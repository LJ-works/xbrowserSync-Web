if(!self.define){let e,i={};const s=(s,r)=>(s=new URL(s+".js",r).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(r,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let c={};const o=e=>s(e,t),f={module:{uri:t},exports:c,require:o};i[t]=Promise.all(r.map((e=>f[e]||o(e)))).then((e=>(n(...e),c)))}}define(["./workbox-f683aea5"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"126.js",revision:"393aa496cf917cedf6fdae5633a9f1d7"},{url:"index.html",revision:"f64eacce4439e7fd0374ed8385be8057"},{url:"main.css",revision:"c3bc4b463dd9a9634753959cfe92dee0"},{url:"main.js",revision:"b1c4392a95df35d36ea332c0fe061fbc"},{url:"main.js.LICENSE.txt",revision:"f8c5098203685ab5cb04fe8ac75a05f4"}],{})}));
