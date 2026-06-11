 export async function onRequest(context) {
   const { request, env } = context;
 
   if (request.method === "POST") {
     try {
       const formData = await request.formData();
       const id = Date.now().toString();
       const data = {
         name: formData.get("name") || "",
         attending: formData.get("attending") || "yes",
         guests: formData.get("guests") || "1",
         message: formData.get("message") || "",
         time: new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })
       };
       await env.GUEST_DATA.put(id, JSON.stringify(data));
       return new Response(JSON.stringify({ success: true }), {
         headers: { "Content-Type": "application/json" }
       });
     } catch (e) {
       return new Response(JSON.stringify({ success: false }), {
         status: 500,
         headers: { "Content-Type": "application/json" }
       });
     }
   }
 
   if (request.method === "GET") {
     const url = new URL(request.url);
     const key = url.searchParams.get("key") || "";
     if (key !== "wenying2026") return new Response("未授权", { status: 401 });
 
     const list = await env.GUEST_DATA.list();
     const entries = [];
     for (const k of list.keys) {
       const val = await env.GUEST_DATA.get(k.name);
       if (val) entries.push(JSON.parse(val));
     }
     entries.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
     const html = `
       <!DOCTYPE html><meta charset="utf-8"><title>宾客信息</title>
       <style>body{font-family:sans-serif;max-width:700px;margin:40px auto;padding:0 20px}
       table{width:100%;border-collapse:collapse}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #ddd}
       th{background:#f4efe8}tr:hover{background:#f9f6f1}</style>
       <h2>宾客回复 (${entries.length}条)</h2>
       <table><tr><th>姓名</th><th>出席</th><th>人数</th><th>留言</th><th>时间</th></tr>
       ${entries.map(e => `<tr><td>${esc(e.name)}</td><td>${e.attending === "yes" ? "✅ 是" : "❌ 否"}</td><td>${esc(e.guests)}</td><td>${esc(e.message)}</td><td>${esc(e.time)}</td></tr>`).join("")}
       </table>
     `;
     return new Response(html, { headers: { "Content-Type": "text/html;charset=utf-8" } });
   }
 
   return new Response("", { status: 405 });
 }
 function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;") }
