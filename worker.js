export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/submit") {
      try {
        const fd = await request.formData();
        await env.GUEST_DATA.put(Date.now().toString(), JSON.stringify({
          name: fd.get("name") || "",
          attending: fd.get("attending") || "yes",
          guests: fd.get("guests") || "1",
          message: fd.get("message") || "",
          time: new Date().toLocaleString("zh-CN", {timeZone: "Asia/Shanghai"})
        }));
        return new Response(JSON.stringify({success: true}),
          {headers: {"Content-Type": "application/json","Access-Control-Allow-Origin":"*"}});
      } catch (e) {
        return new Response(JSON.stringify({success: false}),
          {status: 500, headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
      }
    }
    if (request.method === "GET" && url.pathname === "/admin") {
      if (url.searchParams.get("key") !== "wenying2026") return new Response("\u672a\u6388\u6743", {status: 401});
      const list = await env.GUEST_DATA.list();
      const rows = [];
      for (const k of list.keys) {
        const v = await env.GUEST_DATA.get(k.name);
        if (v) rows.push(JSON.parse(v));
      }
      rows.sort((a, b) => (a.time||"").localeCompare(b.time||""));
      const html = `<!DOCTYPE html><meta charset="utf-8"><title>\u5bbe\u5ba2\u4fe1\u606f</title>
<style>body{font-family:sans-serif;max-width:700px;margin:40px auto;padding:0 20px}
table{width:100%;border-collapse:collapse}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #ddd}
th{background:#f4efe8}</style>
<h2>\u5bbe\u5ba2\u56de\u590d (${rows.length}\u6761)</h2>
<table><tr><th>\u59d3\u540d</th><th>\u51fa\u5e2d</th><th>\u4eba\u6570</th><th>\u7559\u8a00</th><th>\u65f6\u95f4</th></tr>
${rows.map(r => `<tr><td>${esc(r.name)}</td><td>${r.attending==="yes"?"✅ \u662f":"❌ \u5426"}</td><td>${esc(r.guests)}</td><td>${esc(r.message)}</td><td>${esc(r.time)}</td></tr>`).join("")}
</table>`;
      return new Response(html, {headers: {"Content-Type":"text/html;charset=utf-8"}});
    }
    return new Response("", {status: 404});
  }
};
function esc(s) {return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
