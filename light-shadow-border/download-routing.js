(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.LightShadowDownloadRouting=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ANDROID_PACKAGE='com.dengziwl.bk';
  const HARMONY_PACKAGE='com.dengziwl.bk.har';
  const IOS_URL='https://apps.apple.com/cn/app/id6446897199';
  const stores=Object.freeze({
    xiaomi:{name:'小米应用商店',scheme:'market',client:'com.xiaomi.market',web:'https://app.mi.com/details?id='+ANDROID_PACKAGE},
    huawei:{name:'华为应用市场',scheme:'appmarket',client:'com.huawei.appmarket',web:'https://appgallery.cloud.huawei.com/appDetail?pkgName='+ANDROID_PACKAGE+'&detailType=0&callType=AGDLINK'},
    honor:{name:'荣耀应用市场',scheme:'honormarket',client:'com.hihonor.appmarket'},
    oppo:{name:'OPPO 软件商店',scheme:'market',client:'com.heytap.market'},
    vivo:{name:'vivo 应用商店',scheme:'market',client:'com.bbk.appstore'},
    harmony:{name:'华为应用市场（鸿蒙）',web:'https://appgallery.huawei.com/app/detail?id='+HARMONY_PACKAGE},
    system:{name:'手机应用商店',scheme:'market',client:null}
  });
  function detectDevice(input){
    input=input||{};
    const ua=String(input.userAgent||'');
    const embedded=/MicroMessenger|\bQQ\/|Weibo|DingTalk/i.test(ua);
    const ios=/iPhone|iPad|iPod/i.test(ua)||(input.platform==='MacIntel'&&Number(input.maxTouchPoints)>1);
    if(ios)return{platform:'ios',store:null,embedded,chrome:false};
    // HarmonyOS NEXT uses its own bundle. Android-compatible HarmonyOS browsers retain Android in UA.
    const nativeHarmony=/HarmonyOS|OpenHarmony/i.test(ua)&&!/Android/i.test(ua);
    if(nativeHarmony)return{platform:'harmony',store:'harmony',embedded,chrome:false};
    if(!/Android/i.test(ua))return{platform:'desktop',store:null,embedded,chrome:false};
    let store='system';
    if(/HONOR|HonorBrowser/i.test(ua))store='honor';
    else if(/HUAWEI|HuaweiBrowser|HMSCore|HarmonyOS/i.test(ua))store='huawei';
    else if(/Xiaomi|Redmi|MiuiBrowser|MiBrowser|HyperOS|\bMI\s/i.test(ua))store='xiaomi';
    else if(/OPPO|OnePlus|realme|HeyTapBrowser/i.test(ua))store='oppo';
    else if(/vivo|iQOO/i.test(ua))store='vivo';
    const chrome=/Chrome\//i.test(ua)&&!/MiuiBrowser|MiBrowser|HuaweiBrowser|HeyTapBrowser|VivoBrowser|HONORBrowser|OPPOBrowser/i.test(ua);
    return{platform:'android',store,embedded,chrome};
  }
  function fallbackUrl(pageUrl){
    const url=new URL(pageUrl);url.hash='android-stores';return url.href;
  }
  function storeTarget(storeId,device,pageUrl){
    if(!Object.prototype.hasOwnProperty.call(stores,storeId))throw new Error('Unknown store');
    const store=stores[storeId];const fallback=fallbackUrl(pageUrl);
    const base={store:storeId,name:store.name,appPackage:storeId==='harmony'?HARMONY_PACKAGE:ANDROID_PACKAGE};
    if(device.embedded)return Object.assign(base,{action:'manual',reason:'embedded',href:fallback});
    if(storeId==='harmony')return Object.assign(base,{action:'web',href:store.web});
    if(device.platform!=='android'){
      if(store.web)return Object.assign(base,{action:'web',href:store.web});
      return Object.assign(base,{action:'manual',reason:'desktop',href:fallback});
    }
    let href=store.scheme+'://details?id='+ANDROID_PACKAGE;
    if(device.chrome){
      href='intent://details?id='+ANDROID_PACKAGE+'#Intent;scheme='+store.scheme+';'+(store.client?'package='+store.client+';':'')+'S.browser_fallback_url='+encodeURIComponent(fallback)+';end';
    }
    return Object.assign(base,{action:'native',href,web:store.web||null});
  }
  function automaticTarget(device,pageUrl){
    if(device.platform==='ios')return{action:'web',name:'App Store',href:IOS_URL,appPackage:null};
    if(device.store)return storeTarget(device.store,device,pageUrl);
    return{action:'manual',reason:'desktop',name:'选择应用商店',href:fallbackUrl(pageUrl)};
  }
  return Object.freeze({ANDROID_PACKAGE,HARMONY_PACKAGE,IOS_URL,stores,detectDevice,storeTarget,automaticTarget});
});
