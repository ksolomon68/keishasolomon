(()=>{var a={};a.id=702,a.ids=[702],a.modules={1932:a=>{"use strict";a.exports=require("url")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4844:(a,b,c)=>{"use strict";c.d(b,{PrintButton:()=>d});let d=(0,c(77943).registerClientReference)(function(){throw Error("Attempted to call PrintButton() from the server but PrintButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\KSOLO\\OneDrive\\Documents\\keishasolomon\\app\\certificate\\print-button.tsx","PrintButton")},5632:(a,b,c)=>{"use strict";c.d(b,{A:()=>f});var d=c(69413);let e={name:"circle-check",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 9-5.5 5.5L8 12",key:"xofnsj"}]],aliases:["check-circle-2"]};e.node;let f=(0,d.A)(e)},8128:a=>{"use strict";a.exports=require("next/dist/server/runtime-reacts.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},13527:(a,b,c)=>{Promise.resolve().then(c.bind(c,81690)),Promise.resolve().then(c.bind(c,20876)),Promise.resolve().then(c.t.bind(c,2116,23)),Promise.resolve().then(c.t.bind(c,51455,23))},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},19771:a=>{"use strict";a.exports=require("process")},27207:(a,b,c)=>{"use strict";async function d(a,b){return b.cohortId?a.getCohort(b.cohortId):null}async function e(a,b){return"admin"===b.role?a.listResources():b.cohortId?a.listResources(b.cohortId):(await a.listResources()).filter(a=>null===a.cohortId)}c.d(b,{j:()=>e,l:()=>d})},27910:a=>{"use strict";a.exports=require("stream")},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},30053:(a,b,c)=>{"use strict";c.d(b,{Lx:()=>i,s$:()=>k,x5:()=>j});var d=c(89256);let e=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",year:"numeric",timeZone:"UTC"}),f=new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"UTC"}),g=a=>{let[b,c,d]=a.split("-").map(Number);return new Date(Date.UTC(b,c-1,d))},h=a=>e.format(g(a));function i(a){return d.Mf.map(b=>{if(!a||!Object.hasOwn(a,b.id))return b;let c=a[b.id];return c&&c===b.date?b:c?{...b,date:c,dateLabel:h(c),shortDate:f.format(g(c))}:{...b,date:null,dateLabel:"Date to be announced",shortDate:"TBA"}})}let j=a=>a.filter(a=>null!==a.deliverable);function k(a){let b=a?.completionDate;return b?h(b):h(i(a?.sessionDates).flatMap(a=>a.date?[a.date]:[]).sort().at(-1)??(0,d.JF)("s8")?.date??"2027-05-11")}},33873:a=>{"use strict";a.exports=require("path")},34631:a=>{"use strict";a.exports=require("tls")},38522:a=>{"use strict";a.exports=require("node:zlib")},41025:a=>{"use strict";a.exports=require("next/dist/server/app-render/dynamic-access-async-storage.external.js")},41204:a=>{"use strict";a.exports=require("string_decoder")},46060:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external.js")},47613:(a,b,c)=>{"use strict";c.d(b,{default:()=>d});let d=(0,c(77943).registerClientReference)(function(){throw Error("Attempted to call the default export of \"C:\\\\Users\\\\KSOLO\\\\OneDrive\\\\Documents\\\\keishasolomon\\\\node_modules\\\\lucide-react\\\\dist\\\\esm\\\\Icon.mjs\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\KSOLO\\OneDrive\\Documents\\keishasolomon\\node_modules\\lucide-react\\dist\\esm\\Icon.mjs","default")},49158:(a,b,c)=>{"use strict";c.d(b,{A:()=>f});var d=c(69413);let e={name:"lock",size:24,node:[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]};e.node;let f=(0,d.A)(e)},51002:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>A,metadata:()=>z});var d=c(5735),e=c(63059),f=c.n(e),g=c(23755),h=c(22926),i=c(89256),j=c(27207),k=c(30053),l=c(29978),m=c(87349),n=c.n(m);let o=(()=>{let a=[];for(let b=0;b<=360;b++){let c=b*Math.PI/180,d=92+4*Math.sin(28*c);a.push(`${(100+d*Math.cos(c)).toFixed(2)},${(100+d*Math.sin(c)).toFixed(2)}`)}return`M${a.join("L")}Z`})();function p({className:a}){return(0,d.jsxs)("svg",{className:`cert-corner ${a}`,viewBox:"0 0 100 100","aria-hidden":"true",children:[(0,d.jsx)("path",{d:"M3 70 V3 H70",fill:"none",stroke:"url(#cert-gold)",strokeWidth:"3"}),(0,d.jsx)("path",{d:"M12 50 V12 H50",fill:"none",stroke:"url(#cert-gold)",strokeWidth:"1"}),(0,d.jsx)("path",{d:"M20 20 l6 -6 l6 6 l-6 6 Z",fill:"url(#cert-gold)"}),(0,d.jsx)("circle",{cx:"42",cy:"20",r:"1.8",fill:"url(#cert-gold)"}),(0,d.jsx)("circle",{cx:"20",cy:"42",r:"1.8",fill:"url(#cert-gold)"})]})}function q(){return(0,d.jsxs)("svg",{className:"cert-flourish",viewBox:"0 0 400 24","aria-hidden":"true",children:[(0,d.jsx)("rect",{x:"0",y:"11.4",width:"170",height:"1.2",fill:"url(#cert-gold-fade-l)"}),(0,d.jsx)("rect",{x:"230",y:"11.4",width:"170",height:"1.2",fill:"url(#cert-gold-fade-r)"}),(0,d.jsx)("path",{d:"M200 3 L209 12 L200 21 L191 12 Z",fill:"url(#cert-gold)"}),(0,d.jsx)("path",{d:"M180 12 L185 7 L190 12 L185 17 Z",fill:"none",stroke:"#c5933a",strokeWidth:"1"}),(0,d.jsx)("path",{d:"M210 12 L215 7 L220 12 L215 17 Z",fill:"none",stroke:"#c5933a",strokeWidth:"1"})]})}function r(){return(0,d.jsxs)("svg",{className:"cert-seal",viewBox:"0 0 200 200",role:"img","aria-label":"EVOBRAND Concepts seal",children:[(0,d.jsx)("path",{d:o,fill:"url(#cert-gold)"}),(0,d.jsx)("circle",{cx:"100",cy:"100",r:"82",fill:"none",stroke:"#fff",strokeOpacity:".55",strokeWidth:"1.5"}),(0,d.jsx)("circle",{cx:"100",cy:"100",r:"78",fill:"#0b1730"}),(0,d.jsx)("circle",{cx:"100",cy:"100",r:"74",fill:"none",stroke:"url(#cert-gold)",strokeWidth:"1.2"}),(0,d.jsx)("defs",{children:(0,d.jsx)("path",{id:"cert-seal-ring",d:"M100,100 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0"})}),(0,d.jsx)("text",{fill:"#f1d38f",fontSize:"9.5",fontWeight:"600",letterSpacing:"1.6",fontFamily:"var(--font-mono), monospace",children:(0,d.jsx)("textPath",{href:"#cert-seal-ring",textLength:"366",lengthAdjust:"spacing",children:"THE AI EXECUTIVE SANDBOX ✦ EVOBRAND CONCEPTS ✦"})}),(0,d.jsx)("circle",{cx:"100",cy:"100",r:"42",fill:"url(#cert-seal-core)"}),(0,d.jsx)("circle",{cx:"100",cy:"100",r:"42",fill:"none",stroke:"url(#cert-gold)",strokeWidth:"1.5"}),(0,d.jsx)("image",{href:"/favicon-source.png",x:"70",y:"70",width:"60",height:"60"})]})}function s({name:a,organization:b,cohortName:c,date:e}){let f=a.length>30?"4.6cqw":a.length>22?"5.8cqw":"7.4cqw";return(0,d.jsxs)("div",{className:"cert-scroll",children:[(0,d.jsxs)("article",{id:"certificate","aria-label":"Certificate of Completion",className:`cert-sheet ${n().variable}`,children:[(0,d.jsx)("svg",{width:"0",height:"0",className:"absolute","aria-hidden":"true",focusable:"false",children:(0,d.jsxs)("defs",{children:[(0,d.jsxs)("linearGradient",{id:"cert-gold",x1:"0",y1:"0",x2:"1",y2:"1",children:[(0,d.jsx)("stop",{offset:"0",stopColor:"#f0d48e"}),(0,d.jsx)("stop",{offset:".45",stopColor:"#c5933a"}),(0,d.jsx)("stop",{offset:"1",stopColor:"#8a6420"})]}),(0,d.jsxs)("linearGradient",{id:"cert-gold-fade-l",x1:"0",y1:"0",x2:"1",y2:"0",children:[(0,d.jsx)("stop",{offset:"0",stopColor:"#c5933a",stopOpacity:"0"}),(0,d.jsx)("stop",{offset:"1",stopColor:"#c5933a"})]}),(0,d.jsxs)("linearGradient",{id:"cert-gold-fade-r",x1:"0",y1:"0",x2:"1",y2:"0",children:[(0,d.jsx)("stop",{offset:"0",stopColor:"#c5933a"}),(0,d.jsx)("stop",{offset:"1",stopColor:"#c5933a",stopOpacity:"0"})]}),(0,d.jsxs)("radialGradient",{id:"cert-seal-core",cx:".4",cy:".35",r:".8",children:[(0,d.jsx)("stop",{offset:"0",stopColor:"#ffffff"}),(0,d.jsx)("stop",{offset:"1",stopColor:"#dde6f0"})]})]})}),(0,d.jsxs)("div",{className:"cert-paper",children:[(0,d.jsx)(l.default,{src:"/favicon-source.png",alt:"",width:512,height:512,className:"cert-watermark","aria-hidden":"true"}),(0,d.jsx)(p,{className:"cert-corner-tl"}),(0,d.jsx)(p,{className:"cert-corner-tr"}),(0,d.jsx)(p,{className:"cert-corner-bl"}),(0,d.jsx)(p,{className:"cert-corner-br"}),(0,d.jsxs)("div",{className:"cert-body",children:[(0,d.jsx)("a",{href:i.IA.companyUrl,target:"_blank",rel:"noopener noreferrer",className:"inline-block transition-opacity hover:opacity-85",children:(0,d.jsx)(l.default,{src:"/evobrand-logo.png",alt:"EVOBRAND Concepts",width:1024,height:175,className:"cert-logo",priority:!0})}),(0,d.jsx)("h1",{className:"cert-title",children:"Certificate"}),(0,d.jsx)("p",{className:"cert-subtitle",children:"of Completion"}),(0,d.jsx)(q,{}),(0,d.jsx)("p",{className:"cert-lead",children:"This certificate is proudly presented to"}),(0,d.jsx)("p",{className:"cert-name",style:{fontSize:f},children:a}),(0,d.jsx)("span",{className:"cert-name-rule","aria-hidden":"true"}),b&&(0,d.jsx)("p",{className:"cert-org",children:b}),(0,d.jsx)("p",{className:"cert-text",children:"for successfully completing the eight-month cohort program and its capstone project, building real AI workflows, policies and automations for their organization."}),(0,d.jsxs)("p",{className:"cert-program",children:["“",i._P.name,"”"]}),(0,d.jsx)("p",{className:"cert-tagline",children:i._P.tagline}),c&&(0,d.jsx)("p",{className:"cert-cohort",children:c}),(0,d.jsx)("ul",{className:"cert-stats",children:i.H.slice(0,3).map(a=>(0,d.jsxs)("li",{children:[(0,d.jsx)("span",{className:"cert-stat-value",children:a.value}),(0,d.jsx)("span",{className:"cert-stat-label",children:a.label})]},a.label))}),(0,d.jsxs)("div",{className:"cert-footer",children:[(0,d.jsxs)("div",{className:"cert-sign",children:[(0,d.jsx)("p",{className:"cert-signature",children:i.IA.name}),(0,d.jsx)("span",{className:"cert-sign-rule","aria-hidden":"true"}),(0,d.jsx)("p",{className:"cert-sign-name",children:i.IA.name}),(0,d.jsxs)("p",{className:"cert-sign-role",children:[i.IA.role,","," ",(0,d.jsx)("a",{href:i.IA.companyUrl,target:"_blank",rel:"noopener noreferrer",className:"hover:underline",children:i.IA.company})]})]}),(0,d.jsx)(r,{}),(0,d.jsxs)("div",{className:"cert-sign",children:[(0,d.jsx)("p",{className:"cert-date",children:e}),(0,d.jsx)("span",{className:"cert-sign-rule","aria-hidden":"true"}),(0,d.jsx)("p",{className:"cert-sign-name",children:"Date of Completion"}),(0,d.jsxs)("p",{className:"cert-sign-role",children:["Verify at ",i._P.url.replace(/^https?:\/\//,"")]})]})]})]})]})]}),(0,d.jsx)("style",{children:`
        /* ── Sheet: everything is sized in cqw so it scales like a photo of the page ── */
        .cert-scroll {
          overflow-x: auto;
          padding: 2.5rem 1rem 3.5rem;
        }
        .cert-sheet {
          container-type: inline-size;
          position: relative;
          width: 100%;
          min-width: 760px;
          max-width: 1100px;
          margin: 0 auto;
          aspect-ratio: 11 / 8.5;
          padding: 2.2cqw;
          color: var(--color-ink);
          background-color: #0b1730;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cpath d='M0 7 7 0 14 7 7 14Z' fill='none' stroke='%23f4b63f' stroke-opacity='.3' stroke-width='.6'/%3E%3C/svg%3E");
          box-shadow: 0 30px 60px -20px rgb(11 23 48 / .45), 0 6px 14px rgb(11 23 48 / .2);
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        .cert-sheet::before {
          content: "";
          position: absolute;
          inset: 1.1cqw;
          border: 0.14cqw solid rgb(240 212 142 / .75);
          pointer-events: none;
        }

        /* ── Paper ── */
        .cert-paper {
          position: relative;
          height: 100%;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 0%, #fffefb 0%, #fbf7ec 60%, #f3ecda 100%);
          border: 0.14cqw solid #c5933a;
          box-shadow: inset 0 0 0 0.7cqw #fbf7ec, inset 0 0 0 0.85cqw rgb(197 147 58 / .55);
        }
        .cert-watermark {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 44cqw;
          height: auto;
          transform: translate(-50%, -50%);
          opacity: 0.06;
          filter: grayscale(0.4);
          pointer-events: none;
        }
        .cert-corner {
          position: absolute;
          width: 9cqw;
          height: 9cqw;
        }
        .cert-corner-tl { top: 1.4cqw; left: 1.4cqw; }
        .cert-corner-tr { top: 1.4cqw; right: 1.4cqw; transform: scaleX(-1); }
        .cert-corner-bl { bottom: 1.4cqw; left: 1.4cqw; transform: scaleY(-1); }
        .cert-corner-br { bottom: 1.4cqw; right: 1.4cqw; transform: scale(-1, -1); }

        /* ── Content ── */
        .cert-body {
          position: relative;
          display: flex;
          height: 100%;
          flex-direction: column;
          align-items: center;
          padding: 3.4cqw 6.5cqw 3.6cqw;
          text-align: center;
        }
        .cert-logo {
          width: 22cqw;
          height: auto;
        }
        .cert-title {
          margin-top: 1.7cqw;
          font-family: var(--font-display);
          font-size: 6.6cqw;
          font-weight: 300;
          line-height: 1;
          letter-spacing: 0.02em;
          color: var(--color-navy-900);
        }
        .cert-subtitle {
          margin-top: 0.7cqw;
          font-family: var(--font-mono);
          font-size: 1.35cqw;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          padding-left: 0.5em;
          color: var(--color-cyan-deep);
        }
        .cert-flourish {
          width: 30cqw;
          height: auto;
          margin-top: 1.5cqw;
        }
        .cert-lead {
          margin-top: 1.5cqw;
          font-family: var(--font-display);
          font-size: 1.55cqw;
          font-style: italic;
          color: var(--color-muted);
        }
        .cert-name {
          margin-top: 0.4cqw;
          max-width: 100%;
          font-family: var(--font-script), var(--font-display), cursive;
          line-height: 1.25;
          color: var(--color-navy-900);
          overflow-wrap: anywhere;
        }
        .cert-name-rule {
          display: block;
          width: 46cqw;
          height: 0.12cqw;
          background: linear-gradient(to right, transparent, #c5933a 20%, #c5933a 80%, transparent);
        }
        .cert-org {
          margin-top: 0.8cqw;
          font-family: var(--font-mono);
          font-size: 1.1cqw;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-cyan-deep);
        }
        .cert-text {
          margin-top: 1.4cqw;
          max-width: 52cqw;
          font-size: 1.5cqw;
          line-height: 1.55;
          color: var(--color-muted);
        }
        .cert-program {
          margin-top: 1.2cqw;
          font-family: var(--font-display);
          font-size: 3cqw;
          font-style: italic;
          font-weight: 400;
          line-height: 1.15;
          color: var(--color-amber-deep);
        }
        .cert-tagline {
          margin-top: 0.5cqw;
          font-family: var(--font-mono);
          font-size: 1cqw;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--color-muted);
        }
        .cert-cohort {
          margin-top: 0.7cqw;
          max-width: 60cqw;
          font-family: var(--font-display);
          font-size: 1.4cqw;
          font-style: italic;
          color: var(--color-navy-700);
        }
        .cert-stats {
          display: flex;
          margin-top: 1.6cqw;
          list-style: none;
        }
        .cert-stats li {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 2.6cqw;
        }
        .cert-stats li + li {
          border-left: 0.1cqw solid rgb(197 147 58 / .6);
        }
        .cert-stat-value {
          font-family: var(--font-display);
          font-size: 2.3cqw;
          font-weight: 300;
          line-height: 1;
          color: var(--color-navy-900);
        }
        .cert-stat-label {
          margin-top: 0.4cqw;
          font-family: var(--font-mono);
          font-size: 0.85cqw;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-muted);
        }

        /* ── Footer: signature \xb7 seal \xb7 date ── */
        .cert-footer {
          display: grid;
          width: 100%;
          margin-top: auto;
          grid-template-columns: 1fr auto 1fr;
          align-items: end;
          gap: 2cqw;
        }
        .cert-seal {
          width: 12.5cqw;
          height: 12.5cqw;
          filter: drop-shadow(0 0.4cqw 0.6cqw rgb(11 23 48 / .3));
        }
        .cert-sign {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 0.4cqw;
        }
        .cert-signature,
        .cert-date {
          min-height: 4.2cqw;
          display: flex;
          align-items: flex-end;
          color: var(--color-navy-900);
        }
        .cert-signature {
          font-family: var(--font-script), var(--font-display), cursive;
          font-size: 3.6cqw;
          line-height: 1.1;
        }
        .cert-date {
          font-family: var(--font-display);
          font-size: 1.9cqw;
          font-weight: 400;
        }
        .cert-sign-rule {
          display: block;
          width: 20cqw;
          height: 0.12cqw;
          margin-top: 0.4cqw;
          background: var(--color-navy-900);
          opacity: 0.55;
        }
        .cert-sign-name {
          margin-top: 0.6cqw;
          font-family: var(--font-display);
          font-size: 1.4cqw;
          font-weight: 500;
          color: var(--color-navy-900);
        }
        .cert-sign-role {
          margin-top: 0.15cqw;
          font-size: 1.05cqw;
          color: var(--color-muted);
        }

        /* ── Print: one landscape Letter page, no browser chrome ── */
        @page { size: 11in 8.5in; margin: 0; }
        @media print {
          html, body { background: #fff !important; }
          .cert-scroll { overflow: visible; padding: 0; }
          .cert-sheet {
            width: 11in;
            min-width: 0;
            max-width: none;
            height: 8.48in;
            aspect-ratio: auto;
            margin: 0;
            box-shadow: none;
            break-inside: avoid;
          }
        }
      `})]})}var t=c(4844),u=c(49158),v=c(60450),w=c(5632),x=c(82884),y=c(96422);let z={title:"Certificate of Completion – The AI Executive Sandbox",description:"Certificate of Completion for the AI Executive Sandbox program, issued by EVOBRAND Concepts."};async function A(){let a=await (0,g.JR)("/certificate"),b=await (0,h.KA)(),[c,e]=await Promise.all([b.listCapstone(a.id),(0,j.l)(b,a)]),l=c.filter(a=>i.Zv.some(b=>b.id===a.stepId)).length,m=i.Zv.length;if(!("admin"===a.role||l>=m)){let a=Math.round(l/m*100);return(0,d.jsx)("div",{className:"mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8",children:(0,d.jsxs)("div",{className:"rounded-xl border border-amber/30 bg-white p-8 text-center shadow-lg sm:p-12",children:[(0,d.jsx)("div",{className:"mx-auto flex size-16 items-center justify-center rounded-full bg-amber/10 text-amber-deep",children:(0,d.jsx)(u.A,{className:"size-8"})}),(0,d.jsx)("h1",{className:"mt-6 font-display text-3xl font-light text-navy-900 sm:text-4xl",children:"Certificate Locked"}),(0,d.jsxs)("p",{className:"mt-3 text-lg leading-relaxed text-muted",children:["The official"," ",(0,d.jsx)("a",{href:"https://evobrand.net",target:"_blank",rel:"noopener noreferrer",className:"font-semibold text-navy-900 underline underline-offset-2 hover:text-amber-deep",children:"EVOBRAND Concepts"})," ","Certificate of Completion is awarded upon finishing all milestones in your capstone project."]}),(0,d.jsxs)("div",{className:"mx-auto mt-8 max-w-md rounded-lg border border-line bg-paper-deep p-6 text-left",children:[(0,d.jsxs)("div",{className:"flex items-center justify-between text-sm font-semibold text-navy-900",children:[(0,d.jsxs)("span",{className:"flex items-center gap-2",children:[(0,d.jsx)(v.A,{className:"size-4 text-amber-deep"}),"Capstone Progress"]}),(0,d.jsxs)("span",{children:[l," / ",m," steps (",a,"%)"]})]}),(0,d.jsx)("div",{className:"mt-3 h-3 w-full overflow-hidden rounded-full bg-line",children:(0,d.jsx)("div",{className:"h-full bg-amber-deep transition-all duration-500",style:{width:`${a}%`}})}),(0,d.jsxs)("p",{className:"mt-4 text-xs leading-normal text-muted",children:["Complete the remaining ",m-l," capstone step",m-l==1?"":"s"," on your participant dashboard to unlock your certificate."]})]}),(0,d.jsxs)("div",{className:"mt-8 flex flex-col justify-center gap-4 sm:flex-row",children:[(0,d.jsxs)(f(),{href:"/dashboard#capstone",className:(0,y.V)({variant:"primary"}),children:[(0,d.jsx)(w.A,{className:"size-4"}),"Go to Capstone Tracker"]}),(0,d.jsxs)(f(),{href:"/dashboard",className:(0,y.V)({variant:"secondary"}),children:[(0,d.jsx)(x.A,{className:"size-4"}),"Back to Dashboard"]})]})]})})}return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("div",{className:"no-print flex justify-center gap-4 bg-paper-deep py-6 border-b border-line",children:(0,d.jsx)(t.PrintButton,{})}),(0,d.jsx)(s,{name:a.name,organization:a.organization,cohortName:e?.name,date:(0,k.s$)(e)})]})}},53053:a=>{"use strict";a.exports=require("node:diagnostics_channel")},53279:(a,b,c)=>{Promise.resolve().then(c.bind(c,4844)),Promise.resolve().then(c.bind(c,47613)),Promise.resolve().then(c.t.bind(c,23318,23)),Promise.resolve().then(c.t.bind(c,58637,23))},55511:a=>{"use strict";a.exports=require("crypto")},60450:(a,b,c)=>{"use strict";c.d(b,{A:()=>f});var d=c(69413);let e={name:"award",size:24,node:[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]]};e.node;let f=(0,d.A)(e)},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66136:a=>{"use strict";a.exports=require("timers")},66480:(a,b,c)=>{"use strict";c.r(b),c.d(b,{__next_app__:()=>r,handler:()=>t,routeModule:()=>s});var d=c(21635),e=c(86315),f=c(1020),g=c(61287),h={};for(let a in g)0>["default","__next_app__","routeModule","handler"].indexOf(a)&&(h[a]=()=>g[a]);c.d(b,h);let i=(0,d.p)(()=>Promise.resolve().then(c.bind(c,71364))),j=(0,d.p)(()=>Promise.resolve().then(c.bind(c,85034))),k=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,95547,23))),l=(0,d.p)(()=>Promise.resolve().then(c.bind(c,37548))),m=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,45270,23))),n=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,28193,23))),o=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,95547,23))),p={children:["",{children:["certificate",{children:["__PAGE__",{},{page:[(0,d.p)(()=>Promise.resolve().then(c.bind(c,51002))),"C:\\Users\\KSOLO\\OneDrive\\Documents\\keishasolomon\\app\\certificate\\page.tsx"]}]},{"global-error":[o,"next/dist/client/components/builtin/global-error.js"],metadata:{icon:[async a=>(await (0,d.p)(()=>Promise.resolve().then(c.bind(c,46055)))()).default(a)],apple:[],openGraph:[],twitter:[],manifest:void 0}},[]]},{layout:[i,"C:\\Users\\KSOLO\\OneDrive\\Documents\\keishasolomon\\app\\layout.tsx"],error:[j,"C:\\Users\\KSOLO\\OneDrive\\Documents\\keishasolomon\\app\\error.tsx"],"global-error":[k,"next/dist/client/components/builtin/global-error.js"],"not-found":[l,"C:\\Users\\KSOLO\\OneDrive\\Documents\\keishasolomon\\app\\not-found.tsx"],forbidden:[m,"next/dist/client/components/builtin/forbidden.js"],unauthorized:[n,"next/dist/client/components/builtin/unauthorized.js"],metadata:{icon:[async a=>(await (0,d.p)(()=>Promise.resolve().then(c.bind(c,46055)))()).default(a)],apple:[],openGraph:[],twitter:[],manifest:void 0}},[]]}.children,q=(0,e.H)({tree:p,page:"/certificate/page",pathname:"/certificate",require:c,loadChunk:()=>Promise.resolve(),interopDefault:f.T}),r=q.__next_app__,s=q.routeModule,t=q.handler},69413:(a,b,c)=>{"use strict";c.d(b,{A:()=>f});var d=c(91986),e=c(47613);function f(a,b=[],c=[]){let g,h="string"==typeof a?function(a,b,c=[]){if(null==b)throw Error("[lucide]: iconNode is required when icon name is used");return{name:a?.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),size:24,node:b,...c.length>0?{aliases:c}:{}}}(a,b,c):a,i=(0,d.forwardRef)(({className:a,...b},c)=>(0,d.createElement)(e.default,{ref:c,icon:h,className:a,...b}));return h.name&&(i.displayName=(g=(a=>{let b="",c=!1;for(let d of a){if("-"===d||"_"===d||d<=" "){c=b.length>0;continue}0===b.length?b+=d.toLowerCase():b+=c?d.toUpperCase():d,c=!1}return b})(h.name)).charAt(0).toUpperCase()+g.slice(1)),i}},73836:a=>{"use strict";a.exports=require("node:fs/promises")},74075:a=>{"use strict";a.exports=require("zlib")},76760:a=>{"use strict";a.exports=require("node:path")},77598:a=>{"use strict";a.exports=require("node:crypto")},79428:a=>{"use strict";a.exports=require("buffer")},81690:(a,b,c)=>{"use strict";c.d(b,{PrintButton:()=>e});var d=c(48249);function e(){return(0,d.jsxs)("button",{id:"print-certificate-btn",onClick:()=>window.print(),className:"inline-flex items-center gap-2 rounded-sm border border-navy-900 bg-navy-900 px-6 py-2.5 text-[0.9375rem] font-medium tracking-tight text-white transition-colors hover:bg-navy-700 active:translate-y-px",children:[(0,d.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,d.jsx)("polyline",{points:"6 9 6 2 18 2 18 9"}),(0,d.jsx)("path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"}),(0,d.jsx)("rect",{x:"6",y:"14",width:"12",height:"8"})]}),"Print / Save as PDF"]})}},82884:(a,b,c)=>{"use strict";c.d(b,{A:()=>f});var d=c(69413);let e={name:"arrow-left",size:24,node:[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]};e.node;let f=(0,d.A)(e)},84863:(a,b,c)=>{"use strict";c.r(b),c.d(b,{"0024116d147bbdfd6eea730d00f85d0c52e5ffdfb3":()=>d.Zm,"60596e80d98fae5216964d9b7b1919318407067410":()=>d.OH,"60a04a696c5d3800220a672c71029232fd454909ee":()=>d.iC});var d=c(5757)},87349:a=>{a.exports={style:{fontFamily:"'Pinyon Script', Georgia, Times New Roman, serif",fontWeight:400,fontStyle:"normal"},className:"__className_9d3266",variable:"__variable_9d3266"}},91645:a=>{"use strict";a.exports=require("net")},94735:a=>{"use strict";a.exports=require("events")}};var b=require("../../webpack-runtime.js");b.C(a);var c=b.X(0,[445,107,485,879,23],()=>b(b.s=66480));module.exports=c})();