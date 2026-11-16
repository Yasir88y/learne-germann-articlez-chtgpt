/* Artikel Studio cloud-sync adapter.
 * Requires a Supabase project and the RLS-protected artikel_progress table.
 * Local data is ALWAYS retained; synchronization is opt-in by email sign-in.
 * Public project URL and publishable key are safe in cloud-config.js.
 * Never put a Supabase service-role/secret key in this static website.
 */
(()=>{
  "use strict";
  const config=window.ARTIKEL_CLOUD_CONFIG||{};
  const $=id=>document.getElementById(id);
  const state={client:null,user:null,working:false,rerun:false,timer:null,lastError:""};
  const api=window.ArtikelCloud={signedIn:false,onLocalChange:()=>{
    if(!api.signedIn)return;
    clearTimeout(state.timer);
    state.timer=setTimeout(()=>sync(),1500);
  }};
  const setStatus=msg=>{$("cloud-status").textContent=msg;};
  const cloudForm=$("cloud-form"),cloudActions=$("cloud-actions"),help=$("cloud-setup-link");
  function showAuth(){
    cloudForm.hidden=!!state.user;
    cloudActions.hidden=!state.user;
    help.hidden=true;
    api.signedIn=!!state.user;
  }
  function read(key){
    try{return JSON.parse(localStorage.getItem(key)||"null");}catch(_){return null}
  }
  function obj(x){return x&&typeof x==="object"&&!Array.isArray(x)?x:{};}
  function scoreRecord(x){
    if(!x||typeof x!=="object")return -1;
    return (Number(x.seen)||0)*100+(Array.isArray(x.successes)?x.successes.length:0);
  }
  function recordTime(p){
    if(!p||typeof p!=="object")return 0;
    return Math.max(Number(p.updatedAt)||0,Number(p.lastWrongAt)||0,
      ...(Array.isArray(p.successes)?p.successes.map(x=>Number(x.at)||0):[0]));
  }
  function bestWord(a,b){
    if(!a)return b;
    if(!b)return a;
    const ta=recordTime(a),tb=recordTime(b);
    if(ta!==tb)return ta>tb?a:b;
    return scoreRecord(a)>=scoreRecord(b)?a:b;
  }
  function mergeProgress(a,b){
    const left=obj(a),right=obj(b),out={};
    for(const key of new Set([...Object.keys(left),...Object.keys(right)])){
      if(!/^(?:[0-9]|[1-9][0-9]{0,2})$/.test(key)||Number(key)>=200)continue;
      out[key]=bestWord(left[key],right[key]);
    }
    return out;
  }
  function betterRound(a,b){
    if(!a)return b||null;if(!b)return a;
    if(a.day!==b.day)return String(a.day)>String(b.day)?a:b;
    const av=Number(a.completedCount)||0,bv=Number(b.completedCount)||0;
    return av>=bv?a:b;
  }
  function mergeDaily(a,b){
    if(!a)return b||null;if(!b)return a;
    if(a.day!==b.day)return String(a.day)>String(b.day)?a:b;
    return {...a,ms:Math.max(Number(a.ms)||0,Number(b.ms)||0),paused:a.paused};
  }
  function readLocal(){
    return {
      version:1,
      progress:obj(read("artikel-studio-v2")),
      daily:read("artikel-studio-daily-v1"),
      roundOld:read("artikel-studio-round-v1"),
      roundNew:read("artikel-studio-round-series02-v1"),
      recentOld:read("artikel-studio-recent-v1"),
      recentNew:read("artikel-studio-recent-series02-v1"),
      savedAt:Date.now()
    };
  }
  function merge(local,cloud){
    const r=obj(cloud),l=obj(local);
    return {
      version:1,
      progress:mergeProgress(l.progress,r.progress),
      daily:mergeDaily(l.daily,r.daily),
      roundOld:betterRound(l.roundOld,r.roundOld),
      roundNew:betterRound(l.roundNew,r.roundNew),
      recentOld:l.recentOld||r.recentOld||[],
      recentNew:l.recentNew||r.recentNew||[],
      savedAt:Date.now()
    };
  }
  function applyLocal(merged){
    // Save the old snapshot before any cloud reconciliation.
    const old=obj(read("artikel-studio-v2"));
    const newRecords=obj(merged.progress);
    const oldSize=Object.values(old).reduce((n,p)=>n+(Number(p?.seen)||0),0);
    const saveSize=Object.values(newRecords).reduce((n,p)=>n+(Number(p?.seen)||0),0);
    if(oldSize>saveSize){
      setStatus("Sync paused: cloud merge contained fewer saved answers. Your local data was NOT replaced.");
      throw Error("Protected against progress reduction");
    }
    try{
      if(oldSize){
        const backupKey="artikel-studio-cloud-before-merge";
        const existing=read(backupKey);
        const existingSize=Object.values(obj(existing)).reduce((n,p)=>n+(Number(p?.seen)||0),0);
        if(oldSize>existingSize)localStorage.setItem(backupKey,JSON.stringify(old));
      }
      progress=newRecords;
      localStorage.setItem("artikel-studio-v2",JSON.stringify(progress));
      // Restore the active daily timer and rounds without replacing an open question.
      if(merged.daily?.day===dayKey()&&Number(merged.daily.ms)>Number(daily.ms)){
        daily.ms=Math.min(60*60*1000,Number(merged.daily.ms));
        saveDaily();showClock();
      }
      for(const [key,val] of [
        ["artikel-studio-round-v1",merged.roundOld],
        ["artikel-studio-round-series02-v1",merged.roundNew],
        ["artikel-studio-recent-v1",merged.recentOld],
        ["artikel-studio-recent-series02-v1",merged.recentNew]
      ]){
        if(val!==null&&val!==undefined)localStorage.setItem(key,JSON.stringify(val));
      }
      updateStats();
    }catch(err){setStatus("Local storage error. Cloud copy may be saved; download a backup.");throw err;}
  }
  async function sync(){
    if(!state.user||!state.client)return;
    if(state.working){state.rerun=true;return;}
    state.working=true;
    try{
      do{
        state.rerun=false;
        setStatus("Syncing your learning history…");
        const uid=state.user.id;
        const {data,error}=await state.client.from("artikel_progress")
          .select("payload").eq("user_id",uid).maybeSingle();
        if(error)throw error;
        const merged=merge(readLocal(),data?.payload);
        // Check the latest local data again so answers made during network fetch are retained.
        const final=merge(readLocal(),merged);
        const {error:writeError}=await state.client.from("artikel_progress")
          .upsert({user_id:uid,payload:final,updated_at:new Date().toISOString()},{onConflict:"user_id"});
        if(writeError)throw writeError;
        const completed=merge(readLocal(),final);
        applyLocal(completed);
        state.lastError="";
        setStatus("Cloud saved ✓ · "+new Date().toLocaleTimeString()+" · "+state.user.email);
      }while(state.rerun);
    }catch(e){
      state.lastError=e.message||String(e);
      setStatus("Cloud sync failed: "+state.lastError+" · Local records remain saved");
    }finally{state.working=false;}
  }
  async function handleSession(session){
    const user=session?.user||null;
    if(!user){state.user=null;showAuth();setStatus("Not signed in · progress stays in this browser");return;}
    const isNew=state.user?.id!==user.id;
    state.user=user;showAuth();
    if(isNew)await sync();
  }
  async function initialize(){
    if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url||"")||!config.publishableKey){
      cloudForm.hidden=true;cloudActions.hidden=true;help.hidden=false;
      setStatus("Cloud sync needs one-time setup · local progress is safe");
      return;
    }
    try{
      setStatus("Loading secure cloud sign-in…");
      await new Promise((resolve,reject)=>{
        if(window.supabase?.createClient)return resolve();
        const tag=document.createElement("script");
        tag.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
        tag.onload=resolve;tag.onerror=()=>reject(Error("Supabase client could not load"));
        document.head.appendChild(tag);
      });
      if(!window.supabase?.createClient)throw Error("Cloud authentication library unavailable");
      state.client=window.supabase.createClient(config.url,config.publishableKey,{
        auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
      });
      state.client.auth.onAuthStateChange((_event,session)=>{
        // Avoid calling other Supabase APIs directly inside auth callbacks.
        setTimeout(()=>handleSession(session),0);
      });
      const {data,error}=await state.client.auth.getSession();
      if(error)throw error;
      await handleSession(data.session);
      // A periodic sync captures study time even if no answer was submitted recently.
      setInterval(()=>{if(state.user)sync();},30000);
      window.addEventListener("online",()=>{if(state.user)sync();});
    }catch(e){
      cloudForm.hidden=true;cloudActions.hidden=true;help.hidden=false;
      setStatus("Cloud setup error: "+(e.message||e)+" · Local progress is safe");
    }
  }
  cloudForm.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!state.client)return;
    const email=$("cloud-email").value.trim();
    if(!email)return;
    setStatus("Sending sign-in link…");
    try{
      const {error}=await state.client.auth.signInWithOtp({
        email,options:{emailRedirectTo:window.location.origin+window.location.pathname}
      });
      if(error)throw error;
      setStatus("Check your email for your private sign-in link. Open it in this browser.");
    }catch(err){setStatus("Sign-in failed: "+(err.message||err));}
  });
  $("cloud-sync-now").addEventListener("click",()=>sync());
  $("cloud-signout").addEventListener("click",async()=>{
    if(!state.client)return;
    await sync();
    await state.client.auth.signOut();
    state.user=null;showAuth();
    setStatus("Signed out · saved cloud history remains available when you sign in");
  });
  window.addEventListener("pagehide",()=>{
    // Local storage is always written synchronously in the app.
    // The next sign-in/focus pulls and merges the server copy.
  });
  initialize();
})();
