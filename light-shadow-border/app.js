'use strict';
const photos={
  coast:{src:'assets/coast.jpg',name:'山海',title:'山海之间',colors:['#40665e','#bd9566','#e4d1b4']},
  city:{src:'assets/city.jpg',name:'城市',title:'街角的午后',colors:['#b37955','#728064','#e0c6a2']},
  flowers:{src:'assets/flowers.jpg',name:'日常',title:'给日常一点温柔',colors:['#929578','#d2c394','#e5e2d0']}
};
const styles={white:'简约留白',watermark:'光影水印',ticket:'旅行票根',glass:'玻璃色卡'};
let selectedPhoto='coast';let selectedStyle='white';
const frame=document.getElementById('demo-frame');const photo=document.getElementById('demo-photo');const stage=document.getElementById('preview-stage');
function render(){
  const item=photos[selectedPhoto];frame.dataset.style=selectedStyle;photo.src=item.src;photo.alt=item.name+'示例照片，'+styles[selectedStyle]+'风格。';
  stage.style.setProperty('--photo','url("'+item.src+'")');document.getElementById('frame-title').textContent=item.title;
  document.getElementById('demo-status').textContent=item.name+' · '+styles[selectedStyle];
  document.querySelectorAll('.style-option').forEach(button=>{const active=button.dataset.style===selectedStyle;button.setAttribute('aria-pressed',String(active));button.classList.toggle('selected',active);});
  document.querySelectorAll('.photo-option').forEach(button=>{const active=button.dataset.photo===selectedPhoto;button.setAttribute('aria-pressed',String(active));button.classList.toggle('selected',active);});
  document.querySelectorAll('.palette-strip>span').forEach((swatch,index)=>swatch.style.setProperty('--swatch',item.colors[index]));
}
document.querySelectorAll('.style-option').forEach(button=>button.addEventListener('click',()=>{selectedStyle=button.dataset.style;render();}));
document.querySelectorAll('.photo-option').forEach(button=>button.addEventListener('click',()=>{selectedPhoto=button.dataset.photo;render();}));
document.getElementById('copy-name').addEventListener('click',async()=>{
 const output=document.getElementById('copy-status');
 try{await navigator.clipboard.writeText('光影边框');output.textContent='已复制“光影边框”，请在应用市场搜索。';}
 catch{output.textContent='请在应用市场搜索：光影边框';}
});

const copyWechat=document.getElementById('copy-wechat');
copyWechat.addEventListener('click',async()=>{
 const output=document.getElementById('wechat-status');
 try{await navigator.clipboard.writeText('dengziwl');output.textContent='已复制商务微信 dengziwl，欢迎添加联系。';}
 catch{output.textContent='商务微信：dengziwl，可长按或选中微信号复制。';}
});

const downloadRouting=window.LightShadowDownloadRouting;
if(downloadRouting){
 const device=downloadRouting.detectDevice({userAgent:navigator.userAgent,platform:navigator.platform,maxTouchPoints:navigator.maxTouchPoints});
 const storePicker=document.getElementById('android-stores');
 const routeStatus=document.getElementById('store-navigation-status');
 const androidLink=document.getElementById('android-download');
 const harmonyLink=document.getElementById('harmony-download');
 const pageUrl=window.location.href;
 const target=downloadRouting.automaticTarget(device,pageUrl);
 androidLink.href=target.href;
 document.getElementById('android-download-label').textContent=target.action==='manual'?'选择应用商店':'前往'+target.name;
 const deviceNote=document.getElementById('android-device-note');
 if(device.embedded)deviceNote.textContent='请在手机浏览器中打开本页，再前往应用商店；也可手动选择品牌。';
 else if(device.platform==='ios')deviceNote.textContent='当前设备可从 App Store 获取；其他手机可在下方选择对应品牌。';
 else if(device.store)deviceNote.textContent='已优先选择'+target.name+'。识别不准或无法打开时，可在下方手动切换。';
 function openStorePicker(message){storePicker.open=true;routeStatus.textContent=message;}
 function wireDownload(link,resolved){
  link.href=resolved.href;
  link.addEventListener('click',function(event){
   if(event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   if(resolved.action==='manual'){
    event.preventDefault();
    const message=resolved.reason==='embedded'?'请使用右上角菜单在手机浏览器中打开，再选择应用商店。':device.platform==='desktop'&&resolved.store?'请在对应品牌的手机上打开本页，或复制应用名称到手机应用商店搜索。':'请选择你的手机品牌；浏览器无法识别时，也可以打开手机默认应用商店。';
    openStorePicker(message);storePicker.scrollIntoView({block:'start'});
   }else if(resolved.action==='native'){
    // Prepare a visible fallback before the user-initiated native navigation. Never redirect from a timer.
    openStorePicker('正在尝试打开'+resolved.name+'。若未打开，请在下面手动选择或复制应用名称。');
   }
  });
 }
 wireDownload(androidLink,target);
 wireDownload(harmonyLink,downloadRouting.storeTarget('harmony',device,pageUrl));
 document.querySelectorAll('[data-store]').forEach(link=>wireDownload(link,downloadRouting.storeTarget(link.dataset.store,device,pageUrl)));
 function revealStorePicker(){if(window.location.hash==='#android-stores')storePicker.open=true;}
 revealStorePicker();window.addEventListener('hashchange',revealStorePicker);
}
