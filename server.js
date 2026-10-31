const express = require('express');
const app = express();
app.use(express.json());
let data = { totalEarn: 0, totalPaid: 0, withdrawals: [], dailyLog: [] };
app.get('/api/finance', (req,res)=> res.json(data));
app.post('/api/add-earn', (req,res)=>{ data.totalEarn+=parseFloat(req.body.amount); data.dailyLog.push({type:'EARN', amount:req.body.amount, date:new Date().toLocaleString()}); res.json(data); });
app.post('/api/add-paid', (req,res)=>{ data.totalPaid+=parseFloat(req.body.amount); data.dailyLog.push({type:'PAID', amount:req.body.amount, phone:req.body.phone, date:new Date().toLocaleString()}); res.json(data); });
app.post('/api/reset', (req,res)=>{ data={totalEarn:0, totalPaid:0, withdrawals:[], dailyLog:[]}; res.json(data); });

app.get('/sw.js', (req,res)=>{
  res.setHeader('Content-Type','application/javascript');
  res.send(`self.options={"domain":"5gvci.com","zoneId":12156625}; self.lary=""; importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')`);
});

app.get('/', (req,res)=> res.send(`
<!DOCTYPE html><html><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- BOTH MONETAG VERIFICATION TAGS -->
<meta name="monetag" content="99b74aaeb9bff6ad0a8cc6c528d59acd">
<meta name="monetag" content="0d93f788723b8ec7bbb20ad89ca0c51f">
<title>Adebisi Finance</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}</script>
</head><body class="bg-gray-100 p-3"><div class="max-w-md mx-auto"><div class="bg-white rounded-2xl p-5 shadow-xl">
<h2 class="font-bold text-xl">💰 Adebisi Finance Tracker - LIVE</h2>
<p class="text-[10px] text-green-600">Tags: 99b74aae... + 0d93f788... installed</p>
<p class="text-xs text-gray-500">adebisi-finance.onrender.com</p>
<div class="grid grid-cols-2 gap-3 mt-4">
<div class="bg-green-50 p-4 rounded-xl border"><p class="text-xs">Total Earn</p><p class="font-bold text-lg text-green-600" id="earn">$0</p><p class="text-xs" id="earnN">N0</p></div>
<div class="bg-red-50 p-4 rounded-xl border"><p class="text-xs">Total Paid</p><p class="font-bold text-lg text-red-600" id="paidN">N0</p></div>
<div class="bg-blue-600 text-white p-4 rounded-xl col-span-2"><p class="text-xs">NET PROFIT</p><p class="font-bold text-2xl" id="profit">N0</p></div>
</div>
<div class="mt-5 bg-gray-50 p-4 rounded-xl">
<h3 class="font-bold text-sm">➕ Add Earning</h3><div class="flex gap-2 mt-2"><input id="earnAmount" type="number" placeholder="e.g 6.72" class="flex-1 p-3 border rounded-xl"><select id="earnSource" class="p-3 border rounded-xl"><option>Monetag</option></select></div><button onclick="addEarn()" class="w-full mt-2 p-3 bg-green-600 text-white rounded-xl font-bold">Add Earning</button>
</div>
<div class="mt-3 bg-gray-50 p-4 rounded-xl">
<h3 class="font-bold text-sm">➖ Add Paid</h3><input id="paidPhone" placeholder="User phone" class="w-full p-3 border rounded-xl mt-2"><div class="flex gap-2 mt-2"><input id="paidAmount" type="number" placeholder="N500" value="500" class="flex-1 p-3 border rounded-xl"><select id="paidMethod" class="p-3 border rounded-xl"><option>MTN</option><option>Airtel</option></select></div><button onclick="addPaid()" class="w-full mt-2 p-3 bg-red-600 text-white rounded-xl font-bold">Add Paid</button>
</div>
<div class="mt-5"><h3 class="font-bold text-sm">📋 Log</h3><div id="log" class="mt-2 text-xs max-h-[300px] overflow-y-auto"></div></div>
</div></div>
<script>
const RATE=1500; async function load(){ let d=await fetch('/api/finance').then(r=>r.json()); document.getElementById('earn').innerText='$'+d.totalEarn.toFixed(2); document.getElementById('earnN').innerText='N'+(d.totalEarn*RATE).toLocaleString(); document.getElementById('paidN').innerText='N'+d.totalPaid.toLocaleString(); let profitN=(d.totalEarn*RATE)-d.totalPaid; document.getElementById('profit').innerText='N'+profitN.toLocaleString(); document.getElementById('log').innerHTML=d.dailyLog.slice().reverse().map(l=>{ if(l.type==='EARN') return '<div class="flex justify-between p-2 bg-green-50 rounded mb-1"><span>💰 +$'+l.amount+'</span><span>'+l.date+'</span></div>'; else return '<div class="flex justify-between p-2 bg-red-50 rounded mb-1"><span>💸 -N'+l.amount+' to '+l.phone+'</span><span>'+l.date+'</span></div>'; }).join('')||'<p class="text-gray-400 text-center py-4">No data</p>'; }
async function addEarn(){ let a=document.getElementById('earnAmount').value; if(!a) return alert('Enter'); await fetch('/api/add-earn',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({amount:a})}); document.getElementById('earnAmount').value=''; load(); }
async function addPaid(){ let p=document.getElementById('paidPhone').value; let a=document.getElementById('paidAmount').value; if(!p||!a) return alert('Enter'); await fetch('/api/add-paid',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:p, amount:a})}); document.getElementById('paidPhone').value=''; load(); }
load();
<\/script></body></html>
`));
const PORT=process.env.PORT||3000; app.listen(PORT, ()=>console.log('LIVE'));
