/* Pocket Atlas Explorer add-on. Approximate regional labels from sampled GM Command Deck v4 registered landmarks. */
(function(){
'use strict';
const q=id=>document.getElementById(id),map=q('mapWrap');if(!map)return;
const css='.map-wrap{touch-action:none;overscroll-behavior:contain;user-select:none}.atlas-world{position:absolute;inset:0;transform-origin:center;will-change:transform}.atlas-world .map-art,.atlas-world .map-grid{inset:0}.atlas-controls{position:absolute;right:8px;bottom:8px;z-index:8;display:flex;align-items:center;gap:5px;padding:5px;background:#071a29ee;border:1px solid #c5a87b8a;border-radius:8px}.atlas-controls button{color:#f4ddaa;background:#193b4e;border:1px solid #8c856d;border-radius:5px;min-width:34px;height:36px;font-size:20px}.atlas-controls button:last-child{font-size:11px;padding:0 6px}.atlas-controls span{color:#e1cca2;font-size:11px;width:32px;text-align:center}.atlas-region{border-top:1px solid #ceb67c33;padding:12px 14px;background:#0e2535}.atlas-region b{display:block;color:#f5dfa9;font:19px Georgia,serif;margin:2px 0}.atlas-region small{display:block;color:#a0b9bd;font-size:10px;line-height:1.5}.atlas-region span{color:#c6d6d2;font-size:11px}.atlas-wind{padding:9px 10px;margin-top:9px;background:#0b2231;border:1px solid #cdb58033;border-radius:8px;font-size:11px;color:#bdd3d5}.atlas-wind strong{color:#f1d5a3}.atlas-help{position:absolute;bottom:9px;left:9px;z-index:7;font-size:9px;padding:5px 6px;color:#e3d6b4;background:#061c2ccd;border-radius:5px;pointer-events:none;max-width:135px}';
const style=document.createElement('style');style.textContent=css;document.head.append(style);
const art=q('mapArt'),grid=map.querySelector('.map-grid'),pin=q('mapPin');
const world=document.createElement('div');world.className='atlas-world';map.insertBefore(world,art);world.append(art,grid,pin);
map.setAttribute('aria-label','Tap to choose a location, pinch to zoom, drag to pan');
const controls=document.createElement('div');controls.className='atlas-controls';
controls.innerHTML='<button type="button" data-a="minus" aria-label="Zoom out">−</button><span id="atlasZoom">1×</span><button type="button" data-a="plus" aria-label="Zoom in">+</button><button type="button" data-a="reset" aria-label="Reset zoom">Reset</button>';map.append(controls);
const help=document.createElement('div');help.className='atlas-help';help.textContent='Pinch to zoom · Drag to pan · Tap to place';map.append(help);
const region=document.createElement('div');region.className='atlas-region';region.innerHTML='<div class="eyebrow">Estimated atlas region</div><b id="atlasRegionName">Locating…</b><span id="atlasNearPlace"></span><small>Approximate nearest-landmark lookup from GM atlas anchors. Official region boundaries are provisional; GPS uses a fictional projection.</small>';
document.querySelector('.map-bottom')?.after(region);
const wind=document.createElement('div');wind.className='atlas-wind';document.querySelector('.stats')?.after(wind);
const lore=['Still Air','Whisper','Leafwind','Bannerwind','Waywind','Strongwind','Hardwind','Highwind','Gale','Great Gale','Stormwind','Tempest','Sundering Gale'];
const effect=['Air is motionless','Only a breath stirs','Leaves and cloth stir','Banners unfurl','Dust and branches move','Small trees sway','Travel feels the push','Walking against the wind becomes difficult','Twigs break; exposed trails become hazardous','Minor damage and difficult travel','Trees suffer damage; seek shelter','Widespread damage; travel is perilous','Extreme wind; seek firm shelter'];
const thresholds=[0,1,6,12,20,29,39,50,62,75,89,103,118];
function windBand(kph){let f=0;for(let i=0;i<13;i++)if(kph>=thresholds[i])f=i;return {force:f,name:lore[f],effect:effect[f]}}
const data=[
['Nordavind','Dunmere',460,500],['Nordavind','Icegate',744,600],['Nordavind','Endur',347,742],['Nordavind','Meremar',1052,240],
['Valdarn','Brean',1920,323],['Valdarn','Daxxos',1193,444],['Valdarn','Kemerin',1359,493],
['Zeitan','Nordur',2525,248],['Zeitan','Zaldar',2360,260],['Zeitan','Innerdale',3188,371],['Zeitan','Void Citadel',3001,452],
['Laangor','Highpine',3525,540],['Laangor','Trailstone',3849,580],['Laangor','Sailwind',4153,511],
['Jhert','Silverstone',3884,1220],['Jhert','Pindar',3633,1028],['Jhert','Molos',3647,1520],['Jhert','Dawnsea',4068,898],
['Inkari','Khoralis',4027,1713],['Inkari','Meentum',4053,2287],['Inkari','Radaris',3941,1947],
['Aumar','Atanis',2001,645],['Aumar','Gamaran',2513,531],['Aumar','Lamòra',2175,901],['Aumar','Aaris',2329,319],
['Kessen','Feldris',2184,1627],['Kessen','Greatdale',1757,1086],['Kessen','Opur',2351,1413],['Kessen','Baurus',2115,1681],
['Dreamor','Fivestar',2760,1469],['Dreamor','Qadris',3265,1228],['Dreamor','Morun',3072,1651],['Dreamor','Lonestar',2637,2160],
['Merosh','Veloras',2923,740],['Merosh','Bemea',3649,1024],['Merosh','Lornat',3087,659],
['Gwaldur','Kaphnur',3265,2433],['Gwaldur','Zarhia',3081,2451],['Gwaldur','Eathos',2789,2789],['Gwaldur','Morganis Tower',3573,2336],
['Thanaros','Pendor',2091,2244],['Thanaros','Viriana',1000,2420],['Thanaros','Jalamai',1803,2402],['Thanaros','Blackraven',1326,2190],
['Laendil','Nayalis',1991,2035],['Laendil','Tamalen',1893,1739],['Laendil','Orianur Keep',2441,2012],
['Faeland','Elerin',933,1456],['Faeland','Devine',1669,1576],['Faeland','Iratar',1368,1845],['Faeland','Riordan',809,1640],
['Kartaren','Kartar',993,800],['Kartaren','Stormvale',1447,1119],['Kartaren','Kantias',967,1227],
['Laentas','Damodar',693,1256],['Laentas','Yaras',507,1003],['Laentas','Thiros',400,1293],
['Eternal Ice','Angor',3967,16],['Eternal Ice','Norn',4016,179]
];
function nearest(lat,lon){const x=(lon+45)/90*4320,y=(65-lat)/45*2880;const sorted=data.map(a=>({name:a[1],region:a[0],distance:(x-a[2])**2+(y-a[3])**2})).sort((a,b)=>a.distance-b.distance);
 const nearest=sorted[0];const score={};sorted.slice(0,5).forEach(a=>score[a.region]=(score[a.region]||0)+1/Math.max(10000,a.distance));
 const probable=Object.keys(score).sort((a,b)=>score[b]-score[a])[0];return {region:probable,place:nearest.name,placeRegion:nearest.region,distance:Math.sqrt(nearest.distance)};
}
let last='';
function updateRegion(){const lat=+q('aumyrLat').value,lon=+q('aumyrLon').value;const key=lat+'|'+lon;if(key===last)return;last=key;const found=nearest(lat,lon);
q('atlasRegionName').textContent=found.region;
q('atlasNearPlace').textContent='Nearest registered landmark: '+found.place+' ('+found.placeRegion+')'+(found.distance>470?' · distant / unsurveyed position':'');
}
function updateWind(){const speed=Number(q('wind').textContent);if(!Number.isFinite(speed))return;const b=windBand(speed);const txt='<strong>Wind Force '+b.force+' · '+b.name+'</strong> · '+Math.round(speed)+' km/h. '+b.effect+'. <small>Working lore names, Beaufort 0–12 speed thresholds. Pocket weather still differs from GM travel weather.</small>';if(wind.innerHTML!==txt)wind.innerHTML=txt}
const observer=new MutationObserver(updateRegion);observer.observe(q('aumyrPosition'),{childList:true});
const windObserver=new MutationObserver(updateWind);windObserver.observe(q('wind'),{childList:true});
q('aumyrLat').addEventListener('input',updateRegion);q('aumyrLon').addEventListener('input',updateRegion);
let z=1,panX=0,panY=0,dragged=false,origin=null,pinch=null;const pts=new Map();
function paint(){const width=map.clientWidth,height=map.clientHeight;panX=Math.min(Math.max(panX,-(z-1)*width/2),(z-1)*width/2);panY=Math.min(Math.max(panY,-(z-1)*height/2),(z-1)*height/2);world.style.transform='translate('+panX+'px,'+panY+'px) scale('+z+')';q('atlasZoom').textContent=z.toFixed(z%1?1:0)+'×'}
function zoom(to,x=map.clientWidth/2,y=map.clientHeight/2){const old=z;z=Math.min(6,Math.max(1,Math.round(to*10)/10));const cx=map.clientWidth/2,cy=map.clientHeight/2;panX=(panX+cx-x)*z/old+x-cx;panY=(panY+cy-y)*z/old+y-cy;paint()}
controls.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();const a=b.dataset.a;if(a==='plus')zoom(z*1.5);if(a==='minus')zoom(z/1.5);if(a==='reset'){z=1;panX=panY=0;paint()}});
map.addEventListener('wheel',e=>{e.preventDefault();const rect=map.getBoundingClientRect();zoom(z*(e.deltaY<0?1.25:.8),e.clientX-rect.left,e.clientY-rect.top)},{passive:false});
map.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});map.setPointerCapture?.(e.pointerId);if(pts.size===1){origin={x:e.clientX,y:e.clientY,panX,panY};dragged=false}if(pts.size===2){const [a,b]=[...pts.values()];pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),startZoom:z};dragged=true}},true);
map.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===2&&pinch){const [a,b]=[...pts.values()];zoom(pinch.startZoom*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(pinch.distance,1));dragged=true}else if(pts.size===1&&origin){const dx=e.clientX-origin.x,dy=e.clientY-origin.y;if(Math.hypot(dx,dy)>7)dragged=true;if(z>1){panX=origin.panX+dx;panY=origin.panY+dy;paint()}}},true);
function finish(e){pts.delete(e.pointerId);if(!pts.size){origin=null;pinch=null}else if(pts.size===1){const p=[...pts.values()][0];origin={x:p.x,y:p.y,panX,panY};pinch=null}}
map.addEventListener('pointerup',finish,true);map.addEventListener('pointercancel',finish,true);
map.addEventListener('click',e=>{if(e.target.closest('button'))return;e.preventDefault();e.stopImmediatePropagation();if(dragged){dragged=false;return}const rect=map.getBoundingClientRect(),cx=rect.width/2,cy=rect.height/2;
const mx=(e.clientX-rect.left-cx-panX)/z+cx,my=(e.clientY-rect.top-cy-panY)/z+cy;const lat=65-45*Math.min(1,Math.max(0,my/rect.height)),lon=-45+90*Math.min(1,Math.max(0,mx/rect.width));
q('aumyrLat').value=lat;q('aumyrLat').dispatchEvent(new Event('input',{bubbles:true}));q('aumyrLon').value=lon;q('aumyrLon').dispatchEvent(new Event('input',{bubbles:true}));},true);
updateRegion();updateWind();paint();
window.AumyrExplorer={nearest,windBand,zoom:()=>z,source:'GM Command Deck v4 sample anchors',regionPrecision:'approximate',weatherParity:'independent'};
})();
