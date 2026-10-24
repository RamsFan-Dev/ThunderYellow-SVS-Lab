const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'):'playwright');
(async()=>{
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const file=path.join(root,req.url==='/'?'index.html':req.url.split('?')[0]);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>typeof inspectCartridgeSave==='function');
assert.equal(await page.locator('#drop + #savAssist').count(),1);
assert.equal(await page.locator('#gymCoachBuildSwap').count(),1);
assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
const data=await page.evaluate(()=>{const d=new Uint8Array(0x20000);for(let bank=0;bank<2;bank++)for(let id=0;id<14;id++){const b=(14*bank+id)*4096;d[b]=id+1;w16(d,b+0xff4,id);w16(d,b+0xff6,checksum(d,b,sectionLengths[id]));d.set([0x25,0x20,1,8],b+0xff8);d[b+0xffc]=bank+1;}return Array.from(d);});
await page.evaluate(()=>{work=Uint8Array.of(1,2,3);original=work.slice();filename='keep.svs';});
await page.locator('#savFile').setInputFiles({name:'test.sav',mimeType:'application/octet-stream',buffer:Buffer.from(data)});
await page.waitForFunction(()=>document.getElementById('savStatus').textContent.includes('2 complete'));
assert(await page.locator('#savGuide').evaluate(e=>e.open));
assert(await page.evaluate(()=>work.join(',')==='1,2,3'&&original.join(',')==='1,2,3'&&filename==='keep.svs'));
await page.screenshot({path:'/tmp/svs-mobile-assist.png',fullPage:true});
await page.locator('#savFile').setInputFiles({name:'wrong.sav',mimeType:'application/octet-stream',buffer:Buffer.alloc(10)});
await page.waitForFunction(()=>document.getElementById('savStatus').textContent.includes('128 KiB'));
assert.equal(await page.locator('#savGuide').evaluate(e=>e.open),false);
// A corrupted full-size file must not retain a success message.
await page.locator('#savFile').setInputFiles({name:'bad.sav',mimeType:'application/octet-stream',buffer:Buffer.alloc(131072)});
await page.waitForFunction(()=>document.getElementById('savStatus').textContent.includes('No complete'));
// Drop uses the secondary input without invoking the main SVS loader.
await page.evaluate(bytes=>{const dt=new DataTransfer();dt.items.add(new File([Uint8Array.from(bytes)],'drop.sav'));document.getElementById('savDrop').dispatchEvent(new DragEvent('drop',{dataTransfer:dt,bubbles:true,cancelable:true}));},data);
await page.waitForFunction(()=>document.getElementById('savStatus').textContent.includes('drop.sav: 2 complete'));
assert(await page.evaluate(()=>filename==='keep.svs'));
const chooser=page.waitForEvent('filechooser');await page.locator('#savOpenState').click();assert.equal(await (await chooser).element().getAttribute('id'),'file');
assert.deepEqual(errors,[]);console.log('PASS: mobile layout, independent SAV upload/drop, valid/error/reset states, unchanged open editor, SVS chooser and existing Coach button; no browser exceptions.');
}finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
