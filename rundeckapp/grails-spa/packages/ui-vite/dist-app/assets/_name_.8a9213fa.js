import{o as n,j as o,k as e,d as h,h as v,i as x,q as f,r as k,p as m,t as s,l as t,F as b,s as y,x as C,y as V,z as g}from"./vendor.a4eb9702.js";import{u as A}from"./index.38a423f2.js";const L={preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 32 32",width:"1.2em",height:"1.2em"},N=e("path",{fill:"currentColor",d:"m21.677 14l-1.245-3.114A2.986 2.986 0 0 0 17.646 9h-4.092a3.002 3.002 0 0 0-1.544.428L7 12.434V18h2v-4.434l3-1.8v11.931l-3.462 5.194L10.202 30L14 24.303V11h3.646a.995.995 0 0 1 .928.629L20.323 16H26v-2Z"},null,-1),$=e("path",{fill:"currentColor",d:"M17.051 18.316L19 24.162V30h2v-6.162l-2.051-6.154l-1.898.632zM16.5 8A3.5 3.5 0 1 1 20 4.5A3.504 3.504 0 0 1 16.5 8zm0-5A1.5 1.5 0 1 0 18 4.5A1.502 1.502 0 0 0 16.5 3z"},null,-1),w=[N,$];function z(i,l){return n(),o("svg",L,w)}var B={name:"carbon-pedestrian",render:z};const M={class:"text-4xl"},E={class:"text-sm opacity-50"},F={key:0,class:"text-sm mt-4"},R={class:"opacity-75"},D=h({props:{name:null},setup(i){const l=i,_=v(),c=A(),{t:a}=x();return f(()=>{c.setNewName(l.name)}),(S,u)=>{const p=B,d=k("router-link");return n(),o("div",null,[e("p",M,[m(p,{class:"inline-block"})]),e("p",null,s(t(a)("intro.hi",{name:l.name})),1),e("p",E,[e("em",null,s(t(a)("intro.dynamic-route")),1)]),t(c).otherNames.length?(n(),o("div",F,[e("span",R,s(t(a)("intro.aka"))+":",1),e("ul",null,[(n(!0),o(b,null,y(t(c).otherNames,r=>(n(),o("li",{key:r},[m(d,{to:`/users/${r}`,replace:""},{default:V(()=>[g(s(r),1)]),_:2},1032,["to"])]))),128))])])):C("",!0),e("div",null,[e("button",{class:"btn m-3 text-sm mt-6",onClick:u[0]||(u[0]=r=>t(_).back())},s(t(a)("button.back")),1)])])}}});export{D as default};
