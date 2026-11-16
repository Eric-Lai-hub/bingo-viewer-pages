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

const appTourSteps={
 home:{image:'assets/app-home-ios.jpg',alt:'光影边框 iOS 首页，展示光影水印、背景模糊模板及底部导航。',platform:'模板首页 · iOS 实际截图',frame:'phone',title:'先在首页，挑好想用的模板。',description:'光影水印、背景模糊等模板按类别排列，先看预览再进入编辑。底部还有视频专区和我的，照片和视频的入口一眼能分清。',points:['浏览每一类模板的成图预览。','点选模板后，从相册加入自己的照片。','视频水印从底部“视频专区”进入。'],path:'操作路径：首页 → 选择模板 → 相册选图'},
 editor:{image:'assets/app-editor-ios.jpg',alt:'iOS 编辑页中的山海摄影示例，展示模糊背景、Sony 参数水印以及底部比例选项。',platform:'边框编辑 · iOS 实际截图',frame:'phone',title:'比例、Logo、参数，切换面板直接调。',description:'照片在上方预览，工具集中在底部。以截图中的背景模糊模板为例，可以切换原图、16:9、3:4 和 9:16，再继续调整 Logo、参数、主题、阴影与边距。',points:['选择比例，让作品适合横向或竖向分享。','截图示例：SONY ILCE-7M4，35mm、F5.6、1/250s、ISO100，均来自演示 EXIF。','照片下方的缩略图栏，可以随时切换和继续添加照片。'],path:'操作路径：编辑页 → 底部设置面板 → 查看预览'},
 batch:{image:'assets/app-batch-ios.jpg',alt:'iOS 编辑页中的城市摄影示例，显示 Fujifilm 参数水印与一组照片缩略图。',platform:'多图编辑 · iOS 实际截图',frame:'phone',title:'同一组照片，一套边框批量做。',description:'已选照片出现在预览下方，点缩略图逐张检查效果，也可以用加号继续添加。为一组照片使用相同的模板设置，再通过右上角保存入口批量导出。',points:['多张照片放在同一编辑会话中，减少重复进入模板。','逐张切换检查画面，需要时添加或移除照片。','保存时按顺序处理，结果页显示成功、失败与未处理数量。'],path:'操作路径：多选照片 → 缩略图切换检查 → 右上角保存'},
 logo:{image:'assets/app-logo-ios.jpg',alt:'iOS 编辑器 Logo 面板，展示山海摄影示例、Sony 参数水印、品牌 Logo 与推荐、我的、大小选项。',platform:'Logo 面板 · iOS 实际截图',frame:'phone',title:'选内置 Logo，也能放自己的签名。',description:'Logo 面板提供内置素材选择，界面中有“推荐”“我的”“大小”入口。你可以切换品牌素材，或导入自己的 Logo，再调整到适合当前版式的尺寸。',points:['内置 Logo 可直接在素材列表里选择。','通过“我的”使用自己的素材，保持作品签名一致。','调整 Logo 大小；不同模板还提供对应的文字、参数和配方选项。'],path:'操作路径：编辑页 → Logo → 推荐 / 我的 / 大小'},
 quality:{image:'assets/app-quality-ios.jpg?v=20261116-ios-exif',alt:'iOS 导出画质设置，提供普通导出和高质量导出两种选项及用途说明。',platform:'导出画质 · iOS 实际截图',frame:'phone',title:'普通或高质量导出，按用途选择。',description:'在导出画质设置里选择普通导出或高质量导出。普通导出便于社交分享，高质量导出更适合存档、打印或后续编辑，文件也通常更大。',points:['普通导出会控制尺寸与压缩，便于日常分享。','高质量导出尽量保留照片细节与拍摄信息。','实际成图仍受源照片、模板和导出格式影响。'],path:'操作路径：我的 → 导出画质 → 选择导出模式'}
};
const appTourTabs=[...document.querySelectorAll('[data-app-step]')];
function selectAppTour(key){
 const step=appTourSteps[key];if(!step)return;
 appTourTabs.forEach(tab=>{const selected=tab.dataset.appStep===key;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
 document.getElementById('app-tour-panel').setAttribute('aria-labelledby','app-tab-'+key);
 const image=document.getElementById('tour-screen');image.src=step.image;image.alt=step.alt;
 const dimensions=[1206,2622];
 image.setAttribute('width',String(dimensions[0]));image.setAttribute('height',String(dimensions[1]));
 document.getElementById('tour-screen-link').href=step.image;
 document.getElementById('tour-screen-stage').dataset.frame=step.frame;
 document.getElementById('tour-platform').textContent=step.platform;
 document.getElementById('tour-step-title').textContent=step.title;
 document.getElementById('tour-step-description').textContent=step.description;
 document.getElementById('tour-action-hint').textContent=step.path;
 document.getElementById('tour-step-points').replaceChildren(...step.points.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
}
appTourTabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>selectAppTour(tab.dataset.appStep));
 tab.addEventListener('keydown',event=>{
  let next=null;
  if(event.key==='ArrowRight')next=(index+1)%appTourTabs.length;
  if(event.key==='ArrowLeft')next=(index+appTourTabs.length-1)%appTourTabs.length;
  if(event.key==='Home')next=0;if(event.key==='End')next=appTourTabs.length-1;
  if(next!==null){event.preventDefault();selectAppTour(appTourTabs[next].dataset.appStep);appTourTabs[next].focus();}
 });
});
function revealExampleDemo(){if(location.hash==='#playground')document.getElementById('example-demo').open=true;}
revealExampleDemo();window.addEventListener('hashchange',revealExampleDemo);
