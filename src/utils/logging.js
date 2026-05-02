const STACKS = new Set(["backend","frontend"]);
const LEVELS = new Set(["debug","info","warn","error","fatal"]);
const PACKAGES = new Set([
  "cache","controller","cron_job","db","domain","handler","repository","route","service",
  "api","component","hook","page","state","style",
  "auth","config","middleware","utils"
]);
const ENDPOINT = "http://20.207.122.201/evaluation-service/logs";
function getToken(){
  try{
    const t = localStorage.getItem('evaluationAuthToken');
    if(t) return t;
  }catch(e){}
  return import.meta.env.VITE_EVAL_TOKEN || '';
}
export default async function Log(stack,level,packageName,message){
  if(!stack||!level||!packageName) return false;
  const s = String(stack).toLowerCase();
  const l = String(level).toLowerCase();
  const p = String(packageName).toLowerCase();
  if(!STACKS.has(s)||!LEVELS.has(l)||!PACKAGES.has(p)) return false;
  const body = {stack:s,level:l,package:p,message:String(message)};
  const token = getToken();
  const headers = {"Content-Type":"application/json"};
  if(token) headers.Authorization = `Bearer ${token}`;
  try{
    const res = await fetch(ENDPOINT,{method:'POST',headers,body:JSON.stringify(body)});
    return res.ok;
  }catch(e){
    return false;
  }
}
