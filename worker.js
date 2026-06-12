export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const GUEST_DATA = env.GUEST_DATA;
    const CORS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
    if (request.method === "OPTIONS") return new Response("",{headers:CORS});

    if (request.method === "POST" && url.pathname === "/submit") {
      try {
        const fd = await request.formData();
        await GUEST_DATA.put(Date.now().toString(), JSON.stringify({
          name: fd.get("name") || "",
          attending: fd.get("attending") || "yes",
          guests: fd.get("guests") || "1",
          message: fd.get("message") || "",
          time: new Date().toLocaleString("zh-CN", {timeZone: "Asia/Shanghai"})
        }));
        return new Response("",{status:302,headers:{"Location":"/?submitted=1",...CORS}});
      } catch (e) {
        return new Response(JSON.stringify({success: false}),
          {status:500,headers:{"Content-Type":"application/json",...CORS}});
      }
    }

    if (request.method === "DELETE" && url.pathname === "/delete") {
      if (url.searchParams.get("key") !== "wenying2026") return new Response("未授权",{status:401,headers:CORS});
      const id = url.searchParams.get("id");
      if (!id) return new Response(JSON.stringify({success:false,error:"缺少参数"}),{status:400,headers:{"Content-Type":"application/json",...CORS}});
      await GUEST_DATA.delete(id);
      return new Response(JSON.stringify({success:true}),{headers:{"Content-Type":"application/json",...CORS}});
    }

    if (request.method === "GET" && url.pathname === "/admin") {
      if (url.searchParams.get("key") !== "wenying2026") return new Response("未授权",{status:401});
      const list = await GUEST_DATA.list();
      const rows = [];
      for (const {name} of list.keys) {
        const v = await GUEST_DATA.get(name);
        if (v) rows.push({id:name,...JSON.parse(v)});
      }
      rows.sort((a,b)=>(a.time||"").localeCompare(b.time||""));
      const he = (s)=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      return new Response(`<!DOCTYPE html><meta charset="utf-8"><title>宾客信息</title>
<style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px}
table{width:100%;border-collapse:collapse}
th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #ddd;font-size:14px}
th{background:#f4efe8;position:sticky;top:0}
.del-btn{background:#e74c3c;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px}
.del-btn:hover{background:#c0392b}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.8);color:#fff;padding:10px 20px;border-radius:6px;font-size:14px;z-index:999;display:none}</style>
<h2>宾客回复 (${rows.length}条) <span style="font-size:13px;color:#999;font-weight:normal">点"删除"可删除记录</span></h2>
<table><tr><th>姓名</th><th>出席</th><th>人数</th><th>留言</th><th>时间</th><th>操作</th></tr>
${rows.map(r => `<tr id="row-${he(r.id)}"><td>${he(r.name)}</td><td>${r.attending==="yes"?"✅ 是":"❌ 否"}</td><td>${he(r.guests)}</td><td>${he(r.message)}</td><td>${he(r.time)}</td><td><button class="del-btn" onclick="del('${he(r.id)}')">删除</button></td></tr>`).join("")}
</table>
<div id="toast" class="toast"></div>
<script>
async function del(id){
  if(!confirm('确定要删除该条记录吗？')) return;
  const btn=document.querySelector("#row-"+id+" .del-btn");
  btn.disabled=true;btn.textContent='删除中...';
  try{
    const r=await fetch('/delete?id='+encodeURIComponent(id)+'&key=wenying2026',{method:'DELETE'});
    const j=await r.json();
    if(j.success){
      document.getElementById('row-'+id).remove();
      showToast('已删除');
    }else showToast('删除失败');
  }catch(e){showToast('网络错误');}
}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2000);}
</script>`,{headers:{"Content-Type":"text/html;charset=utf-8"}});
    }
    return new Response("",{status:404});
  }
};
