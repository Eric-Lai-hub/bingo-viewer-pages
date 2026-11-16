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
