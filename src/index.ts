export interface Env {
  AI: Ai;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const TEST_PAGE = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Worker Test</title>
<style>body{background:#030308;color:#39ff14;font-family:monospace;padding:20px}
button{background:#39ff14;color:#000;padding:14px;border:none;border-radius:6px;
font-weight:bold;font-size:1rem;width:100%}button:disabled{opacity:.5}
#s{margin-top:14px;font-size:.85rem;color:#00f3ff;line-height:1.6}
img{max-width:100%;border:2px solid #39ff14;border-radius:8px;margin-top:14px}
.err{color:#ff007f}</style></head>
<body><h2>🧪 Worker Test</h2>
<button id="b">تست کن</button><div id="s">آماده</div><div id="o"></div>
<script>
const U=location.origin;
document.getElementById("b").onclick=async()=>{
  const b=document.getElementById("b"),s=document.getElementById("s"),o=document.getElementById("o");
  b.disabled=true;s.className="";s.textContent="⏳ در حال ساخت... (۲۰-۴۰ ثانیه)";o.innerHTML="";
  const t0=Date.now();
  try{
    const r=await fetch(U,{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({prompt:"a cyberpunk samurai in neon Tokyo at night, cinematic, hyper detailed"})});
    const d=await r.json();const sec=((Date.now()-t0)/1000).toFixed(1);
    if(d.ok&&d.image){s.textContent="✅ موفق در "+sec+"s";
      const i=document.createElement("img");i.src=d.image;o.appendChild(i);}
    else{s.className="err";s.textContent="❌ خطا: "+(d.error||"?")+" ("+sec+"s)";}
  }catch(e){s.className="err";s.textContent="❌ "+e.message;}
  finally{b.disabled=false;}
};
</script></body></html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "GET") {
      return new Response(TEST_PAGE, {
        headers: { "Content-Type": "text/html;charset=UTF-8" },
      });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json() as any;
      const prompt = (body.prompt || "").trim();
      if (!prompt) {
        return new Response(JSON.stringify({ error: "Empty prompt" }), {
          status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      // فقط prompt و steps معتبر هستند — بقیه پارامترها حذف شدند
      const response = await env.AI.run("@cf/black-forest-labs/flux-1-schnell" as any, {
        prompt: prompt.slice(0, 2048),
        steps: 4
      });

      let imageBase64 = "";
      if (response instanceof Response) {
        const buf = await response.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        imageBase64 = btoa(binary);
      } else if (response && (response as any).image) {
        imageBase64 = (response as any).image;
      } else {
        throw new Error("Unexpected AI response");
      }

      return new Response(JSON.stringify({
        ok: true,
        image: "data:image/jpeg;base64," + imageBase64,
        model: "flux-1-schnell",
      }), { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    } catch (err: any) {
      return new Response(JSON.stringify({
        ok: false, error: err?.message || String(err),
      }), { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }
  },
} satisfies ExportedHandler<Env>;
