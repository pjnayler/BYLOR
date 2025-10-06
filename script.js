(function(){
  window.loadEntries = loadEntries;
  window.saveEntries = saveEntries;
  window.saveEntry = saveEntry;
  window.mergeEntries = mergeEntries;
  window.escapeHtml = escapeHtml;
})();

function loadEntries() {
  try{
    const raw=localStorage.getItem('mc_entries');
    if(!raw) return [];
    const arr=JSON.parse(raw);
    if(!Array.isArray(arr)) return [];
    return arr;
  }catch(e){ console.error(e); return []; }
}

function saveEntries(entries){
  try{ localStorage.setItem('mc_entries',JSON.stringify(entries)); return true; }
  catch(e){ console.error(e); return false; }
}

function saveEntry(name, meta){
  if(!name) return false;
  const entries=loadEntries();
  const entry={ 
    id:genId(), 
    name:name.trim(), 
    ts:(new Date()).toISOString(),
    sap: meta.sap || ''
  };
  if(meta && typeof meta==='object'){
    if(typeof meta.lat==='number') entry.lat=meta.lat;
    if(typeof meta.lon==='number') entry.lon=meta.lon;
    if(typeof meta.distance_m==='number') entry.distance_m=meta.distance_m;
  }
  entries.push(entry);
  return saveEntries(entries);
}

function mergeEntries(incoming){
  if(!Array.isArray(incoming)) return loadEntries();
  const existing=loadEntries();
  const map=new Map();
  existing.forEach(e=>map.set(e.id||(e.name+'|'+e.ts),e));
  incoming.forEach(e=>{ if(!e||!e.name||!e.ts) return;
    const key=e.id||(e.name+'|'+e.ts);
    if(!map.has(key)) map.set(key,{id:e.id||genId(), name:e.name, ts:e.ts, sap:e.sap||'', lat:e.lat, lon:e.lon, distance_m:e.distance_m});
  });
  return Array.from(map.values());
}

function genId(){ return 'id_'+Math.random().toString(36).slice(2,9); }
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
