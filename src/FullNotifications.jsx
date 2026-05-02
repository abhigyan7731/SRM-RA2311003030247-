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
export default function FullNotifications(){
  const [all,setAll]=useState([])
  const [loading,setLoading]=useState(false)
  const [filter,setFilter]=useState('all')
  const [pageSize,setPageSize]=useState(10)
  const [page,setPage]=useState(1)
  useEffect(()=>{
    async function run(){
      setLoading(true)
      const token = (()=>{try{return localStorage.getItem('evaluationAuthToken')||import.meta.env.VITE_EVAL_TOKEN}catch(e){return import.meta.env.VITE_EVAL_TOKEN}})()
      const headers={'Content-Type':'application/json'}
      if(token) headers.Authorization = 'Bearer '+token
      try{
        const res = await fetch('http://20.207.122.201/evaluation-service/notifications',{headers})
        if(!res.ok){ setAll([]); setLoading(false); return }
        const data = await res.json()
        const arr = (data.notifications||[]).map(n=>({id:n.ID,type:n.Type,message:n.Message,timestamp:n.Timestamp,score:scoreFor(n)}))
        arr.sort((a,b)=>b.score-a.score)
        setAll(arr)
      }catch(e){ setAll([]) }
      setLoading(false)
    }
    run()
  },[])
  const filtered = all.filter(x=> filter==='all' ? true : String(x.type).toLowerCase()===filter)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page-1)*pageSize
  const pageItems = filtered.slice(start, start+pageSize)
  useEffect(()=>{ if(page>totalPages) setPage(1) },[totalPages])
  return (
    <section id="full-notifications">
      <h2>All Notifications</h2>
      <div>
        <label>Filter: </label>
        <select value={filter} onChange={e=>{setFilter(e.target.value); setPage(1)}}>
          <option value="all">All</option>
          <option value="placement">Placement</option>
          <option value="result">Result</option>
          <option value="event">Event</option>
        </select>
        <label style={{marginLeft:10}}>Page size: </label>
        <input type="number" value={pageSize} min={1} max={50} onChange={e=>{const v=parseInt(e.target.value)||10; setPageSize(v); setPage(1)}} style={{width:60}} />
      </div>
      {loading? <div>Loading...</div> : (
        <div>
          <ul>
            {pageItems.map(n=> (
              <li key={n.id}><strong>{n.type}</strong> — {n.message} <em>({n.timestamp})</em></li>
            ))}
          </ul>
          <div>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1}>Prev</button>
            <span style={{margin:'0 8px'}}>Page {page} / {totalPages}</span>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages}>Next</button>
          </div>
        </div>
      )}
    </section>
  )
}
