(()=>{'use strict';
const $=id=>document.getElementById(id),history=[],maxHistory=30;
const ui={status:$('repairStatus'),details:$('repairDetails'),log:$('repairLog')};
let lastIssue=null,lastTap=null,tapCount=0;const reports=[];try{const saved=JSON.parse(localStorage.getItem('neonscope-bug-reports')||'[]');if(Array.isArray(saved))reports.push(...saved.slice(0,20))}catch(e){}
const stamp=()=>new Date().toLocaleTimeString();
function write(message,type='info'){const line={time:stamp(),type,message:String(message).slice(0,250)};history.unshift(line);history.length=Math.min(history.length,maxHistory);if(ui.status)ui.status.textContent=line.message;if(ui.log){ui.log.replaceChildren();for(const item of history.slice(0,8)){const p=document.createElement('p');p.textContent=item.time+' · '+item.message;ui.log.append(p)}}}
function issue(code,message,repair){lastIssue={code,message,repair};write(message,'warning');if(ui.details)ui.details.hidden=false}
function safeStop(){window.dispatchEvent(new Event('neonscope-stop-all'));$('synthStop')?.click();const player=$('player');if(player&&!player.paused)player.pause();$('stopRecord')?.click();write('Playback and recording reset. Your artwork and presets are preserved.')}
function scan(){const failures=[];const required=['view','drawLayer','tabVisual','tabDraw','tabMusic','tabLibrary','drawToggle','drawSound','drawMotionPlay','synthPlay','synthStop','beatPlay','record','stopRecord','presetSave','presetLoad','store','restore'];for(const id of required)if(!$(id))failures.push('Missing control: '+id);
for(const id of ['view','drawLayer']){const canvas=$(id);if(canvas&&(!canvas.getContext||!canvas.getContext('2d')))failures.push('Canvas rendering unavailable: '+id)}
if(!window.AudioContext&&!window.webkitAudioContext)failures.push('Audio playback unsupported by this browser');
if(!window.OfflineAudioContext&&!window.webkitOfflineAudioContext)failures.push('Audio export may not work on this browser');
if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)failures.push('Video recording unsupported on this browser');
if(!navigator.onLine)failures.push('Device is offline; saved files and cached features may still work');
if(failures.length){issue('diagnostics',failures.length+' potential issue(s) found. See details.','stop');ui.details.textContent=failures.join(' • ')}else{lastIssue=null;ui.details.hidden=true;write('Checks passed: controls, canvas, audio and recording APIs detected. This does not guarantee every feature works.')}return failures}
function report(){return ['NeonScope diagnostic report','Build: 19','User-reported broken controls:',...reports.map(r=>r.time+' | '+r.control+' | '+r.description),'Time: '+new Date().toISOString(),'Browser: '+navigator.userAgent,'Online: '+navigator.onLine,'Last issue: '+(lastIssue?lastIssue.code+' - '+lastIssue.message:'none'),'Recent events:',...history.map(e=>e.time+' ['+e.type+'] '+e.message)].join('\n')}
function copyReport(){const data=report();if(navigator.clipboard?.writeText){navigator.clipboard.writeText(data).then(()=>write('Diagnostic report copied. Paste it into your ChatGPT conversation.')).catch(()=>fallback(data))}else fallback(data)}
function fallback(data){const blob=new Blob([data],{type:'text/plain'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='neonscope-diagnostics.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);write('Diagnostic report downloaded. Share it with ChatGPT for code repairs.')}
async function refresh(){if(!navigator.onLine){write('Connect to the internet before refreshing app files.');return}write('Refreshing cached app files…');try{if('serviceWorker' in navigator){const registration=await navigator.serviceWorker.getRegistration();await registration?.update()}const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith('neonscope-')).map(n=>caches.delete(n)));location.reload()}catch(e){issue('refresh','Refresh failed: '+e.message,'refresh')}}
function autoRecover(message){const m=String(message||'');if(/audio|context|oscillator|playback|mediarecorder|recording/i.test(m)){safeStop();write('Audio/recording issue detected. Playback reset automatically.');return}if(/canvas|render|drawing/i.test(m)){window.dispatchEvent(new Event('neonscope-stop-all'));write('Canvas issue detected. Animations stopped to protect your work.');return}issue('runtime','App issue detected: '+m,'stop')}
function saveReports(){try{localStorage.setItem('neonscope-bug-reports',JSON.stringify(reports.slice(0,20)))}catch(e){write('Bug report saved for this session; local storage is unavailable.')}}
function identify(el){if(!el)return 'Unknown control';const label=el.getAttribute('aria-label')||el.textContent?.trim().replace(/\\s+/g,' ').slice(0,70)||el.getAttribute('name')||el.tagName.toLowerCase();return (el.id?'#'+el.id+' — ':'')+label}
function flagBroken(el){const control=identify(el),description=$('repairDescription');if(description)description.value='';const target=$('repairTarget');if(target)target.textContent=control;const form=$('repairReportForm');if(form){form.hidden=false;form.dataset.control=control;form.scrollIntoView({behavior:'smooth',block:'center'})}issue('user-report','Broken control flagged: '+control+'. Describe the problem and tap Save report.','report')}
document.addEventListener('click',e=>{const target=e.target.closest?.('button,a,[role="button"]');if(!target||target.closest('#repair-tools'))return;const now=Date.now();if(lastTap===target&&now-(window.neonscopeLastTapTime||0)<1100){tapCount++}else tapCount=1;lastTap=target;window.neonscopeLastTapTime=now;if(tapCount===3){tapCount=0;lastTap=null;flagBroken(target)}},true);
$('repairSubmit')?.addEventListener('click',()=>{const form=$('repairReportForm'),control=form?.dataset.control||'Unknown control',description=($('repairDescription')?.value||'Clicked three times; control did not work as expected.').trim().slice(0,500);reports.unshift({time:new Date().toISOString(),control,description});reports.length=Math.min(20,reports.length);saveReports();if(form)form.hidden=true;issue('user-report','Saved broken-control report for '+control+'. Use Copy report or Ask ChatGPT to share it.','report')});
$('repairCancel')?.addEventListener('click',()=>{$('repairReportForm').hidden=true;write('Report cancelled.')});
window.addEventListener('error',e=>autoRecover(e.message||'Unexpected script error'));
window.addEventListener('unhandledrejection',e=>autoRecover(e.reason?.message||String(e.reason||'Unexpected asynchronous error')));
window.addEventListener('online',()=>write('Connection restored.'));
window.addEventListener('offline',()=>write('Offline mode. Local work remains available.'));
$('repairScan')?.addEventListener('click',scan);
$('repairStop')?.addEventListener('click',safeStop);
$('repairRefresh')?.addEventListener('click',refresh);
$('repairCopy')?.addEventListener('click',copyReport);
$('repairHelp')?.addEventListener('click',()=>{copyReport();const opened=window.open('https://chatgpt.com/','_blank','noopener,noreferrer');write(opened?'ChatGPT opened. Paste your copied report and ask for a repair.':'Copy or download the report, then open ChatGPT and paste it to request a repair.')});
window.neonscopeRepair={scan,report,safeStop};
write('Repair Assistant ready. Monitoring errors locally; no data is uploaded.');
setTimeout(scan,700);
})();