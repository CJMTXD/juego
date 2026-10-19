// Prueba opcional de interfaz. Requiere Playwright y Chromium en el equipo de desarrollo.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({...(fs.existsSync('/usr/bin/chromium')?{executablePath:'/usr/bin/chromium'}:{}),headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1450,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  assert.equal((await page.goto('http://127.0.0.1:8000/?debug=1')).status(),200);
  await page.locator('[data-action="characters"]').click();assert.equal(await page.locator('[data-character]').count(),5);assert.equal(await page.locator('[data-character]:disabled').count(),4);
  await page.locator('[data-action="title"]').click();await page.locator('[data-action="arsenal"]').click();assert.equal(await page.locator('[data-weapon-icon]').count(),10);await page.locator('[data-action="back"]').click();
  await page.evaluate(()=>{const data=JSON.parse(localStorage.getItem('ascenso-debug-v3')||'null')||{version:2};data.progress={echoes:20,runs:3,wins:1,unlocks:2,totalEchoes:20,worlds:6,bossMask:63,characters:['remender','hollow','courier','weaver','witness']};localStorage.setItem('ascenso-debug-v3',JSON.stringify(data));});
  const characters=['remender','hollow','courier','weaver','witness'];
  for(let zone=0;zone<6;zone++){
   await page.reload();await page.locator('[data-action="characters"]').click();await page.locator(`[data-character="${characters[zone%5]}"]`).click();await page.locator('#start-world').selectOption(String(zone));await page.locator('#seed-input').fill('42');await page.locator('[data-action="start"]').click();await page.locator('[data-start-weapon]').first().click();await page.locator('[data-initial-item]').first().click();await page.waitForTimeout(200);
   const snapshot=await page.evaluate(()=>window.gameDiagnostics());assert.equal(snapshot.world,zone);assert.equal(snapshot.character,characters[zone%5]);assert.equal(snapshot.status,'playing');assert(snapshot.audio.available);assert.equal(snapshot.audio.state,'running');assert(snapshot.audio.beat>0);
   await page.locator('#map button:not([disabled])').first().click();await page.waitForTimeout(1700);assert.match(await page.locator('#wave').textContent(),/Oleada 1/);assert.equal(await page.locator('#panel').isHidden(),true);
   await page.screenshot({path:`/tmp/ascenso-world-${zone+1}.png`});
   await page.keyboard.press('Escape');assert(await page.getByRole('heading',{name:'En pausa'}).isVisible());const time=(await page.evaluate(()=>window.gameDiagnostics())).time;await page.waitForTimeout(100);assert.equal((await page.evaluate(()=>window.gameDiagnostics())).time,time);
  }
  await page.keyboard.press('Escape');await page.keyboard.press('F3');await page.waitForTimeout(180);assert(await page.locator('#debug').isHidden());
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert(await page.getByRole('heading',{name:'En pausa'}).isVisible());
  const benchmark=await page.evaluate(async()=>{
   const {createWorld,updateWorld,emit}=await import('/src/simulation.js');const {createRenderer}=await import('/src/render.js');const {defaults}=await import('/src/data.js');
   const canvas=document.createElement('canvas');canvas.width=640;canvas.height=360;const render=createRenderer(canvas),w=createWorld(22,2,'weaver',5),i={keys:new Set(),mouseX:500,mouseY:150},preferences={bindings:defaults,autoFire:true,reducedEffects:false};
   for(let n=0;n<512;n++)emit(w.hostiles,30+n%580,30+n%300,0,0,4,1);
   for(let n=0;n<128;n++)emit(w.allies,30+n%580,30+n%300,0,0,3,1);
   for(let n=0;n<16;n++)Object.assign(w.enemies[n],{active:true,type:w.zone.enemies[n%3].id,x:80+(n%4)*150,y:70+Math.floor(n/4)*65,hp:999,maxHp:999,timer:500});for(let n=0;n<64;n++)Object.assign(w.particles[n],{active:true,x:200+n,y:100+n,vx:1,vy:1,life:10});
   const samples=[];
   for(let n=0;n<240;n++){w.player.invulnerable=1;const before=performance.now();updateWorld(w,i,1/120,preferences);render(w,i,preferences);w.events.length=0;samples.push(performance.now()-before);}
   samples.sort((a,b)=>a-b);return {frames:240,medianMs:samples[120],p95Ms:samples[228],pool:[w.allies.length,w.hostiles.length,w.enemies.length,w.particles.length]};
  });
  assert.deepEqual(benchmark.pool,[128,512,16,64]);assert(benchmark.p95Ms<50,'La carga de estrés supera el presupuesto de 50 ms');
  const art=await page.evaluate(async()=>{const{makeEnemySprite,drawPortrait,makeWeaponSprite}=await import('/src/render.js');const{characters}=await import('/src/data/characters.js');const{weapons}=await import('/src/data/weapons.js');const images=[];for(let w=0;w<6;w++){for(let k=0;k<3;k++)images.push(makeEnemySprite(w,k));const boss=makeEnemySprite(w,3,true);if(boss.width!==64||boss.height!==64)throw Error('Tamaño de jefe');images.push(boss);}for(const c of Object.values(characters)){const canvas=document.createElement('canvas');drawPortrait(canvas,c);images.push(canvas);}for(const g of Object.values(weapons))images.push(makeWeaponSprite(g));for(const canvas of images){const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;for(let i=3;i<data.length;i+=4)if(data[i]!==0&&data[i]!==255)throw Error('Sprite con semitransparencia');}if(new Set(images.map(c=>c.toDataURL())).size!==images.length)throw Error('Sprites duplicados');return {sprites:images.length,alpha:'binaria',unique:true};});
  assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'6 mundos, 5 personajes, 10 armas, selección, combate, pausa y consola correctos',benchmark,art}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
