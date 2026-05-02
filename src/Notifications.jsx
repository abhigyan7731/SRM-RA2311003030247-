import {useEffect,useState} from 'react'
function weightFor(t){
  t=String(t||'').toLowerCase()
  if(t==='placement') return 3
  if(t==='result') return 2
  return 1
}
function scoreFor(n){
  const w=weightFor(n.Type)
  const ts=new Date(n.Timestamp).getTime()
  const ageSec=(Date.now()-ts)/1000
  return w*100000 - ageSec
}
export default function Notifications(){
  const [list,setList]=useState([])
  const [loading,setLoading]=useState(false)
  useEffect(()=>{
    async function run(){
      setLoading(true)
      const token = (()=>{
        try{return localStorage.getItem('evaluationAuthToken')||import.meta.env.VITE_EVAL_TOKEN}catch(e){return import.meta.env.VITE_EVAL_TOKEN}
      })()
      const headers={'Content-Type':'application/json'}
      if(token) headers.Authorization = 'Bearer '+token
      try{
        const res = await fetch('http://20.207.122.201/evaluation-service/notifications',{headers})
        if(!res.ok){ setLoading(false); return }
        const data = await res.json()
        const arr = (data.notifications||[]).map(n=>({id:n.ID,type:n.Type,message:n.Message,timestamp:n.Timestamp,score:scoreFor(n)}))
        arr.sort((a,b)=>b.score-a.score)
        setList(arr.slice(0,10))
      }catch(e){
        setList([])
      }
      setLoading(false)
    }
    run()
  },[])
  return (
    <section id="notifications">
      <h2>Top Notifications</h2>
      {loading? <div>Loading...</div> : (
        <ul>
          {list.map(n=> (
            <li key={n.id}>
              <strong>{n.type}</strong> — {n.message} <em>({n.timestamp})</em>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
