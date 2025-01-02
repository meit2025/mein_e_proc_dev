import{j as e}from"./app-CtHeFP4b.js";import{c as i}from"./utils-CRDo-rgY.js";import{c as a}from"./createLucideIcon-BkZ9mTsG.js";/**
 * @license lucide-react v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=a("Ban",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m4.9 4.9 14.2 14.2",key:"1m5liu"}]]);/**
 * @license lucide-react v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=a("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=a("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);function m({className:x,code:l,name:n}){let r="bg-red-100 border-red-600",s=null;const t=16;switch(l){case"waiting_approve":r="bg-yellow-50 border-yellow-600  text-yellow-600",s=e.jsx(d,{size:t});break;case"cancel":r="bg-red-50 border-red-600  text-red-600",s=e.jsx(c,{size:t});break;case"approve_to":r="bg-green-50 border-green-600  text-green-600",s=e.jsx(o,{size:t});break;case"reject_to":r="bg-red-50 border-red-600  text-red-600",s=e.jsx(c,{size:t});break;case"fully_approve":r="bg-green-50 border-green-600  text-green-600",s=e.jsx(o,{size:t});break;case"revise":r="bg-red-50 border-red-600  text-red-600",s=e.jsx(c,{size:t});break;default:r="bg-green-50 border-green-400 text-green-600 ",s=e.jsx(o,{size:t});break}return e.jsxs("div",{className:i("px-4 py-2 mt-1 flex font-bold items-center space-x-2 border-4 rounded-full border text-xs ",r),children:[s,e.jsx("span",{children:n})]})}export{m as C};
