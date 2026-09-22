export interface Env {
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // اینجا کد Worker ما قرار می‌گیره
    // در مرحله بعد کاملش می‌کنیم
    return new Response("Worker is running!", {
      headers: { "Content-Type": "text/plain" },
    });
  },
} satisfies ExportedHandler<Env>;
