const fs = require('fs')
const path = require('path')
async function readToken(){
  if(process.env.VITE_EVAL_TOKEN) return process.env.VITE_EVAL_TOKEN
  try{
    const p = path.resolve(__dirname,'..','.env.local')
    const txt = fs.readFileSync(p,'utf8')
    const m = txt.match(/VITE_EVAL_TOKEN=(.+)/)
    if(m) return m[1].trim()
  }catch(e){}
  return ''
}
function weightFor(type){
  const t = String(type||'').toLowerCase()
  if(t==='placement') return 3
  if(t==='result') return 2
  return 1
}
function scoreFor(n){
  const w = weightFor(n.Type)
  const ts = new Date(n.Timestamp).getTime()
  const ageSec = (Date.now()-ts)/1000
  return w*100000 - ageSec
}
async function main(){
  const token = await readToken()
  const url = 'http://20.207.122.201/evaluation-service/notifications'
  const headers = { 'Content-Type':'application/json' }
  if(token) headers.Authorization = 'Bearer '+token
  try{
    const res = await fetch(url,{headers})
    if(!res.ok){
      console.error('fetch failed',res.status)
      process.exit(1)
    }
    const data = await res.json()
    const arr = (data.notifications||[]).map(n=>({
      id:n.ID,type:n.Type,message:n.Message,timestamp:n.Timestamp,score:scoreFor(n)
    }))
    arr.sort((a,b)=>b.score-a.score)
    const top = arr.slice(0,10)
    const outPath = path.resolve(__dirname,'top10.json')
    fs.writeFileSync(outPath,JSON.stringify({top},null,2))
    console.log('wrote',outPath)
  }catch(e){
    console.error('err',e.message||e)
    process.exit(1)
  }
}
main()
