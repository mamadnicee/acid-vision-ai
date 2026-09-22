export interface Env {
  AI: Ai;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed. Use POST.", {
        status: 405,
        headers: CORS_HEADERS,
      });
    }

    try {
      const body = await request.json() as {
        prompt: string;
        model?: string;
        width?: number;
        height?: number;
        seed?: number;
      };

      const prompt = (body.prompt || "").trim();
      if (!prompt) {
        return new Response(JSON.stringify({ error: "Empty prompt" }), {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      // Choose model — default to FLUX.1 schnell (fast + high quality)
      const model = body.model || "@cf/black-forest-labs/flux-1-schnell";
      const width = Math.min(Math.max(body.width || 1024, 256), 2048);
      const height = Math.min(Math.max(body.height || 1024, 256), 2048);
      const seed = body.seed != null ? body.seed : Math.floor(Math.random() * 1e9);

      const inputs = {
        prompt: prompt,
        width: width,
        height: height,
        seed: seed,
        num_steps: 4, // schnell needs 4 steps
      };

      // Run model
      const response = await env.AI.run(model as any, inputs);

      // FLUX.1 schnell returns raw PNG bytes as Response or { image: base64 }
      let imageBase64 = "";
      let contentType = "image/png";

      if (response instanceof Response) {
        const buf = await response.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        imageBase64 = btoa(binary);
      } else if (response && (response as any).image) {
        imageBase64 = (response as any).image;
      } else {
        throw new Error("Unexpected AI response format");
      }

      return new Response(
        JSON.stringify({
          ok: true,
          image: "data:" + contentType + ";base64," + imageBase64,
          seed: seed,
          model: model,
        }),
        {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: err?.message || String(err),
        }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }
  },
} satisfies ExportedHandler<Env>;
