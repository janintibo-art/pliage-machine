(function(){'use strict';
const X=window.PieceExchange;let pending=null,token=0;
function msg(t){text('exchangeMsg',t)}
function clear(){pending=null;$('exchangeApply').disabled=true;$('exchangePreview').textContent='Aucun fichier sélectionné.';}
clear();
function download(packet){const data=JSON.stringify(packet,null,2);if(window.NativeFiles){window.NativeFiles.saveExchange(data);return;}const url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='pliage-machine-echange.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('exchangeExport').onclick=()=>{try{download(X.fromProject(s,$('exchangeKind').value));msg('Export de la géométrie enregistrée demandé.')}catch(err){msg('Export refusé : '+err.message)}};
$('exchangeInput').onchange=async()=>{const id=++token;clear();try{const file=$('exchangeInput').files?.[0];if(!file)return;if(file.size>3000000)throw Error('Fichier de 3 Mo maximum.');const raw=await file.text();if(id!==token)return;pending=X.parse(raw);$('exchangePreview').textContent=X.summary(pending);$('exchangeApply').disabled=false;msg('Vérifier la pièce avant de l’importer.');}catch(err){if(id===token){clear();msg('Import refusé : '+err.message)}}finally{if(id===token)$('exchangeInput').value=''}};
$('exchangeCancel').onclick=()=>{token++;clear();msg('Import annulé. Projet inchangé.');};
$('exchangeApply').onclick=()=>{try{if(!pending)return;const packet=pending,next=X.merge(s,packet);if(!valid(next))throw Error('Géométrie incompatible avec le projet.');if(!confirm('Remplacer la pièce '+(packet.kind==='flat'?'complexe':'de profil')+' et ses modifications non enregistrées ? La presse et les outils sont conservés.'))return;s=next;step=0;invalidate();const ok=save();token++;clear();msg(ok?'Pièce importée et enregistrée.':'Pièce importée en mémoire ; exporter une sauvegarde.');show(packet.kind==='flat'?'flat':'piece');if(!ok)text(packet.kind==='flat'?'sheetMsg':'pieceMsg','Sauvegarde locale indisponible : exporter le projet.');}catch(err){msg('Import refusé : '+err.message)}};
})();
