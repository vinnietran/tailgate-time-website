const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HostDashboard-DXESQhOf.js","assets/AppShell-Vs6Du90b.js","assets/TopBar-CXb8lI8C.js","assets/tailgate-CQ8epyMU.js","assets/mockTailgates-DpQ8LgpC.js","assets/location-DikLhm6E.js","assets/useUserProfile-CF93B4t0.js","assets/useHostProfile-DhhmmGMj.js","assets/hostProfile-CEcRtHYC.js","assets/CreateTailgateWizard-D-IPMTnR.js","assets/ticketing-CdF9cdra.js","assets/usePlacesAutocomplete-B5HUQd8s.js","assets/connectCallbacks-CxqJvcGB.js","assets/AccountPayouts-jPiK-ABK.js","assets/AccountPayoutHistory-YmYVmTtx.js","assets/ChangePassword-D4RfVB4K.js","assets/TailgateDetails-C6vAs5GO.js","assets/TailgateCheckin-QsboIw2s.js","assets/CheckinHub-BXQNUZ-4.js","assets/Messages-D17Toq_2.js","assets/NotificationPreferences-DMGMEa49.js","assets/DiscoverTailgates-D4FE3AUW.js","assets/EventFeed-DaFdsI3C.js","assets/AdminSpotlight-DPqP_76Q.js","assets/AdminConsoleNav-D6C1PAu1.js","assets/AdminMetrics-3n2MSFb8.js","assets/AdminOps-lx46znnU.js","assets/AdminTicketAnalytics-DLgOTedr.js","assets/PublicHostPage-CXl4XRb0.js","assets/HostPageSettings-CzQN-ox1.js","assets/HostPromotionPage-jLZUjJzy.js","assets/usePromotionEvent-CtzfI1L9.js","assets/TailgateCreatedSuccess-Bp9HPrsM.js"])))=>i.map(i=>d[i]);
function sA(t,e){for(var n=0;n<e.length;n++){const r=e[n];if(typeof r!="string"&&!Array.isArray(r)){for(const i in r)if(i!=="default"&&!(i in t)){const s=Object.getOwnPropertyDescriptor(r,i);s&&Object.defineProperty(t,i,s.get?s:{enumerable:!0,get:()=>r[i]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();var bj=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function oA(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Wv={exports:{}},Mu={},Hv={exports:{}},ee={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ua=Symbol.for("react.element"),aA=Symbol.for("react.portal"),lA=Symbol.for("react.fragment"),uA=Symbol.for("react.strict_mode"),cA=Symbol.for("react.profiler"),hA=Symbol.for("react.provider"),dA=Symbol.for("react.context"),fA=Symbol.for("react.forward_ref"),pA=Symbol.for("react.suspense"),mA=Symbol.for("react.memo"),gA=Symbol.for("react.lazy"),Dg=Symbol.iterator;function yA(t){return t===null||typeof t!="object"?null:(t=Dg&&t[Dg]||t["@@iterator"],typeof t=="function"?t:null)}var qv={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Kv=Object.assign,Gv={};function Ss(t,e,n){this.props=t,this.context=e,this.refs=Gv,this.updater=n||qv}Ss.prototype.isReactComponent={};Ss.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Ss.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Qv(){}Qv.prototype=Ss.prototype;function Tf(t,e,n){this.props=t,this.context=e,this.refs=Gv,this.updater=n||qv}var If=Tf.prototype=new Qv;If.constructor=Tf;Kv(If,Ss.prototype);If.isPureReactComponent=!0;var Og=Array.isArray,Yv=Object.prototype.hasOwnProperty,Sf={current:null},Xv={key:!0,ref:!0,__self:!0,__source:!0};function Jv(t,e,n){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Yv.call(e,r)&&!Xv.hasOwnProperty(r)&&(i[r]=e[r]);var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){for(var u=Array(l),c=0;c<l;c++)u[c]=arguments[c+2];i.children=u}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)i[r]===void 0&&(i[r]=l[r]);return{$$typeof:ua,type:t,key:s,ref:o,props:i,_owner:Sf.current}}function _A(t,e){return{$$typeof:ua,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Af(t){return typeof t=="object"&&t!==null&&t.$$typeof===ua}function vA(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Lg=/\/+/g;function Jc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?vA(""+t.key):e.toString(36)}function Tl(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case ua:case aA:o=!0}}if(o)return o=t,i=i(o),t=r===""?"."+Jc(o,0):r,Og(i)?(n="",t!=null&&(n=t.replace(Lg,"$&/")+"/"),Tl(i,e,n,"",function(c){return c})):i!=null&&(Af(i)&&(i=_A(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(Lg,"$&/")+"/")+t)),e.push(i)),1;if(o=0,r=r===""?".":r+":",Og(t))for(var l=0;l<t.length;l++){s=t[l];var u=r+Jc(s,l);o+=Tl(s,e,n,u,i)}else if(u=yA(t),typeof u=="function")for(t=u.call(t),l=0;!(s=t.next()).done;)s=s.value,u=r+Jc(s,l++),o+=Tl(s,e,n,u,i);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Qa(t,e,n){if(t==null)return t;var r=[],i=0;return Tl(t,r,"","",function(s){return e.call(n,s,i++)}),r}function wA(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Tt={current:null},Il={transition:null},EA={ReactCurrentDispatcher:Tt,ReactCurrentBatchConfig:Il,ReactCurrentOwner:Sf};function Zv(){throw Error("act(...) is not supported in production builds of React.")}ee.Children={map:Qa,forEach:function(t,e,n){Qa(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Qa(t,function(){e++}),e},toArray:function(t){return Qa(t,function(e){return e})||[]},only:function(t){if(!Af(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};ee.Component=Ss;ee.Fragment=lA;ee.Profiler=cA;ee.PureComponent=Tf;ee.StrictMode=uA;ee.Suspense=pA;ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=EA;ee.act=Zv;ee.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=Kv({},t.props),i=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Sf.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(u in e)Yv.call(e,u)&&!Xv.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&l!==void 0?l[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){l=Array(u);for(var c=0;c<u;c++)l[c]=arguments[c+2];r.children=l}return{$$typeof:ua,type:t.type,key:i,ref:s,props:r,_owner:o}};ee.createContext=function(t){return t={$$typeof:dA,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:hA,_context:t},t.Consumer=t};ee.createElement=Jv;ee.createFactory=function(t){var e=Jv.bind(null,t);return e.type=t,e};ee.createRef=function(){return{current:null}};ee.forwardRef=function(t){return{$$typeof:fA,render:t}};ee.isValidElement=Af;ee.lazy=function(t){return{$$typeof:gA,_payload:{_status:-1,_result:t},_init:wA}};ee.memo=function(t,e){return{$$typeof:mA,type:t,compare:e===void 0?null:e}};ee.startTransition=function(t){var e=Il.transition;Il.transition={};try{t()}finally{Il.transition=e}};ee.unstable_act=Zv;ee.useCallback=function(t,e){return Tt.current.useCallback(t,e)};ee.useContext=function(t){return Tt.current.useContext(t)};ee.useDebugValue=function(){};ee.useDeferredValue=function(t){return Tt.current.useDeferredValue(t)};ee.useEffect=function(t,e){return Tt.current.useEffect(t,e)};ee.useId=function(){return Tt.current.useId()};ee.useImperativeHandle=function(t,e,n){return Tt.current.useImperativeHandle(t,e,n)};ee.useInsertionEffect=function(t,e){return Tt.current.useInsertionEffect(t,e)};ee.useLayoutEffect=function(t,e){return Tt.current.useLayoutEffect(t,e)};ee.useMemo=function(t,e){return Tt.current.useMemo(t,e)};ee.useReducer=function(t,e,n){return Tt.current.useReducer(t,e,n)};ee.useRef=function(t){return Tt.current.useRef(t)};ee.useState=function(t){return Tt.current.useState(t)};ee.useSyncExternalStore=function(t,e,n){return Tt.current.useSyncExternalStore(t,e,n)};ee.useTransition=function(){return Tt.current.useTransition()};ee.version="18.3.1";Hv.exports=ee;var L=Hv.exports;const ew=oA(L),TA=sA({__proto__:null,default:ew},[L]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var IA=L,SA=Symbol.for("react.element"),AA=Symbol.for("react.fragment"),kA=Object.prototype.hasOwnProperty,RA=IA.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,PA={key:!0,ref:!0,__self:!0,__source:!0};function tw(t,e,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)kA.call(e,r)&&!PA.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:SA,type:t,key:s,ref:o,props:i,_owner:RA.current}}Mu.Fragment=AA;Mu.jsx=tw;Mu.jsxs=tw;Wv.exports=Mu;var p=Wv.exports,Hh={},nw={exports:{}},Bt={},rw={exports:{}},iw={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e($,G){var Q=$.length;$.push(G);e:for(;0<Q;){var ge=Q-1>>>1,q=$[ge];if(0<i(q,G))$[ge]=G,$[Q]=q,Q=ge;else break e}}function n($){return $.length===0?null:$[0]}function r($){if($.length===0)return null;var G=$[0],Q=$.pop();if(Q!==G){$[0]=Q;e:for(var ge=0,q=$.length,oe=q>>>1;ge<oe;){var de=2*(ge+1)-1,Wt=$[de],Ht=de+1,rt=$[Ht];if(0>i(Wt,Q))Ht<q&&0>i(rt,Wt)?($[ge]=rt,$[Ht]=Q,ge=Ht):($[ge]=Wt,$[de]=Q,ge=de);else if(Ht<q&&0>i(rt,Q))$[ge]=rt,$[Ht]=Q,ge=Ht;else break e}}return G}function i($,G){var Q=$.sortIndex-G.sortIndex;return Q!==0?Q:$.id-G.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var u=[],c=[],d=1,m=null,g=3,I=!1,R=!1,C=!1,b=typeof setTimeout=="function"?setTimeout:null,k=typeof clearTimeout=="function"?clearTimeout:null,w=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function v($){for(var G=n(c);G!==null;){if(G.callback===null)r(c);else if(G.startTime<=$)r(c),G.sortIndex=G.expirationTime,e(u,G);else break;G=n(c)}}function O($){if(C=!1,v($),!R)if(n(u)!==null)R=!0,zr(U);else{var G=n(c);G!==null&&nt(O,G.startTime-$)}}function U($,G){R=!1,C&&(C=!1,k(_),_=-1),I=!0;var Q=g;try{for(v(G),m=n(u);m!==null&&(!(m.expirationTime>G)||$&&!P());){var ge=m.callback;if(typeof ge=="function"){m.callback=null,g=m.priorityLevel;var q=ge(m.expirationTime<=G);G=t.unstable_now(),typeof q=="function"?m.callback=q:m===n(u)&&r(u),v(G)}else r(u);m=n(u)}if(m!==null)var oe=!0;else{var de=n(c);de!==null&&nt(O,de.startTime-G),oe=!1}return oe}finally{m=null,g=Q,I=!1}}var x=!1,E=null,_=-1,T=5,A=-1;function P(){return!(t.unstable_now()-A<T)}function N(){if(E!==null){var $=t.unstable_now();A=$;var G=!0;try{G=E(!0,$)}finally{G?S():(x=!1,E=null)}}else x=!1}var S;if(typeof w=="function")S=function(){w(N)};else if(typeof MessageChannel<"u"){var De=new MessageChannel,me=De.port2;De.port1.onmessage=N,S=function(){me.postMessage(null)}}else S=function(){b(N,0)};function zr($){E=$,x||(x=!0,S())}function nt($,G){_=b(function(){$(t.unstable_now())},G)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function($){$.callback=null},t.unstable_continueExecution=function(){R||I||(R=!0,zr(U))},t.unstable_forceFrameRate=function($){0>$||125<$?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<$?Math.floor(1e3/$):5},t.unstable_getCurrentPriorityLevel=function(){return g},t.unstable_getFirstCallbackNode=function(){return n(u)},t.unstable_next=function($){switch(g){case 1:case 2:case 3:var G=3;break;default:G=g}var Q=g;g=G;try{return $()}finally{g=Q}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function($,G){switch($){case 1:case 2:case 3:case 4:case 5:break;default:$=3}var Q=g;g=$;try{return G()}finally{g=Q}},t.unstable_scheduleCallback=function($,G,Q){var ge=t.unstable_now();switch(typeof Q=="object"&&Q!==null?(Q=Q.delay,Q=typeof Q=="number"&&0<Q?ge+Q:ge):Q=ge,$){case 1:var q=-1;break;case 2:q=250;break;case 5:q=1073741823;break;case 4:q=1e4;break;default:q=5e3}return q=Q+q,$={id:d++,callback:G,priorityLevel:$,startTime:Q,expirationTime:q,sortIndex:-1},Q>ge?($.sortIndex=Q,e(c,$),n(u)===null&&$===n(c)&&(C?(k(_),_=-1):C=!0,nt(O,Q-ge))):($.sortIndex=q,e(u,$),R||I||(R=!0,zr(U))),$},t.unstable_shouldYield=P,t.unstable_wrapCallback=function($){var G=g;return function(){var Q=g;g=G;try{return $.apply(this,arguments)}finally{g=Q}}}})(iw);rw.exports=iw;var CA=rw.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var NA=L,Ft=CA;function F(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var sw=new Set,Do={};function Ti(t,e){os(t,e),os(t+"Capture",e)}function os(t,e){for(Do[t]=e,t=0;t<e.length;t++)sw.add(e[t])}var Fn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),qh=Object.prototype.hasOwnProperty,xA=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Vg={},Mg={};function bA(t){return qh.call(Mg,t)?!0:qh.call(Vg,t)?!1:xA.test(t)?Mg[t]=!0:(Vg[t]=!0,!1)}function DA(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function OA(t,e,n,r){if(e===null||typeof e>"u"||DA(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function It(t,e,n,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var et={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){et[t]=new It(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];et[e]=new It(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){et[t]=new It(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){et[t]=new It(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){et[t]=new It(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){et[t]=new It(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){et[t]=new It(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){et[t]=new It(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){et[t]=new It(t,5,!1,t.toLowerCase(),null,!1,!1)});var kf=/[\-:]([a-z])/g;function Rf(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(kf,Rf);et[e]=new It(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(kf,Rf);et[e]=new It(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(kf,Rf);et[e]=new It(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){et[t]=new It(t,1,!1,t.toLowerCase(),null,!1,!1)});et.xlinkHref=new It("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){et[t]=new It(t,1,!1,t.toLowerCase(),null,!0,!0)});function Pf(t,e,n,r){var i=et.hasOwnProperty(e)?et[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(OA(e,n,i,r)&&(n=null),r||i===null?bA(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var Gn=NA.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ya=Symbol.for("react.element"),Mi=Symbol.for("react.portal"),ji=Symbol.for("react.fragment"),Cf=Symbol.for("react.strict_mode"),Kh=Symbol.for("react.profiler"),ow=Symbol.for("react.provider"),aw=Symbol.for("react.context"),Nf=Symbol.for("react.forward_ref"),Gh=Symbol.for("react.suspense"),Qh=Symbol.for("react.suspense_list"),xf=Symbol.for("react.memo"),ir=Symbol.for("react.lazy"),lw=Symbol.for("react.offscreen"),jg=Symbol.iterator;function Gs(t){return t===null||typeof t!="object"?null:(t=jg&&t[jg]||t["@@iterator"],typeof t=="function"?t:null)}var ke=Object.assign,Zc;function io(t){if(Zc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Zc=e&&e[1]||""}return`
`+Zc+t}var eh=!1;function th(t,e){if(!t||eh)return"";eh=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var r=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){r=c}t.call(e.prototype)}else{try{throw Error()}catch(c){r=c}t()}}catch(c){if(c&&r&&typeof c.stack=="string"){for(var i=c.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,l=s.length-1;1<=o&&0<=l&&i[o]!==s[l];)l--;for(;1<=o&&0<=l;o--,l--)if(i[o]!==s[l]){if(o!==1||l!==1)do if(o--,l--,0>l||i[o]!==s[l]){var u=`
`+i[o].replace(" at new "," at ");return t.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",t.displayName)),u}while(1<=o&&0<=l);break}}}finally{eh=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?io(t):""}function LA(t){switch(t.tag){case 5:return io(t.type);case 16:return io("Lazy");case 13:return io("Suspense");case 19:return io("SuspenseList");case 0:case 2:case 15:return t=th(t.type,!1),t;case 11:return t=th(t.type.render,!1),t;case 1:return t=th(t.type,!0),t;default:return""}}function Yh(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ji:return"Fragment";case Mi:return"Portal";case Kh:return"Profiler";case Cf:return"StrictMode";case Gh:return"Suspense";case Qh:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case aw:return(t.displayName||"Context")+".Consumer";case ow:return(t._context.displayName||"Context")+".Provider";case Nf:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case xf:return e=t.displayName||null,e!==null?e:Yh(t.type)||"Memo";case ir:e=t._payload,t=t._init;try{return Yh(t(e))}catch{}}return null}function VA(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Yh(e);case 8:return e===Cf?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Nr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function uw(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function MA(t){var e=uw(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Xa(t){t._valueTracker||(t._valueTracker=MA(t))}function cw(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=uw(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function Hl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Xh(t,e){var n=e.checked;return ke({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Ug(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=Nr(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function hw(t,e){e=e.checked,e!=null&&Pf(t,"checked",e,!1)}function Jh(t,e){hw(t,e);var n=Nr(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Zh(t,e.type,n):e.hasOwnProperty("defaultValue")&&Zh(t,e.type,Nr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Fg(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Zh(t,e,n){(e!=="number"||Hl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var so=Array.isArray;function Qi(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+Nr(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function ed(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(F(91));return ke({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Bg(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(F(92));if(so(n)){if(1<n.length)throw Error(F(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:Nr(n)}}function dw(t,e){var n=Nr(e.value),r=Nr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function $g(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function fw(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function td(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?fw(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ja,pw=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Ja=Ja||document.createElement("div"),Ja.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Ja.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Oo(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var go={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},jA=["Webkit","ms","Moz","O"];Object.keys(go).forEach(function(t){jA.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),go[e]=go[t]})});function mw(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||go.hasOwnProperty(t)&&go[t]?(""+e).trim():e+"px"}function gw(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=mw(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var UA=ke({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function nd(t,e){if(e){if(UA[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(F(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(F(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(F(61))}if(e.style!=null&&typeof e.style!="object")throw Error(F(62))}}function rd(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var id=null;function bf(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var sd=null,Yi=null,Xi=null;function zg(t){if(t=da(t)){if(typeof sd!="function")throw Error(F(280));var e=t.stateNode;e&&(e=$u(e),sd(t.stateNode,t.type,e))}}function yw(t){Yi?Xi?Xi.push(t):Xi=[t]:Yi=t}function _w(){if(Yi){var t=Yi,e=Xi;if(Xi=Yi=null,zg(t),e)for(t=0;t<e.length;t++)zg(e[t])}}function vw(t,e){return t(e)}function ww(){}var nh=!1;function Ew(t,e,n){if(nh)return t(e,n);nh=!0;try{return vw(t,e,n)}finally{nh=!1,(Yi!==null||Xi!==null)&&(ww(),_w())}}function Lo(t,e){var n=t.stateNode;if(n===null)return null;var r=$u(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(F(231,e,typeof n));return n}var od=!1;if(Fn)try{var Qs={};Object.defineProperty(Qs,"passive",{get:function(){od=!0}}),window.addEventListener("test",Qs,Qs),window.removeEventListener("test",Qs,Qs)}catch{od=!1}function FA(t,e,n,r,i,s,o,l,u){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(d){this.onError(d)}}var yo=!1,ql=null,Kl=!1,ad=null,BA={onError:function(t){yo=!0,ql=t}};function $A(t,e,n,r,i,s,o,l,u){yo=!1,ql=null,FA.apply(BA,arguments)}function zA(t,e,n,r,i,s,o,l,u){if($A.apply(this,arguments),yo){if(yo){var c=ql;yo=!1,ql=null}else throw Error(F(198));Kl||(Kl=!0,ad=c)}}function Ii(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Tw(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Wg(t){if(Ii(t)!==t)throw Error(F(188))}function WA(t){var e=t.alternate;if(!e){if(e=Ii(t),e===null)throw Error(F(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return Wg(i),t;if(s===r)return Wg(i),e;s=s.sibling}throw Error(F(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,l=i.child;l;){if(l===n){o=!0,n=i,r=s;break}if(l===r){o=!0,r=i,n=s;break}l=l.sibling}if(!o){for(l=s.child;l;){if(l===n){o=!0,n=s,r=i;break}if(l===r){o=!0,r=s,n=i;break}l=l.sibling}if(!o)throw Error(F(189))}}if(n.alternate!==r)throw Error(F(190))}if(n.tag!==3)throw Error(F(188));return n.stateNode.current===n?t:e}function Iw(t){return t=WA(t),t!==null?Sw(t):null}function Sw(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Sw(t);if(e!==null)return e;t=t.sibling}return null}var Aw=Ft.unstable_scheduleCallback,Hg=Ft.unstable_cancelCallback,HA=Ft.unstable_shouldYield,qA=Ft.unstable_requestPaint,Le=Ft.unstable_now,KA=Ft.unstable_getCurrentPriorityLevel,Df=Ft.unstable_ImmediatePriority,kw=Ft.unstable_UserBlockingPriority,Gl=Ft.unstable_NormalPriority,GA=Ft.unstable_LowPriority,Rw=Ft.unstable_IdlePriority,ju=null,En=null;function QA(t){if(En&&typeof En.onCommitFiberRoot=="function")try{En.onCommitFiberRoot(ju,t,void 0,(t.current.flags&128)===128)}catch{}}var ln=Math.clz32?Math.clz32:JA,YA=Math.log,XA=Math.LN2;function JA(t){return t>>>=0,t===0?32:31-(YA(t)/XA|0)|0}var Za=64,el=4194304;function oo(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Ql(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,i=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~i;l!==0?r=oo(l):(s&=o,s!==0&&(r=oo(s)))}else o=n&~i,o!==0?r=oo(o):s!==0&&(r=oo(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-ln(e),i=1<<n,r|=t[n],e&=~i;return r}function ZA(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ek(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-ln(s),l=1<<o,u=i[o];u===-1?(!(l&n)||l&r)&&(i[o]=ZA(l,e)):u<=e&&(t.expiredLanes|=l),s&=~l}}function ld(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Pw(){var t=Za;return Za<<=1,!(Za&4194240)&&(Za=64),t}function rh(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function ca(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-ln(e),t[e]=n}function tk(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var i=31-ln(n),s=1<<i;e[i]=0,r[i]=-1,t[i]=-1,n&=~s}}function Of(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-ln(n),i=1<<r;i&e|t[r]&e&&(t[r]|=e),n&=~i}}var ce=0;function Cw(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Nw,Lf,xw,bw,Dw,ud=!1,tl=[],yr=null,_r=null,vr=null,Vo=new Map,Mo=new Map,or=[],nk="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function qg(t,e){switch(t){case"focusin":case"focusout":yr=null;break;case"dragenter":case"dragleave":_r=null;break;case"mouseover":case"mouseout":vr=null;break;case"pointerover":case"pointerout":Vo.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Mo.delete(e.pointerId)}}function Ys(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=da(e),e!==null&&Lf(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function rk(t,e,n,r,i){switch(e){case"focusin":return yr=Ys(yr,t,e,n,r,i),!0;case"dragenter":return _r=Ys(_r,t,e,n,r,i),!0;case"mouseover":return vr=Ys(vr,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return Vo.set(s,Ys(Vo.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,Mo.set(s,Ys(Mo.get(s)||null,t,e,n,r,i)),!0}return!1}function Ow(t){var e=Xr(t.target);if(e!==null){var n=Ii(e);if(n!==null){if(e=n.tag,e===13){if(e=Tw(n),e!==null){t.blockedOn=e,Dw(t.priority,function(){xw(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Sl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=cd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);id=r,n.target.dispatchEvent(r),id=null}else return e=da(n),e!==null&&Lf(e),t.blockedOn=n,!1;e.shift()}return!0}function Kg(t,e,n){Sl(t)&&n.delete(e)}function ik(){ud=!1,yr!==null&&Sl(yr)&&(yr=null),_r!==null&&Sl(_r)&&(_r=null),vr!==null&&Sl(vr)&&(vr=null),Vo.forEach(Kg),Mo.forEach(Kg)}function Xs(t,e){t.blockedOn===e&&(t.blockedOn=null,ud||(ud=!0,Ft.unstable_scheduleCallback(Ft.unstable_NormalPriority,ik)))}function jo(t){function e(i){return Xs(i,t)}if(0<tl.length){Xs(tl[0],t);for(var n=1;n<tl.length;n++){var r=tl[n];r.blockedOn===t&&(r.blockedOn=null)}}for(yr!==null&&Xs(yr,t),_r!==null&&Xs(_r,t),vr!==null&&Xs(vr,t),Vo.forEach(e),Mo.forEach(e),n=0;n<or.length;n++)r=or[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<or.length&&(n=or[0],n.blockedOn===null);)Ow(n),n.blockedOn===null&&or.shift()}var Ji=Gn.ReactCurrentBatchConfig,Yl=!0;function sk(t,e,n,r){var i=ce,s=Ji.transition;Ji.transition=null;try{ce=1,Vf(t,e,n,r)}finally{ce=i,Ji.transition=s}}function ok(t,e,n,r){var i=ce,s=Ji.transition;Ji.transition=null;try{ce=4,Vf(t,e,n,r)}finally{ce=i,Ji.transition=s}}function Vf(t,e,n,r){if(Yl){var i=cd(t,e,n,r);if(i===null)fh(t,e,r,Xl,n),qg(t,r);else if(rk(i,t,e,n,r))r.stopPropagation();else if(qg(t,r),e&4&&-1<nk.indexOf(t)){for(;i!==null;){var s=da(i);if(s!==null&&Nw(s),s=cd(t,e,n,r),s===null&&fh(t,e,r,Xl,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else fh(t,e,r,null,n)}}var Xl=null;function cd(t,e,n,r){if(Xl=null,t=bf(r),t=Xr(t),t!==null)if(e=Ii(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Tw(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Xl=t,null}function Lw(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(KA()){case Df:return 1;case kw:return 4;case Gl:case GA:return 16;case Rw:return 536870912;default:return 16}default:return 16}}var fr=null,Mf=null,Al=null;function Vw(){if(Al)return Al;var t,e=Mf,n=e.length,r,i="value"in fr?fr.value:fr.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===i[s-r];r++);return Al=i.slice(t,1<r?1-r:void 0)}function kl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function nl(){return!0}function Gg(){return!1}function $t(t){function e(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?nl:Gg,this.isPropagationStopped=Gg,this}return ke(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=nl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=nl)},persist:function(){},isPersistent:nl}),e}var As={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},jf=$t(As),ha=ke({},As,{view:0,detail:0}),ak=$t(ha),ih,sh,Js,Uu=ke({},ha,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Uf,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Js&&(Js&&t.type==="mousemove"?(ih=t.screenX-Js.screenX,sh=t.screenY-Js.screenY):sh=ih=0,Js=t),ih)},movementY:function(t){return"movementY"in t?t.movementY:sh}}),Qg=$t(Uu),lk=ke({},Uu,{dataTransfer:0}),uk=$t(lk),ck=ke({},ha,{relatedTarget:0}),oh=$t(ck),hk=ke({},As,{animationName:0,elapsedTime:0,pseudoElement:0}),dk=$t(hk),fk=ke({},As,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),pk=$t(fk),mk=ke({},As,{data:0}),Yg=$t(mk),gk={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},yk={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},_k={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function vk(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=_k[t])?!!e[t]:!1}function Uf(){return vk}var wk=ke({},ha,{key:function(t){if(t.key){var e=gk[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=kl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?yk[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Uf,charCode:function(t){return t.type==="keypress"?kl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?kl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Ek=$t(wk),Tk=ke({},Uu,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Xg=$t(Tk),Ik=ke({},ha,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Uf}),Sk=$t(Ik),Ak=ke({},As,{propertyName:0,elapsedTime:0,pseudoElement:0}),kk=$t(Ak),Rk=ke({},Uu,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Pk=$t(Rk),Ck=[9,13,27,32],Ff=Fn&&"CompositionEvent"in window,_o=null;Fn&&"documentMode"in document&&(_o=document.documentMode);var Nk=Fn&&"TextEvent"in window&&!_o,Mw=Fn&&(!Ff||_o&&8<_o&&11>=_o),Jg=" ",Zg=!1;function jw(t,e){switch(t){case"keyup":return Ck.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Uw(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ui=!1;function xk(t,e){switch(t){case"compositionend":return Uw(e);case"keypress":return e.which!==32?null:(Zg=!0,Jg);case"textInput":return t=e.data,t===Jg&&Zg?null:t;default:return null}}function bk(t,e){if(Ui)return t==="compositionend"||!Ff&&jw(t,e)?(t=Vw(),Al=Mf=fr=null,Ui=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Mw&&e.locale!=="ko"?null:e.data;default:return null}}var Dk={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ey(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!Dk[t.type]:e==="textarea"}function Fw(t,e,n,r){yw(r),e=Jl(e,"onChange"),0<e.length&&(n=new jf("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var vo=null,Uo=null;function Ok(t){Xw(t,0)}function Fu(t){var e=$i(t);if(cw(e))return t}function Lk(t,e){if(t==="change")return e}var Bw=!1;if(Fn){var ah;if(Fn){var lh="oninput"in document;if(!lh){var ty=document.createElement("div");ty.setAttribute("oninput","return;"),lh=typeof ty.oninput=="function"}ah=lh}else ah=!1;Bw=ah&&(!document.documentMode||9<document.documentMode)}function ny(){vo&&(vo.detachEvent("onpropertychange",$w),Uo=vo=null)}function $w(t){if(t.propertyName==="value"&&Fu(Uo)){var e=[];Fw(e,Uo,t,bf(t)),Ew(Ok,e)}}function Vk(t,e,n){t==="focusin"?(ny(),vo=e,Uo=n,vo.attachEvent("onpropertychange",$w)):t==="focusout"&&ny()}function Mk(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Fu(Uo)}function jk(t,e){if(t==="click")return Fu(e)}function Uk(t,e){if(t==="input"||t==="change")return Fu(e)}function Fk(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var hn=typeof Object.is=="function"?Object.is:Fk;function Fo(t,e){if(hn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!qh.call(e,i)||!hn(t[i],e[i]))return!1}return!0}function ry(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function iy(t,e){var n=ry(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=ry(n)}}function zw(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?zw(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Ww(){for(var t=window,e=Hl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Hl(t.document)}return e}function Bf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function Bk(t){var e=Ww(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&zw(n.ownerDocument.documentElement,n)){if(r!==null&&Bf(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!t.extend&&s>r&&(i=r,r=s,s=i),i=iy(n,s);var o=iy(n,r);i&&o&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),s>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var $k=Fn&&"documentMode"in document&&11>=document.documentMode,Fi=null,hd=null,wo=null,dd=!1;function sy(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;dd||Fi==null||Fi!==Hl(r)||(r=Fi,"selectionStart"in r&&Bf(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),wo&&Fo(wo,r)||(wo=r,r=Jl(hd,"onSelect"),0<r.length&&(e=new jf("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=Fi)))}function rl(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Bi={animationend:rl("Animation","AnimationEnd"),animationiteration:rl("Animation","AnimationIteration"),animationstart:rl("Animation","AnimationStart"),transitionend:rl("Transition","TransitionEnd")},uh={},Hw={};Fn&&(Hw=document.createElement("div").style,"AnimationEvent"in window||(delete Bi.animationend.animation,delete Bi.animationiteration.animation,delete Bi.animationstart.animation),"TransitionEvent"in window||delete Bi.transitionend.transition);function Bu(t){if(uh[t])return uh[t];if(!Bi[t])return t;var e=Bi[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in Hw)return uh[t]=e[n];return t}var qw=Bu("animationend"),Kw=Bu("animationiteration"),Gw=Bu("animationstart"),Qw=Bu("transitionend"),Yw=new Map,oy="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Vr(t,e){Yw.set(t,e),Ti(e,[t])}for(var ch=0;ch<oy.length;ch++){var hh=oy[ch],zk=hh.toLowerCase(),Wk=hh[0].toUpperCase()+hh.slice(1);Vr(zk,"on"+Wk)}Vr(qw,"onAnimationEnd");Vr(Kw,"onAnimationIteration");Vr(Gw,"onAnimationStart");Vr("dblclick","onDoubleClick");Vr("focusin","onFocus");Vr("focusout","onBlur");Vr(Qw,"onTransitionEnd");os("onMouseEnter",["mouseout","mouseover"]);os("onMouseLeave",["mouseout","mouseover"]);os("onPointerEnter",["pointerout","pointerover"]);os("onPointerLeave",["pointerout","pointerover"]);Ti("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ti("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ti("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ti("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ti("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ti("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ao="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Hk=new Set("cancel close invalid load scroll toggle".split(" ").concat(ao));function ay(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,zA(r,e,void 0,t),t.currentTarget=null}function Xw(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var l=r[o],u=l.instance,c=l.currentTarget;if(l=l.listener,u!==s&&i.isPropagationStopped())break e;ay(i,l,c),s=u}else for(o=0;o<r.length;o++){if(l=r[o],u=l.instance,c=l.currentTarget,l=l.listener,u!==s&&i.isPropagationStopped())break e;ay(i,l,c),s=u}}}if(Kl)throw t=ad,Kl=!1,ad=null,t}function _e(t,e){var n=e[yd];n===void 0&&(n=e[yd]=new Set);var r=t+"__bubble";n.has(r)||(Jw(e,t,2,!1),n.add(r))}function dh(t,e,n){var r=0;e&&(r|=4),Jw(n,t,r,e)}var il="_reactListening"+Math.random().toString(36).slice(2);function Bo(t){if(!t[il]){t[il]=!0,sw.forEach(function(n){n!=="selectionchange"&&(Hk.has(n)||dh(n,!1,t),dh(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[il]||(e[il]=!0,dh("selectionchange",!1,e))}}function Jw(t,e,n,r){switch(Lw(e)){case 1:var i=sk;break;case 4:i=ok;break;default:i=Vf}n=i.bind(null,e,n,t),i=void 0,!od||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function fh(t,e,n,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var l=r.stateNode.containerInfo;if(l===i||l.nodeType===8&&l.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;o=o.return}for(;l!==null;){if(o=Xr(l),o===null)return;if(u=o.tag,u===5||u===6){r=s=o;continue e}l=l.parentNode}}r=r.return}Ew(function(){var c=s,d=bf(n),m=[];e:{var g=Yw.get(t);if(g!==void 0){var I=jf,R=t;switch(t){case"keypress":if(kl(n)===0)break e;case"keydown":case"keyup":I=Ek;break;case"focusin":R="focus",I=oh;break;case"focusout":R="blur",I=oh;break;case"beforeblur":case"afterblur":I=oh;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":I=Qg;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":I=uk;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":I=Sk;break;case qw:case Kw:case Gw:I=dk;break;case Qw:I=kk;break;case"scroll":I=ak;break;case"wheel":I=Pk;break;case"copy":case"cut":case"paste":I=pk;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":I=Xg}var C=(e&4)!==0,b=!C&&t==="scroll",k=C?g!==null?g+"Capture":null:g;C=[];for(var w=c,v;w!==null;){v=w;var O=v.stateNode;if(v.tag===5&&O!==null&&(v=O,k!==null&&(O=Lo(w,k),O!=null&&C.push($o(w,O,v)))),b)break;w=w.return}0<C.length&&(g=new I(g,R,null,n,d),m.push({event:g,listeners:C}))}}if(!(e&7)){e:{if(g=t==="mouseover"||t==="pointerover",I=t==="mouseout"||t==="pointerout",g&&n!==id&&(R=n.relatedTarget||n.fromElement)&&(Xr(R)||R[Bn]))break e;if((I||g)&&(g=d.window===d?d:(g=d.ownerDocument)?g.defaultView||g.parentWindow:window,I?(R=n.relatedTarget||n.toElement,I=c,R=R?Xr(R):null,R!==null&&(b=Ii(R),R!==b||R.tag!==5&&R.tag!==6)&&(R=null)):(I=null,R=c),I!==R)){if(C=Qg,O="onMouseLeave",k="onMouseEnter",w="mouse",(t==="pointerout"||t==="pointerover")&&(C=Xg,O="onPointerLeave",k="onPointerEnter",w="pointer"),b=I==null?g:$i(I),v=R==null?g:$i(R),g=new C(O,w+"leave",I,n,d),g.target=b,g.relatedTarget=v,O=null,Xr(d)===c&&(C=new C(k,w+"enter",R,n,d),C.target=v,C.relatedTarget=b,O=C),b=O,I&&R)t:{for(C=I,k=R,w=0,v=C;v;v=bi(v))w++;for(v=0,O=k;O;O=bi(O))v++;for(;0<w-v;)C=bi(C),w--;for(;0<v-w;)k=bi(k),v--;for(;w--;){if(C===k||k!==null&&C===k.alternate)break t;C=bi(C),k=bi(k)}C=null}else C=null;I!==null&&ly(m,g,I,C,!1),R!==null&&b!==null&&ly(m,b,R,C,!0)}}e:{if(g=c?$i(c):window,I=g.nodeName&&g.nodeName.toLowerCase(),I==="select"||I==="input"&&g.type==="file")var U=Lk;else if(ey(g))if(Bw)U=Uk;else{U=Mk;var x=Vk}else(I=g.nodeName)&&I.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(U=jk);if(U&&(U=U(t,c))){Fw(m,U,n,d);break e}x&&x(t,g,c),t==="focusout"&&(x=g._wrapperState)&&x.controlled&&g.type==="number"&&Zh(g,"number",g.value)}switch(x=c?$i(c):window,t){case"focusin":(ey(x)||x.contentEditable==="true")&&(Fi=x,hd=c,wo=null);break;case"focusout":wo=hd=Fi=null;break;case"mousedown":dd=!0;break;case"contextmenu":case"mouseup":case"dragend":dd=!1,sy(m,n,d);break;case"selectionchange":if($k)break;case"keydown":case"keyup":sy(m,n,d)}var E;if(Ff)e:{switch(t){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else Ui?jw(t,n)&&(_="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(_="onCompositionStart");_&&(Mw&&n.locale!=="ko"&&(Ui||_!=="onCompositionStart"?_==="onCompositionEnd"&&Ui&&(E=Vw()):(fr=d,Mf="value"in fr?fr.value:fr.textContent,Ui=!0)),x=Jl(c,_),0<x.length&&(_=new Yg(_,t,null,n,d),m.push({event:_,listeners:x}),E?_.data=E:(E=Uw(n),E!==null&&(_.data=E)))),(E=Nk?xk(t,n):bk(t,n))&&(c=Jl(c,"onBeforeInput"),0<c.length&&(d=new Yg("onBeforeInput","beforeinput",null,n,d),m.push({event:d,listeners:c}),d.data=E))}Xw(m,e)})}function $o(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Jl(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=Lo(t,n),s!=null&&r.unshift($o(t,s,i)),s=Lo(t,e),s!=null&&r.push($o(t,s,i))),t=t.return}return r}function bi(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function ly(t,e,n,r,i){for(var s=e._reactName,o=[];n!==null&&n!==r;){var l=n,u=l.alternate,c=l.stateNode;if(u!==null&&u===r)break;l.tag===5&&c!==null&&(l=c,i?(u=Lo(n,s),u!=null&&o.unshift($o(n,u,l))):i||(u=Lo(n,s),u!=null&&o.push($o(n,u,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var qk=/\r\n?/g,Kk=/\u0000|\uFFFD/g;function uy(t){return(typeof t=="string"?t:""+t).replace(qk,`
`).replace(Kk,"")}function sl(t,e,n){if(e=uy(e),uy(t)!==e&&n)throw Error(F(425))}function Zl(){}var fd=null,pd=null;function md(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var gd=typeof setTimeout=="function"?setTimeout:void 0,Gk=typeof clearTimeout=="function"?clearTimeout:void 0,cy=typeof Promise=="function"?Promise:void 0,Qk=typeof queueMicrotask=="function"?queueMicrotask:typeof cy<"u"?function(t){return cy.resolve(null).then(t).catch(Yk)}:gd;function Yk(t){setTimeout(function(){throw t})}function ph(t,e){var n=e,r=0;do{var i=n.nextSibling;if(t.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){t.removeChild(i),jo(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);jo(e)}function wr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function hy(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var ks=Math.random().toString(36).slice(2),vn="__reactFiber$"+ks,zo="__reactProps$"+ks,Bn="__reactContainer$"+ks,yd="__reactEvents$"+ks,Xk="__reactListeners$"+ks,Jk="__reactHandles$"+ks;function Xr(t){var e=t[vn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Bn]||n[vn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=hy(t);t!==null;){if(n=t[vn])return n;t=hy(t)}return e}t=n,n=t.parentNode}return null}function da(t){return t=t[vn]||t[Bn],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function $i(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(F(33))}function $u(t){return t[zo]||null}var _d=[],zi=-1;function Mr(t){return{current:t}}function we(t){0>zi||(t.current=_d[zi],_d[zi]=null,zi--)}function pe(t,e){zi++,_d[zi]=t.current,t.current=e}var xr={},pt=Mr(xr),Rt=Mr(!1),li=xr;function as(t,e){var n=t.type.contextTypes;if(!n)return xr;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function Pt(t){return t=t.childContextTypes,t!=null}function eu(){we(Rt),we(pt)}function dy(t,e,n){if(pt.current!==xr)throw Error(F(168));pe(pt,e),pe(Rt,n)}function Zw(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error(F(108,VA(t)||"Unknown",i));return ke({},n,r)}function tu(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||xr,li=pt.current,pe(pt,t),pe(Rt,Rt.current),!0}function fy(t,e,n){var r=t.stateNode;if(!r)throw Error(F(169));n?(t=Zw(t,e,li),r.__reactInternalMemoizedMergedChildContext=t,we(Rt),we(pt),pe(pt,t)):we(Rt),pe(Rt,n)}var bn=null,zu=!1,mh=!1;function eE(t){bn===null?bn=[t]:bn.push(t)}function Zk(t){zu=!0,eE(t)}function jr(){if(!mh&&bn!==null){mh=!0;var t=0,e=ce;try{var n=bn;for(ce=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}bn=null,zu=!1}catch(i){throw bn!==null&&(bn=bn.slice(t+1)),Aw(Df,jr),i}finally{ce=e,mh=!1}}return null}var Wi=[],Hi=0,nu=null,ru=0,qt=[],Kt=0,ui=null,Dn=1,On="";function Gr(t,e){Wi[Hi++]=ru,Wi[Hi++]=nu,nu=t,ru=e}function tE(t,e,n){qt[Kt++]=Dn,qt[Kt++]=On,qt[Kt++]=ui,ui=t;var r=Dn;t=On;var i=32-ln(r)-1;r&=~(1<<i),n+=1;var s=32-ln(e)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Dn=1<<32-ln(e)+i|n<<i|r,On=s+t}else Dn=1<<s|n<<i|r,On=t}function $f(t){t.return!==null&&(Gr(t,1),tE(t,1,0))}function zf(t){for(;t===nu;)nu=Wi[--Hi],Wi[Hi]=null,ru=Wi[--Hi],Wi[Hi]=null;for(;t===ui;)ui=qt[--Kt],qt[Kt]=null,On=qt[--Kt],qt[Kt]=null,Dn=qt[--Kt],qt[Kt]=null}var jt=null,Lt=null,Ee=!1,on=null;function nE(t,e){var n=Gt(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function py(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,jt=t,Lt=wr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,jt=t,Lt=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=ui!==null?{id:Dn,overflow:On}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Gt(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,jt=t,Lt=null,!0):!1;default:return!1}}function vd(t){return(t.mode&1)!==0&&(t.flags&128)===0}function wd(t){if(Ee){var e=Lt;if(e){var n=e;if(!py(t,e)){if(vd(t))throw Error(F(418));e=wr(n.nextSibling);var r=jt;e&&py(t,e)?nE(r,n):(t.flags=t.flags&-4097|2,Ee=!1,jt=t)}}else{if(vd(t))throw Error(F(418));t.flags=t.flags&-4097|2,Ee=!1,jt=t}}}function my(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;jt=t}function ol(t){if(t!==jt)return!1;if(!Ee)return my(t),Ee=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!md(t.type,t.memoizedProps)),e&&(e=Lt)){if(vd(t))throw rE(),Error(F(418));for(;e;)nE(t,e),e=wr(e.nextSibling)}if(my(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(F(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Lt=wr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Lt=null}}else Lt=jt?wr(t.stateNode.nextSibling):null;return!0}function rE(){for(var t=Lt;t;)t=wr(t.nextSibling)}function ls(){Lt=jt=null,Ee=!1}function Wf(t){on===null?on=[t]:on.push(t)}var eR=Gn.ReactCurrentBatchConfig;function Zs(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(F(309));var r=n.stateNode}if(!r)throw Error(F(147,t));var i=r,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var l=i.refs;o===null?delete l[s]:l[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(F(284));if(!n._owner)throw Error(F(290,t))}return t}function al(t,e){throw t=Object.prototype.toString.call(e),Error(F(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function gy(t){var e=t._init;return e(t._payload)}function iE(t){function e(k,w){if(t){var v=k.deletions;v===null?(k.deletions=[w],k.flags|=16):v.push(w)}}function n(k,w){if(!t)return null;for(;w!==null;)e(k,w),w=w.sibling;return null}function r(k,w){for(k=new Map;w!==null;)w.key!==null?k.set(w.key,w):k.set(w.index,w),w=w.sibling;return k}function i(k,w){return k=Sr(k,w),k.index=0,k.sibling=null,k}function s(k,w,v){return k.index=v,t?(v=k.alternate,v!==null?(v=v.index,v<w?(k.flags|=2,w):v):(k.flags|=2,w)):(k.flags|=1048576,w)}function o(k){return t&&k.alternate===null&&(k.flags|=2),k}function l(k,w,v,O){return w===null||w.tag!==6?(w=Th(v,k.mode,O),w.return=k,w):(w=i(w,v),w.return=k,w)}function u(k,w,v,O){var U=v.type;return U===ji?d(k,w,v.props.children,O,v.key):w!==null&&(w.elementType===U||typeof U=="object"&&U!==null&&U.$$typeof===ir&&gy(U)===w.type)?(O=i(w,v.props),O.ref=Zs(k,w,v),O.return=k,O):(O=Dl(v.type,v.key,v.props,null,k.mode,O),O.ref=Zs(k,w,v),O.return=k,O)}function c(k,w,v,O){return w===null||w.tag!==4||w.stateNode.containerInfo!==v.containerInfo||w.stateNode.implementation!==v.implementation?(w=Ih(v,k.mode,O),w.return=k,w):(w=i(w,v.children||[]),w.return=k,w)}function d(k,w,v,O,U){return w===null||w.tag!==7?(w=ii(v,k.mode,O,U),w.return=k,w):(w=i(w,v),w.return=k,w)}function m(k,w,v){if(typeof w=="string"&&w!==""||typeof w=="number")return w=Th(""+w,k.mode,v),w.return=k,w;if(typeof w=="object"&&w!==null){switch(w.$$typeof){case Ya:return v=Dl(w.type,w.key,w.props,null,k.mode,v),v.ref=Zs(k,null,w),v.return=k,v;case Mi:return w=Ih(w,k.mode,v),w.return=k,w;case ir:var O=w._init;return m(k,O(w._payload),v)}if(so(w)||Gs(w))return w=ii(w,k.mode,v,null),w.return=k,w;al(k,w)}return null}function g(k,w,v,O){var U=w!==null?w.key:null;if(typeof v=="string"&&v!==""||typeof v=="number")return U!==null?null:l(k,w,""+v,O);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Ya:return v.key===U?u(k,w,v,O):null;case Mi:return v.key===U?c(k,w,v,O):null;case ir:return U=v._init,g(k,w,U(v._payload),O)}if(so(v)||Gs(v))return U!==null?null:d(k,w,v,O,null);al(k,v)}return null}function I(k,w,v,O,U){if(typeof O=="string"&&O!==""||typeof O=="number")return k=k.get(v)||null,l(w,k,""+O,U);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case Ya:return k=k.get(O.key===null?v:O.key)||null,u(w,k,O,U);case Mi:return k=k.get(O.key===null?v:O.key)||null,c(w,k,O,U);case ir:var x=O._init;return I(k,w,v,x(O._payload),U)}if(so(O)||Gs(O))return k=k.get(v)||null,d(w,k,O,U,null);al(w,O)}return null}function R(k,w,v,O){for(var U=null,x=null,E=w,_=w=0,T=null;E!==null&&_<v.length;_++){E.index>_?(T=E,E=null):T=E.sibling;var A=g(k,E,v[_],O);if(A===null){E===null&&(E=T);break}t&&E&&A.alternate===null&&e(k,E),w=s(A,w,_),x===null?U=A:x.sibling=A,x=A,E=T}if(_===v.length)return n(k,E),Ee&&Gr(k,_),U;if(E===null){for(;_<v.length;_++)E=m(k,v[_],O),E!==null&&(w=s(E,w,_),x===null?U=E:x.sibling=E,x=E);return Ee&&Gr(k,_),U}for(E=r(k,E);_<v.length;_++)T=I(E,k,_,v[_],O),T!==null&&(t&&T.alternate!==null&&E.delete(T.key===null?_:T.key),w=s(T,w,_),x===null?U=T:x.sibling=T,x=T);return t&&E.forEach(function(P){return e(k,P)}),Ee&&Gr(k,_),U}function C(k,w,v,O){var U=Gs(v);if(typeof U!="function")throw Error(F(150));if(v=U.call(v),v==null)throw Error(F(151));for(var x=U=null,E=w,_=w=0,T=null,A=v.next();E!==null&&!A.done;_++,A=v.next()){E.index>_?(T=E,E=null):T=E.sibling;var P=g(k,E,A.value,O);if(P===null){E===null&&(E=T);break}t&&E&&P.alternate===null&&e(k,E),w=s(P,w,_),x===null?U=P:x.sibling=P,x=P,E=T}if(A.done)return n(k,E),Ee&&Gr(k,_),U;if(E===null){for(;!A.done;_++,A=v.next())A=m(k,A.value,O),A!==null&&(w=s(A,w,_),x===null?U=A:x.sibling=A,x=A);return Ee&&Gr(k,_),U}for(E=r(k,E);!A.done;_++,A=v.next())A=I(E,k,_,A.value,O),A!==null&&(t&&A.alternate!==null&&E.delete(A.key===null?_:A.key),w=s(A,w,_),x===null?U=A:x.sibling=A,x=A);return t&&E.forEach(function(N){return e(k,N)}),Ee&&Gr(k,_),U}function b(k,w,v,O){if(typeof v=="object"&&v!==null&&v.type===ji&&v.key===null&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case Ya:e:{for(var U=v.key,x=w;x!==null;){if(x.key===U){if(U=v.type,U===ji){if(x.tag===7){n(k,x.sibling),w=i(x,v.props.children),w.return=k,k=w;break e}}else if(x.elementType===U||typeof U=="object"&&U!==null&&U.$$typeof===ir&&gy(U)===x.type){n(k,x.sibling),w=i(x,v.props),w.ref=Zs(k,x,v),w.return=k,k=w;break e}n(k,x);break}else e(k,x);x=x.sibling}v.type===ji?(w=ii(v.props.children,k.mode,O,v.key),w.return=k,k=w):(O=Dl(v.type,v.key,v.props,null,k.mode,O),O.ref=Zs(k,w,v),O.return=k,k=O)}return o(k);case Mi:e:{for(x=v.key;w!==null;){if(w.key===x)if(w.tag===4&&w.stateNode.containerInfo===v.containerInfo&&w.stateNode.implementation===v.implementation){n(k,w.sibling),w=i(w,v.children||[]),w.return=k,k=w;break e}else{n(k,w);break}else e(k,w);w=w.sibling}w=Ih(v,k.mode,O),w.return=k,k=w}return o(k);case ir:return x=v._init,b(k,w,x(v._payload),O)}if(so(v))return R(k,w,v,O);if(Gs(v))return C(k,w,v,O);al(k,v)}return typeof v=="string"&&v!==""||typeof v=="number"?(v=""+v,w!==null&&w.tag===6?(n(k,w.sibling),w=i(w,v),w.return=k,k=w):(n(k,w),w=Th(v,k.mode,O),w.return=k,k=w),o(k)):n(k,w)}return b}var us=iE(!0),sE=iE(!1),iu=Mr(null),su=null,qi=null,Hf=null;function qf(){Hf=qi=su=null}function Kf(t){var e=iu.current;we(iu),t._currentValue=e}function Ed(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function Zi(t,e){su=t,Hf=qi=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(kt=!0),t.firstContext=null)}function Jt(t){var e=t._currentValue;if(Hf!==t)if(t={context:t,memoizedValue:e,next:null},qi===null){if(su===null)throw Error(F(308));qi=t,su.dependencies={lanes:0,firstContext:t}}else qi=qi.next=t;return e}var Jr=null;function Gf(t){Jr===null?Jr=[t]:Jr.push(t)}function oE(t,e,n,r){var i=e.interleaved;return i===null?(n.next=n,Gf(e)):(n.next=i.next,i.next=n),e.interleaved=n,$n(t,r)}function $n(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var sr=!1;function Qf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function aE(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function jn(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Er(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,se&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,$n(t,n)}return i=r.interleaved,i===null?(e.next=e,Gf(r)):(e.next=i.next,i.next=e),r.interleaved=e,$n(t,n)}function Rl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,Of(t,n)}}function yy(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function ou(t,e,n,r){var i=t.updateQueue;sr=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,l=i.shared.pending;if(l!==null){i.shared.pending=null;var u=l,c=u.next;u.next=null,o===null?s=c:o.next=c,o=u;var d=t.alternate;d!==null&&(d=d.updateQueue,l=d.lastBaseUpdate,l!==o&&(l===null?d.firstBaseUpdate=c:l.next=c,d.lastBaseUpdate=u))}if(s!==null){var m=i.baseState;o=0,d=c=u=null,l=s;do{var g=l.lane,I=l.eventTime;if((r&g)===g){d!==null&&(d=d.next={eventTime:I,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var R=t,C=l;switch(g=e,I=n,C.tag){case 1:if(R=C.payload,typeof R=="function"){m=R.call(I,m,g);break e}m=R;break e;case 3:R.flags=R.flags&-65537|128;case 0:if(R=C.payload,g=typeof R=="function"?R.call(I,m,g):R,g==null)break e;m=ke({},m,g);break e;case 2:sr=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,g=i.effects,g===null?i.effects=[l]:g.push(l))}else I={eventTime:I,lane:g,tag:l.tag,payload:l.payload,callback:l.callback,next:null},d===null?(c=d=I,u=m):d=d.next=I,o|=g;if(l=l.next,l===null){if(l=i.shared.pending,l===null)break;g=l,l=g.next,g.next=null,i.lastBaseUpdate=g,i.shared.pending=null}}while(!0);if(d===null&&(u=m),i.baseState=u,i.firstBaseUpdate=c,i.lastBaseUpdate=d,e=i.shared.interleaved,e!==null){i=e;do o|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);hi|=o,t.lanes=o,t.memoizedState=m}}function _y(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(F(191,i));i.call(r)}}}var fa={},Tn=Mr(fa),Wo=Mr(fa),Ho=Mr(fa);function Zr(t){if(t===fa)throw Error(F(174));return t}function Yf(t,e){switch(pe(Ho,e),pe(Wo,t),pe(Tn,fa),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:td(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=td(e,t)}we(Tn),pe(Tn,e)}function cs(){we(Tn),we(Wo),we(Ho)}function lE(t){Zr(Ho.current);var e=Zr(Tn.current),n=td(e,t.type);e!==n&&(pe(Wo,t),pe(Tn,n))}function Xf(t){Wo.current===t&&(we(Tn),we(Wo))}var Ie=Mr(0);function au(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var gh=[];function Jf(){for(var t=0;t<gh.length;t++)gh[t]._workInProgressVersionPrimary=null;gh.length=0}var Pl=Gn.ReactCurrentDispatcher,yh=Gn.ReactCurrentBatchConfig,ci=0,Se=null,Fe=null,We=null,lu=!1,Eo=!1,qo=0,tR=0;function at(){throw Error(F(321))}function Zf(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!hn(t[n],e[n]))return!1;return!0}function ep(t,e,n,r,i,s){if(ci=s,Se=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Pl.current=t===null||t.memoizedState===null?sR:oR,t=n(r,i),Eo){s=0;do{if(Eo=!1,qo=0,25<=s)throw Error(F(301));s+=1,We=Fe=null,e.updateQueue=null,Pl.current=aR,t=n(r,i)}while(Eo)}if(Pl.current=uu,e=Fe!==null&&Fe.next!==null,ci=0,We=Fe=Se=null,lu=!1,e)throw Error(F(300));return t}function tp(){var t=qo!==0;return qo=0,t}function yn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return We===null?Se.memoizedState=We=t:We=We.next=t,We}function Zt(){if(Fe===null){var t=Se.alternate;t=t!==null?t.memoizedState:null}else t=Fe.next;var e=We===null?Se.memoizedState:We.next;if(e!==null)We=e,Fe=t;else{if(t===null)throw Error(F(310));Fe=t,t={memoizedState:Fe.memoizedState,baseState:Fe.baseState,baseQueue:Fe.baseQueue,queue:Fe.queue,next:null},We===null?Se.memoizedState=We=t:We=We.next=t}return We}function Ko(t,e){return typeof e=="function"?e(t):e}function _h(t){var e=Zt(),n=e.queue;if(n===null)throw Error(F(311));n.lastRenderedReducer=t;var r=Fe,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var l=o=null,u=null,c=s;do{var d=c.lane;if((ci&d)===d)u!==null&&(u=u.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),r=c.hasEagerState?c.eagerState:t(r,c.action);else{var m={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};u===null?(l=u=m,o=r):u=u.next=m,Se.lanes|=d,hi|=d}c=c.next}while(c!==null&&c!==s);u===null?o=r:u.next=l,hn(r,e.memoizedState)||(kt=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=u,n.lastRenderedState=r}if(t=n.interleaved,t!==null){i=t;do s=i.lane,Se.lanes|=s,hi|=s,i=i.next;while(i!==t)}else i===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function vh(t){var e=Zt(),n=e.queue;if(n===null)throw Error(F(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=t(s,o.action),o=o.next;while(o!==i);hn(s,e.memoizedState)||(kt=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function uE(){}function cE(t,e){var n=Se,r=Zt(),i=e(),s=!hn(r.memoizedState,i);if(s&&(r.memoizedState=i,kt=!0),r=r.queue,np(fE.bind(null,n,r,t),[t]),r.getSnapshot!==e||s||We!==null&&We.memoizedState.tag&1){if(n.flags|=2048,Go(9,dE.bind(null,n,r,i,e),void 0,null),He===null)throw Error(F(349));ci&30||hE(n,e,i)}return i}function hE(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Se.updateQueue,e===null?(e={lastEffect:null,stores:null},Se.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function dE(t,e,n,r){e.value=n,e.getSnapshot=r,pE(e)&&mE(t)}function fE(t,e,n){return n(function(){pE(e)&&mE(t)})}function pE(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!hn(t,n)}catch{return!0}}function mE(t){var e=$n(t,1);e!==null&&un(e,t,1,-1)}function vy(t){var e=yn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ko,lastRenderedState:t},e.queue=t,t=t.dispatch=iR.bind(null,Se,t),[e.memoizedState,t]}function Go(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=Se.updateQueue,e===null?(e={lastEffect:null,stores:null},Se.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function gE(){return Zt().memoizedState}function Cl(t,e,n,r){var i=yn();Se.flags|=t,i.memoizedState=Go(1|e,n,void 0,r===void 0?null:r)}function Wu(t,e,n,r){var i=Zt();r=r===void 0?null:r;var s=void 0;if(Fe!==null){var o=Fe.memoizedState;if(s=o.destroy,r!==null&&Zf(r,o.deps)){i.memoizedState=Go(e,n,s,r);return}}Se.flags|=t,i.memoizedState=Go(1|e,n,s,r)}function wy(t,e){return Cl(8390656,8,t,e)}function np(t,e){return Wu(2048,8,t,e)}function yE(t,e){return Wu(4,2,t,e)}function _E(t,e){return Wu(4,4,t,e)}function vE(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function wE(t,e,n){return n=n!=null?n.concat([t]):null,Wu(4,4,vE.bind(null,e,t),n)}function rp(){}function EE(t,e){var n=Zt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Zf(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function TE(t,e){var n=Zt();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Zf(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function IE(t,e,n){return ci&21?(hn(n,e)||(n=Pw(),Se.lanes|=n,hi|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,kt=!0),t.memoizedState=n)}function nR(t,e){var n=ce;ce=n!==0&&4>n?n:4,t(!0);var r=yh.transition;yh.transition={};try{t(!1),e()}finally{ce=n,yh.transition=r}}function SE(){return Zt().memoizedState}function rR(t,e,n){var r=Ir(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},AE(t))kE(e,n);else if(n=oE(t,e,n,r),n!==null){var i=wt();un(n,t,r,i),RE(n,e,r)}}function iR(t,e,n){var r=Ir(t),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(AE(t))kE(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,l=s(o,n);if(i.hasEagerState=!0,i.eagerState=l,hn(l,o)){var u=e.interleaved;u===null?(i.next=i,Gf(e)):(i.next=u.next,u.next=i),e.interleaved=i;return}}catch{}finally{}n=oE(t,e,i,r),n!==null&&(i=wt(),un(n,t,r,i),RE(n,e,r))}}function AE(t){var e=t.alternate;return t===Se||e!==null&&e===Se}function kE(t,e){Eo=lu=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function RE(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,Of(t,n)}}var uu={readContext:Jt,useCallback:at,useContext:at,useEffect:at,useImperativeHandle:at,useInsertionEffect:at,useLayoutEffect:at,useMemo:at,useReducer:at,useRef:at,useState:at,useDebugValue:at,useDeferredValue:at,useTransition:at,useMutableSource:at,useSyncExternalStore:at,useId:at,unstable_isNewReconciler:!1},sR={readContext:Jt,useCallback:function(t,e){return yn().memoizedState=[t,e===void 0?null:e],t},useContext:Jt,useEffect:wy,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Cl(4194308,4,vE.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Cl(4194308,4,t,e)},useInsertionEffect:function(t,e){return Cl(4,2,t,e)},useMemo:function(t,e){var n=yn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=yn();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=rR.bind(null,Se,t),[r.memoizedState,t]},useRef:function(t){var e=yn();return t={current:t},e.memoizedState=t},useState:vy,useDebugValue:rp,useDeferredValue:function(t){return yn().memoizedState=t},useTransition:function(){var t=vy(!1),e=t[0];return t=nR.bind(null,t[1]),yn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=Se,i=yn();if(Ee){if(n===void 0)throw Error(F(407));n=n()}else{if(n=e(),He===null)throw Error(F(349));ci&30||hE(r,e,n)}i.memoizedState=n;var s={value:n,getSnapshot:e};return i.queue=s,wy(fE.bind(null,r,s,t),[t]),r.flags|=2048,Go(9,dE.bind(null,r,s,n,e),void 0,null),n},useId:function(){var t=yn(),e=He.identifierPrefix;if(Ee){var n=On,r=Dn;n=(r&~(1<<32-ln(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=qo++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=tR++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},oR={readContext:Jt,useCallback:EE,useContext:Jt,useEffect:np,useImperativeHandle:wE,useInsertionEffect:yE,useLayoutEffect:_E,useMemo:TE,useReducer:_h,useRef:gE,useState:function(){return _h(Ko)},useDebugValue:rp,useDeferredValue:function(t){var e=Zt();return IE(e,Fe.memoizedState,t)},useTransition:function(){var t=_h(Ko)[0],e=Zt().memoizedState;return[t,e]},useMutableSource:uE,useSyncExternalStore:cE,useId:SE,unstable_isNewReconciler:!1},aR={readContext:Jt,useCallback:EE,useContext:Jt,useEffect:np,useImperativeHandle:wE,useInsertionEffect:yE,useLayoutEffect:_E,useMemo:TE,useReducer:vh,useRef:gE,useState:function(){return vh(Ko)},useDebugValue:rp,useDeferredValue:function(t){var e=Zt();return Fe===null?e.memoizedState=t:IE(e,Fe.memoizedState,t)},useTransition:function(){var t=vh(Ko)[0],e=Zt().memoizedState;return[t,e]},useMutableSource:uE,useSyncExternalStore:cE,useId:SE,unstable_isNewReconciler:!1};function rn(t,e){if(t&&t.defaultProps){e=ke({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Td(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:ke({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Hu={isMounted:function(t){return(t=t._reactInternals)?Ii(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=wt(),i=Ir(t),s=jn(r,i);s.payload=e,n!=null&&(s.callback=n),e=Er(t,s,i),e!==null&&(un(e,t,i,r),Rl(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=wt(),i=Ir(t),s=jn(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Er(t,s,i),e!==null&&(un(e,t,i,r),Rl(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=wt(),r=Ir(t),i=jn(n,r);i.tag=2,e!=null&&(i.callback=e),e=Er(t,i,r),e!==null&&(un(e,t,r,n),Rl(e,t,r))}};function Ey(t,e,n,r,i,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!Fo(n,r)||!Fo(i,s):!0}function PE(t,e,n){var r=!1,i=xr,s=e.contextType;return typeof s=="object"&&s!==null?s=Jt(s):(i=Pt(e)?li:pt.current,r=e.contextTypes,s=(r=r!=null)?as(t,i):xr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Hu,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function Ty(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&Hu.enqueueReplaceState(e,e.state,null)}function Id(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs={},Qf(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=Jt(s):(s=Pt(e)?li:pt.current,i.context=as(t,s)),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Td(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&Hu.enqueueReplaceState(i,i.state,null),ou(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function hs(t,e){try{var n="",r=e;do n+=LA(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i,digest:null}}function wh(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Sd(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var lR=typeof WeakMap=="function"?WeakMap:Map;function CE(t,e,n){n=jn(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){hu||(hu=!0,Od=r),Sd(t,e)},n}function NE(t,e,n){n=jn(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return r(i)},n.callback=function(){Sd(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Sd(t,e),typeof r!="function"&&(Tr===null?Tr=new Set([this]):Tr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function Iy(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new lR;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(n)||(i.add(n),t=TR.bind(null,t,e,n),e.then(t,t))}function Sy(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Ay(t,e,n,r,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=jn(-1,1),e.tag=2,Er(n,e,1))),n.lanes|=1),t)}var uR=Gn.ReactCurrentOwner,kt=!1;function vt(t,e,n,r){e.child=t===null?sE(e,null,n,r):us(e,t.child,n,r)}function ky(t,e,n,r,i){n=n.render;var s=e.ref;return Zi(e,i),r=ep(t,e,n,r,s,i),n=tp(),t!==null&&!kt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,zn(t,e,i)):(Ee&&n&&$f(e),e.flags|=1,vt(t,e,r,i),e.child)}function Ry(t,e,n,r,i){if(t===null){var s=n.type;return typeof s=="function"&&!hp(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,xE(t,e,s,r,i)):(t=Dl(n.type,null,r,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&i)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:Fo,n(o,r)&&t.ref===e.ref)return zn(t,e,i)}return e.flags|=1,t=Sr(s,r),t.ref=e.ref,t.return=e,e.child=t}function xE(t,e,n,r,i){if(t!==null){var s=t.memoizedProps;if(Fo(s,r)&&t.ref===e.ref)if(kt=!1,e.pendingProps=r=s,(t.lanes&i)!==0)t.flags&131072&&(kt=!0);else return e.lanes=t.lanes,zn(t,e,i)}return Ad(t,e,n,r,i)}function bE(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},pe(Gi,Ot),Ot|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,pe(Gi,Ot),Ot|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,pe(Gi,Ot),Ot|=r}else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,pe(Gi,Ot),Ot|=r;return vt(t,e,i,n),e.child}function DE(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Ad(t,e,n,r,i){var s=Pt(n)?li:pt.current;return s=as(e,s),Zi(e,i),n=ep(t,e,n,r,s,i),r=tp(),t!==null&&!kt?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,zn(t,e,i)):(Ee&&r&&$f(e),e.flags|=1,vt(t,e,n,i),e.child)}function Py(t,e,n,r,i){if(Pt(n)){var s=!0;tu(e)}else s=!1;if(Zi(e,i),e.stateNode===null)Nl(t,e),PE(e,n,r),Id(e,n,r,i),r=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var u=o.context,c=n.contextType;typeof c=="object"&&c!==null?c=Jt(c):(c=Pt(n)?li:pt.current,c=as(e,c));var d=n.getDerivedStateFromProps,m=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";m||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==r||u!==c)&&Ty(e,o,r,c),sr=!1;var g=e.memoizedState;o.state=g,ou(e,r,o,i),u=e.memoizedState,l!==r||g!==u||Rt.current||sr?(typeof d=="function"&&(Td(e,n,d,r),u=e.memoizedState),(l=sr||Ey(e,n,l,r,g,u,c))?(m||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=c,r=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,aE(t,e),l=e.memoizedProps,c=e.type===e.elementType?l:rn(e.type,l),o.props=c,m=e.pendingProps,g=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Jt(u):(u=Pt(n)?li:pt.current,u=as(e,u));var I=n.getDerivedStateFromProps;(d=typeof I=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==m||g!==u)&&Ty(e,o,r,u),sr=!1,g=e.memoizedState,o.state=g,ou(e,r,o,i);var R=e.memoizedState;l!==m||g!==R||Rt.current||sr?(typeof I=="function"&&(Td(e,n,I,r),R=e.memoizedState),(c=sr||Ey(e,n,c,r,g,R,u)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,R,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,R,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=R),o.props=r,o.state=R,o.context=u,r=c):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=1024),r=!1)}return kd(t,e,n,r,s,i)}function kd(t,e,n,r,i,s){DE(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return i&&fy(e,n,!1),zn(t,e,s);r=e.stateNode,uR.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=us(e,t.child,null,s),e.child=us(e,null,l,s)):vt(t,e,l,s),e.memoizedState=r.state,i&&fy(e,n,!0),e.child}function OE(t){var e=t.stateNode;e.pendingContext?dy(t,e.pendingContext,e.pendingContext!==e.context):e.context&&dy(t,e.context,!1),Yf(t,e.containerInfo)}function Cy(t,e,n,r,i){return ls(),Wf(i),e.flags|=256,vt(t,e,n,r),e.child}var Rd={dehydrated:null,treeContext:null,retryLane:0};function Pd(t){return{baseLanes:t,cachePool:null,transitions:null}}function LE(t,e,n){var r=e.pendingProps,i=Ie.current,s=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(i&2)!==0),l?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),pe(Ie,i&1),t===null)return wd(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,s?(r=e.mode,s=e.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Gu(o,r,0,null),t=ii(t,r,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Pd(n),e.memoizedState=Rd,t):ip(e,o));if(i=t.memoizedState,i!==null&&(l=i.dehydrated,l!==null))return cR(t,e,o,r,l,i,n);if(s){s=r.fallback,o=e.mode,i=t.child,l=i.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=Sr(i,u),r.subtreeFlags=i.subtreeFlags&14680064),l!==null?s=Sr(l,s):(s=ii(s,o,n,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,o=t.child.memoizedState,o=o===null?Pd(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=Rd,r}return s=t.child,t=s.sibling,r=Sr(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function ip(t,e){return e=Gu({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function ll(t,e,n,r){return r!==null&&Wf(r),us(e,t.child,null,n),t=ip(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function cR(t,e,n,r,i,s,o){if(n)return e.flags&256?(e.flags&=-257,r=wh(Error(F(422))),ll(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=Gu({mode:"visible",children:r.children},i,0,null),s=ii(s,i,o,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&us(e,t.child,null,o),e.child.memoizedState=Pd(o),e.memoizedState=Rd,s);if(!(e.mode&1))return ll(t,e,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var l=r.dgst;return r=l,s=Error(F(419)),r=wh(s,r,void 0),ll(t,e,o,r)}if(l=(o&t.childLanes)!==0,kt||l){if(r=He,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,$n(t,i),un(r,t,i,-1))}return cp(),r=wh(Error(F(421))),ll(t,e,o,r)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=IR.bind(null,t),i._reactRetry=e,null):(t=s.treeContext,Lt=wr(i.nextSibling),jt=e,Ee=!0,on=null,t!==null&&(qt[Kt++]=Dn,qt[Kt++]=On,qt[Kt++]=ui,Dn=t.id,On=t.overflow,ui=e),e=ip(e,r.children),e.flags|=4096,e)}function Ny(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),Ed(t.return,e,n)}function Eh(t,e,n,r,i){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function VE(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(vt(t,e,r.children,n),r=Ie.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Ny(t,n,e);else if(t.tag===19)Ny(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(pe(Ie,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&au(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),Eh(e,!1,i,n,s);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&au(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}Eh(e,!0,n,null,s);break;case"together":Eh(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Nl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function zn(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),hi|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(F(153));if(e.child!==null){for(t=e.child,n=Sr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Sr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function hR(t,e,n){switch(e.tag){case 3:OE(e),ls();break;case 5:lE(e);break;case 1:Pt(e.type)&&tu(e);break;case 4:Yf(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;pe(iu,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(pe(Ie,Ie.current&1),e.flags|=128,null):n&e.child.childLanes?LE(t,e,n):(pe(Ie,Ie.current&1),t=zn(t,e,n),t!==null?t.sibling:null);pe(Ie,Ie.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return VE(t,e,n);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),pe(Ie,Ie.current),r)break;return null;case 22:case 23:return e.lanes=0,bE(t,e,n)}return zn(t,e,n)}var ME,Cd,jE,UE;ME=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Cd=function(){};jE=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,Zr(Tn.current);var s=null;switch(n){case"input":i=Xh(t,i),r=Xh(t,r),s=[];break;case"select":i=ke({},i,{value:void 0}),r=ke({},r,{value:void 0}),s=[];break;case"textarea":i=ed(t,i),r=ed(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=Zl)}nd(n,r);var o;n=null;for(c in i)if(!r.hasOwnProperty(c)&&i.hasOwnProperty(c)&&i[c]!=null)if(c==="style"){var l=i[c];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Do.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in r){var u=r[c];if(l=i!=null?i[c]:void 0,r.hasOwnProperty(c)&&u!==l&&(u!=null||l!=null))if(c==="style")if(l){for(o in l)!l.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&l[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(s||(s=[]),s.push(c,n)),n=u;else c==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,l=l?l.__html:void 0,u!=null&&l!==u&&(s=s||[]).push(c,u)):c==="children"?typeof u!="string"&&typeof u!="number"||(s=s||[]).push(c,""+u):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Do.hasOwnProperty(c)?(u!=null&&c==="onScroll"&&_e("scroll",t),s||l===u||(s=[])):(s=s||[]).push(c,u))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};UE=function(t,e,n,r){n!==r&&(e.flags|=4)};function eo(t,e){if(!Ee)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function lt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function dR(t,e,n){var r=e.pendingProps;switch(zf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return lt(e),null;case 1:return Pt(e.type)&&eu(),lt(e),null;case 3:return r=e.stateNode,cs(),we(Rt),we(pt),Jf(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(ol(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,on!==null&&(Md(on),on=null))),Cd(t,e),lt(e),null;case 5:Xf(e);var i=Zr(Ho.current);if(n=e.type,t!==null&&e.stateNode!=null)jE(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(F(166));return lt(e),null}if(t=Zr(Tn.current),ol(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[vn]=e,r[zo]=s,t=(e.mode&1)!==0,n){case"dialog":_e("cancel",r),_e("close",r);break;case"iframe":case"object":case"embed":_e("load",r);break;case"video":case"audio":for(i=0;i<ao.length;i++)_e(ao[i],r);break;case"source":_e("error",r);break;case"img":case"image":case"link":_e("error",r),_e("load",r);break;case"details":_e("toggle",r);break;case"input":Ug(r,s),_e("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},_e("invalid",r);break;case"textarea":Bg(r,s),_e("invalid",r)}nd(n,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var l=s[o];o==="children"?typeof l=="string"?r.textContent!==l&&(s.suppressHydrationWarning!==!0&&sl(r.textContent,l,t),i=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&sl(r.textContent,l,t),i=["children",""+l]):Do.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&_e("scroll",r)}switch(n){case"input":Xa(r),Fg(r,s,!0);break;case"textarea":Xa(r),$g(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Zl)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=fw(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[vn]=e,t[zo]=r,ME(t,e,!1,!1),e.stateNode=t;e:{switch(o=rd(n,r),n){case"dialog":_e("cancel",t),_e("close",t),i=r;break;case"iframe":case"object":case"embed":_e("load",t),i=r;break;case"video":case"audio":for(i=0;i<ao.length;i++)_e(ao[i],t);i=r;break;case"source":_e("error",t),i=r;break;case"img":case"image":case"link":_e("error",t),_e("load",t),i=r;break;case"details":_e("toggle",t),i=r;break;case"input":Ug(t,r),i=Xh(t,r),_e("invalid",t);break;case"option":i=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=ke({},r,{value:void 0}),_e("invalid",t);break;case"textarea":Bg(t,r),i=ed(t,r),_e("invalid",t);break;default:i=r}nd(n,i),l=i;for(s in l)if(l.hasOwnProperty(s)){var u=l[s];s==="style"?gw(t,u):s==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&pw(t,u)):s==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&Oo(t,u):typeof u=="number"&&Oo(t,""+u):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Do.hasOwnProperty(s)?u!=null&&s==="onScroll"&&_e("scroll",t):u!=null&&Pf(t,s,u,o))}switch(n){case"input":Xa(t),Fg(t,r,!1);break;case"textarea":Xa(t),$g(t);break;case"option":r.value!=null&&t.setAttribute("value",""+Nr(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?Qi(t,!!r.multiple,s,!1):r.defaultValue!=null&&Qi(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=Zl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return lt(e),null;case 6:if(t&&e.stateNode!=null)UE(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(F(166));if(n=Zr(Ho.current),Zr(Tn.current),ol(e)){if(r=e.stateNode,n=e.memoizedProps,r[vn]=e,(s=r.nodeValue!==n)&&(t=jt,t!==null))switch(t.tag){case 3:sl(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&sl(r.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[vn]=e,e.stateNode=r}return lt(e),null;case 13:if(we(Ie),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(Ee&&Lt!==null&&e.mode&1&&!(e.flags&128))rE(),ls(),e.flags|=98560,s=!1;else if(s=ol(e),r!==null&&r.dehydrated!==null){if(t===null){if(!s)throw Error(F(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(F(317));s[vn]=e}else ls(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;lt(e),s=!1}else on!==null&&(Md(on),on=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||Ie.current&1?Be===0&&(Be=3):cp())),e.updateQueue!==null&&(e.flags|=4),lt(e),null);case 4:return cs(),Cd(t,e),t===null&&Bo(e.stateNode.containerInfo),lt(e),null;case 10:return Kf(e.type._context),lt(e),null;case 17:return Pt(e.type)&&eu(),lt(e),null;case 19:if(we(Ie),s=e.memoizedState,s===null)return lt(e),null;if(r=(e.flags&128)!==0,o=s.rendering,o===null)if(r)eo(s,!1);else{if(Be!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=au(t),o!==null){for(e.flags|=128,eo(s,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return pe(Ie,Ie.current&1|2),e.child}t=t.sibling}s.tail!==null&&Le()>ds&&(e.flags|=128,r=!0,eo(s,!1),e.lanes=4194304)}else{if(!r)if(t=au(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),eo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!Ee)return lt(e),null}else 2*Le()-s.renderingStartTime>ds&&n!==1073741824&&(e.flags|=128,r=!0,eo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Le(),e.sibling=null,n=Ie.current,pe(Ie,r?n&1|2:n&1),e):(lt(e),null);case 22:case 23:return up(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?Ot&1073741824&&(lt(e),e.subtreeFlags&6&&(e.flags|=8192)):lt(e),null;case 24:return null;case 25:return null}throw Error(F(156,e.tag))}function fR(t,e){switch(zf(e),e.tag){case 1:return Pt(e.type)&&eu(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return cs(),we(Rt),we(pt),Jf(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Xf(e),null;case 13:if(we(Ie),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(F(340));ls()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return we(Ie),null;case 4:return cs(),null;case 10:return Kf(e.type._context),null;case 22:case 23:return up(),null;case 24:return null;default:return null}}var ul=!1,ht=!1,pR=typeof WeakSet=="function"?WeakSet:Set,W=null;function Ki(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Ne(t,e,r)}else n.current=null}function Nd(t,e,n){try{n()}catch(r){Ne(t,e,r)}}var xy=!1;function mR(t,e){if(fd=Yl,t=Ww(),Bf(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,l=-1,u=-1,c=0,d=0,m=t,g=null;t:for(;;){for(var I;m!==n||i!==0&&m.nodeType!==3||(l=o+i),m!==s||r!==0&&m.nodeType!==3||(u=o+r),m.nodeType===3&&(o+=m.nodeValue.length),(I=m.firstChild)!==null;)g=m,m=I;for(;;){if(m===t)break t;if(g===n&&++c===i&&(l=o),g===s&&++d===r&&(u=o),(I=m.nextSibling)!==null)break;m=g,g=m.parentNode}m=I}n=l===-1||u===-1?null:{start:l,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(pd={focusedElem:t,selectionRange:n},Yl=!1,W=e;W!==null;)if(e=W,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,W=t;else for(;W!==null;){e=W;try{var R=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(R!==null){var C=R.memoizedProps,b=R.memoizedState,k=e.stateNode,w=k.getSnapshotBeforeUpdate(e.elementType===e.type?C:rn(e.type,C),b);k.__reactInternalSnapshotBeforeUpdate=w}break;case 3:var v=e.stateNode.containerInfo;v.nodeType===1?v.textContent="":v.nodeType===9&&v.documentElement&&v.removeChild(v.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(F(163))}}catch(O){Ne(e,e.return,O)}if(t=e.sibling,t!==null){t.return=e.return,W=t;break}W=e.return}return R=xy,xy=!1,R}function To(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&t)===t){var s=i.destroy;i.destroy=void 0,s!==void 0&&Nd(e,n,s)}i=i.next}while(i!==r)}}function qu(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function xd(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function FE(t){var e=t.alternate;e!==null&&(t.alternate=null,FE(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[vn],delete e[zo],delete e[yd],delete e[Xk],delete e[Jk])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function BE(t){return t.tag===5||t.tag===3||t.tag===4}function by(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||BE(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function bd(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Zl));else if(r!==4&&(t=t.child,t!==null))for(bd(t,e,n),t=t.sibling;t!==null;)bd(t,e,n),t=t.sibling}function Dd(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(Dd(t,e,n),t=t.sibling;t!==null;)Dd(t,e,n),t=t.sibling}var Ke=null,sn=!1;function nr(t,e,n){for(n=n.child;n!==null;)$E(t,e,n),n=n.sibling}function $E(t,e,n){if(En&&typeof En.onCommitFiberUnmount=="function")try{En.onCommitFiberUnmount(ju,n)}catch{}switch(n.tag){case 5:ht||Ki(n,e);case 6:var r=Ke,i=sn;Ke=null,nr(t,e,n),Ke=r,sn=i,Ke!==null&&(sn?(t=Ke,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Ke.removeChild(n.stateNode));break;case 18:Ke!==null&&(sn?(t=Ke,n=n.stateNode,t.nodeType===8?ph(t.parentNode,n):t.nodeType===1&&ph(t,n),jo(t)):ph(Ke,n.stateNode));break;case 4:r=Ke,i=sn,Ke=n.stateNode.containerInfo,sn=!0,nr(t,e,n),Ke=r,sn=i;break;case 0:case 11:case 14:case 15:if(!ht&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Nd(n,e,o),i=i.next}while(i!==r)}nr(t,e,n);break;case 1:if(!ht&&(Ki(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){Ne(n,e,l)}nr(t,e,n);break;case 21:nr(t,e,n);break;case 22:n.mode&1?(ht=(r=ht)||n.memoizedState!==null,nr(t,e,n),ht=r):nr(t,e,n);break;default:nr(t,e,n)}}function Dy(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new pR),e.forEach(function(r){var i=SR.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function nn(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:Ke=l.stateNode,sn=!1;break e;case 3:Ke=l.stateNode.containerInfo,sn=!0;break e;case 4:Ke=l.stateNode.containerInfo,sn=!0;break e}l=l.return}if(Ke===null)throw Error(F(160));$E(s,o,i),Ke=null,sn=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(c){Ne(i,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)zE(e,t),e=e.sibling}function zE(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(nn(e,t),mn(t),r&4){try{To(3,t,t.return),qu(3,t)}catch(C){Ne(t,t.return,C)}try{To(5,t,t.return)}catch(C){Ne(t,t.return,C)}}break;case 1:nn(e,t),mn(t),r&512&&n!==null&&Ki(n,n.return);break;case 5:if(nn(e,t),mn(t),r&512&&n!==null&&Ki(n,n.return),t.flags&32){var i=t.stateNode;try{Oo(i,"")}catch(C){Ne(t,t.return,C)}}if(r&4&&(i=t.stateNode,i!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,l=t.type,u=t.updateQueue;if(t.updateQueue=null,u!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&hw(i,s),rd(l,o);var c=rd(l,s);for(o=0;o<u.length;o+=2){var d=u[o],m=u[o+1];d==="style"?gw(i,m):d==="dangerouslySetInnerHTML"?pw(i,m):d==="children"?Oo(i,m):Pf(i,d,m,c)}switch(l){case"input":Jh(i,s);break;case"textarea":dw(i,s);break;case"select":var g=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var I=s.value;I!=null?Qi(i,!!s.multiple,I,!1):g!==!!s.multiple&&(s.defaultValue!=null?Qi(i,!!s.multiple,s.defaultValue,!0):Qi(i,!!s.multiple,s.multiple?[]:"",!1))}i[zo]=s}catch(C){Ne(t,t.return,C)}}break;case 6:if(nn(e,t),mn(t),r&4){if(t.stateNode===null)throw Error(F(162));i=t.stateNode,s=t.memoizedProps;try{i.nodeValue=s}catch(C){Ne(t,t.return,C)}}break;case 3:if(nn(e,t),mn(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{jo(e.containerInfo)}catch(C){Ne(t,t.return,C)}break;case 4:nn(e,t),mn(t);break;case 13:nn(e,t),mn(t),i=t.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(ap=Le())),r&4&&Dy(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(ht=(c=ht)||d,nn(e,t),ht=c):nn(e,t),mn(t),r&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!d&&t.mode&1)for(W=t,d=t.child;d!==null;){for(m=W=d;W!==null;){switch(g=W,I=g.child,g.tag){case 0:case 11:case 14:case 15:To(4,g,g.return);break;case 1:Ki(g,g.return);var R=g.stateNode;if(typeof R.componentWillUnmount=="function"){r=g,n=g.return;try{e=r,R.props=e.memoizedProps,R.state=e.memoizedState,R.componentWillUnmount()}catch(C){Ne(r,n,C)}}break;case 5:Ki(g,g.return);break;case 22:if(g.memoizedState!==null){Ly(m);continue}}I!==null?(I.return=g,W=I):Ly(m)}d=d.sibling}e:for(d=null,m=t;;){if(m.tag===5){if(d===null){d=m;try{i=m.stateNode,c?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=m.stateNode,u=m.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,l.style.display=mw("display",o))}catch(C){Ne(t,t.return,C)}}}else if(m.tag===6){if(d===null)try{m.stateNode.nodeValue=c?"":m.memoizedProps}catch(C){Ne(t,t.return,C)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===t)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===t)break e;for(;m.sibling===null;){if(m.return===null||m.return===t)break e;d===m&&(d=null),m=m.return}d===m&&(d=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:nn(e,t),mn(t),r&4&&Dy(t);break;case 21:break;default:nn(e,t),mn(t)}}function mn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(BE(n)){var r=n;break e}n=n.return}throw Error(F(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(Oo(i,""),r.flags&=-33);var s=by(t);Dd(t,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,l=by(t);bd(t,l,o);break;default:throw Error(F(161))}}catch(u){Ne(t,t.return,u)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function gR(t,e,n){W=t,WE(t)}function WE(t,e,n){for(var r=(t.mode&1)!==0;W!==null;){var i=W,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||ul;if(!o){var l=i.alternate,u=l!==null&&l.memoizedState!==null||ht;l=ul;var c=ht;if(ul=o,(ht=u)&&!c)for(W=i;W!==null;)o=W,u=o.child,o.tag===22&&o.memoizedState!==null?Vy(i):u!==null?(u.return=o,W=u):Vy(i);for(;s!==null;)W=s,WE(s),s=s.sibling;W=i,ul=l,ht=c}Oy(t)}else i.subtreeFlags&8772&&s!==null?(s.return=i,W=s):Oy(t)}}function Oy(t){for(;W!==null;){var e=W;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:ht||qu(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!ht)if(n===null)r.componentDidMount();else{var i=e.elementType===e.type?n.memoizedProps:rn(e.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&_y(e,s,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}_y(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var m=d.dehydrated;m!==null&&jo(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(F(163))}ht||e.flags&512&&xd(e)}catch(g){Ne(e,e.return,g)}}if(e===t){W=null;break}if(n=e.sibling,n!==null){n.return=e.return,W=n;break}W=e.return}}function Ly(t){for(;W!==null;){var e=W;if(e===t){W=null;break}var n=e.sibling;if(n!==null){n.return=e.return,W=n;break}W=e.return}}function Vy(t){for(;W!==null;){var e=W;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{qu(4,e)}catch(u){Ne(e,n,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(u){Ne(e,i,u)}}var s=e.return;try{xd(e)}catch(u){Ne(e,s,u)}break;case 5:var o=e.return;try{xd(e)}catch(u){Ne(e,o,u)}}}catch(u){Ne(e,e.return,u)}if(e===t){W=null;break}var l=e.sibling;if(l!==null){l.return=e.return,W=l;break}W=e.return}}var yR=Math.ceil,cu=Gn.ReactCurrentDispatcher,sp=Gn.ReactCurrentOwner,Qt=Gn.ReactCurrentBatchConfig,se=0,He=null,je=null,Xe=0,Ot=0,Gi=Mr(0),Be=0,Qo=null,hi=0,Ku=0,op=0,Io=null,St=null,ap=0,ds=1/0,xn=null,hu=!1,Od=null,Tr=null,cl=!1,pr=null,du=0,So=0,Ld=null,xl=-1,bl=0;function wt(){return se&6?Le():xl!==-1?xl:xl=Le()}function Ir(t){return t.mode&1?se&2&&Xe!==0?Xe&-Xe:eR.transition!==null?(bl===0&&(bl=Pw()),bl):(t=ce,t!==0||(t=window.event,t=t===void 0?16:Lw(t.type)),t):1}function un(t,e,n,r){if(50<So)throw So=0,Ld=null,Error(F(185));ca(t,n,r),(!(se&2)||t!==He)&&(t===He&&(!(se&2)&&(Ku|=n),Be===4&&ar(t,Xe)),Ct(t,r),n===1&&se===0&&!(e.mode&1)&&(ds=Le()+500,zu&&jr()))}function Ct(t,e){var n=t.callbackNode;ek(t,e);var r=Ql(t,t===He?Xe:0);if(r===0)n!==null&&Hg(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&Hg(n),e===1)t.tag===0?Zk(My.bind(null,t)):eE(My.bind(null,t)),Qk(function(){!(se&6)&&jr()}),n=null;else{switch(Cw(r)){case 1:n=Df;break;case 4:n=kw;break;case 16:n=Gl;break;case 536870912:n=Rw;break;default:n=Gl}n=JE(n,HE.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function HE(t,e){if(xl=-1,bl=0,se&6)throw Error(F(327));var n=t.callbackNode;if(es()&&t.callbackNode!==n)return null;var r=Ql(t,t===He?Xe:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=fu(t,r);else{e=r;var i=se;se|=2;var s=KE();(He!==t||Xe!==e)&&(xn=null,ds=Le()+500,ri(t,e));do try{wR();break}catch(l){qE(t,l)}while(!0);qf(),cu.current=s,se=i,je!==null?e=0:(He=null,Xe=0,e=Be)}if(e!==0){if(e===2&&(i=ld(t),i!==0&&(r=i,e=Vd(t,i))),e===1)throw n=Qo,ri(t,0),ar(t,r),Ct(t,Le()),n;if(e===6)ar(t,r);else{if(i=t.current.alternate,!(r&30)&&!_R(i)&&(e=fu(t,r),e===2&&(s=ld(t),s!==0&&(r=s,e=Vd(t,s))),e===1))throw n=Qo,ri(t,0),ar(t,r),Ct(t,Le()),n;switch(t.finishedWork=i,t.finishedLanes=r,e){case 0:case 1:throw Error(F(345));case 2:Qr(t,St,xn);break;case 3:if(ar(t,r),(r&130023424)===r&&(e=ap+500-Le(),10<e)){if(Ql(t,0)!==0)break;if(i=t.suspendedLanes,(i&r)!==r){wt(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=gd(Qr.bind(null,t,St,xn),e);break}Qr(t,St,xn);break;case 4:if(ar(t,r),(r&4194240)===r)break;for(e=t.eventTimes,i=-1;0<r;){var o=31-ln(r);s=1<<o,o=e[o],o>i&&(i=o),r&=~s}if(r=i,r=Le()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*yR(r/1960))-r,10<r){t.timeoutHandle=gd(Qr.bind(null,t,St,xn),r);break}Qr(t,St,xn);break;case 5:Qr(t,St,xn);break;default:throw Error(F(329))}}}return Ct(t,Le()),t.callbackNode===n?HE.bind(null,t):null}function Vd(t,e){var n=Io;return t.current.memoizedState.isDehydrated&&(ri(t,e).flags|=256),t=fu(t,e),t!==2&&(e=St,St=n,e!==null&&Md(e)),t}function Md(t){St===null?St=t:St.push.apply(St,t)}function _R(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!hn(s(),i))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function ar(t,e){for(e&=~op,e&=~Ku,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-ln(e),r=1<<n;t[n]=-1,e&=~r}}function My(t){if(se&6)throw Error(F(327));es();var e=Ql(t,0);if(!(e&1))return Ct(t,Le()),null;var n=fu(t,e);if(t.tag!==0&&n===2){var r=ld(t);r!==0&&(e=r,n=Vd(t,r))}if(n===1)throw n=Qo,ri(t,0),ar(t,e),Ct(t,Le()),n;if(n===6)throw Error(F(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Qr(t,St,xn),Ct(t,Le()),null}function lp(t,e){var n=se;se|=1;try{return t(e)}finally{se=n,se===0&&(ds=Le()+500,zu&&jr())}}function di(t){pr!==null&&pr.tag===0&&!(se&6)&&es();var e=se;se|=1;var n=Qt.transition,r=ce;try{if(Qt.transition=null,ce=1,t)return t()}finally{ce=r,Qt.transition=n,se=e,!(se&6)&&jr()}}function up(){Ot=Gi.current,we(Gi)}function ri(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,Gk(n)),je!==null)for(n=je.return;n!==null;){var r=n;switch(zf(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&eu();break;case 3:cs(),we(Rt),we(pt),Jf();break;case 5:Xf(r);break;case 4:cs();break;case 13:we(Ie);break;case 19:we(Ie);break;case 10:Kf(r.type._context);break;case 22:case 23:up()}n=n.return}if(He=t,je=t=Sr(t.current,null),Xe=Ot=e,Be=0,Qo=null,op=Ku=hi=0,St=Io=null,Jr!==null){for(e=0;e<Jr.length;e++)if(n=Jr[e],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}n.pending=r}Jr=null}return t}function qE(t,e){do{var n=je;try{if(qf(),Pl.current=uu,lu){for(var r=Se.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}lu=!1}if(ci=0,We=Fe=Se=null,Eo=!1,qo=0,sp.current=null,n===null||n.return===null){Be=1,Qo=e,je=null;break}e:{var s=t,o=n.return,l=n,u=e;if(e=Xe,l.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var c=u,d=l,m=d.tag;if(!(d.mode&1)&&(m===0||m===11||m===15)){var g=d.alternate;g?(d.updateQueue=g.updateQueue,d.memoizedState=g.memoizedState,d.lanes=g.lanes):(d.updateQueue=null,d.memoizedState=null)}var I=Sy(o);if(I!==null){I.flags&=-257,Ay(I,o,l,s,e),I.mode&1&&Iy(s,c,e),e=I,u=c;var R=e.updateQueue;if(R===null){var C=new Set;C.add(u),e.updateQueue=C}else R.add(u);break e}else{if(!(e&1)){Iy(s,c,e),cp();break e}u=Error(F(426))}}else if(Ee&&l.mode&1){var b=Sy(o);if(b!==null){!(b.flags&65536)&&(b.flags|=256),Ay(b,o,l,s,e),Wf(hs(u,l));break e}}s=u=hs(u,l),Be!==4&&(Be=2),Io===null?Io=[s]:Io.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var k=CE(s,u,e);yy(s,k);break e;case 1:l=u;var w=s.type,v=s.stateNode;if(!(s.flags&128)&&(typeof w.getDerivedStateFromError=="function"||v!==null&&typeof v.componentDidCatch=="function"&&(Tr===null||!Tr.has(v)))){s.flags|=65536,e&=-e,s.lanes|=e;var O=NE(s,l,e);yy(s,O);break e}}s=s.return}while(s!==null)}QE(n)}catch(U){e=U,je===n&&n!==null&&(je=n=n.return);continue}break}while(!0)}function KE(){var t=cu.current;return cu.current=uu,t===null?uu:t}function cp(){(Be===0||Be===3||Be===2)&&(Be=4),He===null||!(hi&268435455)&&!(Ku&268435455)||ar(He,Xe)}function fu(t,e){var n=se;se|=2;var r=KE();(He!==t||Xe!==e)&&(xn=null,ri(t,e));do try{vR();break}catch(i){qE(t,i)}while(!0);if(qf(),se=n,cu.current=r,je!==null)throw Error(F(261));return He=null,Xe=0,Be}function vR(){for(;je!==null;)GE(je)}function wR(){for(;je!==null&&!HA();)GE(je)}function GE(t){var e=XE(t.alternate,t,Ot);t.memoizedProps=t.pendingProps,e===null?QE(t):je=e,sp.current=null}function QE(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=fR(n,e),n!==null){n.flags&=32767,je=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Be=6,je=null;return}}else if(n=dR(n,e,Ot),n!==null){je=n;return}if(e=e.sibling,e!==null){je=e;return}je=e=t}while(e!==null);Be===0&&(Be=5)}function Qr(t,e,n){var r=ce,i=Qt.transition;try{Qt.transition=null,ce=1,ER(t,e,n,r)}finally{Qt.transition=i,ce=r}return null}function ER(t,e,n,r){do es();while(pr!==null);if(se&6)throw Error(F(327));n=t.finishedWork;var i=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(F(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(tk(t,s),t===He&&(je=He=null,Xe=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||cl||(cl=!0,JE(Gl,function(){return es(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Qt.transition,Qt.transition=null;var o=ce;ce=1;var l=se;se|=4,sp.current=null,mR(t,n),zE(n,t),Bk(pd),Yl=!!fd,pd=fd=null,t.current=n,gR(n),qA(),se=l,ce=o,Qt.transition=s}else t.current=n;if(cl&&(cl=!1,pr=t,du=i),s=t.pendingLanes,s===0&&(Tr=null),QA(n.stateNode),Ct(t,Le()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)i=e[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(hu)throw hu=!1,t=Od,Od=null,t;return du&1&&t.tag!==0&&es(),s=t.pendingLanes,s&1?t===Ld?So++:(So=0,Ld=t):So=0,jr(),null}function es(){if(pr!==null){var t=Cw(du),e=Qt.transition,n=ce;try{if(Qt.transition=null,ce=16>t?16:t,pr===null)var r=!1;else{if(t=pr,pr=null,du=0,se&6)throw Error(F(331));var i=se;for(se|=4,W=t.current;W!==null;){var s=W,o=s.child;if(W.flags&16){var l=s.deletions;if(l!==null){for(var u=0;u<l.length;u++){var c=l[u];for(W=c;W!==null;){var d=W;switch(d.tag){case 0:case 11:case 15:To(8,d,s)}var m=d.child;if(m!==null)m.return=d,W=m;else for(;W!==null;){d=W;var g=d.sibling,I=d.return;if(FE(d),d===c){W=null;break}if(g!==null){g.return=I,W=g;break}W=I}}}var R=s.alternate;if(R!==null){var C=R.child;if(C!==null){R.child=null;do{var b=C.sibling;C.sibling=null,C=b}while(C!==null)}}W=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,W=o;else e:for(;W!==null;){if(s=W,s.flags&2048)switch(s.tag){case 0:case 11:case 15:To(9,s,s.return)}var k=s.sibling;if(k!==null){k.return=s.return,W=k;break e}W=s.return}}var w=t.current;for(W=w;W!==null;){o=W;var v=o.child;if(o.subtreeFlags&2064&&v!==null)v.return=o,W=v;else e:for(o=w;W!==null;){if(l=W,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:qu(9,l)}}catch(U){Ne(l,l.return,U)}if(l===o){W=null;break e}var O=l.sibling;if(O!==null){O.return=l.return,W=O;break e}W=l.return}}if(se=i,jr(),En&&typeof En.onPostCommitFiberRoot=="function")try{En.onPostCommitFiberRoot(ju,t)}catch{}r=!0}return r}finally{ce=n,Qt.transition=e}}return!1}function jy(t,e,n){e=hs(n,e),e=CE(t,e,1),t=Er(t,e,1),e=wt(),t!==null&&(ca(t,1,e),Ct(t,e))}function Ne(t,e,n){if(t.tag===3)jy(t,t,n);else for(;e!==null;){if(e.tag===3){jy(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Tr===null||!Tr.has(r))){t=hs(n,t),t=NE(e,t,1),e=Er(e,t,1),t=wt(),e!==null&&(ca(e,1,t),Ct(e,t));break}}e=e.return}}function TR(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=wt(),t.pingedLanes|=t.suspendedLanes&n,He===t&&(Xe&n)===n&&(Be===4||Be===3&&(Xe&130023424)===Xe&&500>Le()-ap?ri(t,0):op|=n),Ct(t,e)}function YE(t,e){e===0&&(t.mode&1?(e=el,el<<=1,!(el&130023424)&&(el=4194304)):e=1);var n=wt();t=$n(t,e),t!==null&&(ca(t,e,n),Ct(t,n))}function IR(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),YE(t,n)}function SR(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,i=t.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(F(314))}r!==null&&r.delete(e),YE(t,n)}var XE;XE=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||Rt.current)kt=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return kt=!1,hR(t,e,n);kt=!!(t.flags&131072)}else kt=!1,Ee&&e.flags&1048576&&tE(e,ru,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;Nl(t,e),t=e.pendingProps;var i=as(e,pt.current);Zi(e,n),i=ep(null,e,r,t,i,n);var s=tp();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Pt(r)?(s=!0,tu(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Qf(e),i.updater=Hu,e.stateNode=i,i._reactInternals=e,Id(e,r,t,n),e=kd(null,e,r,!0,s,n)):(e.tag=0,Ee&&s&&$f(e),vt(null,e,i,n),e=e.child),e;case 16:r=e.elementType;e:{switch(Nl(t,e),t=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=kR(r),t=rn(r,t),i){case 0:e=Ad(null,e,r,t,n);break e;case 1:e=Py(null,e,r,t,n);break e;case 11:e=ky(null,e,r,t,n);break e;case 14:e=Ry(null,e,r,rn(r.type,t),n);break e}throw Error(F(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:rn(r,i),Ad(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:rn(r,i),Py(t,e,r,i,n);case 3:e:{if(OE(e),t===null)throw Error(F(387));r=e.pendingProps,s=e.memoizedState,i=s.element,aE(t,e),ou(e,r,null,n);var o=e.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=hs(Error(F(423)),e),e=Cy(t,e,r,n,i);break e}else if(r!==i){i=hs(Error(F(424)),e),e=Cy(t,e,r,n,i);break e}else for(Lt=wr(e.stateNode.containerInfo.firstChild),jt=e,Ee=!0,on=null,n=sE(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(ls(),r===i){e=zn(t,e,n);break e}vt(t,e,r,n)}e=e.child}return e;case 5:return lE(e),t===null&&wd(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,o=i.children,md(r,i)?o=null:s!==null&&md(r,s)&&(e.flags|=32),DE(t,e),vt(t,e,o,n),e.child;case 6:return t===null&&wd(e),null;case 13:return LE(t,e,n);case 4:return Yf(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=us(e,null,r,n):vt(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:rn(r,i),ky(t,e,r,i,n);case 7:return vt(t,e,e.pendingProps,n),e.child;case 8:return vt(t,e,e.pendingProps.children,n),e.child;case 12:return vt(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,o=i.value,pe(iu,r._currentValue),r._currentValue=o,s!==null)if(hn(s.value,o)){if(s.children===i.children&&!Rt.current){e=zn(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var l=s.dependencies;if(l!==null){o=s.child;for(var u=l.firstContext;u!==null;){if(u.context===r){if(s.tag===1){u=jn(-1,n&-n),u.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?u.next=u:(u.next=d.next,d.next=u),c.pending=u}}s.lanes|=n,u=s.alternate,u!==null&&(u.lanes|=n),Ed(s.return,n,e),l.lanes|=n;break}u=u.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(F(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),Ed(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}vt(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,Zi(e,n),i=Jt(i),r=r(i),e.flags|=1,vt(t,e,r,n),e.child;case 14:return r=e.type,i=rn(r,e.pendingProps),i=rn(r.type,i),Ry(t,e,r,i,n);case 15:return xE(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:rn(r,i),Nl(t,e),e.tag=1,Pt(r)?(t=!0,tu(e)):t=!1,Zi(e,n),PE(e,r,i),Id(e,r,i,n),kd(null,e,r,!0,t,n);case 19:return VE(t,e,n);case 22:return bE(t,e,n)}throw Error(F(156,e.tag))};function JE(t,e){return Aw(t,e)}function AR(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Gt(t,e,n,r){return new AR(t,e,n,r)}function hp(t){return t=t.prototype,!(!t||!t.isReactComponent)}function kR(t){if(typeof t=="function")return hp(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Nf)return 11;if(t===xf)return 14}return 2}function Sr(t,e){var n=t.alternate;return n===null?(n=Gt(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Dl(t,e,n,r,i,s){var o=2;if(r=t,typeof t=="function")hp(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case ji:return ii(n.children,i,s,e);case Cf:o=8,i|=8;break;case Kh:return t=Gt(12,n,e,i|2),t.elementType=Kh,t.lanes=s,t;case Gh:return t=Gt(13,n,e,i),t.elementType=Gh,t.lanes=s,t;case Qh:return t=Gt(19,n,e,i),t.elementType=Qh,t.lanes=s,t;case lw:return Gu(n,i,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case ow:o=10;break e;case aw:o=9;break e;case Nf:o=11;break e;case xf:o=14;break e;case ir:o=16,r=null;break e}throw Error(F(130,t==null?t:typeof t,""))}return e=Gt(o,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function ii(t,e,n,r){return t=Gt(7,t,r,e),t.lanes=n,t}function Gu(t,e,n,r){return t=Gt(22,t,r,e),t.elementType=lw,t.lanes=n,t.stateNode={isHidden:!1},t}function Th(t,e,n){return t=Gt(6,t,null,e),t.lanes=n,t}function Ih(t,e,n){return e=Gt(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function RR(t,e,n,r,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=rh(0),this.expirationTimes=rh(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=rh(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function dp(t,e,n,r,i,s,o,l,u){return t=new RR(t,e,n,l,u),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Gt(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Qf(s),t}function PR(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Mi,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function ZE(t){if(!t)return xr;t=t._reactInternals;e:{if(Ii(t)!==t||t.tag!==1)throw Error(F(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Pt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(F(171))}if(t.tag===1){var n=t.type;if(Pt(n))return Zw(t,n,e)}return e}function eT(t,e,n,r,i,s,o,l,u){return t=dp(n,r,!0,t,i,s,o,l,u),t.context=ZE(null),n=t.current,r=wt(),i=Ir(n),s=jn(r,i),s.callback=e??null,Er(n,s,i),t.current.lanes=i,ca(t,i,r),Ct(t,r),t}function Qu(t,e,n,r){var i=e.current,s=wt(),o=Ir(i);return n=ZE(n),e.context===null?e.context=n:e.pendingContext=n,e=jn(s,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=Er(i,e,o),t!==null&&(un(t,i,o,s),Rl(t,i,o)),o}function pu(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Uy(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function fp(t,e){Uy(t,e),(t=t.alternate)&&Uy(t,e)}function CR(){return null}var tT=typeof reportError=="function"?reportError:function(t){console.error(t)};function pp(t){this._internalRoot=t}Yu.prototype.render=pp.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(F(409));Qu(t,e,null,null)};Yu.prototype.unmount=pp.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;di(function(){Qu(null,t,null,null)}),e[Bn]=null}};function Yu(t){this._internalRoot=t}Yu.prototype.unstable_scheduleHydration=function(t){if(t){var e=bw();t={blockedOn:null,target:t,priority:e};for(var n=0;n<or.length&&e!==0&&e<or[n].priority;n++);or.splice(n,0,t),n===0&&Ow(t)}};function mp(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Xu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Fy(){}function NR(t,e,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var c=pu(o);s.call(c)}}var o=eT(e,r,t,0,null,!1,!1,"",Fy);return t._reactRootContainer=o,t[Bn]=o.current,Bo(t.nodeType===8?t.parentNode:t),di(),o}for(;i=t.lastChild;)t.removeChild(i);if(typeof r=="function"){var l=r;r=function(){var c=pu(u);l.call(c)}}var u=dp(t,0,!1,null,null,!1,!1,"",Fy);return t._reactRootContainer=u,t[Bn]=u.current,Bo(t.nodeType===8?t.parentNode:t),di(function(){Qu(e,u,n,r)}),u}function Ju(t,e,n,r,i){var s=n._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var l=i;i=function(){var u=pu(o);l.call(u)}}Qu(e,o,t,i)}else o=NR(n,e,t,i,r);return pu(o)}Nw=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=oo(e.pendingLanes);n!==0&&(Of(e,n|1),Ct(e,Le()),!(se&6)&&(ds=Le()+500,jr()))}break;case 13:di(function(){var r=$n(t,1);if(r!==null){var i=wt();un(r,t,1,i)}}),fp(t,1)}};Lf=function(t){if(t.tag===13){var e=$n(t,134217728);if(e!==null){var n=wt();un(e,t,134217728,n)}fp(t,134217728)}};xw=function(t){if(t.tag===13){var e=Ir(t),n=$n(t,e);if(n!==null){var r=wt();un(n,t,e,r)}fp(t,e)}};bw=function(){return ce};Dw=function(t,e){var n=ce;try{return ce=t,e()}finally{ce=n}};sd=function(t,e,n){switch(e){case"input":if(Jh(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=$u(r);if(!i)throw Error(F(90));cw(r),Jh(r,i)}}}break;case"textarea":dw(t,n);break;case"select":e=n.value,e!=null&&Qi(t,!!n.multiple,e,!1)}};vw=lp;ww=di;var xR={usingClientEntryPoint:!1,Events:[da,$i,$u,yw,_w,lp]},to={findFiberByHostInstance:Xr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},bR={bundleType:to.bundleType,version:to.version,rendererPackageName:to.rendererPackageName,rendererConfig:to.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Gn.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Iw(t),t===null?null:t.stateNode},findFiberByHostInstance:to.findFiberByHostInstance||CR,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var hl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!hl.isDisabled&&hl.supportsFiber)try{ju=hl.inject(bR),En=hl}catch{}}Bt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=xR;Bt.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!mp(e))throw Error(F(200));return PR(t,e,null,n)};Bt.createRoot=function(t,e){if(!mp(t))throw Error(F(299));var n=!1,r="",i=tT;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=dp(t,1,!1,null,null,n,!1,r,i),t[Bn]=e.current,Bo(t.nodeType===8?t.parentNode:t),new pp(e)};Bt.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(F(188)):(t=Object.keys(t).join(","),Error(F(268,t)));return t=Iw(e),t=t===null?null:t.stateNode,t};Bt.flushSync=function(t){return di(t)};Bt.hydrate=function(t,e,n){if(!Xu(e))throw Error(F(200));return Ju(null,t,e,!0,n)};Bt.hydrateRoot=function(t,e,n){if(!mp(t))throw Error(F(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",o=tT;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=eT(e,null,t,1,n??null,i,!1,s,o),t[Bn]=e.current,Bo(t),r)for(t=0;t<r.length;t++)n=r[t],i=n._getVersion,i=i(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,i]:e.mutableSourceEagerHydrationData.push(n,i);return new Yu(e)};Bt.render=function(t,e,n){if(!Xu(e))throw Error(F(200));return Ju(null,t,e,!1,n)};Bt.unmountComponentAtNode=function(t){if(!Xu(t))throw Error(F(40));return t._reactRootContainer?(di(function(){Ju(null,null,t,!1,function(){t._reactRootContainer=null,t[Bn]=null})}),!0):!1};Bt.unstable_batchedUpdates=lp;Bt.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!Xu(n))throw Error(F(200));if(t==null||t._reactInternals===void 0)throw Error(F(38));return Ju(t,e,n,!1,r)};Bt.version="18.3.1-next-f1338f8080-20240426";function nT(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(nT)}catch(t){console.error(t)}}nT(),nw.exports=Bt;var DR=nw.exports,By=DR;Hh.createRoot=By.createRoot,Hh.hydrateRoot=By.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Yo(){return Yo=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Yo.apply(this,arguments)}var mr;(function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"})(mr||(mr={}));const $y="popstate";function OR(t){t===void 0&&(t={});function e(r,i){let{pathname:s,search:o,hash:l}=r.location;return jd("",{pathname:s,search:o,hash:l},i.state&&i.state.usr||null,i.state&&i.state.key||"default")}function n(r,i){return typeof i=="string"?i:mu(i)}return VR(e,n,null,t)}function Ae(t,e){if(t===!1||t===null||typeof t>"u")throw new Error(e)}function gp(t,e){if(!t){typeof console<"u"&&console.warn(e);try{throw new Error(e)}catch{}}}function LR(){return Math.random().toString(36).substr(2,8)}function zy(t,e){return{usr:t.state,key:t.key,idx:e}}function jd(t,e,n,r){return n===void 0&&(n=null),Yo({pathname:typeof t=="string"?t:t.pathname,search:"",hash:""},typeof e=="string"?Rs(e):e,{state:n,key:e&&e.key||r||LR()})}function mu(t){let{pathname:e="/",search:n="",hash:r=""}=t;return n&&n!=="?"&&(e+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(e+=r.charAt(0)==="#"?r:"#"+r),e}function Rs(t){let e={};if(t){let n=t.indexOf("#");n>=0&&(e.hash=t.substr(n),t=t.substr(0,n));let r=t.indexOf("?");r>=0&&(e.search=t.substr(r),t=t.substr(0,r)),t&&(e.pathname=t)}return e}function VR(t,e,n,r){r===void 0&&(r={});let{window:i=document.defaultView,v5Compat:s=!1}=r,o=i.history,l=mr.Pop,u=null,c=d();c==null&&(c=0,o.replaceState(Yo({},o.state,{idx:c}),""));function d(){return(o.state||{idx:null}).idx}function m(){l=mr.Pop;let b=d(),k=b==null?null:b-c;c=b,u&&u({action:l,location:C.location,delta:k})}function g(b,k){l=mr.Push;let w=jd(C.location,b,k);c=d()+1;let v=zy(w,c),O=C.createHref(w);try{o.pushState(v,"",O)}catch(U){if(U instanceof DOMException&&U.name==="DataCloneError")throw U;i.location.assign(O)}s&&u&&u({action:l,location:C.location,delta:1})}function I(b,k){l=mr.Replace;let w=jd(C.location,b,k);c=d();let v=zy(w,c),O=C.createHref(w);o.replaceState(v,"",O),s&&u&&u({action:l,location:C.location,delta:0})}function R(b){let k=i.location.origin!=="null"?i.location.origin:i.location.href,w=typeof b=="string"?b:mu(b);return w=w.replace(/ $/,"%20"),Ae(k,"No window.location.(origin|href) available to create URL for href: "+w),new URL(w,k)}let C={get action(){return l},get location(){return t(i,o)},listen(b){if(u)throw new Error("A history only accepts one active listener");return i.addEventListener($y,m),u=b,()=>{i.removeEventListener($y,m),u=null}},createHref(b){return e(i,b)},createURL:R,encodeLocation(b){let k=R(b);return{pathname:k.pathname,search:k.search,hash:k.hash}},push:g,replace:I,go(b){return o.go(b)}};return C}var Wy;(function(t){t.data="data",t.deferred="deferred",t.redirect="redirect",t.error="error"})(Wy||(Wy={}));function MR(t,e,n){return n===void 0&&(n="/"),jR(t,e,n)}function jR(t,e,n,r){let i=typeof e=="string"?Rs(e):e,s=fs(i.pathname||"/",n);if(s==null)return null;let o=rT(t);UR(o);let l=null;for(let u=0;l==null&&u<o.length;++u){let c=YR(s);l=GR(o[u],c)}return l}function rT(t,e,n,r){e===void 0&&(e=[]),n===void 0&&(n=[]),r===void 0&&(r="");let i=(s,o,l)=>{let u={relativePath:l===void 0?s.path||"":l,caseSensitive:s.caseSensitive===!0,childrenIndex:o,route:s};u.relativePath.startsWith("/")&&(Ae(u.relativePath.startsWith(r),'Absolute route path "'+u.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),u.relativePath=u.relativePath.slice(r.length));let c=Ar([r,u.relativePath]),d=n.concat(u);s.children&&s.children.length>0&&(Ae(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+c+'".')),rT(s.children,e,d,c)),!(s.path==null&&!s.index)&&e.push({path:c,score:qR(c,s.index),routesMeta:d})};return t.forEach((s,o)=>{var l;if(s.path===""||!((l=s.path)!=null&&l.includes("?")))i(s,o);else for(let u of iT(s.path))i(s,o,u)}),e}function iT(t){let e=t.split("/");if(e.length===0)return[];let[n,...r]=e,i=n.endsWith("?"),s=n.replace(/\?$/,"");if(r.length===0)return i?[s,""]:[s];let o=iT(r.join("/")),l=[];return l.push(...o.map(u=>u===""?s:[s,u].join("/"))),i&&l.push(...o),l.map(u=>t.startsWith("/")&&u===""?"/":u)}function UR(t){t.sort((e,n)=>e.score!==n.score?n.score-e.score:KR(e.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const FR=/^:[\w-]+$/,BR=3,$R=2,zR=1,WR=10,HR=-2,Hy=t=>t==="*";function qR(t,e){let n=t.split("/"),r=n.length;return n.some(Hy)&&(r+=HR),e&&(r+=$R),n.filter(i=>!Hy(i)).reduce((i,s)=>i+(FR.test(s)?BR:s===""?zR:WR),r)}function KR(t,e){return t.length===e.length&&t.slice(0,-1).every((r,i)=>r===e[i])?t[t.length-1]-e[e.length-1]:0}function GR(t,e,n){let{routesMeta:r}=t,i={},s="/",o=[];for(let l=0;l<r.length;++l){let u=r[l],c=l===r.length-1,d=s==="/"?e:e.slice(s.length)||"/",m=gu({path:u.relativePath,caseSensitive:u.caseSensitive,end:c},d),g=u.route;if(!m)return null;Object.assign(i,m.params),o.push({params:i,pathname:Ar([s,m.pathname]),pathnameBase:tP(Ar([s,m.pathnameBase])),route:g}),m.pathnameBase!=="/"&&(s=Ar([s,m.pathnameBase]))}return o}function gu(t,e){typeof t=="string"&&(t={path:t,caseSensitive:!1,end:!0});let[n,r]=QR(t.path,t.caseSensitive,t.end),i=e.match(n);if(!i)return null;let s=i[0],o=s.replace(/(.)\/+$/,"$1"),l=i.slice(1);return{params:r.reduce((c,d,m)=>{let{paramName:g,isOptional:I}=d;if(g==="*"){let C=l[m]||"";o=s.slice(0,s.length-C.length).replace(/(.)\/+$/,"$1")}const R=l[m];return I&&!R?c[g]=void 0:c[g]=(R||"").replace(/%2F/g,"/"),c},{}),pathname:s,pathnameBase:o,pattern:t}}function QR(t,e,n){e===void 0&&(e=!1),n===void 0&&(n=!0),gp(t==="*"||!t.endsWith("*")||t.endsWith("/*"),'Route path "'+t+'" will be treated as if it were '+('"'+t.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+t.replace(/\*$/,"/*")+'".'));let r=[],i="^"+t.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,l,u)=>(r.push({paramName:l,isOptional:u!=null}),u?"/?([^\\/]+)?":"/([^\\/]+)"));return t.endsWith("*")?(r.push({paramName:"*"}),i+=t==="*"||t==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?i+="\\/*$":t!==""&&t!=="/"&&(i+="(?:(?=\\/|$))"),[new RegExp(i,e?void 0:"i"),r]}function YR(t){try{return t.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return gp(!1,'The URL path "'+t+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+e+").")),t}}function fs(t,e){if(e==="/")return t;if(!t.toLowerCase().startsWith(e.toLowerCase()))return null;let n=e.endsWith("/")?e.length-1:e.length,r=t.charAt(n);return r&&r!=="/"?null:t.slice(n)||"/"}const XR=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,JR=t=>XR.test(t);function ZR(t,e){e===void 0&&(e="/");let{pathname:n,search:r="",hash:i=""}=typeof t=="string"?Rs(t):t,s;if(n)if(JR(n))s=n;else{if(n.includes("//")){let o=n;n=n.replace(/\/\/+/g,"/"),gp(!1,"Pathnames cannot have embedded double slashes - normalizing "+(o+" -> "+n))}n.startsWith("/")?s=qy(n.substring(1),"/"):s=qy(n,e)}else s=e;return{pathname:s,search:nP(r),hash:rP(i)}}function qy(t,e){let n=e.replace(/\/+$/,"").split("/");return t.split("/").forEach(i=>{i===".."?n.length>1&&n.pop():i!=="."&&n.push(i)}),n.length>1?n.join("/"):"/"}function Sh(t,e,n,r){return"Cannot include a '"+t+"' character in a manually specified "+("`to."+e+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function eP(t){return t.filter((e,n)=>n===0||e.route.path&&e.route.path.length>0)}function yp(t,e){let n=eP(t);return e?n.map((r,i)=>i===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function _p(t,e,n,r){r===void 0&&(r=!1);let i;typeof t=="string"?i=Rs(t):(i=Yo({},t),Ae(!i.pathname||!i.pathname.includes("?"),Sh("?","pathname","search",i)),Ae(!i.pathname||!i.pathname.includes("#"),Sh("#","pathname","hash",i)),Ae(!i.search||!i.search.includes("#"),Sh("#","search","hash",i)));let s=t===""||i.pathname==="",o=s?"/":i.pathname,l;if(o==null)l=n;else{let m=e.length-1;if(!r&&o.startsWith("..")){let g=o.split("/");for(;g[0]==="..";)g.shift(),m-=1;i.pathname=g.join("/")}l=m>=0?e[m]:"/"}let u=ZR(i,l),c=o&&o!=="/"&&o.endsWith("/"),d=(s||o===".")&&n.endsWith("/");return!u.pathname.endsWith("/")&&(c||d)&&(u.pathname+="/"),u}const Ar=t=>t.join("/").replace(/\/\/+/g,"/"),tP=t=>t.replace(/\/+$/,"").replace(/^\/*/,"/"),nP=t=>!t||t==="?"?"":t.startsWith("?")?t:"?"+t,rP=t=>!t||t==="#"?"":t.startsWith("#")?t:"#"+t;function iP(t){return t!=null&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.internal=="boolean"&&"data"in t}const sT=["post","put","patch","delete"];new Set(sT);const sP=["get",...sT];new Set(sP);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Xo(){return Xo=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Xo.apply(this,arguments)}const Zu=L.createContext(null),oT=L.createContext(null),Qn=L.createContext(null),ec=L.createContext(null),Yn=L.createContext({outlet:null,matches:[],isDataRoute:!1}),aT=L.createContext(null);function oP(t,e){let{relative:n}=e===void 0?{}:e;Ps()||Ae(!1);let{basename:r,navigator:i}=L.useContext(Qn),{hash:s,pathname:o,search:l}=tc(t,{relative:n}),u=o;return r!=="/"&&(u=o==="/"?r:Ar([r,o])),i.createHref({pathname:u,search:l,hash:s})}function Ps(){return L.useContext(ec)!=null}function pn(){return Ps()||Ae(!1),L.useContext(ec).location}function lT(t){L.useContext(Qn).static||L.useLayoutEffect(t)}function vp(){let{isDataRoute:t}=L.useContext(Yn);return t?vP():aP()}function aP(){Ps()||Ae(!1);let t=L.useContext(Zu),{basename:e,future:n,navigator:r}=L.useContext(Qn),{matches:i}=L.useContext(Yn),{pathname:s}=pn(),o=JSON.stringify(yp(i,n.v7_relativeSplatPath)),l=L.useRef(!1);return lT(()=>{l.current=!0}),L.useCallback(function(c,d){if(d===void 0&&(d={}),!l.current)return;if(typeof c=="number"){r.go(c);return}let m=_p(c,JSON.parse(o),s,d.relative==="path");t==null&&e!=="/"&&(m.pathname=m.pathname==="/"?e:Ar([e,m.pathname])),(d.replace?r.replace:r.push)(m,d.state,d)},[e,r,o,s,t])}function Dj(){let{matches:t}=L.useContext(Yn),e=t[t.length-1];return e?e.params:{}}function tc(t,e){let{relative:n}=e===void 0?{}:e,{future:r}=L.useContext(Qn),{matches:i}=L.useContext(Yn),{pathname:s}=pn(),o=JSON.stringify(yp(i,r.v7_relativeSplatPath));return L.useMemo(()=>_p(t,JSON.parse(o),s,n==="path"),[t,o,s,n])}function lP(t,e){return uP(t,e)}function uP(t,e,n,r){Ps()||Ae(!1);let{navigator:i}=L.useContext(Qn),{matches:s}=L.useContext(Yn),o=s[s.length-1],l=o?o.params:{};o&&o.pathname;let u=o?o.pathnameBase:"/";o&&o.route;let c=pn(),d;if(e){var m;let b=typeof e=="string"?Rs(e):e;u==="/"||(m=b.pathname)!=null&&m.startsWith(u)||Ae(!1),d=b}else d=c;let g=d.pathname||"/",I=g;if(u!=="/"){let b=u.replace(/^\//,"").split("/");I="/"+g.replace(/^\//,"").split("/").slice(b.length).join("/")}let R=MR(t,{pathname:I}),C=pP(R&&R.map(b=>Object.assign({},b,{params:Object.assign({},l,b.params),pathname:Ar([u,i.encodeLocation?i.encodeLocation(b.pathname).pathname:b.pathname]),pathnameBase:b.pathnameBase==="/"?u:Ar([u,i.encodeLocation?i.encodeLocation(b.pathnameBase).pathname:b.pathnameBase])})),s,n,r);return e&&C?L.createElement(ec.Provider,{value:{location:Xo({pathname:"/",search:"",hash:"",state:null,key:"default"},d),navigationType:mr.Pop}},C):C}function cP(){let t=_P(),e=iP(t)?t.status+" "+t.statusText:t instanceof Error?t.message:JSON.stringify(t),n=t instanceof Error?t.stack:null,i={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return L.createElement(L.Fragment,null,L.createElement("h2",null,"Unexpected Application Error!"),L.createElement("h3",{style:{fontStyle:"italic"}},e),n?L.createElement("pre",{style:i},n):null,null)}const hP=L.createElement(cP,null);class dP extends L.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,n){return n.location!==e.location||n.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:n.error,location:n.location,revalidation:e.revalidation||n.revalidation}}componentDidCatch(e,n){console.error("React Router caught the following error during render",e,n)}render(){return this.state.error!==void 0?L.createElement(Yn.Provider,{value:this.props.routeContext},L.createElement(aT.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function fP(t){let{routeContext:e,match:n,children:r}=t,i=L.useContext(Zu);return i&&i.static&&i.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(i.staticContext._deepestRenderedBoundaryId=n.route.id),L.createElement(Yn.Provider,{value:e},r)}function pP(t,e,n,r){var i;if(e===void 0&&(e=[]),n===void 0&&(n=null),r===void 0&&(r=null),t==null){var s;if(!n)return null;if(n.errors)t=n.matches;else if((s=r)!=null&&s.v7_partialHydration&&e.length===0&&!n.initialized&&n.matches.length>0)t=n.matches;else return null}let o=t,l=(i=n)==null?void 0:i.errors;if(l!=null){let d=o.findIndex(m=>m.route.id&&(l==null?void 0:l[m.route.id])!==void 0);d>=0||Ae(!1),o=o.slice(0,Math.min(o.length,d+1))}let u=!1,c=-1;if(n&&r&&r.v7_partialHydration)for(let d=0;d<o.length;d++){let m=o[d];if((m.route.HydrateFallback||m.route.hydrateFallbackElement)&&(c=d),m.route.id){let{loaderData:g,errors:I}=n,R=m.route.loader&&g[m.route.id]===void 0&&(!I||I[m.route.id]===void 0);if(m.route.lazy||R){u=!0,c>=0?o=o.slice(0,c+1):o=[o[0]];break}}}return o.reduceRight((d,m,g)=>{let I,R=!1,C=null,b=null;n&&(I=l&&m.route.id?l[m.route.id]:void 0,C=m.route.errorElement||hP,u&&(c<0&&g===0?(wP("route-fallback"),R=!0,b=null):c===g&&(R=!0,b=m.route.hydrateFallbackElement||null)));let k=e.concat(o.slice(0,g+1)),w=()=>{let v;return I?v=C:R?v=b:m.route.Component?v=L.createElement(m.route.Component,null):m.route.element?v=m.route.element:v=d,L.createElement(fP,{match:m,routeContext:{outlet:d,matches:k,isDataRoute:n!=null},children:v})};return n&&(m.route.ErrorBoundary||m.route.errorElement||g===0)?L.createElement(dP,{location:n.location,revalidation:n.revalidation,component:C,error:I,children:w(),routeContext:{outlet:null,matches:k,isDataRoute:!0}}):w()},null)}var uT=function(t){return t.UseBlocker="useBlocker",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t}(uT||{}),cT=function(t){return t.UseBlocker="useBlocker",t.UseLoaderData="useLoaderData",t.UseActionData="useActionData",t.UseRouteError="useRouteError",t.UseNavigation="useNavigation",t.UseRouteLoaderData="useRouteLoaderData",t.UseMatches="useMatches",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t.UseRouteId="useRouteId",t}(cT||{});function mP(t){let e=L.useContext(Zu);return e||Ae(!1),e}function gP(t){let e=L.useContext(oT);return e||Ae(!1),e}function yP(t){let e=L.useContext(Yn);return e||Ae(!1),e}function hT(t){let e=yP(),n=e.matches[e.matches.length-1];return n.route.id||Ae(!1),n.route.id}function _P(){var t;let e=L.useContext(aT),n=gP(),r=hT();return e!==void 0?e:(t=n.errors)==null?void 0:t[r]}function vP(){let{router:t}=mP(uT.UseNavigateStable),e=hT(cT.UseNavigateStable),n=L.useRef(!1);return lT(()=>{n.current=!0}),L.useCallback(function(i,s){s===void 0&&(s={}),n.current&&(typeof i=="number"?t.navigate(i):t.navigate(i,Xo({fromRouteId:e},s)))},[t,e])}const Ky={};function wP(t,e,n){Ky[t]||(Ky[t]=!0)}function EP(t,e){t==null||t.v7_startTransition,t==null||t.v7_relativeSplatPath}function si(t){let{to:e,replace:n,state:r,relative:i}=t;Ps()||Ae(!1);let{future:s,static:o}=L.useContext(Qn),{matches:l}=L.useContext(Yn),{pathname:u}=pn(),c=vp(),d=_p(e,yp(l,s.v7_relativeSplatPath),u,i==="path"),m=JSON.stringify(d);return L.useEffect(()=>c(JSON.parse(m),{replace:n,state:r,relative:i}),[c,m,i,n,r]),null}function ue(t){Ae(!1)}function TP(t){let{basename:e="/",children:n=null,location:r,navigationType:i=mr.Pop,navigator:s,static:o=!1,future:l}=t;Ps()&&Ae(!1);let u=e.replace(/^\/*/,"/"),c=L.useMemo(()=>({basename:u,navigator:s,static:o,future:Xo({v7_relativeSplatPath:!1},l)}),[u,l,s,o]);typeof r=="string"&&(r=Rs(r));let{pathname:d="/",search:m="",hash:g="",state:I=null,key:R="default"}=r,C=L.useMemo(()=>{let b=fs(d,u);return b==null?null:{location:{pathname:b,search:m,hash:g,state:I,key:R},navigationType:i}},[u,d,m,g,I,R,i]);return C==null?null:L.createElement(Qn.Provider,{value:c},L.createElement(ec.Provider,{children:n,value:C}))}function IP(t){let{children:e,location:n}=t;return lP(Ud(e),n)}new Promise(()=>{});function Ud(t,e){e===void 0&&(e=[]);let n=[];return L.Children.forEach(t,(r,i)=>{if(!L.isValidElement(r))return;let s=[...e,i];if(r.type===L.Fragment){n.push.apply(n,Ud(r.props.children,s));return}r.type!==ue&&Ae(!1),!r.props.index||!r.props.children||Ae(!1);let o={id:r.props.id||s.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(o.children=Ud(r.props.children,s)),n.push(o)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function yu(){return yu=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},yu.apply(this,arguments)}function dT(t,e){if(t==null)return{};var n={},r=Object.keys(t),i,s;for(s=0;s<r.length;s++)i=r[s],!(e.indexOf(i)>=0)&&(n[i]=t[i]);return n}function SP(t){return!!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}function AP(t,e){return t.button===0&&(!e||e==="_self")&&!SP(t)}function Fd(t){return t===void 0&&(t=""),new URLSearchParams(typeof t=="string"||Array.isArray(t)||t instanceof URLSearchParams?t:Object.keys(t).reduce((e,n)=>{let r=t[n];return e.concat(Array.isArray(r)?r.map(i=>[n,i]):[[n,r]])},[]))}function kP(t,e){let n=Fd(t);return e&&e.forEach((r,i)=>{n.has(i)||e.getAll(i).forEach(s=>{n.append(i,s)})}),n}const RP=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],PP=["aria-current","caseSensitive","className","end","style","to","viewTransition","children"],CP="6";try{window.__reactRouterVersion=CP}catch{}const NP=L.createContext({isTransitioning:!1}),xP="startTransition",Gy=TA[xP];function bP(t){let{basename:e,children:n,future:r,window:i}=t,s=L.useRef();s.current==null&&(s.current=OR({window:i,v5Compat:!0}));let o=s.current,[l,u]=L.useState({action:o.action,location:o.location}),{v7_startTransition:c}=r||{},d=L.useCallback(m=>{c&&Gy?Gy(()=>u(m)):u(m)},[u,c]);return L.useLayoutEffect(()=>o.listen(d),[o,d]),L.useEffect(()=>EP(r),[r]),L.createElement(TP,{basename:e,children:n,location:l.location,navigationType:l.action,navigator:o,future:r})}const DP=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",OP=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Me=L.forwardRef(function(e,n){let{onClick:r,relative:i,reloadDocument:s,replace:o,state:l,target:u,to:c,preventScrollReset:d,viewTransition:m}=e,g=dT(e,RP),{basename:I}=L.useContext(Qn),R,C=!1;if(typeof c=="string"&&OP.test(c)&&(R=c,DP))try{let v=new URL(window.location.href),O=c.startsWith("//")?new URL(v.protocol+c):new URL(c),U=fs(O.pathname,I);O.origin===v.origin&&U!=null?c=U+O.search+O.hash:C=!0}catch{}let b=oP(c,{relative:i}),k=VP(c,{replace:o,state:l,target:u,preventScrollReset:d,relative:i,viewTransition:m});function w(v){r&&r(v),v.defaultPrevented||k(v)}return L.createElement("a",yu({},g,{href:R||b,onClick:C||s?r:w,ref:n,target:u}))}),Oj=L.forwardRef(function(e,n){let{"aria-current":r="page",caseSensitive:i=!1,className:s="",end:o=!1,style:l,to:u,viewTransition:c,children:d}=e,m=dT(e,PP),g=tc(u,{relative:m.relative}),I=pn(),R=L.useContext(oT),{navigator:C,basename:b}=L.useContext(Qn),k=R!=null&&jP(g)&&c===!0,w=C.encodeLocation?C.encodeLocation(g).pathname:g.pathname,v=I.pathname,O=R&&R.navigation&&R.navigation.location?R.navigation.location.pathname:null;i||(v=v.toLowerCase(),O=O?O.toLowerCase():null,w=w.toLowerCase()),O&&b&&(O=fs(O,b)||O);const U=w!=="/"&&w.endsWith("/")?w.length-1:w.length;let x=v===w||!o&&v.startsWith(w)&&v.charAt(U)==="/",E=O!=null&&(O===w||!o&&O.startsWith(w)&&O.charAt(w.length)==="/"),_={isActive:x,isPending:E,isTransitioning:k},T=x?r:void 0,A;typeof s=="function"?A=s(_):A=[s,x?"active":null,E?"pending":null,k?"transitioning":null].filter(Boolean).join(" ");let P=typeof l=="function"?l(_):l;return L.createElement(Me,yu({},m,{"aria-current":T,className:A,ref:n,style:P,to:u,viewTransition:c}),typeof d=="function"?d(_):d)});var Bd;(function(t){t.UseScrollRestoration="useScrollRestoration",t.UseSubmit="useSubmit",t.UseSubmitFetcher="useSubmitFetcher",t.UseFetcher="useFetcher",t.useViewTransitionState="useViewTransitionState"})(Bd||(Bd={}));var Qy;(function(t){t.UseFetcher="useFetcher",t.UseFetchers="useFetchers",t.UseScrollRestoration="useScrollRestoration"})(Qy||(Qy={}));function LP(t){let e=L.useContext(Zu);return e||Ae(!1),e}function VP(t,e){let{target:n,replace:r,state:i,preventScrollReset:s,relative:o,viewTransition:l}=e===void 0?{}:e,u=vp(),c=pn(),d=tc(t,{relative:o});return L.useCallback(m=>{if(AP(m,n)){m.preventDefault();let g=r!==void 0?r:mu(c)===mu(d);u(t,{replace:g,state:i,preventScrollReset:s,relative:o,viewTransition:l})}},[c,u,d,r,i,n,t,s,o,l])}function MP(t){let e=L.useRef(Fd(t)),n=L.useRef(!1),r=pn(),i=L.useMemo(()=>kP(r.search,n.current?null:e.current),[r.search]),s=vp(),o=L.useCallback((l,u)=>{const c=Fd(typeof l=="function"?l(i):l);n.current=!0,s("?"+c,u)},[s,i]);return[i,o]}function jP(t,e){e===void 0&&(e={});let n=L.useContext(NP);n==null&&Ae(!1);let{basename:r}=LP(Bd.useViewTransitionState),i=tc(t,{relative:e.relative});if(!n.isTransitioning)return!1;let s=fs(n.currentLocation.pathname,r)||n.currentLocation.pathname,o=fs(n.nextLocation.pathname,r)||n.nextLocation.pathname;return gu(i.pathname,o)!=null||gu(i.pathname,s)!=null}const UP="modulepreload",FP=function(t){return"/"+t},Yy={},Pe=function(e,n,r){let i=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=Promise.allSettled(n.map(u=>{if(u=FP(u),u in Yy)return;Yy[u]=!0;const c=u.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${d}`))return;const m=document.createElement("link");if(m.rel=c?"stylesheet":UP,c||(m.as="script"),m.crossOrigin="",m.href=u,l&&m.setAttribute("nonce",l),document.head.appendChild(m),c)return new Promise((g,I)=>{m.addEventListener("load",g),m.addEventListener("error",()=>I(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return i.then(o=>{for(const l of o||[])l.status==="rejected"&&s(l.reason);return e().catch(s)})};var Xy={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fT=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},BP=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],l=t[n++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},wp={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,l=o?t[i+1]:0,u=i+2<t.length,c=u?t[i+2]:0,d=s>>2,m=(s&3)<<4|l>>4;let g=(l&15)<<2|c>>6,I=c&63;u||(I=64,o||(g=64)),r.push(n[d],n[m],n[g],n[I])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(fT(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):BP(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],l=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const m=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||l==null||c==null||m==null)throw new $P;const g=s<<2|l>>4;if(r.push(g),c!==64){const I=l<<4&240|c>>2;if(r.push(I),m!==64){const R=c<<6&192|m;r.push(R)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class $P extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const zP=function(t){const e=fT(t);return wp.encodeByteArray(e,!0)},_u=function(t){return zP(t).replace(/\./g,"")},pT=function(t){try{return wp.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WP(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const HP=()=>WP().__FIREBASE_DEFAULTS__,qP=()=>{if(typeof process>"u"||typeof Xy>"u")return;const t=Xy.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},KP=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&pT(t[1]);return e&&JSON.parse(e)},nc=()=>{try{return HP()||qP()||KP()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},mT=t=>{var e,n;return(n=(e=nc())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},Ep=t=>{const e=mT(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},gT=()=>{var t;return(t=nc())===null||t===void 0?void 0:t.config},yT=t=>{var e;return(e=nc())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $d{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _T(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[_u(JSON.stringify(n)),_u(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function GP(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(mt())}function QP(){var t;const e=(t=nc())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function YP(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Tp(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function XP(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function JP(){const t=mt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function ZP(){return!QP()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function rc(){try{return typeof indexedDB=="object"}catch{return!1}}function Ip(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}function vT(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eC="FirebaseError";class zt extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=eC,Object.setPrototypeOf(this,zt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ur.prototype.create)}}class Ur{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?tC(s,r):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new zt(i,l,r)}}function tC(t,e){return t.replace(nC,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const nC=/\{\$([^}]+)}/g;function rC(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ps(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(Jy(s)&&Jy(o)){if(!ps(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function Jy(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pa(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function lo(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function uo(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function iC(t,e){const n=new sC(t,e);return n.subscribe.bind(n)}class sC{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");oC(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Ah),i.error===void 0&&(i.error=Ah),i.complete===void 0&&(i.complete=Ah);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function oC(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Ah(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aC=1e3,lC=2,uC=4*60*60*1e3,cC=.5;function Zy(t,e=aC,n=lC){const r=e*Math.pow(n,t),i=Math.round(cC*r*(Math.random()-.5)*2);return Math.min(uC,r+i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ie(t){return t&&t._delegate?t._delegate:t}class Et{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hC{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new $d;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(fC(e))try{this.getOrInitializeService({instanceIdentifier:Yr})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Yr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Yr){return this.instances.has(e)}getOptions(e=Yr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&o.resolve(i)}return i}onInit(e,n){var r;const i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:dC(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Yr){return this.component?this.component.multipleInstances?e:Yr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function dC(t){return t===Yr?void 0:t}function fC(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pC{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new hC(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ne;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(ne||(ne={}));const mC={debug:ne.DEBUG,verbose:ne.VERBOSE,info:ne.INFO,warn:ne.WARN,error:ne.ERROR,silent:ne.SILENT},gC=ne.INFO,yC={[ne.DEBUG]:"log",[ne.VERBOSE]:"log",[ne.INFO]:"info",[ne.WARN]:"warn",[ne.ERROR]:"error"},_C=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=yC[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ma{constructor(e){this.name=e,this._logLevel=gC,this._logHandler=_C,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ne))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?mC[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ne.DEBUG,...e),this._logHandler(this,ne.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ne.VERBOSE,...e),this._logHandler(this,ne.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ne.INFO,...e),this._logHandler(this,ne.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ne.WARN,...e),this._logHandler(this,ne.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ne.ERROR,...e),this._logHandler(this,ne.ERROR,...e)}}const vC=(t,e)=>e.some(n=>t instanceof n);let e_,t_;function wC(){return e_||(e_=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function EC(){return t_||(t_=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const wT=new WeakMap,zd=new WeakMap,ET=new WeakMap,kh=new WeakMap,Sp=new WeakMap;function TC(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(kr(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&wT.set(n,t)}).catch(()=>{}),Sp.set(e,t),e}function IC(t){if(zd.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});zd.set(t,e)}let Wd={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return zd.get(t);if(e==="objectStoreNames")return t.objectStoreNames||ET.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return kr(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function SC(t){Wd=t(Wd)}function AC(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Rh(this),e,...n);return ET.set(r,e.sort?e.sort():[e]),kr(r)}:EC().includes(t)?function(...e){return t.apply(Rh(this),e),kr(wT.get(this))}:function(...e){return kr(t.apply(Rh(this),e))}}function kC(t){return typeof t=="function"?AC(t):(t instanceof IDBTransaction&&IC(t),vC(t,wC())?new Proxy(t,Wd):t)}function kr(t){if(t instanceof IDBRequest)return TC(t);if(kh.has(t))return kh.get(t);const e=kC(t);return e!==t&&(kh.set(t,e),Sp.set(e,t)),e}const Rh=t=>Sp.get(t);function TT(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),l=kr(o);return r&&o.addEventListener("upgradeneeded",u=>{r(kr(o.result),u.oldVersion,u.newVersion,kr(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),l}const RC=["get","getKey","getAll","getAllKeys","count"],PC=["put","add","delete","clear"],Ph=new Map;function n_(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Ph.get(e))return Ph.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=PC.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||RC.includes(n)))return;const s=async function(o,...l){const u=this.transaction(o,i?"readwrite":"readonly");let c=u.store;return r&&(c=c.index(l.shift())),(await Promise.all([c[n](...l),i&&u.done]))[0]};return Ph.set(e,s),s}SC(t=>({...t,get:(e,n,r)=>n_(e,n)||t.get(e,n,r),has:(e,n)=>!!n_(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CC{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(NC(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function NC(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Hd="@firebase/app",r_="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wn=new ma("@firebase/app"),xC="@firebase/app-compat",bC="@firebase/analytics-compat",DC="@firebase/analytics",OC="@firebase/app-check-compat",LC="@firebase/app-check",VC="@firebase/auth",MC="@firebase/auth-compat",jC="@firebase/database",UC="@firebase/data-connect",FC="@firebase/database-compat",BC="@firebase/functions",$C="@firebase/functions-compat",zC="@firebase/installations",WC="@firebase/installations-compat",HC="@firebase/messaging",qC="@firebase/messaging-compat",KC="@firebase/performance",GC="@firebase/performance-compat",QC="@firebase/remote-config",YC="@firebase/remote-config-compat",XC="@firebase/storage",JC="@firebase/storage-compat",ZC="@firebase/firestore",e1="@firebase/vertexai-preview",t1="@firebase/firestore-compat",n1="firebase",r1="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qd="[DEFAULT]",i1={[Hd]:"fire-core",[xC]:"fire-core-compat",[DC]:"fire-analytics",[bC]:"fire-analytics-compat",[LC]:"fire-app-check",[OC]:"fire-app-check-compat",[VC]:"fire-auth",[MC]:"fire-auth-compat",[jC]:"fire-rtdb",[UC]:"fire-data-connect",[FC]:"fire-rtdb-compat",[BC]:"fire-fn",[$C]:"fire-fn-compat",[zC]:"fire-iid",[WC]:"fire-iid-compat",[HC]:"fire-fcm",[qC]:"fire-fcm-compat",[KC]:"fire-perf",[GC]:"fire-perf-compat",[QC]:"fire-rc",[YC]:"fire-rc-compat",[XC]:"fire-gcs",[JC]:"fire-gcs-compat",[ZC]:"fire-fst",[t1]:"fire-fst-compat",[e1]:"fire-vertex","fire-js":"fire-js",[n1]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jo=new Map,s1=new Map,Kd=new Map;function i_(t,e){try{t.container.addComponent(e)}catch(n){Wn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function xt(t){const e=t.name;if(Kd.has(e))return Wn.debug(`There were multiple attempts to register component ${e}.`),!1;Kd.set(e,t);for(const n of Jo.values())i_(n,t);for(const n of s1.values())i_(n,t);return!0}function Xn(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function an(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const o1={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Rr=new Ur("app","Firebase",o1);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a1{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Et("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Rr.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Si=r1;function IT(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:qd,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw Rr.create("bad-app-name",{appName:String(i)});if(n||(n=gT()),!n)throw Rr.create("no-options");const s=Jo.get(i);if(s){if(ps(n,s.options)&&ps(r,s.config))return s;throw Rr.create("duplicate-app",{appName:i})}const o=new pC(i);for(const u of Kd.values())o.addComponent(u);const l=new a1(n,r,o);return Jo.set(i,l),l}function ga(t=qd){const e=Jo.get(t);if(!e&&t===qd&&gT())return IT();if(!e)throw Rr.create("no-app",{appName:t});return e}function s_(){return Array.from(Jo.values())}function Je(t,e,n){var r;let i=(r=i1[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${i}" with version "${e}":`];s&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Wn.warn(l.join(" "));return}xt(new Et(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const l1="firebase-heartbeat-database",u1=1,Zo="firebase-heartbeat-store";let Ch=null;function ST(){return Ch||(Ch=TT(l1,u1,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Zo)}catch(n){console.warn(n)}}}}).catch(t=>{throw Rr.create("idb-open",{originalErrorMessage:t.message})})),Ch}async function c1(t){try{const n=(await ST()).transaction(Zo),r=await n.objectStore(Zo).get(AT(t));return await n.done,r}catch(e){if(e instanceof zt)Wn.warn(e.message);else{const n=Rr.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Wn.warn(n.message)}}}async function o_(t,e){try{const r=(await ST()).transaction(Zo,"readwrite");await r.objectStore(Zo).put(e,AT(t)),await r.done}catch(n){if(n instanceof zt)Wn.warn(n.message);else{const r=Rr.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Wn.warn(r.message)}}}function AT(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const h1=1024,d1=30*24*60*60*1e3;class f1{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new m1(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=a_();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=d1}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Wn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=a_(),{heartbeatsToSend:r,unsentEntries:i}=p1(this._heartbeatsCache.heartbeats),s=_u(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Wn.warn(n),""}}}function a_(){return new Date().toISOString().substring(0,10)}function p1(t,e=h1){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),l_(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),l_(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class m1{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return rc()?Ip().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await c1(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return o_(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return o_(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function l_(t){return _u(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g1(t){xt(new Et("platform-logger",e=>new CC(e),"PRIVATE")),xt(new Et("heartbeat",e=>new f1(e),"PRIVATE")),Je(Hd,r_,t),Je(Hd,r_,"esm2017"),Je("fire-js","")}g1("");function Ap(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(t);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(t,r[i])&&(n[r[i]]=t[r[i]]);return n}function kT(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const y1=kT,RT=new Ur("auth","Firebase",kT());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vu=new ma("@firebase/auth");function _1(t,...e){vu.logLevel<=ne.WARN&&vu.warn(`Auth (${Si}): ${t}`,...e)}function Ol(t,...e){vu.logLevel<=ne.ERROR&&vu.error(`Auth (${Si}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function en(t,...e){throw Rp(t,...e)}function cn(t,...e){return Rp(t,...e)}function kp(t,e,n){const r=Object.assign(Object.assign({},y1()),{[e]:n});return new Ur("auth","Firebase",r).create(e,{appName:t.name})}function Un(t){return kp(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function v1(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&en(t,"argument-error"),kp(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Rp(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return RT.create(t,...e)}function Y(t,e,...n){if(!t)throw Rp(e,...n)}function Ln(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Ol(e),new Error(e)}function Hn(t,e){t||Ln(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gd(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function w1(){return u_()==="http:"||u_()==="https:"}function u_(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function E1(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(w1()||Tp()||"connection"in navigator)?navigator.onLine:!0}function T1(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ya{constructor(e,n){this.shortDelay=e,this.longDelay=n,Hn(n>e,"Short delay should be less than long delay!"),this.isMobile=GP()||XP()}get(){return E1()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pp(t,e){Hn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PT{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ln("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ln("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ln("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I1={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S1=new ya(3e4,6e4);function Fr(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Pn(t,e,n,r,i={}){return CT(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const l=pa(Object.assign({key:t.config.apiKey},o)).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const c=Object.assign({method:e,headers:u},s);return YP()||(c.referrerPolicy="no-referrer"),PT.fetch()(NT(t,t.config.apiHost,n,l),c)})}async function CT(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},I1),e);try{const i=new k1(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw dl(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[u,c]=l.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw dl(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw dl(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw dl(t,"user-disabled",o);const d=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw kp(t,d,c);en(t,d)}}catch(i){if(i instanceof zt)throw i;en(t,"network-request-failed",{message:String(i)})}}async function _a(t,e,n,r,i={}){const s=await Pn(t,e,n,r,i);return"mfaPendingCredential"in s&&en(t,"multi-factor-auth-required",{_serverResponse:s}),s}function NT(t,e,n,r){const i=`${e}${n}?${r}`;return t.config.emulator?Pp(t.config,i):`${t.config.apiScheme}://${i}`}function A1(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class k1{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(cn(this.auth,"network-request-failed")),S1.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function dl(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=cn(t,e,r);return i.customData._tokenResponse=n,i}function c_(t){return t!==void 0&&t.enterprise!==void 0}class R1{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return A1(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function P1(t,e){return Pn(t,"GET","/v2/recaptchaConfig",Fr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function C1(t,e){return Pn(t,"POST","/v1/accounts:delete",e)}async function xT(t,e){return Pn(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ao(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function N1(t,e=!1){const n=ie(t),r=await n.getIdToken(e),i=Cp(r);Y(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Ao(Nh(i.auth_time)),issuedAtTime:Ao(Nh(i.iat)),expirationTime:Ao(Nh(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Nh(t){return Number(t)*1e3}function Cp(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Ol("JWT malformed, contained fewer than 3 sections"),null;try{const i=pT(n);return i?JSON.parse(i):(Ol("Failed to decode base64 JWT payload"),null)}catch(i){return Ol("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function h_(t){const e=Cp(t);return Y(e,"internal-error"),Y(typeof e.exp<"u","internal-error"),Y(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fi(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof zt&&x1(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function x1({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b1{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qd{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ao(this.lastLoginAt),this.creationTime=Ao(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wu(t){var e;const n=t.auth,r=await t.getIdToken(),i=await fi(t,xT(n,{idToken:r}));Y(i==null?void 0:i.users.length,n,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?bT(s.providerUserInfo):[],l=O1(t.providerData,o),u=t.isAnonymous,c=!(t.email&&s.passwordHash)&&!(l!=null&&l.length),d=u?c:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new Qd(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(t,m)}async function D1(t){const e=ie(t);await wu(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function O1(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function bT(t){return t.map(e=>{var{providerId:n}=e,r=Ap(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function L1(t,e){const n=await CT(t,{},async()=>{const r=pa({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=NT(t,i,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",PT.fetch()(o,{method:"POST",headers:l,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function V1(t,e){return Pn(t,"POST","/v2/accounts:revokeToken",Fr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ts{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Y(e.idToken,"internal-error"),Y(typeof e.idToken<"u","internal-error"),Y(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):h_(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){Y(e.length!==0,"internal-error");const n=h_(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(Y(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await L1(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new ts;return r&&(Y(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(Y(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(Y(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ts,this.toJSON())}_performRefresh(){return Ln("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rr(t,e){Y(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Vn{constructor(e){var{uid:n,auth:r,stsTokenManager:i}=e,s=Ap(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new b1(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Qd(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await fi(this,this.stsTokenManager.getToken(this.auth,e));return Y(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return N1(this,e)}reload(){return D1(this)}_assign(e){this!==e&&(Y(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Vn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){Y(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await wu(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(an(this.auth.app))return Promise.reject(Un(this.auth));const e=await this.getIdToken();return await fi(this,C1(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,i,s,o,l,u,c,d;const m=(r=n.displayName)!==null&&r!==void 0?r:void 0,g=(i=n.email)!==null&&i!==void 0?i:void 0,I=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,R=(o=n.photoURL)!==null&&o!==void 0?o:void 0,C=(l=n.tenantId)!==null&&l!==void 0?l:void 0,b=(u=n._redirectEventId)!==null&&u!==void 0?u:void 0,k=(c=n.createdAt)!==null&&c!==void 0?c:void 0,w=(d=n.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:v,emailVerified:O,isAnonymous:U,providerData:x,stsTokenManager:E}=n;Y(v&&E,e,"internal-error");const _=ts.fromJSON(this.name,E);Y(typeof v=="string",e,"internal-error"),rr(m,e.name),rr(g,e.name),Y(typeof O=="boolean",e,"internal-error"),Y(typeof U=="boolean",e,"internal-error"),rr(I,e.name),rr(R,e.name),rr(C,e.name),rr(b,e.name),rr(k,e.name),rr(w,e.name);const T=new Vn({uid:v,auth:e,email:g,emailVerified:O,displayName:m,isAnonymous:U,photoURL:R,phoneNumber:I,tenantId:C,stsTokenManager:_,createdAt:k,lastLoginAt:w});return x&&Array.isArray(x)&&(T.providerData=x.map(A=>Object.assign({},A))),b&&(T._redirectEventId=b),T}static async _fromIdTokenResponse(e,n,r=!1){const i=new ts;i.updateFromServerResponse(n);const s=new Vn({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await wu(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];Y(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?bT(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),l=new ts;l.updateFromIdToken(r);const u=new Vn({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Qd(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,c),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const d_=new Map;function Mn(t){Hn(t instanceof Function,"Expected a class definition");let e=d_.get(t);return e?(Hn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,d_.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DT{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}DT.type="NONE";const f_=DT;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ll(t,e,n){return`firebase:${t}:${e}:${n}`}class ns{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Ll(this.userKey,i.apiKey,s),this.fullPersistenceKey=Ll("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Vn._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new ns(Mn(f_),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||Mn(f_);const o=Ll(r,e.config.apiKey,e.name);let l=null;for(const c of n)try{const d=await c._get(o);if(d){const m=Vn._fromJSON(e,d);c!==s&&(l=m),s=c;break}}catch{}const u=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new ns(s,e,r):(s=u[0],l&&await s._set(o,l.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(o)}catch{}})),new ns(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p_(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(MT(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(OT(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(UT(e))return"Blackberry";if(FT(e))return"Webos";if(LT(e))return"Safari";if((e.includes("chrome/")||VT(e))&&!e.includes("edge/"))return"Chrome";if(jT(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function OT(t=mt()){return/firefox\//i.test(t)}function LT(t=mt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function VT(t=mt()){return/crios\//i.test(t)}function MT(t=mt()){return/iemobile/i.test(t)}function jT(t=mt()){return/android/i.test(t)}function UT(t=mt()){return/blackberry/i.test(t)}function FT(t=mt()){return/webos/i.test(t)}function Np(t=mt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function M1(t=mt()){var e;return Np(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function j1(){return JP()&&document.documentMode===10}function BT(t=mt()){return Np(t)||jT(t)||FT(t)||UT(t)||/windows phone/i.test(t)||MT(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $T(t,e=[]){let n;switch(t){case"Browser":n=p_(mt());break;case"Worker":n=`${p_(mt())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Si}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U1{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,l)=>{try{const u=e(s);o(u)}catch(u){l(u)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function F1(t,e={}){return Pn(t,"GET","/v2/passwordPolicy",Fr(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B1=6;class $1{constructor(e){var n,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:B1,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,i,s,o,l;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(n=u.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(l=u.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),u}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z1{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new m_(this),this.idTokenSubscription=new m_(this),this.beforeStateQueue=new U1(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=RT,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Mn(n)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await ns.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await xT(this,{idToken:e}),r=await Vn._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(an(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=i==null?void 0:i._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===l)&&(u!=null&&u.user)&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return Y(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await wu(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=T1()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(an(this.app))return Promise.reject(Un(this));const n=e?ie(e):null;return n&&Y(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&Y(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return an(this.app)?Promise.reject(Un(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return an(this.app)?Promise.reject(Un(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Mn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await F1(this),n=new $1(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Ur("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await V1(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Mn(e)||this._popupRedirectResolver;Y(n,this,"argument-error"),this.redirectPersistenceManager=await ns.create(this,[Mn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(Y(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,i);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Y(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=$T(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&_1(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Ai(t){return ie(t)}class m_{constructor(e){this.auth=e,this.observer=null,this.addObserver=iC(n=>this.observer=n)}get next(){return Y(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ic={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function W1(t){ic=t}function zT(t){return ic.loadJS(t)}function H1(){return ic.recaptchaEnterpriseScript}function q1(){return ic.gapiScript}function K1(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const G1="recaptcha-enterprise",Q1="NO_RECAPTCHA";class Y1{constructor(e){this.type=G1,this.auth=Ai(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,l)=>{P1(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const c=new R1(u);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,o(c.siteKey)}}).catch(u=>{l(u)})})}function i(s,o,l){const u=window.grecaptcha;c_(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(c=>{o(c)}).catch(()=>{o(Q1)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,o)=>{r(this.auth).then(l=>{if(!n&&c_(window.grecaptcha))i(l,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=H1();u.length!==0&&(u+=l),zT(u).then(()=>{i(l,s,o)}).catch(c=>{o(c)})}}).catch(l=>{o(l)})})}}async function g_(t,e,n,r=!1){const i=new Y1(t);let s;try{s=await i.verify(n)}catch{s=await i.verify(n,!0)}const o=Object.assign({},e);return r?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Yd(t,e,n,r){var i;if(!((i=t._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await g_(t,e,n,n==="getOobCode");return r(t,s)}else return r(t,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await g_(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(s)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X1(t,e){const n=Xn(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(ps(s,e??{}))return i;en(i,"already-initialized")}return n.initialize({options:e})}function J1(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Mn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Z1(t,e,n){const r=Ai(t);Y(r._canInitEmulator,r,"emulator-config-failed"),Y(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=WT(e),{host:o,port:l}=eN(e),u=l===null?"":`:${l}`;r.config.emulator={url:`${s}//${o}${u}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),tN()}function WT(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function eN(t){const e=WT(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:y_(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:y_(o)}}}function y_(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function tN(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xp{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Ln("not implemented")}_getIdTokenResponse(e){return Ln("not implemented")}_linkToIdToken(e,n){return Ln("not implemented")}_getReauthenticationResolver(e){return Ln("not implemented")}}async function nN(t,e){return Pn(t,"POST","/v1/accounts:update",e)}async function rN(t,e){return Pn(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function iN(t,e){return _a(t,"POST","/v1/accounts:signInWithPassword",Fr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sN(t,e){return _a(t,"POST","/v1/accounts:signInWithEmailLink",Fr(t,e))}async function oN(t,e){return _a(t,"POST","/v1/accounts:signInWithEmailLink",Fr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ea extends xp{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new ea(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new ea(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Yd(e,n,"signInWithPassword",iN);case"emailLink":return sN(e,{email:this._email,oobCode:this._password});default:en(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Yd(e,r,"signUpPassword",rN);case"emailLink":return oN(e,{idToken:n,email:this._email,oobCode:this._password});default:en(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rs(t,e){return _a(t,"POST","/v1/accounts:signInWithIdp",Fr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aN="http://localhost";class pi extends xp{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new pi(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):en("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=n,s=Ap(n,["providerId","signInMethod"]);if(!r||!i)return null;const o=new pi(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return rs(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,rs(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,rs(e,n)}buildRequest(){const e={requestUri:aN,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=pa(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lN(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function uN(t){const e=lo(uo(t)).link,n=e?lo(uo(e)).deep_link_id:null,r=lo(uo(t)).deep_link_id;return(r?lo(uo(r)).link:null)||r||n||e||t}class bp{constructor(e){var n,r,i,s,o,l;const u=lo(uo(e)),c=(n=u.apiKey)!==null&&n!==void 0?n:null,d=(r=u.oobCode)!==null&&r!==void 0?r:null,m=lN((i=u.mode)!==null&&i!==void 0?i:null);Y(c&&d&&m,"argument-error"),this.apiKey=c,this.operation=m,this.code=d,this.continueUrl=(s=u.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=u.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(l=u.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const n=uN(e);try{return new bp(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs{constructor(){this.providerId=Cs.PROVIDER_ID}static credential(e,n){return ea._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=bp.parseLink(n);return Y(r,"argument-error"),ea._fromEmailAndCode(e,r.code,r.tenantId)}}Cs.PROVIDER_ID="password";Cs.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Cs.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dp{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class va extends Dp{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr extends va{constructor(){super("facebook.com")}static credential(e){return pi._fromParams({providerId:lr.PROVIDER_ID,signInMethod:lr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return lr.credentialFromTaggedObject(e)}static credentialFromError(e){return lr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return lr.credential(e.oauthAccessToken)}catch{return null}}}lr.FACEBOOK_SIGN_IN_METHOD="facebook.com";lr.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur extends va{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return pi._fromParams({providerId:ur.PROVIDER_ID,signInMethod:ur.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return ur.credentialFromTaggedObject(e)}static credentialFromError(e){return ur.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return ur.credential(n,r)}catch{return null}}}ur.GOOGLE_SIGN_IN_METHOD="google.com";ur.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr extends va{constructor(){super("github.com")}static credential(e){return pi._fromParams({providerId:cr.PROVIDER_ID,signInMethod:cr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return cr.credentialFromTaggedObject(e)}static credentialFromError(e){return cr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return cr.credential(e.oauthAccessToken)}catch{return null}}}cr.GITHUB_SIGN_IN_METHOD="github.com";cr.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr extends va{constructor(){super("twitter.com")}static credential(e,n){return pi._fromParams({providerId:hr.PROVIDER_ID,signInMethod:hr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return hr.credentialFromTaggedObject(e)}static credentialFromError(e){return hr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return hr.credential(n,r)}catch{return null}}}hr.TWITTER_SIGN_IN_METHOD="twitter.com";hr.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cN(t,e){return _a(t,"POST","/v1/accounts:signUp",Fr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mi{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await Vn._fromIdTokenResponse(e,r,i),o=__(r);return new mi({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=__(r);return new mi({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function __(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eu extends zt{constructor(e,n,r,i){var s;super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Eu.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new Eu(e,n,r,i)}}function HT(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Eu._fromErrorAndOperation(t,s,e,r):s})}async function hN(t,e,n=!1){const r=await fi(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return mi._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qT(t,e,n=!1){const{auth:r}=t;if(an(r.app))return Promise.reject(Un(r));const i="reauthenticate";try{const s=await fi(t,HT(r,i,e,t),n);Y(s.idToken,r,"internal-error");const o=Cp(s.idToken);Y(o,r,"internal-error");const{sub:l}=o;return Y(t.uid===l,r,"user-mismatch"),mi._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&en(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function KT(t,e,n=!1){if(an(t.app))return Promise.reject(Un(t));const r="signIn",i=await HT(t,r,e),s=await mi._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function dN(t,e){return KT(Ai(t),e)}async function Lj(t,e){return qT(ie(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function GT(t){const e=Ai(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function fN(t,e,n){if(an(t.app))return Promise.reject(Un(t));const r=Ai(t),o=await Yd(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",cN).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&GT(t),u}),l=await mi._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(l.user),l}function pN(t,e,n){return an(t.app)?Promise.reject(Un(t)):dN(ie(t),Cs.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&GT(t),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mN(t,e){return Pn(t,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gN(t,{displayName:e,photoURL:n}){if(e===void 0&&n===void 0)return;const r=ie(t),s={idToken:await r.getIdToken(),displayName:e,photoUrl:n,returnSecureToken:!0},o=await fi(r,mN(r.auth,s));r.displayName=o.displayName||null,r.photoURL=o.photoUrl||null;const l=r.providerData.find(({providerId:u})=>u==="password");l&&(l.displayName=r.displayName,l.photoURL=r.photoURL),await r._updateTokensIfNecessary(o)}function Vj(t,e){return yN(ie(t),null,e)}async function yN(t,e,n){const{auth:r}=t,s={idToken:await t.getIdToken(),returnSecureToken:!0};n&&(s.password=n);const o=await fi(t,nN(r,s));await t._updateTokensIfNecessary(o,!0)}function _N(t,e,n,r){return ie(t).onIdTokenChanged(e,n,r)}function vN(t,e,n){return ie(t).beforeAuthStateChanged(e,n)}function wN(t,e,n,r){return ie(t).onAuthStateChanged(e,n,r)}function Mj(t){return ie(t).signOut()}async function jj(t){return ie(t).delete()}const Tu="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QT{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Tu,"1"),this.storage.removeItem(Tu),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const EN=1e3,TN=10;class YT extends QT{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=BT(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,u)=>{this.notifyListeners(o,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);j1()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,TN):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},EN)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}YT.type="LOCAL";const IN=YT;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XT extends QT{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}XT.type="SESSION";const JT=XT;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function SN(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new sc(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(o).map(async c=>c(n.origin,s)),u=await SN(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}sc.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Op(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AN{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((l,u)=>{const c=Op("",20);i.port1.start();const d=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(m){const g=m;if(g.data.eventId===c)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(g.data.response);break;default:clearTimeout(d),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function In(){return window}function kN(t){In().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ZT(){return typeof In().WorkerGlobalScope<"u"&&typeof In().importScripts=="function"}async function RN(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function PN(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function CN(){return ZT()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e0="firebaseLocalStorageDb",NN=1,Iu="firebaseLocalStorage",t0="fbase_key";class wa{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function oc(t,e){return t.transaction([Iu],e?"readwrite":"readonly").objectStore(Iu)}function xN(){const t=indexedDB.deleteDatabase(e0);return new wa(t).toPromise()}function Xd(){const t=indexedDB.open(e0,NN);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Iu,{keyPath:t0})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Iu)?e(r):(r.close(),await xN(),e(await Xd()))})})}async function v_(t,e,n){const r=oc(t,!0).put({[t0]:e,value:n});return new wa(r).toPromise()}async function bN(t,e){const n=oc(t,!1).get(e),r=await new wa(n).toPromise();return r===void 0?null:r.value}function w_(t,e){const n=oc(t,!0).delete(e);return new wa(n).toPromise()}const DN=800,ON=3;class n0{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Xd(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>ON)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ZT()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=sc._getInstance(CN()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await RN(),!this.activeServiceWorker)return;this.sender=new AN(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||PN()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Xd();return await v_(e,Tu,"1"),await w_(e,Tu),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>v_(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>bN(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>w_(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=oc(i,!1).getAll();return new wa(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),DN)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}n0.type="LOCAL";const LN=n0;new ya(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r0(t,e){return e?Mn(e):(Y(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lp extends xp{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return rs(e,this._buildIdpRequest())}_linkToIdToken(e,n){return rs(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return rs(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function VN(t){return KT(t.auth,new Lp(t),t.bypassAuthState)}function MN(t){const{auth:e,user:n}=t;return Y(n,e,"internal-error"),qT(n,new Lp(t),t.bypassAuthState)}async function jN(t){const{auth:e,user:n}=t;return Y(n,e,"internal-error"),hN(n,new Lp(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i0{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(u))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return VN;case"linkViaPopup":case"linkViaRedirect":return jN;case"reauthViaPopup":case"reauthViaRedirect":return MN;default:en(this.auth,"internal-error")}}resolve(e){Hn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Hn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UN=new ya(2e3,1e4);async function Uj(t,e,n){const r=ie(t);if(an(r.auth.app))return Promise.reject(cn(r.auth,"operation-not-supported-in-this-environment"));v1(r.auth,e,Dp);const i=r0(r.auth,n);return new ei(r.auth,"reauthViaPopup",e,i,r).executeNotNull()}class ei extends i0{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,ei.currentPopupAction&&ei.currentPopupAction.cancel(),ei.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Y(e,this.auth,"internal-error"),e}async onExecution(){Hn(this.filter.length===1,"Popup operations only handle one event");const e=Op();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(cn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(cn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ei.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(cn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,UN.get())};e()}}ei.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FN="pendingRedirect",Vl=new Map;class BN extends i0{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Vl.get(this.auth._key());if(!e){try{const r=await $N(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Vl.set(this.auth._key(),e)}return this.bypassAuthState||Vl.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function $N(t,e){const n=HN(e),r=WN(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function zN(t,e){Vl.set(t._key(),e)}function WN(t){return Mn(t._redirectPersistence)}function HN(t){return Ll(FN,t.config.apiKey,t.name)}async function qN(t,e,n=!1){if(an(t.app))return Promise.reject(Un(t));const r=Ai(t),i=r0(r,e),o=await new BN(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KN=10*60*1e3;class GN{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!QN(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!s0(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(cn(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=KN&&this.cachedEventUids.clear(),this.cachedEventUids.has(E_(e))}saveEventToCache(e){this.cachedEventUids.add(E_(e)),this.lastProcessedEventTime=Date.now()}}function E_(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function s0({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function QN(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return s0(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function YN(t,e={}){return Pn(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XN=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,JN=/^https?/;async function ZN(t){if(t.config.emulator)return;const{authorizedDomains:e}=await YN(t);for(const n of e)try{if(ex(n))return}catch{}en(t,"unauthorized-domain")}function ex(t){const e=Gd(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!JN.test(n))return!1;if(XN.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tx=new ya(3e4,6e4);function T_(){const t=In().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function nx(t){return new Promise((e,n)=>{var r,i,s;function o(){T_(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{T_(),n(cn(t,"network-request-failed"))},timeout:tx.get()})}if(!((i=(r=In().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=In().gapi)===null||s===void 0)&&s.load)o();else{const l=K1("iframefcb");return In()[l]=()=>{gapi.load?o():n(cn(t,"network-request-failed"))},zT(`${q1()}?onload=${l}`).catch(u=>n(u))}}).catch(e=>{throw Ml=null,e})}let Ml=null;function rx(t){return Ml=Ml||nx(t),Ml}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ix=new ya(5e3,15e3),sx="__/auth/iframe",ox="emulator/auth/iframe",ax={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},lx=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function ux(t){const e=t.config;Y(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Pp(e,ox):`https://${t.config.authDomain}/${sx}`,r={apiKey:e.apiKey,appName:t.name,v:Si},i=lx.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${pa(r).slice(1)}`}async function cx(t){const e=await rx(t),n=In().gapi;return Y(n,t,"internal-error"),e.open({where:document.body,url:ux(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:ax,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=cn(t,"network-request-failed"),l=In().setTimeout(()=>{s(o)},ix.get());function u(){In().clearTimeout(l),i(r)}r.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hx={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},dx=500,fx=600,px="_blank",mx="http://localhost";class I_{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function gx(t,e,n,r=dx,i=fx){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const u=Object.assign(Object.assign({},hx),{width:r.toString(),height:i.toString(),top:s,left:o}),c=mt().toLowerCase();n&&(l=VT(c)?px:n),OT(c)&&(e=e||mx,u.scrollbars="yes");const d=Object.entries(u).reduce((g,[I,R])=>`${g}${I}=${R},`,"");if(M1(c)&&l!=="_self")return yx(e||"",l),new I_(null);const m=window.open(e||"",l,d);Y(m,t,"popup-blocked");try{m.focus()}catch{}return new I_(m)}function yx(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _x="__/auth/handler",vx="emulator/auth/handler",wx=encodeURIComponent("fac");async function S_(t,e,n,r,i,s){Y(t.config.authDomain,t,"auth-domain-config-required"),Y(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Si,eventId:i};if(e instanceof Dp){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",rC(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,m]of Object.entries({}))o[d]=m}if(e instanceof va){const d=e.getScopes().filter(m=>m!=="");d.length>0&&(o.scopes=d.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const d of Object.keys(l))l[d]===void 0&&delete l[d];const u=await t._getAppCheckToken(),c=u?`#${wx}=${encodeURIComponent(u)}`:"";return`${Ex(t)}?${pa(l).slice(1)}${c}`}function Ex({config:t}){return t.emulator?Pp(t,vx):`https://${t.authDomain}/${_x}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xh="webStorageSupport";class Tx{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=JT,this._completeRedirectFn=qN,this._overrideRedirectResult=zN}async _openPopup(e,n,r,i){var s;Hn((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await S_(e,n,r,Gd(),i);return gx(e,o,Op())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await S_(e,n,r,Gd(),i);return kN(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Hn(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await cx(e),r=new GN(e);return n.register("authEvent",i=>(Y(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(xh,{type:xh},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[xh];o!==void 0&&n(!!o),en(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=ZN(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return BT()||LT()||Np()}}const Ix=Tx;var A_="@firebase/auth",k_="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sx{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){Y(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ax(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function kx(t){xt(new Et("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;Y(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:$T(t)},c=new z1(r,i,s,u);return J1(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),xt(new Et("auth-internal",e=>{const n=Ai(e.getProvider("auth").getImmediate());return(r=>new Sx(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Je(A_,k_,Ax(t)),Je(A_,k_,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rx=5*60,Px=yT("authIdTokenMaxAge")||Rx;let R_=null;const Cx=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Px)return;const i=n==null?void 0:n.token;R_!==i&&(R_=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Nx(t=ga()){const e=Xn(t,"auth");if(e.isInitialized())return e.getImmediate();const n=X1(t,{popupRedirectResolver:Ix,persistence:[LN,IN,JT]}),r=yT("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=Cx(s.toString());vN(n,o,()=>o(n.currentUser)),_N(n,l=>o(l))}}const i=mT("auth");return i&&Z1(n,`http://${i}`),n}function xx(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}W1({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=cn("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",xx().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});kx("Browser");var P_=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var oi,o0;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,_){function T(){}T.prototype=_.prototype,E.D=_.prototype,E.prototype=new T,E.prototype.constructor=E,E.C=function(A,P,N){for(var S=Array(arguments.length-2),De=2;De<arguments.length;De++)S[De-2]=arguments[De];return _.prototype[P].apply(A,S)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(E,_,T){T||(T=0);var A=Array(16);if(typeof _=="string")for(var P=0;16>P;++P)A[P]=_.charCodeAt(T++)|_.charCodeAt(T++)<<8|_.charCodeAt(T++)<<16|_.charCodeAt(T++)<<24;else for(P=0;16>P;++P)A[P]=_[T++]|_[T++]<<8|_[T++]<<16|_[T++]<<24;_=E.g[0],T=E.g[1],P=E.g[2];var N=E.g[3],S=_+(N^T&(P^N))+A[0]+3614090360&4294967295;_=T+(S<<7&4294967295|S>>>25),S=N+(P^_&(T^P))+A[1]+3905402710&4294967295,N=_+(S<<12&4294967295|S>>>20),S=P+(T^N&(_^T))+A[2]+606105819&4294967295,P=N+(S<<17&4294967295|S>>>15),S=T+(_^P&(N^_))+A[3]+3250441966&4294967295,T=P+(S<<22&4294967295|S>>>10),S=_+(N^T&(P^N))+A[4]+4118548399&4294967295,_=T+(S<<7&4294967295|S>>>25),S=N+(P^_&(T^P))+A[5]+1200080426&4294967295,N=_+(S<<12&4294967295|S>>>20),S=P+(T^N&(_^T))+A[6]+2821735955&4294967295,P=N+(S<<17&4294967295|S>>>15),S=T+(_^P&(N^_))+A[7]+4249261313&4294967295,T=P+(S<<22&4294967295|S>>>10),S=_+(N^T&(P^N))+A[8]+1770035416&4294967295,_=T+(S<<7&4294967295|S>>>25),S=N+(P^_&(T^P))+A[9]+2336552879&4294967295,N=_+(S<<12&4294967295|S>>>20),S=P+(T^N&(_^T))+A[10]+4294925233&4294967295,P=N+(S<<17&4294967295|S>>>15),S=T+(_^P&(N^_))+A[11]+2304563134&4294967295,T=P+(S<<22&4294967295|S>>>10),S=_+(N^T&(P^N))+A[12]+1804603682&4294967295,_=T+(S<<7&4294967295|S>>>25),S=N+(P^_&(T^P))+A[13]+4254626195&4294967295,N=_+(S<<12&4294967295|S>>>20),S=P+(T^N&(_^T))+A[14]+2792965006&4294967295,P=N+(S<<17&4294967295|S>>>15),S=T+(_^P&(N^_))+A[15]+1236535329&4294967295,T=P+(S<<22&4294967295|S>>>10),S=_+(P^N&(T^P))+A[1]+4129170786&4294967295,_=T+(S<<5&4294967295|S>>>27),S=N+(T^P&(_^T))+A[6]+3225465664&4294967295,N=_+(S<<9&4294967295|S>>>23),S=P+(_^T&(N^_))+A[11]+643717713&4294967295,P=N+(S<<14&4294967295|S>>>18),S=T+(N^_&(P^N))+A[0]+3921069994&4294967295,T=P+(S<<20&4294967295|S>>>12),S=_+(P^N&(T^P))+A[5]+3593408605&4294967295,_=T+(S<<5&4294967295|S>>>27),S=N+(T^P&(_^T))+A[10]+38016083&4294967295,N=_+(S<<9&4294967295|S>>>23),S=P+(_^T&(N^_))+A[15]+3634488961&4294967295,P=N+(S<<14&4294967295|S>>>18),S=T+(N^_&(P^N))+A[4]+3889429448&4294967295,T=P+(S<<20&4294967295|S>>>12),S=_+(P^N&(T^P))+A[9]+568446438&4294967295,_=T+(S<<5&4294967295|S>>>27),S=N+(T^P&(_^T))+A[14]+3275163606&4294967295,N=_+(S<<9&4294967295|S>>>23),S=P+(_^T&(N^_))+A[3]+4107603335&4294967295,P=N+(S<<14&4294967295|S>>>18),S=T+(N^_&(P^N))+A[8]+1163531501&4294967295,T=P+(S<<20&4294967295|S>>>12),S=_+(P^N&(T^P))+A[13]+2850285829&4294967295,_=T+(S<<5&4294967295|S>>>27),S=N+(T^P&(_^T))+A[2]+4243563512&4294967295,N=_+(S<<9&4294967295|S>>>23),S=P+(_^T&(N^_))+A[7]+1735328473&4294967295,P=N+(S<<14&4294967295|S>>>18),S=T+(N^_&(P^N))+A[12]+2368359562&4294967295,T=P+(S<<20&4294967295|S>>>12),S=_+(T^P^N)+A[5]+4294588738&4294967295,_=T+(S<<4&4294967295|S>>>28),S=N+(_^T^P)+A[8]+2272392833&4294967295,N=_+(S<<11&4294967295|S>>>21),S=P+(N^_^T)+A[11]+1839030562&4294967295,P=N+(S<<16&4294967295|S>>>16),S=T+(P^N^_)+A[14]+4259657740&4294967295,T=P+(S<<23&4294967295|S>>>9),S=_+(T^P^N)+A[1]+2763975236&4294967295,_=T+(S<<4&4294967295|S>>>28),S=N+(_^T^P)+A[4]+1272893353&4294967295,N=_+(S<<11&4294967295|S>>>21),S=P+(N^_^T)+A[7]+4139469664&4294967295,P=N+(S<<16&4294967295|S>>>16),S=T+(P^N^_)+A[10]+3200236656&4294967295,T=P+(S<<23&4294967295|S>>>9),S=_+(T^P^N)+A[13]+681279174&4294967295,_=T+(S<<4&4294967295|S>>>28),S=N+(_^T^P)+A[0]+3936430074&4294967295,N=_+(S<<11&4294967295|S>>>21),S=P+(N^_^T)+A[3]+3572445317&4294967295,P=N+(S<<16&4294967295|S>>>16),S=T+(P^N^_)+A[6]+76029189&4294967295,T=P+(S<<23&4294967295|S>>>9),S=_+(T^P^N)+A[9]+3654602809&4294967295,_=T+(S<<4&4294967295|S>>>28),S=N+(_^T^P)+A[12]+3873151461&4294967295,N=_+(S<<11&4294967295|S>>>21),S=P+(N^_^T)+A[15]+530742520&4294967295,P=N+(S<<16&4294967295|S>>>16),S=T+(P^N^_)+A[2]+3299628645&4294967295,T=P+(S<<23&4294967295|S>>>9),S=_+(P^(T|~N))+A[0]+4096336452&4294967295,_=T+(S<<6&4294967295|S>>>26),S=N+(T^(_|~P))+A[7]+1126891415&4294967295,N=_+(S<<10&4294967295|S>>>22),S=P+(_^(N|~T))+A[14]+2878612391&4294967295,P=N+(S<<15&4294967295|S>>>17),S=T+(N^(P|~_))+A[5]+4237533241&4294967295,T=P+(S<<21&4294967295|S>>>11),S=_+(P^(T|~N))+A[12]+1700485571&4294967295,_=T+(S<<6&4294967295|S>>>26),S=N+(T^(_|~P))+A[3]+2399980690&4294967295,N=_+(S<<10&4294967295|S>>>22),S=P+(_^(N|~T))+A[10]+4293915773&4294967295,P=N+(S<<15&4294967295|S>>>17),S=T+(N^(P|~_))+A[1]+2240044497&4294967295,T=P+(S<<21&4294967295|S>>>11),S=_+(P^(T|~N))+A[8]+1873313359&4294967295,_=T+(S<<6&4294967295|S>>>26),S=N+(T^(_|~P))+A[15]+4264355552&4294967295,N=_+(S<<10&4294967295|S>>>22),S=P+(_^(N|~T))+A[6]+2734768916&4294967295,P=N+(S<<15&4294967295|S>>>17),S=T+(N^(P|~_))+A[13]+1309151649&4294967295,T=P+(S<<21&4294967295|S>>>11),S=_+(P^(T|~N))+A[4]+4149444226&4294967295,_=T+(S<<6&4294967295|S>>>26),S=N+(T^(_|~P))+A[11]+3174756917&4294967295,N=_+(S<<10&4294967295|S>>>22),S=P+(_^(N|~T))+A[2]+718787259&4294967295,P=N+(S<<15&4294967295|S>>>17),S=T+(N^(P|~_))+A[9]+3951481745&4294967295,E.g[0]=E.g[0]+_&4294967295,E.g[1]=E.g[1]+(P+(S<<21&4294967295|S>>>11))&4294967295,E.g[2]=E.g[2]+P&4294967295,E.g[3]=E.g[3]+N&4294967295}r.prototype.u=function(E,_){_===void 0&&(_=E.length);for(var T=_-this.blockSize,A=this.B,P=this.h,N=0;N<_;){if(P==0)for(;N<=T;)i(this,E,N),N+=this.blockSize;if(typeof E=="string"){for(;N<_;)if(A[P++]=E.charCodeAt(N++),P==this.blockSize){i(this,A),P=0;break}}else for(;N<_;)if(A[P++]=E[N++],P==this.blockSize){i(this,A),P=0;break}}this.h=P,this.o+=_},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var _=1;_<E.length-8;++_)E[_]=0;var T=8*this.o;for(_=E.length-8;_<E.length;++_)E[_]=T&255,T/=256;for(this.u(E),E=Array(16),_=T=0;4>_;++_)for(var A=0;32>A;A+=8)E[T++]=this.g[_]>>>A&255;return E};function s(E,_){var T=l;return Object.prototype.hasOwnProperty.call(T,E)?T[E]:T[E]=_(E)}function o(E,_){this.h=_;for(var T=[],A=!0,P=E.length-1;0<=P;P--){var N=E[P]|0;A&&N==_||(T[P]=N,A=!1)}this.g=T}var l={};function u(E){return-128<=E&&128>E?s(E,function(_){return new o([_|0],0>_?-1:0)}):new o([E|0],0>E?-1:0)}function c(E){if(isNaN(E)||!isFinite(E))return m;if(0>E)return b(c(-E));for(var _=[],T=1,A=0;E>=T;A++)_[A]=E/T|0,T*=4294967296;return new o(_,0)}function d(E,_){if(E.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(E.charAt(0)=="-")return b(d(E.substring(1),_));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var T=c(Math.pow(_,8)),A=m,P=0;P<E.length;P+=8){var N=Math.min(8,E.length-P),S=parseInt(E.substring(P,P+N),_);8>N?(N=c(Math.pow(_,N)),A=A.j(N).add(c(S))):(A=A.j(T),A=A.add(c(S)))}return A}var m=u(0),g=u(1),I=u(16777216);t=o.prototype,t.m=function(){if(C(this))return-b(this).m();for(var E=0,_=1,T=0;T<this.g.length;T++){var A=this.i(T);E+=(0<=A?A:4294967296+A)*_,_*=4294967296}return E},t.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(R(this))return"0";if(C(this))return"-"+b(this).toString(E);for(var _=c(Math.pow(E,6)),T=this,A="";;){var P=O(T,_).g;T=k(T,P.j(_));var N=((0<T.g.length?T.g[0]:T.h)>>>0).toString(E);if(T=P,R(T))return N+A;for(;6>N.length;)N="0"+N;A=N+A}},t.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function R(E){if(E.h!=0)return!1;for(var _=0;_<E.g.length;_++)if(E.g[_]!=0)return!1;return!0}function C(E){return E.h==-1}t.l=function(E){return E=k(this,E),C(E)?-1:R(E)?0:1};function b(E){for(var _=E.g.length,T=[],A=0;A<_;A++)T[A]=~E.g[A];return new o(T,~E.h).add(g)}t.abs=function(){return C(this)?b(this):this},t.add=function(E){for(var _=Math.max(this.g.length,E.g.length),T=[],A=0,P=0;P<=_;P++){var N=A+(this.i(P)&65535)+(E.i(P)&65535),S=(N>>>16)+(this.i(P)>>>16)+(E.i(P)>>>16);A=S>>>16,N&=65535,S&=65535,T[P]=S<<16|N}return new o(T,T[T.length-1]&-2147483648?-1:0)};function k(E,_){return E.add(b(_))}t.j=function(E){if(R(this)||R(E))return m;if(C(this))return C(E)?b(this).j(b(E)):b(b(this).j(E));if(C(E))return b(this.j(b(E)));if(0>this.l(I)&&0>E.l(I))return c(this.m()*E.m());for(var _=this.g.length+E.g.length,T=[],A=0;A<2*_;A++)T[A]=0;for(A=0;A<this.g.length;A++)for(var P=0;P<E.g.length;P++){var N=this.i(A)>>>16,S=this.i(A)&65535,De=E.i(P)>>>16,me=E.i(P)&65535;T[2*A+2*P]+=S*me,w(T,2*A+2*P),T[2*A+2*P+1]+=N*me,w(T,2*A+2*P+1),T[2*A+2*P+1]+=S*De,w(T,2*A+2*P+1),T[2*A+2*P+2]+=N*De,w(T,2*A+2*P+2)}for(A=0;A<_;A++)T[A]=T[2*A+1]<<16|T[2*A];for(A=_;A<2*_;A++)T[A]=0;return new o(T,0)};function w(E,_){for(;(E[_]&65535)!=E[_];)E[_+1]+=E[_]>>>16,E[_]&=65535,_++}function v(E,_){this.g=E,this.h=_}function O(E,_){if(R(_))throw Error("division by zero");if(R(E))return new v(m,m);if(C(E))return _=O(b(E),_),new v(b(_.g),b(_.h));if(C(_))return _=O(E,b(_)),new v(b(_.g),_.h);if(30<E.g.length){if(C(E)||C(_))throw Error("slowDivide_ only works with positive integers.");for(var T=g,A=_;0>=A.l(E);)T=U(T),A=U(A);var P=x(T,1),N=x(A,1);for(A=x(A,2),T=x(T,2);!R(A);){var S=N.add(A);0>=S.l(E)&&(P=P.add(T),N=S),A=x(A,1),T=x(T,1)}return _=k(E,P.j(_)),new v(P,_)}for(P=m;0<=E.l(_);){for(T=Math.max(1,Math.floor(E.m()/_.m())),A=Math.ceil(Math.log(T)/Math.LN2),A=48>=A?1:Math.pow(2,A-48),N=c(T),S=N.j(_);C(S)||0<S.l(E);)T-=A,N=c(T),S=N.j(_);R(N)&&(N=g),P=P.add(N),E=k(E,S)}return new v(P,E)}t.A=function(E){return O(this,E).h},t.and=function(E){for(var _=Math.max(this.g.length,E.g.length),T=[],A=0;A<_;A++)T[A]=this.i(A)&E.i(A);return new o(T,this.h&E.h)},t.or=function(E){for(var _=Math.max(this.g.length,E.g.length),T=[],A=0;A<_;A++)T[A]=this.i(A)|E.i(A);return new o(T,this.h|E.h)},t.xor=function(E){for(var _=Math.max(this.g.length,E.g.length),T=[],A=0;A<_;A++)T[A]=this.i(A)^E.i(A);return new o(T,this.h^E.h)};function U(E){for(var _=E.g.length+1,T=[],A=0;A<_;A++)T[A]=E.i(A)<<1|E.i(A-1)>>>31;return new o(T,E.h)}function x(E,_){var T=_>>5;_%=32;for(var A=E.g.length-T,P=[],N=0;N<A;N++)P[N]=0<_?E.i(N+T)>>>_|E.i(N+T+1)<<32-_:E.i(N+T);return new o(P,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,o0=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=c,o.fromString=d,oi=o}).apply(typeof P_<"u"?P_:typeof self<"u"?self:typeof window<"u"?window:{});var fl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var a0,co,l0,jl,Jd,u0,c0,h0;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,h,f){return a==Array.prototype||a==Object.prototype||(a[h]=f.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof fl=="object"&&fl];for(var h=0;h<a.length;++h){var f=a[h];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var r=n(this);function i(a,h){if(h)e:{var f=r;a=a.split(".");for(var y=0;y<a.length-1;y++){var D=a[y];if(!(D in f))break e;f=f[D]}a=a[a.length-1],y=f[a],h=h(y),h!=y&&h!=null&&e(f,a,{configurable:!0,writable:!0,value:h})}}function s(a,h){a instanceof String&&(a+="");var f=0,y=!1,D={next:function(){if(!y&&f<a.length){var V=f++;return{value:h(V,a[V]),done:!1}}return y=!0,{done:!0,value:void 0}}};return D[Symbol.iterator]=function(){return D},D}i("Array.prototype.values",function(a){return a||function(){return s(this,function(h,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function u(a){var h=typeof a;return h=h!="object"?h:a?Array.isArray(a)?"array":h:"null",h=="array"||h=="object"&&typeof a.length=="number"}function c(a){var h=typeof a;return h=="object"&&a!=null||h=="function"}function d(a,h,f){return a.call.apply(a.bind,arguments)}function m(a,h,f){if(!a)throw Error();if(2<arguments.length){var y=Array.prototype.slice.call(arguments,2);return function(){var D=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(D,y),a.apply(h,D)}}return function(){return a.apply(h,arguments)}}function g(a,h,f){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:m,g.apply(null,arguments)}function I(a,h){var f=Array.prototype.slice.call(arguments,1);return function(){var y=f.slice();return y.push.apply(y,arguments),a.apply(this,y)}}function R(a,h){function f(){}f.prototype=h.prototype,a.aa=h.prototype,a.prototype=new f,a.prototype.constructor=a,a.Qb=function(y,D,V){for(var B=Array(arguments.length-2),fe=2;fe<arguments.length;fe++)B[fe-2]=arguments[fe];return h.prototype[D].apply(y,B)}}function C(a){const h=a.length;if(0<h){const f=Array(h);for(let y=0;y<h;y++)f[y]=a[y];return f}return[]}function b(a,h){for(let f=1;f<arguments.length;f++){const y=arguments[f];if(u(y)){const D=a.length||0,V=y.length||0;a.length=D+V;for(let B=0;B<V;B++)a[D+B]=y[B]}else a.push(y)}}class k{constructor(h,f){this.i=h,this.j=f,this.h=0,this.g=null}get(){let h;return 0<this.h?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function w(a){return/^[\s\xa0]*$/.test(a)}function v(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function O(a){return O[" "](a),a}O[" "]=function(){};var U=v().indexOf("Gecko")!=-1&&!(v().toLowerCase().indexOf("webkit")!=-1&&v().indexOf("Edge")==-1)&&!(v().indexOf("Trident")!=-1||v().indexOf("MSIE")!=-1)&&v().indexOf("Edge")==-1;function x(a,h,f){for(const y in a)h.call(f,a[y],y,a)}function E(a,h){for(const f in a)h.call(void 0,a[f],f,a)}function _(a){const h={};for(const f in a)h[f]=a[f];return h}const T="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function A(a,h){let f,y;for(let D=1;D<arguments.length;D++){y=arguments[D];for(f in y)a[f]=y[f];for(let V=0;V<T.length;V++)f=T[V],Object.prototype.hasOwnProperty.call(y,f)&&(a[f]=y[f])}}function P(a){var h=1;a=a.split(":");const f=[];for(;0<h&&a.length;)f.push(a.shift()),h--;return a.length&&f.push(a.join(":")),f}function N(a){l.setTimeout(()=>{throw a},0)}function S(){var a=G;let h=null;return a.g&&(h=a.g,a.g=a.g.next,a.g||(a.h=null),h.next=null),h}class De{constructor(){this.h=this.g=null}add(h,f){const y=me.get();y.set(h,f),this.h?this.h.next=y:this.g=y,this.h=y}}var me=new k(()=>new zr,a=>a.reset());class zr{constructor(){this.next=this.g=this.h=null}set(h,f){this.h=h,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let nt,$=!1,G=new De,Q=()=>{const a=l.Promise.resolve(void 0);nt=()=>{a.then(ge)}};var ge=()=>{for(var a;a=S();){try{a.h.call(a.g)}catch(f){N(f)}var h=me;h.j(a),100>h.h&&(h.h++,a.next=h.g,h.g=a)}$=!1};function q(){this.s=this.s,this.C=this.C}q.prototype.s=!1,q.prototype.ma=function(){this.s||(this.s=!0,this.N())},q.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function oe(a,h){this.type=a,this.g=this.target=h,this.defaultPrevented=!1}oe.prototype.h=function(){this.defaultPrevented=!0};var de=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,h=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};l.addEventListener("test",f,h),l.removeEventListener("test",f,h)}catch{}return a}();function Wt(a,h){if(oe.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var f=this.type=a.type,y=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=h,h=a.relatedTarget){if(U){e:{try{O(h.nodeName);var D=!0;break e}catch{}D=!1}D||(h=null)}}else f=="mouseover"?h=a.fromElement:f=="mouseout"&&(h=a.toElement);this.relatedTarget=h,y?(this.clientX=y.clientX!==void 0?y.clientX:y.pageX,this.clientY=y.clientY!==void 0?y.clientY:y.pageY,this.screenX=y.screenX||0,this.screenY=y.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Ht[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&Wt.aa.h.call(this)}}R(Wt,oe);var Ht={2:"touch",3:"pen",4:"mouse"};Wt.prototype.h=function(){Wt.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var rt="closure_listenable_"+(1e6*Math.random()|0),Na=0;function xa(a,h,f,y,D){this.listener=a,this.proxy=null,this.src=h,this.type=f,this.capture=!!y,this.ha=D,this.key=++Na,this.da=this.fa=!1}function Jn(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function ba(a){this.src=a,this.g={},this.h=0}ba.prototype.add=function(a,h,f,y,D){var V=a.toString();a=this.g[V],a||(a=this.g[V]=[],this.h++);var B=Nc(a,h,y,D);return-1<B?(h=a[B],f||(h.fa=!1)):(h=new xa(h,this.src,V,!!y,D),h.fa=f,a.push(h)),h};function Cc(a,h){var f=h.type;if(f in a.g){var y=a.g[f],D=Array.prototype.indexOf.call(y,h,void 0),V;(V=0<=D)&&Array.prototype.splice.call(y,D,1),V&&(Jn(h),a.g[f].length==0&&(delete a.g[f],a.h--))}}function Nc(a,h,f,y){for(var D=0;D<a.length;++D){var V=a[D];if(!V.da&&V.listener==h&&V.capture==!!f&&V.ha==y)return D}return-1}var xc="closure_lm_"+(1e6*Math.random()|0),bc={};function Om(a,h,f,y,D){if(Array.isArray(h)){for(var V=0;V<h.length;V++)Om(a,h[V],f,y,D);return null}return f=Mm(f),a&&a[rt]?a.K(h,f,c(y)?!!y.capture:!1,D):NS(a,h,f,!1,y,D)}function NS(a,h,f,y,D,V){if(!h)throw Error("Invalid event type");var B=c(D)?!!D.capture:!!D,fe=Oc(a);if(fe||(a[xc]=fe=new ba(a)),f=fe.add(h,f,y,B,V),f.proxy)return f;if(y=xS(),f.proxy=y,y.src=a,y.listener=f,a.addEventListener)de||(D=B),D===void 0&&(D=!1),a.addEventListener(h.toString(),y,D);else if(a.attachEvent)a.attachEvent(Vm(h.toString()),y);else if(a.addListener&&a.removeListener)a.addListener(y);else throw Error("addEventListener and attachEvent are unavailable.");return f}function xS(){function a(f){return h.call(a.src,a.listener,f)}const h=bS;return a}function Lm(a,h,f,y,D){if(Array.isArray(h))for(var V=0;V<h.length;V++)Lm(a,h[V],f,y,D);else y=c(y)?!!y.capture:!!y,f=Mm(f),a&&a[rt]?(a=a.i,h=String(h).toString(),h in a.g&&(V=a.g[h],f=Nc(V,f,y,D),-1<f&&(Jn(V[f]),Array.prototype.splice.call(V,f,1),V.length==0&&(delete a.g[h],a.h--)))):a&&(a=Oc(a))&&(h=a.g[h.toString()],a=-1,h&&(a=Nc(h,f,y,D)),(f=-1<a?h[a]:null)&&Dc(f))}function Dc(a){if(typeof a!="number"&&a&&!a.da){var h=a.src;if(h&&h[rt])Cc(h.i,a);else{var f=a.type,y=a.proxy;h.removeEventListener?h.removeEventListener(f,y,a.capture):h.detachEvent?h.detachEvent(Vm(f),y):h.addListener&&h.removeListener&&h.removeListener(y),(f=Oc(h))?(Cc(f,a),f.h==0&&(f.src=null,h[xc]=null)):Jn(a)}}}function Vm(a){return a in bc?bc[a]:bc[a]="on"+a}function bS(a,h){if(a.da)a=!0;else{h=new Wt(h,this);var f=a.listener,y=a.ha||a.src;a.fa&&Dc(a),a=f.call(y,h)}return a}function Oc(a){return a=a[xc],a instanceof ba?a:null}var Lc="__closure_events_fn_"+(1e9*Math.random()>>>0);function Mm(a){return typeof a=="function"?a:(a[Lc]||(a[Lc]=function(h){return a.handleEvent(h)}),a[Lc])}function it(){q.call(this),this.i=new ba(this),this.M=this,this.F=null}R(it,q),it.prototype[rt]=!0,it.prototype.removeEventListener=function(a,h,f,y){Lm(this,a,h,f,y)};function gt(a,h){var f,y=a.F;if(y)for(f=[];y;y=y.F)f.push(y);if(a=a.M,y=h.type||h,typeof h=="string")h=new oe(h,a);else if(h instanceof oe)h.target=h.target||a;else{var D=h;h=new oe(y,a),A(h,D)}if(D=!0,f)for(var V=f.length-1;0<=V;V--){var B=h.g=f[V];D=Da(B,y,!0,h)&&D}if(B=h.g=a,D=Da(B,y,!0,h)&&D,D=Da(B,y,!1,h)&&D,f)for(V=0;V<f.length;V++)B=h.g=f[V],D=Da(B,y,!1,h)&&D}it.prototype.N=function(){if(it.aa.N.call(this),this.i){var a=this.i,h;for(h in a.g){for(var f=a.g[h],y=0;y<f.length;y++)Jn(f[y]);delete a.g[h],a.h--}}this.F=null},it.prototype.K=function(a,h,f,y){return this.i.add(String(a),h,!1,f,y)},it.prototype.L=function(a,h,f,y){return this.i.add(String(a),h,!0,f,y)};function Da(a,h,f,y){if(h=a.i.g[String(h)],!h)return!0;h=h.concat();for(var D=!0,V=0;V<h.length;++V){var B=h[V];if(B&&!B.da&&B.capture==f){var fe=B.listener,qe=B.ha||B.src;B.fa&&Cc(a.i,B),D=fe.call(qe,y)!==!1&&D}}return D&&!y.defaultPrevented}function jm(a,h,f){if(typeof a=="function")f&&(a=g(a,f));else if(a&&typeof a.handleEvent=="function")a=g(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(h)?-1:l.setTimeout(a,h||0)}function Um(a){a.g=jm(()=>{a.g=null,a.i&&(a.i=!1,Um(a))},a.l);const h=a.h;a.h=null,a.m.apply(null,h)}class DS extends q{constructor(h,f){super(),this.m=h,this.l=f,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:Um(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ls(a){q.call(this),this.h=a,this.g={}}R(Ls,q);var Fm=[];function Bm(a){x(a.g,function(h,f){this.g.hasOwnProperty(f)&&Dc(h)},a),a.g={}}Ls.prototype.N=function(){Ls.aa.N.call(this),Bm(this)},Ls.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Vc=l.JSON.stringify,OS=l.JSON.parse,LS=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Mc(){}Mc.prototype.h=null;function $m(a){return a.h||(a.h=a.i())}function zm(){}var Vs={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function jc(){oe.call(this,"d")}R(jc,oe);function Uc(){oe.call(this,"c")}R(Uc,oe);var Wr={},Wm=null;function Oa(){return Wm=Wm||new it}Wr.La="serverreachability";function Hm(a){oe.call(this,Wr.La,a)}R(Hm,oe);function Ms(a){const h=Oa();gt(h,new Hm(h))}Wr.STAT_EVENT="statevent";function qm(a,h){oe.call(this,Wr.STAT_EVENT,a),this.stat=h}R(qm,oe);function yt(a){const h=Oa();gt(h,new qm(h,a))}Wr.Ma="timingevent";function Km(a,h){oe.call(this,Wr.Ma,a),this.size=h}R(Km,oe);function js(a,h){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},h)}function Us(){this.g=!0}Us.prototype.xa=function(){this.g=!1};function VS(a,h,f,y,D,V){a.info(function(){if(a.g)if(V)for(var B="",fe=V.split("&"),qe=0;qe<fe.length;qe++){var ae=fe[qe].split("=");if(1<ae.length){var st=ae[0];ae=ae[1];var ot=st.split("_");B=2<=ot.length&&ot[1]=="type"?B+(st+"="+ae+"&"):B+(st+"=redacted&")}}else B=null;else B=V;return"XMLHTTP REQ ("+y+") [attempt "+D+"]: "+h+`
`+f+`
`+B})}function MS(a,h,f,y,D,V,B){a.info(function(){return"XMLHTTP RESP ("+y+") [ attempt "+D+"]: "+h+`
`+f+`
`+V+" "+B})}function Pi(a,h,f,y){a.info(function(){return"XMLHTTP TEXT ("+h+"): "+US(a,f)+(y?" "+y:"")})}function jS(a,h){a.info(function(){return"TIMEOUT: "+h})}Us.prototype.info=function(){};function US(a,h){if(!a.g)return h;if(!h)return null;try{var f=JSON.parse(h);if(f){for(a=0;a<f.length;a++)if(Array.isArray(f[a])){var y=f[a];if(!(2>y.length)){var D=y[1];if(Array.isArray(D)&&!(1>D.length)){var V=D[0];if(V!="noop"&&V!="stop"&&V!="close")for(var B=1;B<D.length;B++)D[B]=""}}}}return Vc(f)}catch{return h}}var La={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Gm={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Fc;function Va(){}R(Va,Mc),Va.prototype.g=function(){return new XMLHttpRequest},Va.prototype.i=function(){return{}},Fc=new Va;function Zn(a,h,f,y){this.j=a,this.i=h,this.l=f,this.R=y||1,this.U=new Ls(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Qm}function Qm(){this.i=null,this.g="",this.h=!1}var Ym={},Bc={};function $c(a,h,f){a.L=1,a.v=Fa(Cn(h)),a.m=f,a.P=!0,Xm(a,null)}function Xm(a,h){a.F=Date.now(),Ma(a),a.A=Cn(a.v);var f=a.A,y=a.R;Array.isArray(y)||(y=[String(y)]),hg(f.i,"t",y),a.C=0,f=a.j.J,a.h=new Qm,a.g=Cg(a.j,f?h:null,!a.m),0<a.O&&(a.M=new DS(g(a.Y,a,a.g),a.O)),h=a.U,f=a.g,y=a.ca;var D="readystatechange";Array.isArray(D)||(D&&(Fm[0]=D.toString()),D=Fm);for(var V=0;V<D.length;V++){var B=Om(f,D[V],y||h.handleEvent,!1,h.h||h);if(!B)break;h.g[B.key]=B}h=a.H?_(a.H):{},a.m?(a.u||(a.u="POST"),h["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,h)):(a.u="GET",a.g.ea(a.A,a.u,null,h)),Ms(),VS(a.i,a.u,a.A,a.l,a.R,a.m)}Zn.prototype.ca=function(a){a=a.target;const h=this.M;h&&Nn(a)==3?h.j():this.Y(a)},Zn.prototype.Y=function(a){try{if(a==this.g)e:{const ot=Nn(this.g);var h=this.g.Ba();const xi=this.g.Z();if(!(3>ot)&&(ot!=3||this.g&&(this.h.h||this.g.oa()||_g(this.g)))){this.J||ot!=4||h==7||(h==8||0>=xi?Ms(3):Ms(2)),zc(this);var f=this.g.Z();this.X=f;t:if(Jm(this)){var y=_g(this.g);a="";var D=y.length,V=Nn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Hr(this),Fs(this);var B="";break t}this.h.i=new l.TextDecoder}for(h=0;h<D;h++)this.h.h=!0,a+=this.h.i.decode(y[h],{stream:!(V&&h==D-1)});y.length=0,this.h.g+=a,this.C=0,B=this.h.g}else B=this.g.oa();if(this.o=f==200,MS(this.i,this.u,this.A,this.l,this.R,ot,f),this.o){if(this.T&&!this.K){t:{if(this.g){var fe,qe=this.g;if((fe=qe.g?qe.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!w(fe)){var ae=fe;break t}}ae=null}if(f=ae)Pi(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Wc(this,f);else{this.o=!1,this.s=3,yt(12),Hr(this),Fs(this);break e}}if(this.P){f=!0;let tn;for(;!this.J&&this.C<B.length;)if(tn=FS(this,B),tn==Bc){ot==4&&(this.s=4,yt(14),f=!1),Pi(this.i,this.l,null,"[Incomplete Response]");break}else if(tn==Ym){this.s=4,yt(15),Pi(this.i,this.l,B,"[Invalid Chunk]"),f=!1;break}else Pi(this.i,this.l,tn,null),Wc(this,tn);if(Jm(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ot!=4||B.length!=0||this.h.h||(this.s=1,yt(16),f=!1),this.o=this.o&&f,!f)Pi(this.i,this.l,B,"[Invalid Chunked Response]"),Hr(this),Fs(this);else if(0<B.length&&!this.W){this.W=!0;var st=this.j;st.g==this&&st.ba&&!st.M&&(st.j.info("Great, no buffering proxy detected. Bytes received: "+B.length),Yc(st),st.M=!0,yt(11))}}else Pi(this.i,this.l,B,null),Wc(this,B);ot==4&&Hr(this),this.o&&!this.J&&(ot==4?Ag(this.j,this):(this.o=!1,Ma(this)))}else rA(this.g),f==400&&0<B.indexOf("Unknown SID")?(this.s=3,yt(12)):(this.s=0,yt(13)),Hr(this),Fs(this)}}}catch{}finally{}};function Jm(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function FS(a,h){var f=a.C,y=h.indexOf(`
`,f);return y==-1?Bc:(f=Number(h.substring(f,y)),isNaN(f)?Ym:(y+=1,y+f>h.length?Bc:(h=h.slice(y,y+f),a.C=y+f,h)))}Zn.prototype.cancel=function(){this.J=!0,Hr(this)};function Ma(a){a.S=Date.now()+a.I,Zm(a,a.I)}function Zm(a,h){if(a.B!=null)throw Error("WatchDog timer not null");a.B=js(g(a.ba,a),h)}function zc(a){a.B&&(l.clearTimeout(a.B),a.B=null)}Zn.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(jS(this.i,this.A),this.L!=2&&(Ms(),yt(17)),Hr(this),this.s=2,Fs(this)):Zm(this,this.S-a)};function Fs(a){a.j.G==0||a.J||Ag(a.j,a)}function Hr(a){zc(a);var h=a.M;h&&typeof h.ma=="function"&&h.ma(),a.M=null,Bm(a.U),a.g&&(h=a.g,a.g=null,h.abort(),h.ma())}function Wc(a,h){try{var f=a.j;if(f.G!=0&&(f.g==a||Hc(f.h,a))){if(!a.K&&Hc(f.h,a)&&f.G==3){try{var y=f.Da.g.parse(h)}catch{y=null}if(Array.isArray(y)&&y.length==3){var D=y;if(D[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<a.F)qa(f),Wa(f);else break e;Qc(f),yt(18)}}else f.za=D[1],0<f.za-f.T&&37500>D[2]&&f.F&&f.v==0&&!f.C&&(f.C=js(g(f.Za,f),6e3));if(1>=ng(f.h)&&f.ca){try{f.ca()}catch{}f.ca=void 0}}else Kr(f,11)}else if((a.K||f.g==a)&&qa(f),!w(h))for(D=f.Da.g.parse(h),h=0;h<D.length;h++){let ae=D[h];if(f.T=ae[0],ae=ae[1],f.G==2)if(ae[0]=="c"){f.K=ae[1],f.ia=ae[2];const st=ae[3];st!=null&&(f.la=st,f.j.info("VER="+f.la));const ot=ae[4];ot!=null&&(f.Aa=ot,f.j.info("SVER="+f.Aa));const xi=ae[5];xi!=null&&typeof xi=="number"&&0<xi&&(y=1.5*xi,f.L=y,f.j.info("backChannelRequestTimeoutMs_="+y)),y=f;const tn=a.g;if(tn){const Ga=tn.g?tn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ga){var V=y.h;V.g||Ga.indexOf("spdy")==-1&&Ga.indexOf("quic")==-1&&Ga.indexOf("h2")==-1||(V.j=V.l,V.g=new Set,V.h&&(qc(V,V.h),V.h=null))}if(y.D){const Xc=tn.g?tn.g.getResponseHeader("X-HTTP-Session-Id"):null;Xc&&(y.ya=Xc,ye(y.I,y.D,Xc))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-a.F,f.j.info("Handshake RTT: "+f.R+"ms")),y=f;var B=a;if(y.qa=Pg(y,y.J?y.ia:null,y.W),B.K){rg(y.h,B);var fe=B,qe=y.L;qe&&(fe.I=qe),fe.B&&(zc(fe),Ma(fe)),y.g=B}else Ig(y);0<f.i.length&&Ha(f)}else ae[0]!="stop"&&ae[0]!="close"||Kr(f,7);else f.G==3&&(ae[0]=="stop"||ae[0]=="close"?ae[0]=="stop"?Kr(f,7):Gc(f):ae[0]!="noop"&&f.l&&f.l.ta(ae),f.v=0)}}Ms(4)}catch{}}var BS=class{constructor(a,h){this.g=a,this.map=h}};function eg(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function tg(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function ng(a){return a.h?1:a.g?a.g.size:0}function Hc(a,h){return a.h?a.h==h:a.g?a.g.has(h):!1}function qc(a,h){a.g?a.g.add(h):a.h=h}function rg(a,h){a.h&&a.h==h?a.h=null:a.g&&a.g.has(h)&&a.g.delete(h)}eg.prototype.cancel=function(){if(this.i=ig(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function ig(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let h=a.i;for(const f of a.g.values())h=h.concat(f.D);return h}return C(a.i)}function $S(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var h=[],f=a.length,y=0;y<f;y++)h.push(a[y]);return h}h=[],f=0;for(y in a)h[f++]=a[y];return h}function zS(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(u(a)||typeof a=="string"){var h=[];a=a.length;for(var f=0;f<a;f++)h.push(f);return h}h=[],f=0;for(const y in a)h[f++]=y;return h}}}function sg(a,h){if(a.forEach&&typeof a.forEach=="function")a.forEach(h,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,h,void 0);else for(var f=zS(a),y=$S(a),D=y.length,V=0;V<D;V++)h.call(void 0,y[V],f&&f[V],a)}var og=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function WS(a,h){if(a){a=a.split("&");for(var f=0;f<a.length;f++){var y=a[f].indexOf("="),D=null;if(0<=y){var V=a[f].substring(0,y);D=a[f].substring(y+1)}else V=a[f];h(V,D?decodeURIComponent(D.replace(/\+/g," ")):"")}}}function qr(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof qr){this.h=a.h,ja(this,a.j),this.o=a.o,this.g=a.g,Ua(this,a.s),this.l=a.l;var h=a.i,f=new zs;f.i=h.i,h.g&&(f.g=new Map(h.g),f.h=h.h),ag(this,f),this.m=a.m}else a&&(h=String(a).match(og))?(this.h=!1,ja(this,h[1]||"",!0),this.o=Bs(h[2]||""),this.g=Bs(h[3]||"",!0),Ua(this,h[4]),this.l=Bs(h[5]||"",!0),ag(this,h[6]||"",!0),this.m=Bs(h[7]||"")):(this.h=!1,this.i=new zs(null,this.h))}qr.prototype.toString=function(){var a=[],h=this.j;h&&a.push($s(h,lg,!0),":");var f=this.g;return(f||h=="file")&&(a.push("//"),(h=this.o)&&a.push($s(h,lg,!0),"@"),a.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&a.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push($s(f,f.charAt(0)=="/"?KS:qS,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",$s(f,QS)),a.join("")};function Cn(a){return new qr(a)}function ja(a,h,f){a.j=f?Bs(h,!0):h,a.j&&(a.j=a.j.replace(/:$/,""))}function Ua(a,h){if(h){if(h=Number(h),isNaN(h)||0>h)throw Error("Bad port number "+h);a.s=h}else a.s=null}function ag(a,h,f){h instanceof zs?(a.i=h,YS(a.i,a.h)):(f||(h=$s(h,GS)),a.i=new zs(h,a.h))}function ye(a,h,f){a.i.set(h,f)}function Fa(a){return ye(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Bs(a,h){return a?h?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function $s(a,h,f){return typeof a=="string"?(a=encodeURI(a).replace(h,HS),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function HS(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var lg=/[#\/\?@]/g,qS=/[#\?:]/g,KS=/[#\?]/g,GS=/[#\?@]/g,QS=/#/g;function zs(a,h){this.h=this.g=null,this.i=a||null,this.j=!!h}function er(a){a.g||(a.g=new Map,a.h=0,a.i&&WS(a.i,function(h,f){a.add(decodeURIComponent(h.replace(/\+/g," ")),f)}))}t=zs.prototype,t.add=function(a,h){er(this),this.i=null,a=Ci(this,a);var f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(h),this.h+=1,this};function ug(a,h){er(a),h=Ci(a,h),a.g.has(h)&&(a.i=null,a.h-=a.g.get(h).length,a.g.delete(h))}function cg(a,h){return er(a),h=Ci(a,h),a.g.has(h)}t.forEach=function(a,h){er(this),this.g.forEach(function(f,y){f.forEach(function(D){a.call(h,D,y,this)},this)},this)},t.na=function(){er(this);const a=Array.from(this.g.values()),h=Array.from(this.g.keys()),f=[];for(let y=0;y<h.length;y++){const D=a[y];for(let V=0;V<D.length;V++)f.push(h[y])}return f},t.V=function(a){er(this);let h=[];if(typeof a=="string")cg(this,a)&&(h=h.concat(this.g.get(Ci(this,a))));else{a=Array.from(this.g.values());for(let f=0;f<a.length;f++)h=h.concat(a[f])}return h},t.set=function(a,h){return er(this),this.i=null,a=Ci(this,a),cg(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[h]),this.h+=1,this},t.get=function(a,h){return a?(a=this.V(a),0<a.length?String(a[0]):h):h};function hg(a,h,f){ug(a,h),0<f.length&&(a.i=null,a.g.set(Ci(a,h),C(f)),a.h+=f.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],h=Array.from(this.g.keys());for(var f=0;f<h.length;f++){var y=h[f];const V=encodeURIComponent(String(y)),B=this.V(y);for(y=0;y<B.length;y++){var D=V;B[y]!==""&&(D+="="+encodeURIComponent(String(B[y]))),a.push(D)}}return this.i=a.join("&")};function Ci(a,h){return h=String(h),a.j&&(h=h.toLowerCase()),h}function YS(a,h){h&&!a.j&&(er(a),a.i=null,a.g.forEach(function(f,y){var D=y.toLowerCase();y!=D&&(ug(this,y),hg(this,D,f))},a)),a.j=h}function XS(a,h){const f=new Us;if(l.Image){const y=new Image;y.onload=I(tr,f,"TestLoadImage: loaded",!0,h,y),y.onerror=I(tr,f,"TestLoadImage: error",!1,h,y),y.onabort=I(tr,f,"TestLoadImage: abort",!1,h,y),y.ontimeout=I(tr,f,"TestLoadImage: timeout",!1,h,y),l.setTimeout(function(){y.ontimeout&&y.ontimeout()},1e4),y.src=a}else h(!1)}function JS(a,h){const f=new Us,y=new AbortController,D=setTimeout(()=>{y.abort(),tr(f,"TestPingServer: timeout",!1,h)},1e4);fetch(a,{signal:y.signal}).then(V=>{clearTimeout(D),V.ok?tr(f,"TestPingServer: ok",!0,h):tr(f,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(D),tr(f,"TestPingServer: error",!1,h)})}function tr(a,h,f,y,D){try{D&&(D.onload=null,D.onerror=null,D.onabort=null,D.ontimeout=null),y(f)}catch{}}function ZS(){this.g=new LS}function eA(a,h,f){const y=f||"";try{sg(a,function(D,V){let B=D;c(D)&&(B=Vc(D)),h.push(y+V+"="+encodeURIComponent(B))})}catch(D){throw h.push(y+"type="+encodeURIComponent("_badmap")),D}}function Ba(a){this.l=a.Ub||null,this.j=a.eb||!1}R(Ba,Mc),Ba.prototype.g=function(){return new $a(this.l,this.j)},Ba.prototype.i=function(a){return function(){return a}}({});function $a(a,h){it.call(this),this.D=a,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}R($a,it),t=$a.prototype,t.open=function(a,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=h,this.readyState=1,Hs(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const h={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(h.body=a),(this.D||l).fetch(new Request(this.A,h)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Ws(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Hs(this)),this.g&&(this.readyState=3,Hs(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;dg(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function dg(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var h=a.value?a.value:new Uint8Array(0);(h=this.v.decode(h,{stream:!a.done}))&&(this.response=this.responseText+=h)}a.done?Ws(this):Hs(this),this.readyState==3&&dg(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,Ws(this))},t.Qa=function(a){this.g&&(this.response=a,Ws(this))},t.ga=function(){this.g&&Ws(this)};function Ws(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Hs(a)}t.setRequestHeader=function(a,h){this.u.append(a,h)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],h=this.h.entries();for(var f=h.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=h.next();return a.join(`\r
`)};function Hs(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty($a.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function fg(a){let h="";return x(a,function(f,y){h+=y,h+=":",h+=f,h+=`\r
`}),h}function Kc(a,h,f){e:{for(y in f){var y=!1;break e}y=!0}y||(f=fg(f),typeof a=="string"?f!=null&&encodeURIComponent(String(f)):ye(a,h,f))}function Ce(a){it.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}R(Ce,it);var tA=/^https?$/i,nA=["POST","PUT"];t=Ce.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,h,f,y){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);h=h?h.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Fc.g(),this.v=this.o?$m(this.o):$m(Fc),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(h,String(a),!0),this.B=!1}catch(V){pg(this,V);return}if(a=f||"",f=new Map(this.headers),y)if(Object.getPrototypeOf(y)===Object.prototype)for(var D in y)f.set(D,y[D]);else if(typeof y.keys=="function"&&typeof y.get=="function")for(const V of y.keys())f.set(V,y.get(V));else throw Error("Unknown input type for opt_headers: "+String(y));y=Array.from(f.keys()).find(V=>V.toLowerCase()=="content-type"),D=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(nA,h,void 0))||y||D||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[V,B]of f)this.g.setRequestHeader(V,B);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{yg(this),this.u=!0,this.g.send(a),this.u=!1}catch(V){pg(this,V)}};function pg(a,h){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=h,a.m=5,mg(a),za(a)}function mg(a){a.A||(a.A=!0,gt(a,"complete"),gt(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,gt(this,"complete"),gt(this,"abort"),za(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),za(this,!0)),Ce.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?gg(this):this.bb())},t.bb=function(){gg(this)};function gg(a){if(a.h&&typeof o<"u"&&(!a.v[1]||Nn(a)!=4||a.Z()!=2)){if(a.u&&Nn(a)==4)jm(a.Ea,0,a);else if(gt(a,"readystatechange"),Nn(a)==4){a.h=!1;try{const B=a.Z();e:switch(B){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var f;if(!(f=h)){var y;if(y=B===0){var D=String(a.D).match(og)[1]||null;!D&&l.self&&l.self.location&&(D=l.self.location.protocol.slice(0,-1)),y=!tA.test(D?D.toLowerCase():"")}f=y}if(f)gt(a,"complete"),gt(a,"success");else{a.m=6;try{var V=2<Nn(a)?a.g.statusText:""}catch{V=""}a.l=V+" ["+a.Z()+"]",mg(a)}}finally{za(a)}}}}function za(a,h){if(a.g){yg(a);const f=a.g,y=a.v[0]?()=>{}:null;a.g=null,a.v=null,h||gt(a,"ready");try{f.onreadystatechange=y}catch{}}}function yg(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function Nn(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<Nn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(a){if(this.g){var h=this.g.responseText;return a&&h.indexOf(a)==0&&(h=h.substring(a.length)),OS(h)}};function _g(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function rA(a){const h={};a=(a.g&&2<=Nn(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let y=0;y<a.length;y++){if(w(a[y]))continue;var f=P(a[y]);const D=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const V=h[D]||[];h[D]=V,V.push(f)}E(h,function(y){return y.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function qs(a,h,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||h}function vg(a){this.Aa=0,this.i=[],this.j=new Us,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=qs("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=qs("baseRetryDelayMs",5e3,a),this.cb=qs("retryDelaySeedMs",1e4,a),this.Wa=qs("forwardChannelMaxRetries",2,a),this.wa=qs("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new eg(a&&a.concurrentRequestLimit),this.Da=new ZS,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=vg.prototype,t.la=8,t.G=1,t.connect=function(a,h,f,y){yt(0),this.W=a,this.H=h||{},f&&y!==void 0&&(this.H.OSID=f,this.H.OAID=y),this.F=this.X,this.I=Pg(this,null,this.W),Ha(this)};function Gc(a){if(wg(a),a.G==3){var h=a.U++,f=Cn(a.I);if(ye(f,"SID",a.K),ye(f,"RID",h),ye(f,"TYPE","terminate"),Ks(a,f),h=new Zn(a,a.j,h),h.L=2,h.v=Fa(Cn(f)),f=!1,l.navigator&&l.navigator.sendBeacon)try{f=l.navigator.sendBeacon(h.v.toString(),"")}catch{}!f&&l.Image&&(new Image().src=h.v,f=!0),f||(h.g=Cg(h.j,null),h.g.ea(h.v)),h.F=Date.now(),Ma(h)}Rg(a)}function Wa(a){a.g&&(Yc(a),a.g.cancel(),a.g=null)}function wg(a){Wa(a),a.u&&(l.clearTimeout(a.u),a.u=null),qa(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Ha(a){if(!tg(a.h)&&!a.s){a.s=!0;var h=a.Ga;nt||Q(),$||(nt(),$=!0),G.add(h,a),a.B=0}}function iA(a,h){return ng(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=h.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=js(g(a.Ga,a,h),kg(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const D=new Zn(this,this.j,a);let V=this.o;if(this.S&&(V?(V=_(V),A(V,this.S)):V=this.S),this.m!==null||this.O||(D.H=V,V=null),this.P)e:{for(var h=0,f=0;f<this.i.length;f++){t:{var y=this.i[f];if("__data__"in y.map&&(y=y.map.__data__,typeof y=="string")){y=y.length;break t}y=void 0}if(y===void 0)break;if(h+=y,4096<h){h=f;break e}if(h===4096||f===this.i.length-1){h=f+1;break e}}h=1e3}else h=1e3;h=Tg(this,D,h),f=Cn(this.I),ye(f,"RID",a),ye(f,"CVER",22),this.D&&ye(f,"X-HTTP-Session-Id",this.D),Ks(this,f),V&&(this.O?h="headers="+encodeURIComponent(String(fg(V)))+"&"+h:this.m&&Kc(f,this.m,V)),qc(this.h,D),this.Ua&&ye(f,"TYPE","init"),this.P?(ye(f,"$req",h),ye(f,"SID","null"),D.T=!0,$c(D,f,null)):$c(D,f,h),this.G=2}}else this.G==3&&(a?Eg(this,a):this.i.length==0||tg(this.h)||Eg(this))};function Eg(a,h){var f;h?f=h.l:f=a.U++;const y=Cn(a.I);ye(y,"SID",a.K),ye(y,"RID",f),ye(y,"AID",a.T),Ks(a,y),a.m&&a.o&&Kc(y,a.m,a.o),f=new Zn(a,a.j,f,a.B+1),a.m===null&&(f.H=a.o),h&&(a.i=h.D.concat(a.i)),h=Tg(a,f,1e3),f.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),qc(a.h,f),$c(f,y,h)}function Ks(a,h){a.H&&x(a.H,function(f,y){ye(h,y,f)}),a.l&&sg({},function(f,y){ye(h,y,f)})}function Tg(a,h,f){f=Math.min(a.i.length,f);var y=a.l?g(a.l.Na,a.l,a):null;e:{var D=a.i;let V=-1;for(;;){const B=["count="+f];V==-1?0<f?(V=D[0].g,B.push("ofs="+V)):V=0:B.push("ofs="+V);let fe=!0;for(let qe=0;qe<f;qe++){let ae=D[qe].g;const st=D[qe].map;if(ae-=V,0>ae)V=Math.max(0,D[qe].g-100),fe=!1;else try{eA(st,B,"req"+ae+"_")}catch{y&&y(st)}}if(fe){y=B.join("&");break e}}}return a=a.i.splice(0,f),h.D=a,y}function Ig(a){if(!a.g&&!a.u){a.Y=1;var h=a.Fa;nt||Q(),$||(nt(),$=!0),G.add(h,a),a.v=0}}function Qc(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=js(g(a.Fa,a),kg(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,Sg(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=js(g(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,yt(10),Wa(this),Sg(this))};function Yc(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Sg(a){a.g=new Zn(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var h=Cn(a.qa);ye(h,"RID","rpc"),ye(h,"SID",a.K),ye(h,"AID",a.T),ye(h,"CI",a.F?"0":"1"),!a.F&&a.ja&&ye(h,"TO",a.ja),ye(h,"TYPE","xmlhttp"),Ks(a,h),a.m&&a.o&&Kc(h,a.m,a.o),a.L&&(a.g.I=a.L);var f=a.g;a=a.ia,f.L=1,f.v=Fa(Cn(h)),f.m=null,f.P=!0,Xm(f,a)}t.Za=function(){this.C!=null&&(this.C=null,Wa(this),Qc(this),yt(19))};function qa(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Ag(a,h){var f=null;if(a.g==h){qa(a),Yc(a),a.g=null;var y=2}else if(Hc(a.h,h))f=h.D,rg(a.h,h),y=1;else return;if(a.G!=0){if(h.o)if(y==1){f=h.m?h.m.length:0,h=Date.now()-h.F;var D=a.B;y=Oa(),gt(y,new Km(y,f)),Ha(a)}else Ig(a);else if(D=h.s,D==3||D==0&&0<h.X||!(y==1&&iA(a,h)||y==2&&Qc(a)))switch(f&&0<f.length&&(h=a.h,h.i=h.i.concat(f)),D){case 1:Kr(a,5);break;case 4:Kr(a,10);break;case 3:Kr(a,6);break;default:Kr(a,2)}}}function kg(a,h){let f=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(f*=2),f*h}function Kr(a,h){if(a.j.info("Error code "+h),h==2){var f=g(a.fb,a),y=a.Xa;const D=!y;y=new qr(y||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||ja(y,"https"),Fa(y),D?XS(y.toString(),f):JS(y.toString(),f)}else yt(2);a.G=0,a.l&&a.l.sa(h),Rg(a),wg(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),yt(2)):(this.j.info("Failed to ping google.com"),yt(1))};function Rg(a){if(a.G=0,a.ka=[],a.l){const h=ig(a.h);(h.length!=0||a.i.length!=0)&&(b(a.ka,h),b(a.ka,a.i),a.h.i.length=0,C(a.i),a.i.length=0),a.l.ra()}}function Pg(a,h,f){var y=f instanceof qr?Cn(f):new qr(f);if(y.g!="")h&&(y.g=h+"."+y.g),Ua(y,y.s);else{var D=l.location;y=D.protocol,h=h?h+"."+D.hostname:D.hostname,D=+D.port;var V=new qr(null);y&&ja(V,y),h&&(V.g=h),D&&Ua(V,D),f&&(V.l=f),y=V}return f=a.D,h=a.ya,f&&h&&ye(y,f,h),ye(y,"VER",a.la),Ks(a,y),y}function Cg(a,h,f){if(h&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return h=a.Ca&&!a.pa?new Ce(new Ba({eb:f})):new Ce(a.pa),h.Ha(a.J),h}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function Ng(){}t=Ng.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Ka(){}Ka.prototype.g=function(a,h){return new bt(a,h)};function bt(a,h){it.call(this),this.g=new vg(h),this.l=a,this.h=h&&h.messageUrlParams||null,a=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(a?a["X-WebChannel-Content-Type"]=h.messageContentType:a={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.va&&(a?a["X-WebChannel-Client-Profile"]=h.va:a={"X-WebChannel-Client-Profile":h.va}),this.g.S=a,(a=h&&h.Sb)&&!w(a)&&(this.g.m=a),this.v=h&&h.supportsCrossDomainXhr||!1,this.u=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!w(h)&&(this.g.D=h,a=this.h,a!==null&&h in a&&(a=this.h,h in a&&delete a[h])),this.j=new Ni(this)}R(bt,it),bt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},bt.prototype.close=function(){Gc(this.g)},bt.prototype.o=function(a){var h=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.u&&(f={},f.__data__=Vc(a),a=f);h.i.push(new BS(h.Ya++,a)),h.G==3&&Ha(h)},bt.prototype.N=function(){this.g.l=null,delete this.j,Gc(this.g),delete this.g,bt.aa.N.call(this)};function xg(a){jc.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var h=a.__sm__;if(h){e:{for(const f in h){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,h=h!==null&&a in h?h[a]:void 0),this.data=h}else this.data=a}R(xg,jc);function bg(){Uc.call(this),this.status=1}R(bg,Uc);function Ni(a){this.g=a}R(Ni,Ng),Ni.prototype.ua=function(){gt(this.g,"a")},Ni.prototype.ta=function(a){gt(this.g,new xg(a))},Ni.prototype.sa=function(a){gt(this.g,new bg)},Ni.prototype.ra=function(){gt(this.g,"b")},Ka.prototype.createWebChannel=Ka.prototype.g,bt.prototype.send=bt.prototype.o,bt.prototype.open=bt.prototype.m,bt.prototype.close=bt.prototype.close,h0=function(){return new Ka},c0=function(){return Oa()},u0=Wr,Jd={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},La.NO_ERROR=0,La.TIMEOUT=8,La.HTTP_ERROR=6,jl=La,Gm.COMPLETE="complete",l0=Gm,zm.EventType=Vs,Vs.OPEN="a",Vs.CLOSE="b",Vs.ERROR="c",Vs.MESSAGE="d",it.prototype.listen=it.prototype.K,co=zm,Ce.prototype.listenOnce=Ce.prototype.L,Ce.prototype.getLastError=Ce.prototype.Ka,Ce.prototype.getLastErrorCode=Ce.prototype.Ba,Ce.prototype.getStatus=Ce.prototype.Z,Ce.prototype.getResponseJson=Ce.prototype.Oa,Ce.prototype.getResponseText=Ce.prototype.oa,Ce.prototype.send=Ce.prototype.ea,Ce.prototype.setWithCredentials=Ce.prototype.Ha,a0=Ce}).apply(typeof fl<"u"?fl:typeof self<"u"?self:typeof window<"u"?window:{});const C_="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ct.UNAUTHENTICATED=new ct(null),ct.GOOGLE_CREDENTIALS=new ct("google-credentials-uid"),ct.FIRST_PARTY=new ct("first-party-uid"),ct.MOCK_USER=new ct("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ns="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gi=new ma("@firebase/firestore");function no(){return gi.logLevel}function H(t,...e){if(gi.logLevel<=ne.DEBUG){const n=e.map(Vp);gi.debug(`Firestore (${Ns}): ${t}`,...n)}}function qn(t,...e){if(gi.logLevel<=ne.ERROR){const n=e.map(Vp);gi.error(`Firestore (${Ns}): ${t}`,...n)}}function ms(t,...e){if(gi.logLevel<=ne.WARN){const n=e.map(Vp);gi.warn(`Firestore (${Ns}): ${t}`,...n)}}function Vp(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X(t="Unexpected state"){const e=`FIRESTORE (${Ns}) INTERNAL ASSERTION FAILED: `+t;throw qn(e),new Error(e)}function he(t,e){t||X()}function Z(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class z extends zt{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d0{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class bx{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(ct.UNAUTHENTICATED))}shutdown(){}}class Dx{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class Ox{constructor(e){this.t=e,this.currentUser=ct.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){he(this.o===void 0);let r=this.i;const i=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let s=new Pr;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Pr,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},l=u=>{H("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(H("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Pr)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(H("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(he(typeof r.accessToken=="string"),new d0(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return he(e===null||typeof e=="string"),new ct(e)}}class Lx{constructor(e,n,r){this.l=e,this.h=n,this.P=r,this.type="FirstParty",this.user=ct.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Vx{constructor(e,n,r){this.l=e,this.h=n,this.P=r}getToken(){return Promise.resolve(new Lx(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(ct.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Mx{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class jx{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){he(this.o===void 0);const r=s=>{s.error!=null&&H("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.R;return this.R=s.token,H("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{H("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):H("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(he(typeof n.token=="string"),this.R=n.token,new Mx(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ux(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f0{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=Ux(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%e.length))}return r}}function le(t,e){return t<e?-1:t>e?1:0}function gs(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new z(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new z(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new z(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new z(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return $e.fromMillis(Date.now())}static fromDate(e){return $e.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new $e(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?le(this.nanoseconds,e.nanoseconds):le(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{constructor(e){this.timestamp=e}static fromTimestamp(e){return new J(e)}static min(){return new J(new $e(0,0))}static max(){return new J(new $e(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ta{constructor(e,n,r){n===void 0?n=0:n>e.length&&X(),r===void 0?r=e.length-n:r>e.length-n&&X(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return ta.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof ta?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=e.get(i),o=n.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class ve extends ta{construct(e,n,r){return new ve(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new z(M.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new ve(n)}static emptyPath(){return new ve([])}}const Fx=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ye extends ta{construct(e,n,r){return new Ye(e,n,r)}static isValidIdentifier(e){return Fx.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ye.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ye(["__name__"])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new z(M.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new z(M.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new z(M.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(r+=l,i++):(s(),i++)}if(s(),o)throw new z(M.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ye(n)}static emptyPath(){return new Ye([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(e){this.path=e}static fromPath(e){return new K(ve.fromString(e))}static fromName(e){return new K(ve.fromString(e).popFirst(5))}static empty(){return new K(ve.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ve.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ve.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new K(new ve(e.slice()))}}function Bx(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,i=J.fromTimestamp(r===1e9?new $e(n+1,0):new $e(n,r));return new br(i,K.empty(),e)}function $x(t){return new br(t.readTime,t.key,-1)}class br{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new br(J.min(),K.empty(),-1)}static max(){return new br(J.max(),K.empty(),-1)}}function zx(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=K.comparator(t.documentKey,e.documentKey),n!==0?n:le(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wx="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Hx{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ea(t){if(t.code!==M.FAILED_PRECONDITION||t.message!==Wx)throw t;H("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&X(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new j((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(n,s).next(r,i)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof j?n:j.resolve(n)}catch(n){return j.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):j.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):j.reject(n)}static resolve(e){return new j((n,r)=>{n(e)})}static reject(e){return new j((n,r)=>{r(e)})}static waitFor(e){return new j((n,r)=>{let i=0,s=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++s,o&&s===i&&n()},u=>r(u))}),o=!0,s===i&&n()})}static or(e){let n=j.resolve(!1);for(const r of e)n=n.next(i=>i?j.resolve(i):r());return n}static forEach(e,n){const r=[];return e.forEach((i,s)=>{r.push(n.call(this,i,s))}),this.waitFor(r)}static mapArray(e,n){return new j((r,i)=>{const s=e.length,o=new Array(s);let l=0;for(let u=0;u<s;u++){const c=u;n(e[c]).next(d=>{o[c]=d,++l,l===s&&r(o)},d=>i(d))}})}static doWhile(e,n){return new j((r,i)=>{const s=()=>{e()===!0?n().next(()=>{s()},i):r()};s()})}}function qx(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Ta(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mp{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ie(r),this.se=r=>n.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Mp.oe=-1;function ac(t){return t==null}function Su(t){return t===0&&1/t==-1/0}function Kx(t){return typeof t=="number"&&Number.isInteger(t)&&!Su(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N_(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function ki(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function p0(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(e,n){this.comparator=e,this.root=n||Qe.EMPTY}insert(e,n){return new Re(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,Qe.BLACK,null,null))}remove(e){return new Re(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Qe.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new pl(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new pl(this.root,e,this.comparator,!1)}getReverseIterator(){return new pl(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new pl(this.root,e,this.comparator,!0)}}class pl{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Qe{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??Qe.RED,this.left=i??Qe.EMPTY,this.right=s??Qe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new Qe(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Qe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return Qe.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Qe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Qe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw X();const e=this.left.check();if(e!==this.right.check())throw X();return e+(this.isRed()?0:1)}}Qe.EMPTY=null,Qe.RED=!0,Qe.BLACK=!1;Qe.EMPTY=new class{constructor(){this.size=0}get key(){throw X()}get value(){throw X()}get color(){throw X()}get left(){throw X()}get right(){throw X()}copy(e,n,r,i,s){return this}insert(e,n,r){return new Qe(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e){this.comparator=e,this.data=new Re(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new x_(this.data.getIterator())}getIteratorFrom(e){return new x_(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof Ze)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Ze(this.comparator);return n.data=e,n}}class x_{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(e){this.fields=e,e.sort(Ye.comparator)}static empty(){return new Vt([])}unionWith(e){let n=new Ze(Ye.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Vt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return gs(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m0 extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new m0("Invalid base64 string: "+s):s}}(e);return new tt(n)}static fromUint8Array(e){const n=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new tt(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return le(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}tt.EMPTY_BYTE_STRING=new tt("");const Gx=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Dr(t){if(he(!!t),typeof t=="string"){let e=0;const n=Gx.exec(t);if(he(!!n),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Oe(t.seconds),nanos:Oe(t.nanos)}}function Oe(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function yi(t){return typeof t=="string"?tt.fromBase64String(t):tt.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jp(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Up(t){const e=t.mapValue.fields.__previous_value__;return jp(e)?Up(e):e}function na(t){const e=Dr(t.mapValue.fields.__local_write_time__.timestampValue);return new $e(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qx{constructor(e,n,r,i,s,o,l,u,c){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=c}}class ra{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new ra("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof ra&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ml={mapValue:{}};function _i(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?jp(t)?4:Xx(t)?9007199254740991:Yx(t)?10:11:X()}function kn(t,e){if(t===e)return!0;const n=_i(t);if(n!==_i(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return na(t).isEqual(na(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=Dr(i.timestampValue),l=Dr(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return yi(i.bytesValue).isEqual(yi(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return Oe(i.geoPointValue.latitude)===Oe(s.geoPointValue.latitude)&&Oe(i.geoPointValue.longitude)===Oe(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return Oe(i.integerValue)===Oe(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=Oe(i.doubleValue),l=Oe(s.doubleValue);return o===l?Su(o)===Su(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return gs(t.arrayValue.values||[],e.arrayValue.values||[],kn);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},l=s.mapValue.fields||{};if(N_(o)!==N_(l))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(l[u]===void 0||!kn(o[u],l[u])))return!1;return!0}(t,e);default:return X()}}function ia(t,e){return(t.values||[]).find(n=>kn(n,e))!==void 0}function ys(t,e){if(t===e)return 0;const n=_i(t),r=_i(e);if(n!==r)return le(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return le(t.booleanValue,e.booleanValue);case 2:return function(s,o){const l=Oe(s.integerValue||s.doubleValue),u=Oe(o.integerValue||o.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(t,e);case 3:return b_(t.timestampValue,e.timestampValue);case 4:return b_(na(t),na(e));case 5:return le(t.stringValue,e.stringValue);case 6:return function(s,o){const l=yi(s),u=yi(o);return l.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const l=s.split("/"),u=o.split("/");for(let c=0;c<l.length&&c<u.length;c++){const d=le(l[c],u[c]);if(d!==0)return d}return le(l.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const l=le(Oe(s.latitude),Oe(o.latitude));return l!==0?l:le(Oe(s.longitude),Oe(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return D_(t.arrayValue,e.arrayValue);case 10:return function(s,o){var l,u,c,d;const m=s.fields||{},g=o.fields||{},I=(l=m.value)===null||l===void 0?void 0:l.arrayValue,R=(u=g.value)===null||u===void 0?void 0:u.arrayValue,C=le(((c=I==null?void 0:I.values)===null||c===void 0?void 0:c.length)||0,((d=R==null?void 0:R.values)===null||d===void 0?void 0:d.length)||0);return C!==0?C:D_(I,R)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===ml.mapValue&&o===ml.mapValue)return 0;if(s===ml.mapValue)return 1;if(o===ml.mapValue)return-1;const l=s.fields||{},u=Object.keys(l),c=o.fields||{},d=Object.keys(c);u.sort(),d.sort();for(let m=0;m<u.length&&m<d.length;++m){const g=le(u[m],d[m]);if(g!==0)return g;const I=ys(l[u[m]],c[d[m]]);if(I!==0)return I}return le(u.length,d.length)}(t.mapValue,e.mapValue);default:throw X()}}function b_(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return le(t,e);const n=Dr(t),r=Dr(e),i=le(n.seconds,r.seconds);return i!==0?i:le(n.nanos,r.nanos)}function D_(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const s=ys(n[i],r[i]);if(s)return s}return le(n.length,r.length)}function _s(t){return Zd(t)}function Zd(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=Dr(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return yi(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return K.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",i=!0;for(const s of n.values||[])i?i=!1:r+=",",r+=Zd(s);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${Zd(n.fields[o])}`;return i+"}"}(t.mapValue):X()}function O_(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function ef(t){return!!t&&"integerValue"in t}function Fp(t){return!!t&&"arrayValue"in t}function L_(t){return!!t&&"nullValue"in t}function V_(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Ul(t){return!!t&&"mapValue"in t}function Yx(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function ko(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return ki(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=ko(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=ko(t.arrayValue.values[n]);return e}return Object.assign({},t)}function Xx(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e){this.value=e}static empty(){return new At({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Ul(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=ko(n)}setAll(e){let n=Ye.emptyPath(),r={},i=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,r,i),r={},i=[],n=l.popLast()}o?r[l.lastSegment()]=ko(o):i.push(l.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());Ul(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return kn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];Ul(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){ki(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new At(ko(this.value))}}function g0(t){const e=[];return ki(t.fields,(n,r)=>{const i=new Ye([n]);if(Ul(r)){const s=g0(r.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new Vt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(e,n,r,i,s,o,l){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new dt(e,0,J.min(),J.min(),J.min(),At.empty(),0)}static newFoundDocument(e,n,r,i){return new dt(e,1,n,J.min(),r,i,0)}static newNoDocument(e,n){return new dt(e,2,n,J.min(),J.min(),At.empty(),0)}static newUnknownDocument(e,n){return new dt(e,3,n,J.min(),J.min(),At.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(J.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=At.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=At.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=J.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof dt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new dt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Au{constructor(e,n){this.position=e,this.inclusive=n}}function M_(t,e,n){let r=0;for(let i=0;i<t.position.length;i++){const s=e[i],o=t.position[i];if(s.field.isKeyField()?r=K.comparator(K.fromName(o.referenceValue),n.key):r=ys(o,n.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function j_(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!kn(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sa{constructor(e,n="asc"){this.field=e,this.dir=n}}function Jx(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y0{}class Ue extends y0{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new eb(e,n,r):n==="array-contains"?new rb(e,r):n==="in"?new ib(e,r):n==="not-in"?new sb(e,r):n==="array-contains-any"?new ob(e,r):new Ue(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new tb(e,r):new nb(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(ys(n,this.value)):n!==null&&_i(this.value)===_i(n)&&this.matchesComparison(ys(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return X()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class dn extends y0{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new dn(e,n)}matches(e){return _0(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function _0(t){return t.op==="and"}function v0(t){return Zx(t)&&_0(t)}function Zx(t){for(const e of t.filters)if(e instanceof dn)return!1;return!0}function tf(t){if(t instanceof Ue)return t.field.canonicalString()+t.op.toString()+_s(t.value);if(v0(t))return t.filters.map(e=>tf(e)).join(",");{const e=t.filters.map(n=>tf(n)).join(",");return`${t.op}(${e})`}}function w0(t,e){return t instanceof Ue?function(r,i){return i instanceof Ue&&r.op===i.op&&r.field.isEqual(i.field)&&kn(r.value,i.value)}(t,e):t instanceof dn?function(r,i){return i instanceof dn&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,l)=>s&&w0(o,i.filters[l]),!0):!1}(t,e):void X()}function E0(t){return t instanceof Ue?function(n){return`${n.field.canonicalString()} ${n.op} ${_s(n.value)}`}(t):t instanceof dn?function(n){return n.op.toString()+" {"+n.getFilters().map(E0).join(" ,")+"}"}(t):"Filter"}class eb extends Ue{constructor(e,n,r){super(e,n,r),this.key=K.fromName(r.referenceValue)}matches(e){const n=K.comparator(e.key,this.key);return this.matchesComparison(n)}}class tb extends Ue{constructor(e,n){super(e,"in",n),this.keys=T0("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class nb extends Ue{constructor(e,n){super(e,"not-in",n),this.keys=T0("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function T0(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>K.fromName(r.referenceValue))}class rb extends Ue{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Fp(n)&&ia(n.arrayValue,this.value)}}class ib extends Ue{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&ia(this.value.arrayValue,n)}}class sb extends Ue{constructor(e,n){super(e,"not-in",n)}matches(e){if(ia(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!ia(this.value.arrayValue,n)}}class ob extends Ue{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Fp(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>ia(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ab{constructor(e,n=null,r=[],i=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=l,this.ue=null}}function U_(t,e=null,n=[],r=[],i=null,s=null,o=null){return new ab(t,e,n,r,i,s,o)}function Bp(t){const e=Z(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>tf(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),ac(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>_s(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>_s(r)).join(",")),e.ue=n}return e.ue}function $p(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!Jx(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!w0(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!j_(t.startAt,e.startAt)&&j_(t.endAt,e.endAt)}function nf(t){return K.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xs{constructor(e,n=null,r=[],i=[],s=null,o="F",l=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=u,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function lb(t,e,n,r,i,s,o,l){return new xs(t,e,n,r,i,s,o,l)}function lc(t){return new xs(t)}function F_(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function I0(t){return t.collectionGroup!==null}function Ro(t){const e=Z(t);if(e.ce===null){e.ce=[];const n=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),n.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Ze(Ye.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(c=>{c.isInequality()&&(l=l.add(c.field))})}),l})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.ce.push(new sa(s,r))}),n.has(Ye.keyField().canonicalString())||e.ce.push(new sa(Ye.keyField(),r))}return e.ce}function Sn(t){const e=Z(t);return e.le||(e.le=ub(e,Ro(t))),e.le}function ub(t,e){if(t.limitType==="F")return U_(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new sa(i.field,s)});const n=t.endAt?new Au(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new Au(t.startAt.position,t.startAt.inclusive):null;return U_(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function rf(t,e){const n=t.filters.concat([e]);return new xs(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function ku(t,e,n){return new xs(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function uc(t,e){return $p(Sn(t),Sn(e))&&t.limitType===e.limitType}function S0(t){return`${Bp(Sn(t))}|lt:${t.limitType}`}function Oi(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(i=>E0(i)).join(", ")}]`),ac(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(i=>_s(i)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(i=>_s(i)).join(",")),`Target(${r})`}(Sn(t))}; limitType=${t.limitType})`}function cc(t,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):K.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(t,e)&&function(r,i){for(const s of Ro(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(t,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(t,e)&&function(r,i){return!(r.startAt&&!function(o,l,u){const c=M_(o,l,u);return o.inclusive?c<=0:c<0}(r.startAt,Ro(r),i)||r.endAt&&!function(o,l,u){const c=M_(o,l,u);return o.inclusive?c>=0:c>0}(r.endAt,Ro(r),i))}(t,e)}function cb(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function A0(t){return(e,n)=>{let r=!1;for(const i of Ro(t)){const s=hb(i,e,n);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function hb(t,e,n){const r=t.field.isKeyField()?K.comparator(e.key,n.key):function(s,o,l){const u=o.data.field(s),c=l.data.field(s);return u!==null&&c!==null?ys(u,c):X()}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return X()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bs{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){ki(this.inner,(n,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return p0(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const db=new Re(K.comparator);function Kn(){return db}const k0=new Re(K.comparator);function ho(...t){let e=k0;for(const n of t)e=e.insert(n.key,n);return e}function R0(t){let e=k0;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function ti(){return Po()}function P0(){return Po()}function Po(){return new bs(t=>t.toString(),(t,e)=>t.isEqual(e))}const fb=new Re(K.comparator),pb=new Ze(K.comparator);function te(...t){let e=pb;for(const n of t)e=e.add(n);return e}const mb=new Ze(le);function gb(){return mb}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zp(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Su(e)?"-0":e}}function C0(t){return{integerValue:""+t}}function yb(t,e){return Kx(e)?C0(e):zp(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hc{constructor(){this._=void 0}}function _b(t,e,n){return t instanceof oa?function(i,s){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&jp(s)&&(s=Up(s)),s&&(o.fields.__previous_value__=s),{mapValue:o}}(n,e):t instanceof vs?x0(t,e):t instanceof aa?b0(t,e):function(i,s){const o=N0(i,s),l=B_(o)+B_(i.Pe);return ef(o)&&ef(i.Pe)?C0(l):zp(i.serializer,l)}(t,e)}function vb(t,e,n){return t instanceof vs?x0(t,e):t instanceof aa?b0(t,e):n}function N0(t,e){return t instanceof Ru?function(r){return ef(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class oa extends hc{}class vs extends hc{constructor(e){super(),this.elements=e}}function x0(t,e){const n=D0(e);for(const r of t.elements)n.some(i=>kn(i,r))||n.push(r);return{arrayValue:{values:n}}}class aa extends hc{constructor(e){super(),this.elements=e}}function b0(t,e){let n=D0(e);for(const r of t.elements)n=n.filter(i=>!kn(i,r));return{arrayValue:{values:n}}}class Ru extends hc{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function B_(t){return Oe(t.integerValue||t.doubleValue)}function D0(t){return Fp(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O0{constructor(e,n){this.field=e,this.transform=n}}function wb(t,e){return t.field.isEqual(e.field)&&function(r,i){return r instanceof vs&&i instanceof vs||r instanceof aa&&i instanceof aa?gs(r.elements,i.elements,kn):r instanceof Ru&&i instanceof Ru?kn(r.Pe,i.Pe):r instanceof oa&&i instanceof oa}(t.transform,e.transform)}class Eb{constructor(e,n){this.version=e,this.transformResults=n}}class Yt{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Yt}static exists(e){return new Yt(void 0,e)}static updateTime(e){return new Yt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Fl(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class dc{}function L0(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new Wp(t.key,Yt.none()):new Ia(t.key,t.data,Yt.none());{const n=t.data,r=At.empty();let i=new Ze(Ye.comparator);for(let s of e.fields)if(!i.has(s)){let o=n.field(s);o===null&&s.length>1&&(s=s.popLast(),o=n.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new Br(t.key,r,new Vt(i.toArray()),Yt.none())}}function Tb(t,e,n){t instanceof Ia?function(i,s,o){const l=i.value.clone(),u=z_(i.fieldTransforms,s,o.transformResults);l.setAll(u),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof Br?function(i,s,o){if(!Fl(i.precondition,s))return void s.convertToUnknownDocument(o.version);const l=z_(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(V0(i)),u.setAll(l),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function Co(t,e,n,r){return t instanceof Ia?function(s,o,l,u){if(!Fl(s.precondition,o))return l;const c=s.value.clone(),d=W_(s.fieldTransforms,u,o);return c.setAll(d),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null}(t,e,n,r):t instanceof Br?function(s,o,l,u){if(!Fl(s.precondition,o))return l;const c=W_(s.fieldTransforms,u,o),d=o.data;return d.setAll(V0(s)),d.setAll(c),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(m=>m.field))}(t,e,n,r):function(s,o,l){return Fl(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function Ib(t,e){let n=null;for(const r of t.fieldTransforms){const i=e.data.field(r.field),s=N0(r.transform,i||null);s!=null&&(n===null&&(n=At.empty()),n.set(r.field,s))}return n||null}function $_(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&gs(r,i,(s,o)=>wb(s,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class Ia extends dc{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Br extends dc{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function V0(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function z_(t,e,n){const r=new Map;he(t.length===n.length);for(let i=0;i<n.length;i++){const s=t[i],o=s.transform,l=e.data.field(s.field);r.set(s.field,vb(o,l,n[i]))}return r}function W_(t,e,n){const r=new Map;for(const i of t){const s=i.transform,o=n.data.field(i.field);r.set(i.field,_b(s,o,e))}return r}class Wp extends dc{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Sb extends dc{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ab{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&Tb(s,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=Co(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=Co(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=P0();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=n.has(i.key)?null:l;const u=L0(o,l);u!==null&&r.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(J.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),te())}isEqual(e){return this.batchId===e.batchId&&gs(this.mutations,e.mutations,(n,r)=>$_(n,r))&&gs(this.baseMutations,e.baseMutations,(n,r)=>$_(n,r))}}class Hp{constructor(e,n,r,i){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=i}static from(e,n,r){he(e.mutations.length===r.length);let i=function(){return fb}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,r[o].version);return new Hp(e,n,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kb{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rb{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ve,re;function Pb(t){switch(t){default:return X();case M.CANCELLED:case M.UNKNOWN:case M.DEADLINE_EXCEEDED:case M.RESOURCE_EXHAUSTED:case M.INTERNAL:case M.UNAVAILABLE:case M.UNAUTHENTICATED:return!1;case M.INVALID_ARGUMENT:case M.NOT_FOUND:case M.ALREADY_EXISTS:case M.PERMISSION_DENIED:case M.FAILED_PRECONDITION:case M.ABORTED:case M.OUT_OF_RANGE:case M.UNIMPLEMENTED:case M.DATA_LOSS:return!0}}function M0(t){if(t===void 0)return qn("GRPC error has no .code"),M.UNKNOWN;switch(t){case Ve.OK:return M.OK;case Ve.CANCELLED:return M.CANCELLED;case Ve.UNKNOWN:return M.UNKNOWN;case Ve.DEADLINE_EXCEEDED:return M.DEADLINE_EXCEEDED;case Ve.RESOURCE_EXHAUSTED:return M.RESOURCE_EXHAUSTED;case Ve.INTERNAL:return M.INTERNAL;case Ve.UNAVAILABLE:return M.UNAVAILABLE;case Ve.UNAUTHENTICATED:return M.UNAUTHENTICATED;case Ve.INVALID_ARGUMENT:return M.INVALID_ARGUMENT;case Ve.NOT_FOUND:return M.NOT_FOUND;case Ve.ALREADY_EXISTS:return M.ALREADY_EXISTS;case Ve.PERMISSION_DENIED:return M.PERMISSION_DENIED;case Ve.FAILED_PRECONDITION:return M.FAILED_PRECONDITION;case Ve.ABORTED:return M.ABORTED;case Ve.OUT_OF_RANGE:return M.OUT_OF_RANGE;case Ve.UNIMPLEMENTED:return M.UNIMPLEMENTED;case Ve.DATA_LOSS:return M.DATA_LOSS;default:return X()}}(re=Ve||(Ve={}))[re.OK=0]="OK",re[re.CANCELLED=1]="CANCELLED",re[re.UNKNOWN=2]="UNKNOWN",re[re.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",re[re.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",re[re.NOT_FOUND=5]="NOT_FOUND",re[re.ALREADY_EXISTS=6]="ALREADY_EXISTS",re[re.PERMISSION_DENIED=7]="PERMISSION_DENIED",re[re.UNAUTHENTICATED=16]="UNAUTHENTICATED",re[re.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",re[re.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",re[re.ABORTED=10]="ABORTED",re[re.OUT_OF_RANGE=11]="OUT_OF_RANGE",re[re.UNIMPLEMENTED=12]="UNIMPLEMENTED",re[re.INTERNAL=13]="INTERNAL",re[re.UNAVAILABLE=14]="UNAVAILABLE",re[re.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cb(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nb=new oi([4294967295,4294967295],0);function H_(t){const e=Cb().encode(t),n=new o0;return n.update(e),new Uint8Array(n.digest())}function q_(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new oi([n,r],0),new oi([i,s],0)]}class qp{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new fo(`Invalid padding: ${n}`);if(r<0)throw new fo(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new fo(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new fo(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=oi.fromNumber(this.Ie)}Ee(e,n,r){let i=e.add(n.multiply(oi.fromNumber(r)));return i.compare(Nb)===1&&(i=new oi([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=H_(e),[r,i]=q_(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);if(!this.de(o))return!1}return!0}static create(e,n,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new qp(s,i,n);return r.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const n=H_(e),[r,i]=q_(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class fo extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fc{constructor(e,n,r,i,s){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const i=new Map;return i.set(e,Sa.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new fc(J.min(),i,new Re(le),Kn(),te())}}class Sa{constructor(e,n,r,i,s){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new Sa(r,n,te(),te(),te())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bl{constructor(e,n,r,i){this.Re=e,this.removedTargetIds=n,this.key=r,this.Ve=i}}class j0{constructor(e,n){this.targetId=e,this.me=n}}class U0{constructor(e,n,r=tt.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=i}}class K_{constructor(){this.fe=0,this.ge=Q_(),this.pe=tt.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=te(),n=te(),r=te();return this.ge.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:r=r.add(i);break;default:X()}}),new Sa(this.pe,this.ye,e,n,r)}Ce(){this.we=!1,this.ge=Q_()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,he(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class xb{constructor(e){this.Le=e,this.Be=new Map,this.ke=Kn(),this.qe=G_(),this.Qe=new Re(le)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const r=this.Ge(n);switch(e.state){case 0:this.ze(n)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),r.De(e.resumeToken));break;default:X()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((r,i)=>{this.ze(i)&&n(i)})}He(e){const n=e.targetId,r=e.me.count,i=this.Je(n);if(i){const s=i.target;if(nf(s))if(r===0){const o=new K(s.path);this.Ue(n,o,dt.newNoDocument(o,J.min()))}else he(r===1);else{const o=this.Ye(n);if(o!==r){const l=this.Ze(e),u=l?this.Xe(l,e,o):1;if(u!==0){this.je(n);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,c)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=n;let o,l;try{o=yi(r).toUint8Array()}catch(u){if(u instanceof m0)return ms("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new qp(o,i,s)}catch(u){return ms(u instanceof fo?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.Ie===0?null:l}Xe(e,n,r){return n.me.count===r-this.nt(e,n.targetId)?0:2}nt(e,n){const r=this.Le.getRemoteKeysForTarget(n);let i=0;return r.forEach(s=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Ue(n,s,null),i++)}),i}rt(e){const n=new Map;this.Be.forEach((s,o)=>{const l=this.Je(o);if(l){if(s.current&&nf(l.target)){const u=new K(l.target.path);this.ke.get(u)!==null||this.it(o,u)||this.Ue(o,u,dt.newNoDocument(u,e))}s.be&&(n.set(o,s.ve()),s.Ce())}});let r=te();this.qe.forEach((s,o)=>{let l=!0;o.forEachWhile(u=>{const c=this.Je(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(s))}),this.ke.forEach((s,o)=>o.setReadTime(e));const i=new fc(e,n,this.Qe,this.ke,r);return this.ke=Kn(),this.qe=G_(),this.Qe=new Re(le),i}$e(e,n){if(!this.ze(e))return;const r=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,r),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,r){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,n)?i.Fe(n,1):i.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),r&&(this.ke=this.ke.insert(n,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new K_,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new Ze(le),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||H("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new K_),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function G_(){return new Re(K.comparator)}function Q_(){return new Re(K.comparator)}const bb={asc:"ASCENDING",desc:"DESCENDING"},Db={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Ob={and:"AND",or:"OR"};class Lb{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function sf(t,e){return t.useProto3Json||ac(e)?e:{value:e}}function Pu(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function F0(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function Vb(t,e){return Pu(t,e.toTimestamp())}function An(t){return he(!!t),J.fromTimestamp(function(n){const r=Dr(n);return new $e(r.seconds,r.nanos)}(t))}function Kp(t,e){return of(t,e).canonicalString()}function of(t,e){const n=function(i){return new ve(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function B0(t){const e=ve.fromString(t);return he(q0(e)),e}function af(t,e){return Kp(t.databaseId,e.path)}function bh(t,e){const n=B0(e);if(n.get(1)!==t.databaseId.projectId)throw new z(M.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new z(M.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new K(z0(n))}function $0(t,e){return Kp(t.databaseId,e)}function Mb(t){const e=B0(t);return e.length===4?ve.emptyPath():z0(e)}function lf(t){return new ve(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function z0(t){return he(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function Y_(t,e,n){return{name:af(t,e),fields:n.value.mapValue.fields}}function jb(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:X()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(c,d){return c.useProto3Json?(he(d===void 0||typeof d=="string"),tt.fromBase64String(d||"")):(he(d===void 0||d instanceof Buffer||d instanceof Uint8Array),tt.fromUint8Array(d||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(c){const d=c.code===void 0?M.UNKNOWN:M0(c.code);return new z(d,c.message||"")}(o);n=new U0(r,i,s,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=bh(t,r.document.name),s=An(r.document.updateTime),o=r.document.createTime?An(r.document.createTime):J.min(),l=new At({mapValue:{fields:r.document.fields}}),u=dt.newFoundDocument(i,s,o,l),c=r.targetIds||[],d=r.removedTargetIds||[];n=new Bl(c,d,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=bh(t,r.document),s=r.readTime?An(r.readTime):J.min(),o=dt.newNoDocument(i,s),l=r.removedTargetIds||[];n=new Bl([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=bh(t,r.document),s=r.removedTargetIds||[];n=new Bl([],s,i,null)}else{if(!("filter"in e))return X();{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new Rb(i,s),l=r.targetId;n=new j0(l,o)}}return n}function Ub(t,e){let n;if(e instanceof Ia)n={update:Y_(t,e.key,e.value)};else if(e instanceof Wp)n={delete:af(t,e.key)};else if(e instanceof Br)n={update:Y_(t,e.key,e.data),updateMask:Gb(e.fieldMask)};else{if(!(e instanceof Sb))return X();n={verify:af(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const l=o.transform;if(l instanceof oa)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof vs)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof aa)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Ru)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw X()}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:Vb(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:X()}(t,e.precondition)),n}function Fb(t,e){return t&&t.length>0?(he(e!==void 0),t.map(n=>function(i,s){let o=i.updateTime?An(i.updateTime):An(s);return o.isEqual(J.min())&&(o=An(s)),new Eb(o,i.transformResults||[])}(n,e))):[]}function Bb(t,e){return{documents:[$0(t,e.path)]}}function $b(t,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=$0(t,i);const s=function(c){if(c.length!==0)return H0(dn.create(c,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(c){if(c.length!==0)return c.map(d=>function(g){return{field:Li(g.field),direction:Hb(g.dir)}}(d))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=sf(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),{_t:n,parent:i}}function zb(t){let e=Mb(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){he(r===1);const d=n.from[0];d.allDescendants?i=d.collectionId:e=e.child(d.collectionId)}let s=[];n.where&&(s=function(m){const g=W0(m);return g instanceof dn&&v0(g)?g.getFilters():[g]}(n.where));let o=[];n.orderBy&&(o=function(m){return m.map(g=>function(R){return new sa(Vi(R.field),function(b){switch(b){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(R.direction))}(g))}(n.orderBy));let l=null;n.limit&&(l=function(m){let g;return g=typeof m=="object"?m.value:m,ac(g)?null:g}(n.limit));let u=null;n.startAt&&(u=function(m){const g=!!m.before,I=m.values||[];return new Au(I,g)}(n.startAt));let c=null;return n.endAt&&(c=function(m){const g=!m.before,I=m.values||[];return new Au(I,g)}(n.endAt)),lb(e,i,o,s,l,"F",u,c)}function Wb(t,e){const n=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return X()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function W0(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=Vi(n.unaryFilter.field);return Ue.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=Vi(n.unaryFilter.field);return Ue.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Vi(n.unaryFilter.field);return Ue.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Vi(n.unaryFilter.field);return Ue.create(o,"!=",{nullValue:"NULL_VALUE"});default:return X()}}(t):t.fieldFilter!==void 0?function(n){return Ue.create(Vi(n.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return X()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return dn.create(n.compositeFilter.filters.map(r=>W0(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return X()}}(n.compositeFilter.op))}(t):X()}function Hb(t){return bb[t]}function qb(t){return Db[t]}function Kb(t){return Ob[t]}function Li(t){return{fieldPath:t.canonicalString()}}function Vi(t){return Ye.fromServerFormat(t.fieldPath)}function H0(t){return t instanceof Ue?function(n){if(n.op==="=="){if(V_(n.value))return{unaryFilter:{field:Li(n.field),op:"IS_NAN"}};if(L_(n.value))return{unaryFilter:{field:Li(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(V_(n.value))return{unaryFilter:{field:Li(n.field),op:"IS_NOT_NAN"}};if(L_(n.value))return{unaryFilter:{field:Li(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Li(n.field),op:qb(n.op),value:n.value}}}(t):t instanceof dn?function(n){const r=n.getFilters().map(i=>H0(i));return r.length===1?r[0]:{compositeFilter:{op:Kb(n.op),filters:r}}}(t):X()}function Gb(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function q0(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr{constructor(e,n,r,i,s=J.min(),o=J.min(),l=tt.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new gr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new gr(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new gr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new gr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qb{constructor(e){this.ct=e}}function Yb(t){const e=zb({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?ku(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xb{constructor(){this.un=new Jb}addToCollectionParentIndex(e,n){return this.un.add(n),j.resolve()}getCollectionParents(e,n){return j.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return j.resolve()}deleteFieldIndex(e,n){return j.resolve()}deleteAllFieldIndexes(e){return j.resolve()}createTargetIndexes(e,n){return j.resolve()}getDocumentsMatchingTarget(e,n){return j.resolve(null)}getIndexType(e,n){return j.resolve(0)}getFieldIndexes(e,n){return j.resolve([])}getNextCollectionGroupToUpdate(e){return j.resolve(null)}getMinOffset(e,n){return j.resolve(br.min())}getMinOffsetFromCollectionGroup(e,n){return j.resolve(br.min())}updateCollectionGroup(e,n,r){return j.resolve()}updateIndexEntries(e,n){return j.resolve()}}class Jb{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new Ze(ve.comparator),s=!i.has(r);return this.index[n]=i.add(r),s}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new Ze(ve.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ws{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new ws(0)}static kn(){return new ws(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zb{constructor(){this.changes=new bs(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,dt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?j.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eD{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tD{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,n))).next(i=>(r!==null&&Co(r.mutation,i,Vt.empty(),$e.now()),i))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,te()).next(()=>r))}getLocalViewOfDocuments(e,n,r=te()){const i=ti();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,r).next(s=>{let o=ho();return s.forEach((l,u)=>{o=o.insert(l,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=ti();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,te()))}populateOverlays(e,n,r){const i=[];return r.forEach(s=>{n.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,r,i){let s=Kn();const o=Po(),l=function(){return Po()}();return n.forEach((u,c)=>{const d=r.get(c.key);i.has(c.key)&&(d===void 0||d.mutation instanceof Br)?s=s.insert(c.key,c):d!==void 0?(o.set(c.key,d.mutation.getFieldMask()),Co(d.mutation,c,d.mutation.getFieldMask(),$e.now())):o.set(c.key,Vt.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((c,d)=>o.set(c,d)),n.forEach((c,d)=>{var m;return l.set(c,new eD(d,(m=o.get(c))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,n){const r=Po();let i=new Re((o,l)=>o-l),s=te();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(u=>{const c=n.get(u);if(c===null)return;let d=r.get(u)||Vt.empty();d=l.applyToLocalView(c,d),r.set(u,d);const m=(i.get(l.batchId)||te()).add(u);i=i.insert(l.batchId,m)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),c=u.key,d=u.value,m=P0();d.forEach(g=>{if(!s.has(g)){const I=L0(n.get(g),r.get(g));I!==null&&m.set(g,I),s=s.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(e,c,m))}return j.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,i){return function(o){return K.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):I0(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-s.size):j.resolve(ti());let l=-1,u=s;return o.next(c=>j.forEach(c,(d,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),s.get(d)?j.resolve():this.remoteDocumentCache.getEntry(e,d).next(g=>{u=u.insert(d,g)}))).next(()=>this.populateOverlays(e,c,s)).next(()=>this.computeViews(e,u,c,te())).next(d=>({batchId:l,changes:R0(d)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new K(n)).next(r=>{let i=ho();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const s=n.collectionGroup;let o=ho();return this.indexManager.getCollectionParents(e,s).next(l=>j.forEach(l,u=>{const c=function(m,g){return new xs(g,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,c,r,i).next(d=>{d.forEach((m,g)=>{o=o.insert(m,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,s,i))).next(o=>{s.forEach((u,c)=>{const d=c.getKey();o.get(d)===null&&(o=o.insert(d,dt.newInvalidDocument(d)))});let l=ho();return o.forEach((u,c)=>{const d=s.get(u);d!==void 0&&Co(d.mutation,c,Vt.empty(),$e.now()),cc(n,c)&&(l=l.insert(u,c))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nD{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return j.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(i){return{id:i.id,version:i.version,createTime:An(i.createTime)}}(n)),j.resolve()}getNamedQuery(e,n){return j.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(i){return{name:i.name,query:Yb(i.bundledQuery),readTime:An(i.readTime)}}(n)),j.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rD{constructor(){this.overlays=new Re(K.comparator),this.Ir=new Map}getOverlay(e,n){return j.resolve(this.overlays.get(n))}getOverlays(e,n){const r=ti();return j.forEach(n,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((i,s)=>{this.ht(e,n,s)}),j.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.Ir.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(r)),j.resolve()}getOverlaysForCollection(e,n,r){const i=ti(),s=n.length+1,o=new K(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const u=l.getNext().value,c=u.getKey();if(!n.isPrefixOf(c.path))break;c.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return j.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let s=new Re((c,d)=>c-d);const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===n&&c.largestBatchId>r){let d=s.get(c.largestBatchId);d===null&&(d=ti(),s=s.insert(c.largestBatchId,d)),d.set(c.getKey(),c)}}const l=ti(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((c,d)=>l.set(c,d)),!(l.size()>=i)););return j.resolve(l)}ht(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(r.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new kb(n,r));let s=this.Ir.get(n);s===void 0&&(s=te(),this.Ir.set(n,s)),this.Ir.set(n,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iD{constructor(){this.sessionToken=tt.EMPTY_BYTE_STRING}getSessionToken(e){return j.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,j.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gp{constructor(){this.Tr=new Ze(ze.Er),this.dr=new Ze(ze.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const r=new ze(e,n);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Vr(new ze(e,n))}mr(e,n){e.forEach(r=>this.removeReference(r,n))}gr(e){const n=new K(new ve([])),r=new ze(n,e),i=new ze(n,e+1),s=[];return this.dr.forEachInRange([r,i],o=>{this.Vr(o),s.push(o.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new K(new ve([])),r=new ze(n,e),i=new ze(n,e+1);let s=te();return this.dr.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const n=new ze(e,0),r=this.Tr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class ze{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return K.comparator(e.key,n.key)||le(e.wr,n.wr)}static Ar(e,n){return le(e.wr,n.wr)||K.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sD{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new Ze(ze.Er)}checkEmpty(e){return j.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Ab(s,n,r,i);this.mutationQueue.push(o);for(const l of i)this.br=this.br.add(new ze(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return j.resolve(o)}lookupMutationBatch(e,n){return j.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.vr(r),s=i<0?0:i;return j.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return j.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return j.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new ze(n,0),i=new ze(n,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([r,i],o=>{const l=this.Dr(o.wr);s.push(l)}),j.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new Ze(le);return n.forEach(i=>{const s=new ze(i,0),o=new ze(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,o],l=>{r=r.add(l.wr)})}),j.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let s=r;K.isDocumentKey(s)||(s=s.child(""));const o=new ze(new K(s),0);let l=new Ze(le);return this.br.forEachWhile(u=>{const c=u.key.path;return!!r.isPrefixOf(c)&&(c.length===i&&(l=l.add(u.wr)),!0)},o),j.resolve(this.Cr(l))}Cr(e){const n=[];return e.forEach(r=>{const i=this.Dr(r);i!==null&&n.push(i)}),n}removeMutationBatch(e,n){he(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return j.forEach(n.mutations,i=>{const s=new ze(i.key,n.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,n){const r=new ze(n,0),i=this.br.firstAfterOrEqual(r);return j.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,j.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oD{constructor(e){this.Mr=e,this.docs=function(){return new Re(K.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),s=i?i.size:0,o=this.Mr(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return j.resolve(r?r.document.mutableCopy():dt.newInvalidDocument(n))}getEntries(e,n){let r=Kn();return n.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():dt.newInvalidDocument(i))}),j.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let s=Kn();const o=n.path,l=new K(o.child("")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:c,value:{document:d}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||zx($x(d),r)<=0||(i.has(d.key)||cc(n,d))&&(s=s.insert(d.key,d.mutableCopy()))}return j.resolve(s)}getAllFromCollectionGroup(e,n,r,i){X()}Or(e,n){return j.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new aD(this)}getSize(e){return j.resolve(this.size)}}class aD extends Zb{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?n.push(this.cr.addEntry(e,i)):this.cr.removeEntry(r)}),j.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lD{constructor(e){this.persistence=e,this.Nr=new bs(n=>Bp(n),$p),this.lastRemoteSnapshotVersion=J.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Gp,this.targetCount=0,this.kr=ws.Bn()}forEachTarget(e,n){return this.Nr.forEach((r,i)=>n(i)),j.resolve()}getLastRemoteSnapshotVersion(e){return j.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return j.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),j.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.Lr&&(this.Lr=n),j.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new ws(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,j.resolve()}updateTargetData(e,n){return this.Kn(n),j.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,j.resolve()}removeTargets(e,n,r){let i=0;const s=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=n&&r.get(l.targetId)===null&&(this.Nr.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),j.waitFor(s).next(()=>i)}getTargetCount(e){return j.resolve(this.targetCount)}getTargetData(e,n){const r=this.Nr.get(n)||null;return j.resolve(r)}addMatchingKeys(e,n,r){return this.Br.Rr(n,r),j.resolve()}removeMatchingKeys(e,n,r){this.Br.mr(n,r);const i=this.persistence.referenceDelegate,s=[];return i&&n.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),j.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),j.resolve()}getMatchingKeysForTargetId(e,n){const r=this.Br.yr(n);return j.resolve(r)}containsKey(e,n){return j.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uD{constructor(e,n){this.qr={},this.overlays={},this.Qr=new Mp(0),this.Kr=!1,this.Kr=!0,this.$r=new iD,this.referenceDelegate=e(this),this.Ur=new lD(this),this.indexManager=new Xb,this.remoteDocumentCache=function(i){return new oD(i)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new Qb(n),this.Gr=new nD(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new rD,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.qr[e.toKey()];return r||(r=new sD(n,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,r){H("MemoryPersistence","Starting transaction:",e);const i=new cD(this.Qr.next());return this.referenceDelegate.zr(),r(i).next(s=>this.referenceDelegate.jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Hr(e,n){return j.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,n)))}}class cD extends Hx{constructor(e){super(),this.currentSequenceNumber=e}}class Qp{constructor(e){this.persistence=e,this.Jr=new Gp,this.Yr=null}static Zr(e){return new Qp(e)}get Xr(){if(this.Yr)return this.Yr;throw X()}addReference(e,n,r){return this.Jr.addReference(r,n),this.Xr.delete(r.toString()),j.resolve()}removeReference(e,n,r){return this.Jr.removeReference(r,n),this.Xr.add(r.toString()),j.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),j.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(i=>this.Xr.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(i=>{i.forEach(s=>this.Xr.add(s.toString()))}).next(()=>r.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return j.forEach(this.Xr,r=>{const i=K.fromPath(r);return this.ei(e,i).next(s=>{s||n.removeEntry(i,J.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(r=>{r?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return j.or([()=>j.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yp{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.$i=r,this.Ui=i}static Wi(e,n){let r=te(),i=te();for(const s of n.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new Yp(e,n.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hD{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dD{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return ZP()?8:qx(mt())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,r,i){const s={result:null};return this.Yi(e,n).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.Zi(e,n,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new hD;return this.Xi(e,n,o).next(l=>{if(s.result=l,this.zi)return this.es(e,n,o,l.size)})}).next(()=>s.result)}es(e,n,r,i){return r.documentReadCount<this.ji?(no()<=ne.DEBUG&&H("QueryEngine","SDK will not create cache indexes for query:",Oi(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),j.resolve()):(no()<=ne.DEBUG&&H("QueryEngine","Query:",Oi(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.Hi*i?(no()<=ne.DEBUG&&H("QueryEngine","The SDK decides to create cache indexes for query:",Oi(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Sn(n))):j.resolve())}Yi(e,n){if(F_(n))return j.resolve(null);let r=Sn(n);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=ku(n,null,"F"),r=Sn(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=te(...s);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,r).next(u=>{const c=this.ts(n,l);return this.ns(n,c,o,u.readTime)?this.Yi(e,ku(n,null,"F")):this.rs(e,c,n,u)}))})))}Zi(e,n,r,i){return F_(n)||i.isEqual(J.min())?j.resolve(null):this.Ji.getDocuments(e,r).next(s=>{const o=this.ts(n,s);return this.ns(n,o,r,i)?j.resolve(null):(no()<=ne.DEBUG&&H("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),Oi(n)),this.rs(e,o,n,Bx(i,-1)).next(l=>l))})}ts(e,n){let r=new Ze(A0(e));return n.forEach((i,s)=>{cc(e,s)&&(r=r.add(s))}),r}ns(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Xi(e,n,r){return no()<=ne.DEBUG&&H("QueryEngine","Using full collection scan to execute query:",Oi(n)),this.Ji.getDocumentsMatchingQuery(e,n,br.min(),r)}rs(e,n,r,i){return this.Ji.getDocumentsMatchingQuery(e,r,i).next(s=>(n.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fD{constructor(e,n,r,i){this.persistence=e,this.ss=n,this.serializer=i,this.os=new Re(le),this._s=new bs(s=>Bp(s),$p),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new tD(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function pD(t,e,n,r){return new fD(t,e,n,r)}async function K0(t,e){const n=Z(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,n.ls(e),n.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],l=[];let u=te();for(const c of i){o.push(c.batchId);for(const d of c.mutations)u=u.add(d.key)}for(const c of s){l.push(c.batchId);for(const d of c.mutations)u=u.add(d.key)}return n.localDocuments.getDocuments(r,u).next(c=>({hs:c,removedBatchIds:o,addedBatchIds:l}))})})}function mD(t,e){const n=Z(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=n.cs.newChangeBuffer({trackRemovals:!0});return function(l,u,c,d){const m=c.batch,g=m.keys();let I=j.resolve();return g.forEach(R=>{I=I.next(()=>d.getEntry(u,R)).next(C=>{const b=c.docVersions.get(R);he(b!==null),C.version.compareTo(b)<0&&(m.applyToRemoteDocument(C,c),C.isValidDocument()&&(C.setReadTime(c.commitVersion),d.addEntry(C)))})}),I.next(()=>l.mutationQueue.removeMutationBatch(u,m))}(n,r,e,s).next(()=>s.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let u=te();for(let c=0;c<l.mutationResults.length;++c)l.mutationResults[c].transformResults.length>0&&(u=u.add(l.batch.mutations[c].key));return u}(e))).next(()=>n.localDocuments.getDocuments(r,i))})}function G0(t){const e=Z(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function gD(t,e){const n=Z(t),r=e.snapshotVersion;let i=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});i=n.os;const l=[];e.targetChanges.forEach((d,m)=>{const g=i.get(m);if(!g)return;l.push(n.Ur.removeMatchingKeys(s,d.removedDocuments,m).next(()=>n.Ur.addMatchingKeys(s,d.addedDocuments,m)));let I=g.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(m)!==null?I=I.withResumeToken(tt.EMPTY_BYTE_STRING,J.min()).withLastLimboFreeSnapshotVersion(J.min()):d.resumeToken.approximateByteSize()>0&&(I=I.withResumeToken(d.resumeToken,r)),i=i.insert(m,I),function(C,b,k){return C.resumeToken.approximateByteSize()===0||b.snapshotVersion.toMicroseconds()-C.snapshotVersion.toMicroseconds()>=3e8?!0:k.addedDocuments.size+k.modifiedDocuments.size+k.removedDocuments.size>0}(g,I,d)&&l.push(n.Ur.updateTargetData(s,I))});let u=Kn(),c=te();if(e.documentUpdates.forEach(d=>{e.resolvedLimboDocuments.has(d)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(s,d))}),l.push(yD(s,o,e.documentUpdates).next(d=>{u=d.Ps,c=d.Is})),!r.isEqual(J.min())){const d=n.Ur.getLastRemoteSnapshotVersion(s).next(m=>n.Ur.setTargetsMetadata(s,s.currentSequenceNumber,r));l.push(d)}return j.waitFor(l).next(()=>o.apply(s)).next(()=>n.localDocuments.getLocalViewOfDocuments(s,u,c)).next(()=>u)}).then(s=>(n.os=i,s))}function yD(t,e,n){let r=te(),i=te();return n.forEach(s=>r=r.add(s)),e.getEntries(t,r).next(s=>{let o=Kn();return n.forEach((l,u)=>{const c=s.get(l);u.isFoundDocument()!==c.isFoundDocument()&&(i=i.add(l)),u.isNoDocument()&&u.version.isEqual(J.min())?(e.removeEntry(l,u.readTime),o=o.insert(l,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(l,u)):H("LocalStore","Ignoring outdated watch update for ",l,". Current version:",c.version," Watch version:",u.version)}),{Ps:o,Is:i}})}function _D(t,e){const n=Z(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function vD(t,e){const n=Z(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return n.Ur.getTargetData(r,e).next(s=>s?(i=s,j.resolve(i)):n.Ur.allocateTargetId(r).next(o=>(i=new gr(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.Ur.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=n.os.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.os=n.os.insert(r.targetId,r),n._s.set(e,r.targetId)),r})}async function uf(t,e,n){const r=Z(t),i=r.os.get(e),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!Ta(o))throw o;H("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}r.os=r.os.remove(e),r._s.delete(i.target)}function X_(t,e,n){const r=Z(t);let i=J.min(),s=te();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,c,d){const m=Z(u),g=m._s.get(d);return g!==void 0?j.resolve(m.os.get(g)):m.Ur.getTargetData(c,d)}(r,o,Sn(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(o,l.targetId).next(u=>{s=u})}).next(()=>r.ss.getDocumentsMatchingQuery(o,e,n?i:J.min(),n?s:te())).next(l=>(wD(r,cb(e),l),{documents:l,Ts:s})))}function wD(t,e,n){let r=t.us.get(e)||J.min();n.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),t.us.set(e,r)}class J_{constructor(){this.activeTargetIds=gb()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class ED{constructor(){this.so=new J_,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,r){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new J_,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TD{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z_{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){H("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){H("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let gl=null;function Dh(){return gl===null?gl=function(){return 268435456+Math.round(2147483648*Math.random())}():gl++,"0x"+gl.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ID={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SD{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ut="WebChannelConnection";class AD extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+n.host,this.vo=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get Fo(){return!1}Mo(n,r,i,s,o){const l=Dh(),u=this.xo(n,r.toUriEncodedString());H("RestConnection",`Sending RPC '${n}' ${l}:`,u,i);const c={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(c,s,o),this.No(n,u,c,i).then(d=>(H("RestConnection",`Received RPC '${n}' ${l}: `,d),d),d=>{throw ms("RestConnection",`RPC '${n}' ${l} failed with error: `,d,"url: ",u,"request:",i),d})}Lo(n,r,i,s,o,l){return this.Mo(n,r,i,s,o)}Oo(n,r,i){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Ns}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,o)=>n[o]=s),i&&i.headers.forEach((s,o)=>n[o]=s)}xo(n,r){const i=ID[n];return`${this.Do}/v1/${r}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,r,i){const s=Dh();return new Promise((o,l)=>{const u=new a0;u.setWithCredentials(!0),u.listenOnce(l0.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case jl.NO_ERROR:const d=u.getResponseJson();H(ut,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(d)),o(d);break;case jl.TIMEOUT:H(ut,`RPC '${e}' ${s} timed out`),l(new z(M.DEADLINE_EXCEEDED,"Request time out"));break;case jl.HTTP_ERROR:const m=u.getStatus();if(H(ut,`RPC '${e}' ${s} failed with status:`,m,"response text:",u.getResponseText()),m>0){let g=u.getResponseJson();Array.isArray(g)&&(g=g[0]);const I=g==null?void 0:g.error;if(I&&I.status&&I.message){const R=function(b){const k=b.toLowerCase().replace(/_/g,"-");return Object.values(M).indexOf(k)>=0?k:M.UNKNOWN}(I.status);l(new z(R,I.message))}else l(new z(M.UNKNOWN,"Server responded with status "+u.getStatus()))}else l(new z(M.UNAVAILABLE,"Connection failed."));break;default:X()}}finally{H(ut,`RPC '${e}' ${s} completed.`)}});const c=JSON.stringify(i);H(ut,`RPC '${e}' ${s} sending request:`,i),u.send(n,"POST",c,r,15)})}Bo(e,n,r){const i=Dh(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=h0(),l=c0(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Oo(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const d=s.join("");H(ut,`Creating RPC '${e}' stream ${i}: ${d}`,u);const m=o.createWebChannel(d,u);let g=!1,I=!1;const R=new SD({Io:b=>{I?H(ut,`Not sending because RPC '${e}' stream ${i} is closed:`,b):(g||(H(ut,`Opening RPC '${e}' stream ${i} transport.`),m.open(),g=!0),H(ut,`RPC '${e}' stream ${i} sending:`,b),m.send(b))},To:()=>m.close()}),C=(b,k,w)=>{b.listen(k,v=>{try{w(v)}catch(O){setTimeout(()=>{throw O},0)}})};return C(m,co.EventType.OPEN,()=>{I||(H(ut,`RPC '${e}' stream ${i} transport opened.`),R.yo())}),C(m,co.EventType.CLOSE,()=>{I||(I=!0,H(ut,`RPC '${e}' stream ${i} transport closed`),R.So())}),C(m,co.EventType.ERROR,b=>{I||(I=!0,ms(ut,`RPC '${e}' stream ${i} transport errored:`,b),R.So(new z(M.UNAVAILABLE,"The operation could not be completed")))}),C(m,co.EventType.MESSAGE,b=>{var k;if(!I){const w=b.data[0];he(!!w);const v=w,O=v.error||((k=v[0])===null||k===void 0?void 0:k.error);if(O){H(ut,`RPC '${e}' stream ${i} received error:`,O);const U=O.status;let x=function(T){const A=Ve[T];if(A!==void 0)return M0(A)}(U),E=O.message;x===void 0&&(x=M.INTERNAL,E="Unknown error status: "+U+" with message "+O.message),I=!0,R.So(new z(x,E)),m.close()}else H(ut,`RPC '${e}' stream ${i} received:`,w),R.bo(w)}}),C(l,u0.STAT_EVENT,b=>{b.stat===Jd.PROXY?H(ut,`RPC '${e}' stream ${i} detected buffering proxy`):b.stat===Jd.NOPROXY&&H(ut,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{R.wo()},0),R}}function Oh(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pc(t){return new Lb(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q0{constructor(e,n,r=1e3,i=1.5,s=6e4){this.ui=e,this.timerId=n,this.ko=r,this.qo=i,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),i=Math.max(0,n-r);i>0&&H("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y0{constructor(e,n,r,i,s,o,l,u){this.ui=e,this.Ho=r,this.Jo=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Q0(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===M.RESOURCE_EXHAUSTED?(qn(n.toString()),qn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===M.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.Yo===n&&this.P_(r,i)},r=>{e(()=>{const i=new z(M.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(i)})})}P_(e,n){const r=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{r(()=>this.I_(i))}),this.stream.onMessage(i=>{r(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return H("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(H("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class kD extends Y0{constructor(e,n,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=jb(this.serializer,e),r=function(s){if(!("targetChange"in s))return J.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?J.min():o.readTime?An(o.readTime):J.min()}(e);return this.listener.d_(n,r)}A_(e){const n={};n.database=lf(this.serializer),n.addTarget=function(s,o){let l;const u=o.target;if(l=nf(u)?{documents:Bb(s,u)}:{query:$b(s,u)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=F0(s,o.resumeToken);const c=sf(s,o.expectedCount);c!==null&&(l.expectedCount=c)}else if(o.snapshotVersion.compareTo(J.min())>0){l.readTime=Pu(s,o.snapshotVersion.toTimestamp());const c=sf(s,o.expectedCount);c!==null&&(l.expectedCount=c)}return l}(this.serializer,e);const r=Wb(this.serializer,e);r&&(n.labels=r),this.a_(n)}R_(e){const n={};n.database=lf(this.serializer),n.removeTarget=e,this.a_(n)}}class RD extends Y0{constructor(e,n,r,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return he(!!e.streamToken),this.lastStreamToken=e.streamToken,he(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){he(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=Fb(e.writeResults,e.commitTime),r=An(e.commitTime);return this.listener.g_(r,n)}p_(){const e={};e.database=lf(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>Ub(this.serializer,r))};this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PD extends class{}{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new z(M.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Mo(e,of(n,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new z(M.UNKNOWN,s.toString())})}Lo(e,n,r,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,of(n,r),i,o,l,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new z(M.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class CD{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(qn(n),this.D_=!1):H("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ND{constructor(e,n,r,i,s){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(o=>{r.enqueueAndForget(async()=>{Ri(this)&&(H("RemoteStore","Restarting streams for network reachability change."),await async function(u){const c=Z(u);c.L_.add(4),await Aa(c),c.q_.set("Unknown"),c.L_.delete(4),await mc(c)}(this))})}),this.q_=new CD(r,i)}}async function mc(t){if(Ri(t))for(const e of t.B_)await e(!0)}async function Aa(t){for(const e of t.B_)await e(!1)}function X0(t,e){const n=Z(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),em(n)?Zp(n):Ds(n).r_()&&Jp(n,e))}function Xp(t,e){const n=Z(t),r=Ds(n);n.N_.delete(e),r.r_()&&J0(n,e),n.N_.size===0&&(r.r_()?r.o_():Ri(n)&&n.q_.set("Unknown"))}function Jp(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(J.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Ds(t).A_(e)}function J0(t,e){t.Q_.xe(e),Ds(t).R_(e)}function Zp(t){t.Q_=new xb({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),Ds(t).start(),t.q_.v_()}function em(t){return Ri(t)&&!Ds(t).n_()&&t.N_.size>0}function Ri(t){return Z(t).L_.size===0}function Z0(t){t.Q_=void 0}async function xD(t){t.q_.set("Online")}async function bD(t){t.N_.forEach((e,n)=>{Jp(t,e)})}async function DD(t,e){Z0(t),em(t)?(t.q_.M_(e),Zp(t)):t.q_.set("Unknown")}async function OD(t,e,n){if(t.q_.set("Online"),e instanceof U0&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const l of s.targetIds)i.N_.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.N_.delete(l),i.Q_.removeTarget(l))}(t,e)}catch(r){H("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Cu(t,r)}else if(e instanceof Bl?t.Q_.Ke(e):e instanceof j0?t.Q_.He(e):t.Q_.We(e),!n.isEqual(J.min()))try{const r=await G0(t.localStore);n.compareTo(r)>=0&&await function(s,o){const l=s.Q_.rt(o);return l.targetChanges.forEach((u,c)=>{if(u.resumeToken.approximateByteSize()>0){const d=s.N_.get(c);d&&s.N_.set(c,d.withResumeToken(u.resumeToken,o))}}),l.targetMismatches.forEach((u,c)=>{const d=s.N_.get(u);if(!d)return;s.N_.set(u,d.withResumeToken(tt.EMPTY_BYTE_STRING,d.snapshotVersion)),J0(s,u);const m=new gr(d.target,u,c,d.sequenceNumber);Jp(s,m)}),s.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(r){H("RemoteStore","Failed to raise snapshot:",r),await Cu(t,r)}}async function Cu(t,e,n){if(!Ta(e))throw e;t.L_.add(1),await Aa(t),t.q_.set("Offline"),n||(n=()=>G0(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{H("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await mc(t)})}function eI(t,e){return e().catch(n=>Cu(t,n,e))}async function gc(t){const e=Z(t),n=Or(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;LD(e);)try{const i=await _D(e.localStore,r);if(i===null){e.O_.length===0&&n.o_();break}r=i.batchId,VD(e,i)}catch(i){await Cu(e,i)}tI(e)&&nI(e)}function LD(t){return Ri(t)&&t.O_.length<10}function VD(t,e){t.O_.push(e);const n=Or(t);n.r_()&&n.V_&&n.m_(e.mutations)}function tI(t){return Ri(t)&&!Or(t).n_()&&t.O_.length>0}function nI(t){Or(t).start()}async function MD(t){Or(t).p_()}async function jD(t){const e=Or(t);for(const n of t.O_)e.m_(n.mutations)}async function UD(t,e,n){const r=t.O_.shift(),i=Hp.from(r,e,n);await eI(t,()=>t.remoteSyncer.applySuccessfulWrite(i)),await gc(t)}async function FD(t,e){e&&Or(t).V_&&await async function(r,i){if(function(o){return Pb(o)&&o!==M.ABORTED}(i.code)){const s=r.O_.shift();Or(r).s_(),await eI(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await gc(r)}}(t,e),tI(t)&&nI(t)}async function ev(t,e){const n=Z(t);n.asyncQueue.verifyOperationInProgress(),H("RemoteStore","RemoteStore received new credentials");const r=Ri(n);n.L_.add(3),await Aa(n),r&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await mc(n)}async function BD(t,e){const n=Z(t);e?(n.L_.delete(2),await mc(n)):e||(n.L_.add(2),await Aa(n),n.q_.set("Unknown"))}function Ds(t){return t.K_||(t.K_=function(n,r,i){const s=Z(n);return s.w_(),new kD(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Eo:xD.bind(null,t),Ro:bD.bind(null,t),mo:DD.bind(null,t),d_:OD.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),em(t)?Zp(t):t.q_.set("Unknown")):(await t.K_.stop(),Z0(t))})),t.K_}function Or(t){return t.U_||(t.U_=function(n,r,i){const s=Z(n);return s.w_(),new RD(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:MD.bind(null,t),mo:FD.bind(null,t),f_:jD.bind(null,t),g_:UD.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await gc(t)):(await t.U_.stop(),t.O_.length>0&&(H("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tm{constructor(e,n,r,i,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new Pr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,s){const o=Date.now()+r,l=new tm(e,n,o,i,s);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new z(M.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function nm(t,e){if(qn("AsyncQueue",`${e}: ${t}`),Ta(t))return new z(M.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(e){this.comparator=e?(n,r)=>e(n,r)||K.comparator(n.key,r.key):(n,r)=>K.comparator(n.key,r.key),this.keyedMap=ho(),this.sortedSet=new Re(this.comparator)}static emptySet(e){return new is(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof is)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new is;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tv{constructor(){this.W_=new Re(K.comparator)}track(e){const n=e.doc.key,r=this.W_.get(n);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(n,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(n):e.type===1&&r.type===2?this.W_=this.W_.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):X():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,r)=>{e.push(r)}),e}}class Es{constructor(e,n,r,i,s,o,l,u,c){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,n,r,i,s){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new Es(e,n,is.emptySet(n),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&uc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==r[i].type||!n[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $D{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class zD{constructor(){this.queries=nv(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,r){const i=Z(n),s=i.queries;i.queries=nv(),s.forEach((o,l)=>{for(const u of l.j_)u.onError(r)})})(this,new z(M.ABORTED,"Firestore shutting down"))}}function nv(){return new bs(t=>S0(t),uc)}async function rI(t,e){const n=Z(t);let r=3;const i=e.query;let s=n.queries.get(i);s?!s.H_()&&e.J_()&&(r=2):(s=new $D,r=e.J_()?0:1);try{switch(r){case 0:s.z_=await n.onListen(i,!0);break;case 1:s.z_=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const l=nm(o,`Initialization of query '${Oi(e.query)}' failed`);return void e.onError(l)}n.queries.set(i,s),s.j_.push(e),e.Z_(n.onlineState),s.z_&&e.X_(s.z_)&&rm(n)}async function iI(t,e){const n=Z(t),r=e.query;let i=3;const s=n.queries.get(r);if(s){const o=s.j_.indexOf(e);o>=0&&(s.j_.splice(o,1),s.j_.length===0?i=e.J_()?0:1:!s.H_()&&e.J_()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function WD(t,e){const n=Z(t);let r=!1;for(const i of e){const s=i.query,o=n.queries.get(s);if(o){for(const l of o.j_)l.X_(i)&&(r=!0);o.z_=i}}r&&rm(n)}function HD(t,e,n){const r=Z(t),i=r.queries.get(e);if(i)for(const s of i.j_)s.onError(n);r.queries.delete(e)}function rm(t){t.Y_.forEach(e=>{e.next()})}var cf,rv;(rv=cf||(cf={})).ea="default",rv.Cache="cache";class sI{constructor(e,n,r){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new Es(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const r=n!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=Es.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==cf.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oI{constructor(e){this.key=e}}class aI{constructor(e){this.key=e}}class qD{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=te(),this.mutatedKeys=te(),this.Aa=A0(e),this.Ra=new is(this.Aa)}get Va(){return this.Ta}ma(e,n){const r=n?n.fa:new tv,i=n?n.Ra:this.Ra;let s=n?n.mutatedKeys:this.mutatedKeys,o=i,l=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,c=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((d,m)=>{const g=i.get(d),I=cc(this.query,m)?m:null,R=!!g&&this.mutatedKeys.has(g.key),C=!!I&&(I.hasLocalMutations||this.mutatedKeys.has(I.key)&&I.hasCommittedMutations);let b=!1;g&&I?g.data.isEqual(I.data)?R!==C&&(r.track({type:3,doc:I}),b=!0):this.ga(g,I)||(r.track({type:2,doc:I}),b=!0,(u&&this.Aa(I,u)>0||c&&this.Aa(I,c)<0)&&(l=!0)):!g&&I?(r.track({type:0,doc:I}),b=!0):g&&!I&&(r.track({type:1,doc:g}),b=!0,(u||c)&&(l=!0)),b&&(I?(o=o.add(I),s=C?s.add(d):s.delete(d)):(o=o.delete(d),s=s.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),s=s.delete(d.key),r.track({type:1,doc:d})}return{Ra:o,fa:r,ns:l,mutatedKeys:s}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,i){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((d,m)=>function(I,R){const C=b=>{switch(b){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return X()}};return C(I)-C(R)}(d.type,m.type)||this.Aa(d.doc,m.doc)),this.pa(r),i=i!=null&&i;const l=n&&!i?this.ya():[],u=this.da.size===0&&this.current&&!i?1:0,c=u!==this.Ea;return this.Ea=u,o.length!==0||c?{snapshot:new Es(this.query,e.Ra,s,o,e.mutatedKeys,u===0,c,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new tv,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=te(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const n=[];return e.forEach(r=>{this.da.has(r)||n.push(new aI(r))}),this.da.forEach(r=>{e.has(r)||n.push(new oI(r))}),n}ba(e){this.Ta=e.Ts,this.da=te();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return Es.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class KD{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class GD{constructor(e){this.key=e,this.va=!1}}class QD{constructor(e,n,r,i,s,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new bs(l=>S0(l),uc),this.Ma=new Map,this.xa=new Set,this.Oa=new Re(K.comparator),this.Na=new Map,this.La=new Gp,this.Ba={},this.ka=new Map,this.qa=ws.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function YD(t,e,n=!0){const r=fI(t);let i;const s=r.Fa.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await lI(r,e,n,!0),i}async function XD(t,e){const n=fI(t);await lI(n,e,!0,!1)}async function lI(t,e,n,r){const i=await vD(t.localStore,Sn(e)),s=i.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let l;return r&&(l=await JD(t,e,s,o==="current",i.resumeToken)),t.isPrimaryClient&&n&&X0(t.remoteStore,i),l}async function JD(t,e,n,r,i){t.Ka=(m,g,I)=>async function(C,b,k,w){let v=b.view.ma(k);v.ns&&(v=await X_(C.localStore,b.query,!1).then(({documents:E})=>b.view.ma(E,v)));const O=w&&w.targetChanges.get(b.targetId),U=w&&w.targetMismatches.get(b.targetId)!=null,x=b.view.applyChanges(v,C.isPrimaryClient,O,U);return sv(C,b.targetId,x.wa),x.snapshot}(t,m,g,I);const s=await X_(t.localStore,e,!0),o=new qD(e,s.Ts),l=o.ma(s.documents),u=Sa.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",i),c=o.applyChanges(l,t.isPrimaryClient,u);sv(t,n,c.wa);const d=new KD(e,n,o);return t.Fa.set(e,d),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),c.snapshot}async function ZD(t,e,n){const r=Z(t),i=r.Fa.get(e),s=r.Ma.get(i.targetId);if(s.length>1)return r.Ma.set(i.targetId,s.filter(o=>!uc(o,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await uf(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&Xp(r.remoteStore,i.targetId),hf(r,i.targetId)}).catch(Ea)):(hf(r,i.targetId),await uf(r.localStore,i.targetId,!0))}async function eO(t,e){const n=Z(t),r=n.Fa.get(e),i=n.Ma.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Xp(n.remoteStore,r.targetId))}async function tO(t,e,n){const r=lO(t);try{const i=await function(o,l){const u=Z(o),c=$e.now(),d=l.reduce((I,R)=>I.add(R.key),te());let m,g;return u.persistence.runTransaction("Locally write mutations","readwrite",I=>{let R=Kn(),C=te();return u.cs.getEntries(I,d).next(b=>{R=b,R.forEach((k,w)=>{w.isValidDocument()||(C=C.add(k))})}).next(()=>u.localDocuments.getOverlayedDocuments(I,R)).next(b=>{m=b;const k=[];for(const w of l){const v=Ib(w,m.get(w.key).overlayedDocument);v!=null&&k.push(new Br(w.key,v,g0(v.value.mapValue),Yt.exists(!0)))}return u.mutationQueue.addMutationBatch(I,c,k,l)}).next(b=>{g=b;const k=b.applyToLocalDocumentSet(m,C);return u.documentOverlayCache.saveOverlays(I,b.batchId,k)})}).then(()=>({batchId:g.batchId,changes:R0(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(o,l,u){let c=o.Ba[o.currentUser.toKey()];c||(c=new Re(le)),c=c.insert(l,u),o.Ba[o.currentUser.toKey()]=c}(r,i.batchId,n),await ka(r,i.changes),await gc(r.remoteStore)}catch(i){const s=nm(i,"Failed to persist write");n.reject(s)}}async function uI(t,e){const n=Z(t);try{const r=await gD(n.localStore,e);e.targetChanges.forEach((i,s)=>{const o=n.Na.get(s);o&&(he(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?he(o.va):i.removedDocuments.size>0&&(he(o.va),o.va=!1))}),await ka(n,r,e)}catch(r){await Ea(r)}}function iv(t,e,n){const r=Z(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Fa.forEach((s,o)=>{const l=o.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const u=Z(o);u.onlineState=l;let c=!1;u.queries.forEach((d,m)=>{for(const g of m.j_)g.Z_(l)&&(c=!0)}),c&&rm(u)}(r.eventManager,e),i.length&&r.Ca.d_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function nO(t,e,n){const r=Z(t);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Na.get(e),s=i&&i.key;if(s){let o=new Re(K.comparator);o=o.insert(s,dt.newNoDocument(s,J.min()));const l=te().add(s),u=new fc(J.min(),new Map,new Re(le),o,l);await uI(r,u),r.Oa=r.Oa.remove(s),r.Na.delete(e),im(r)}else await uf(r.localStore,e,!1).then(()=>hf(r,e,n)).catch(Ea)}async function rO(t,e){const n=Z(t),r=e.batch.batchId;try{const i=await mD(n.localStore,e);hI(n,r,null),cI(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await ka(n,i)}catch(i){await Ea(i)}}async function iO(t,e,n){const r=Z(t);try{const i=await function(o,l){const u=Z(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",c=>{let d;return u.mutationQueue.lookupMutationBatch(c,l).next(m=>(he(m!==null),d=m.keys(),u.mutationQueue.removeMutationBatch(c,m))).next(()=>u.mutationQueue.performConsistencyCheck(c)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(c,d,l)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,d)).next(()=>u.localDocuments.getDocuments(c,d))})}(r.localStore,e);hI(r,e,n),cI(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await ka(r,i)}catch(i){await Ea(i)}}function cI(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function hI(t,e,n){const r=Z(t);let i=r.Ba[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(n?s.reject(n):s.resolve(),i=i.remove(e)),r.Ba[r.currentUser.toKey()]=i}}function hf(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Ma.get(e))t.Fa.delete(r),n&&t.Ca.$a(r,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(r=>{t.La.containsKey(r)||dI(t,r)})}function dI(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&(Xp(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),im(t))}function sv(t,e,n){for(const r of n)r instanceof oI?(t.La.addReference(r.key,e),sO(t,r)):r instanceof aI?(H("SyncEngine","Document no longer in limbo: "+r.key),t.La.removeReference(r.key,e),t.La.containsKey(r.key)||dI(t,r.key)):X()}function sO(t,e){const n=e.key,r=n.path.canonicalString();t.Oa.get(n)||t.xa.has(r)||(H("SyncEngine","New document in limbo: "+n),t.xa.add(r),im(t))}function im(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new K(ve.fromString(e)),r=t.qa.next();t.Na.set(r,new GD(n)),t.Oa=t.Oa.insert(n,r),X0(t.remoteStore,new gr(Sn(lc(n.path)),r,"TargetPurposeLimboResolution",Mp.oe))}}async function ka(t,e,n){const r=Z(t),i=[],s=[],o=[];r.Fa.isEmpty()||(r.Fa.forEach((l,u)=>{o.push(r.Ka(u,e,n).then(c=>{var d;if((c||n)&&r.isPrimaryClient){const m=c?!c.fromCache:(d=n==null?void 0:n.targetChanges.get(u.targetId))===null||d===void 0?void 0:d.current;r.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(c){i.push(c);const m=Yp.Wi(u.targetId,c);s.push(m)}}))}),await Promise.all(o),r.Ca.d_(i),await async function(u,c){const d=Z(u);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>j.forEach(c,g=>j.forEach(g.$i,I=>d.persistence.referenceDelegate.addReference(m,g.targetId,I)).next(()=>j.forEach(g.Ui,I=>d.persistence.referenceDelegate.removeReference(m,g.targetId,I)))))}catch(m){if(!Ta(m))throw m;H("LocalStore","Failed to update sequence numbers: "+m)}for(const m of c){const g=m.targetId;if(!m.fromCache){const I=d.os.get(g),R=I.snapshotVersion,C=I.withLastLimboFreeSnapshotVersion(R);d.os=d.os.insert(g,C)}}}(r.localStore,s))}async function oO(t,e){const n=Z(t);if(!n.currentUser.isEqual(e)){H("SyncEngine","User change. New user:",e.toKey());const r=await K0(n.localStore,e);n.currentUser=e,function(s,o){s.ka.forEach(l=>{l.forEach(u=>{u.reject(new z(M.CANCELLED,o))})}),s.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await ka(n,r.hs)}}function aO(t,e){const n=Z(t),r=n.Na.get(e);if(r&&r.va)return te().add(r.key);{let i=te();const s=n.Ma.get(e);if(!s)return i;for(const o of s){const l=n.Fa.get(o);i=i.unionWith(l.view.Va)}return i}}function fI(t){const e=Z(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=uI.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=aO.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=nO.bind(null,e),e.Ca.d_=WD.bind(null,e.eventManager),e.Ca.$a=HD.bind(null,e.eventManager),e}function lO(t){const e=Z(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=rO.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=iO.bind(null,e),e}class Nu{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=pc(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return pD(this.persistence,new dD,e.initialUser,this.serializer)}Ga(e){return new uD(Qp.Zr,this.serializer)}Wa(e){return new ED}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Nu.provider={build:()=>new Nu};class df{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>iv(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=oO.bind(null,this.syncEngine),await BD(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new zD}()}createDatastore(e){const n=pc(e.databaseInfo.databaseId),r=function(s){return new AD(s)}(e.databaseInfo);return function(s,o,l,u){return new PD(s,o,l,u)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,i,s,o,l){return new ND(r,i,s,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>iv(this.syncEngine,n,0),function(){return Z_.D()?new Z_:new TD}())}createSyncEngine(e,n){return function(i,s,o,l,u,c,d){const m=new QD(i,s,o,l,u,c);return d&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(i){const s=Z(i);H("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await Aa(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}df.provider={build:()=>new df};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pI{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):qn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uO{constructor(e,n,r,i,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=i,this.user=ct.UNAUTHENTICATED,this.clientId=f0.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{H("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(H("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Pr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=nm(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Lh(t,e){t.asyncQueue.verifyOperationInProgress(),H("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async i=>{r.isEqual(i)||(await K0(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function ov(t,e){t.asyncQueue.verifyOperationInProgress();const n=await cO(t);H("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>ev(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,i)=>ev(e.remoteStore,i)),t._onlineComponents=e}async function cO(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){H("FirestoreClient","Using user provided OfflineComponentProvider");try{await Lh(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(i){return i.name==="FirebaseError"?i.code===M.FAILED_PRECONDITION||i.code===M.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(n))throw n;ms("Error using user provided cache. Falling back to memory cache: "+n),await Lh(t,new Nu)}}else H("FirestoreClient","Using default OfflineComponentProvider"),await Lh(t,new Nu);return t._offlineComponents}async function mI(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(H("FirestoreClient","Using user provided OnlineComponentProvider"),await ov(t,t._uninitializedComponentsProvider._online)):(H("FirestoreClient","Using default OnlineComponentProvider"),await ov(t,new df))),t._onlineComponents}function hO(t){return mI(t).then(e=>e.syncEngine)}async function ff(t){const e=await mI(t),n=e.eventManager;return n.onListen=YD.bind(null,e.syncEngine),n.onUnlisten=ZD.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=XD.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=eO.bind(null,e.syncEngine),n}function dO(t,e,n={}){const r=new Pr;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,u,c){const d=new pI({next:g=>{d.Za(),o.enqueueAndForget(()=>iI(s,m));const I=g.docs.has(l);!I&&g.fromCache?c.reject(new z(M.UNAVAILABLE,"Failed to get document because the client is offline.")):I&&g.fromCache&&u&&u.source==="server"?c.reject(new z(M.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(g)},error:g=>c.reject(g)}),m=new sI(lc(l.path),d,{includeMetadataChanges:!0,_a:!0});return rI(s,m)}(await ff(t),t.asyncQueue,e,n,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gI(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const av=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yI(t,e,n){if(!n)throw new z(M.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function fO(t,e,n,r){if(e===!0&&r===!0)throw new z(M.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function lv(t){if(!K.isDocumentKey(t))throw new z(M.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function uv(t){if(K.isDocumentKey(t))throw new z(M.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function yc(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":X()}function Xt(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new z(M.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=yc(t);throw new z(M.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}function pO(t,e){if(e<=0)throw new z(M.INVALID_ARGUMENT,`Function ${t}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cv{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new z(M.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new z(M.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}fO("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=gI((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class _c{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new cv({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new z(M.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new z(M.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new cv(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new bx;switch(r.type){case"firstParty":return new Vx(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new z(M.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=av.get(n);r&&(H("ComponentProvider","Removing Datastore"),av.delete(n),r.terminate())}(this),Promise.resolve()}}function mO(t,e,n,r={}){var i;const s=(t=Xt(t,_c))._getSettings(),o=`${e}:${n}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&ms("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),r.mockUserToken){let l,u;if(typeof r.mockUserToken=="string")l=r.mockUserToken,u=ct.MOCK_USER;else{l=_T(r.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);const c=r.mockUserToken.sub||r.mockUserToken.user_id;if(!c)throw new z(M.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new ct(c)}t._authCredentials=new Dx(new d0(l,u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $r{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new $r(this.firestore,e,this._query)}}class ft{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Cr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ft(this.firestore,e,this._key)}}class Cr extends $r{constructor(e,n,r){super(e,n,lc(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ft(this.firestore,null,new K(e))}withConverter(e){return new Cr(this.firestore,e,this._path)}}function gO(t,e,...n){if(t=ie(t),yI("collection","path",e),t instanceof _c){const r=ve.fromString(e,...n);return uv(r),new Cr(t,null,r)}{if(!(t instanceof ft||t instanceof Cr))throw new z(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(ve.fromString(e,...n));return uv(r),new Cr(t.firestore,null,r)}}function sm(t,e,...n){if(t=ie(t),arguments.length===1&&(e=f0.newId()),yI("doc","path",e),t instanceof _c){const r=ve.fromString(e,...n);return lv(r),new ft(t,null,new K(r))}{if(!(t instanceof ft||t instanceof Cr))throw new z(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(ve.fromString(e,...n));return lv(r),new ft(t.firestore,t instanceof Cr?t.converter:null,new K(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hv{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Q0(this,"async_queue_retry"),this.Vu=()=>{const r=Oh();r&&H("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const n=Oh();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=Oh();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new Pr;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Ta(e))throw e;H("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const i=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(r);throw qn("INTERNAL UNHANDLED ERROR: ",i),r}).then(r=>(this.du=!1,r))));return this.mu=n,n}enqueueAfterDelay(e,n,r){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const i=tm.createAndSchedule(this,e,n,r,s=>this.yu(s));return this.Tu.push(i),i}fu(){this.Eu&&X()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}function dv(t){return function(n,r){if(typeof n!="object"||n===null)return!1;const i=n;for(const s of r)if(s in i&&typeof i[s]=="function")return!0;return!1}(t,["next","error","complete"])}class Lr extends _c{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new hv,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new hv(e),this._firestoreClient=void 0,await e}}}function yO(t,e){const n=typeof t=="object"?t:ga(),r=typeof t=="string"?t:"(default)",i=Xn(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=Ep("firestore");s&&mO(i,...s)}return i}function om(t){if(t._terminated)throw new z(M.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||_O(t),t._firestoreClient}function _O(t){var e,n,r;const i=t._freezeSettings(),s=function(l,u,c,d){return new Qx(l,u,c,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,gI(d.experimentalLongPollingOptions),d.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,i);t._componentsProvider||!((n=i.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(t._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),t._firestoreClient=new uO(t._authCredentials,t._appCheckCredentials,t._queue,s,t._componentsProvider&&function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ts(tt.fromBase64String(e))}catch(n){throw new z(M.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Ts(tt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vc{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new z(M.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ye(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class am{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new z(M.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new z(M.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return le(this._lat,e._lat)||le(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lm{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vO=/^__.*__$/;class wO{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new Br(e,this.data,this.fieldMask,n,this.fieldTransforms):new Ia(e,this.data,n,this.fieldTransforms)}}class _I{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return new Br(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function vI(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw X()}}class wc{constructor(e,n,r,i,s,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new wc(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:r,xu:!1});return i.Ou(e),i}Nu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:r,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return xu(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(vI(this.Cu)&&vO.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class EO{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||pc(e)}Qu(e,n,r,i=!1){return new wc({Cu:e,methodName:n,qu:r,path:Ye.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ec(t){const e=t._freezeSettings(),n=pc(t._databaseId);return new EO(t._databaseId,!!e.ignoreUndefinedProperties,n)}function wI(t,e,n,r,i,s={}){const o=t.Qu(s.merge||s.mergeFields?2:0,e,n,i);hm("Data must be an object, but it was:",o,r);const l=EI(r,o);let u,c;if(s.merge)u=new Vt(o.fieldMask),c=o.fieldTransforms;else if(s.mergeFields){const d=[];for(const m of s.mergeFields){const g=pf(e,m,n);if(!o.contains(g))throw new z(M.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);II(d,g)||d.push(g)}u=new Vt(d),c=o.fieldTransforms.filter(m=>u.covers(m.field))}else u=null,c=o.fieldTransforms;return new wO(new At(l),u,c)}class Tc extends Ra{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Tc}}function TO(t,e,n){return new wc({Cu:3,qu:e.settings.qu,methodName:t._methodName,xu:n},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class um extends Ra{_toFieldTransform(e){return new O0(e.path,new oa)}isEqual(e){return e instanceof um}}class cm extends Ra{constructor(e,n){super(e),this.Ku=n}_toFieldTransform(e){const n=TO(this,e,!0),r=this.Ku.map(s=>Os(s,n)),i=new vs(r);return new O0(e.path,i)}isEqual(e){return e instanceof cm&&ps(this.Ku,e.Ku)}}function IO(t,e,n,r){const i=t.Qu(1,e,n);hm("Data must be an object, but it was:",i,r);const s=[],o=At.empty();ki(r,(u,c)=>{const d=dm(e,u,n);c=ie(c);const m=i.Nu(d);if(c instanceof Tc)s.push(d);else{const g=Os(c,m);g!=null&&(s.push(d),o.set(d,g))}});const l=new Vt(s);return new _I(o,l,i.fieldTransforms)}function SO(t,e,n,r,i,s){const o=t.Qu(1,e,n),l=[pf(e,r,n)],u=[i];if(s.length%2!=0)throw new z(M.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<s.length;g+=2)l.push(pf(e,s[g])),u.push(s[g+1]);const c=[],d=At.empty();for(let g=l.length-1;g>=0;--g)if(!II(c,l[g])){const I=l[g];let R=u[g];R=ie(R);const C=o.Nu(I);if(R instanceof Tc)c.push(I);else{const b=Os(R,C);b!=null&&(c.push(I),d.set(I,b))}}const m=new Vt(c);return new _I(d,m,o.fieldTransforms)}function AO(t,e,n,r=!1){return Os(n,t.Qu(r?4:3,e))}function Os(t,e){if(TI(t=ie(t)))return hm("Unsupported field value:",e,t),EI(t,e);if(t instanceof Ra)return function(r,i){if(!vI(i.Cu))throw i.Bu(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const l of r){let u=Os(l,i.Lu(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=ie(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return yb(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=$e.fromDate(r);return{timestampValue:Pu(i.serializer,s)}}if(r instanceof $e){const s=new $e(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Pu(i.serializer,s)}}if(r instanceof am)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Ts)return{bytesValue:F0(i.serializer,r._byteString)};if(r instanceof ft){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Kp(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof lm)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(u=>{if(typeof u!="number")throw l.Bu("VectorValues must only contain numeric values.");return zp(l.serializer,u)})}}}}}}(r,i);throw i.Bu(`Unsupported field value: ${yc(r)}`)}(t,e)}function EI(t,e){const n={};return p0(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ki(t,(r,i)=>{const s=Os(i,e.Mu(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function TI(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof $e||t instanceof am||t instanceof Ts||t instanceof ft||t instanceof Ra||t instanceof lm)}function hm(t,e,n){if(!TI(n)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(n)){const r=yc(n);throw r==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+r)}}function pf(t,e,n){if((e=ie(e))instanceof vc)return e._internalPath;if(typeof e=="string")return dm(t,e);throw xu("Field path arguments must be of type string or ",t,!1,void 0,n)}const kO=new RegExp("[~\\*/\\[\\]]");function dm(t,e,n){if(e.search(kO)>=0)throw xu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new vc(...e.split("."))._internalPath}catch{throw xu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function xu(t,e,n,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new z(M.INVALID_ARGUMENT,l+t+u)}function II(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SI{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new ft(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new RO(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Ic("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class RO extends SI{data(){return super.data()}}function Ic(t,e){return typeof e=="string"?dm(t,e):e instanceof vc?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function PO(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new z(M.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class fm{}class pm extends fm{}function CO(t,e,...n){let r=[];e instanceof fm&&r.push(e),r=r.concat(n),function(s){const o=s.filter(u=>u instanceof mm).length,l=s.filter(u=>u instanceof Sc).length;if(o>1||o>0&&l>0)throw new z(M.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)t=i._apply(t);return t}class Sc extends pm{constructor(e,n,r){super(),this._field=e,this._op=n,this._value=r,this.type="where"}static _create(e,n,r){return new Sc(e,n,r)}_apply(e){const n=this._parse(e);return AI(e._query,n),new $r(e.firestore,e.converter,rf(e._query,n))}_parse(e){const n=Ec(e.firestore);return function(s,o,l,u,c,d,m){let g;if(c.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new z(M.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){pv(m,d);const I=[];for(const R of m)I.push(fv(u,s,R));g={arrayValue:{values:I}}}else g=fv(u,s,m)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||pv(m,d),g=AO(l,o,m,d==="in"||d==="not-in");return Ue.create(c,d,g)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}function NO(t,e,n){const r=e,i=Ic("where",t);return Sc._create(i,r,n)}class mm extends fm{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new mm(e,n)}_parse(e){const n=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return n.length===1?n[0]:dn.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(i,s){let o=i;const l=s.getFlattenedFilters();for(const u of l)AI(o,u),o=rf(o,u)}(e._query,n),new $r(e.firestore,e.converter,rf(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class gm extends pm{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new gm(e,n)}_apply(e){const n=function(i,s,o){if(i.startAt!==null)throw new z(M.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new z(M.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new sa(s,o)}(e._query,this._field,this._direction);return new $r(e.firestore,e.converter,function(i,s){const o=i.explicitOrderBy.concat([s]);return new xs(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,n))}}function zj(t,e="asc"){const n=e,r=Ic("orderBy",t);return gm._create(r,n)}class ym extends pm{constructor(e,n,r){super(),this.type=e,this._limit=n,this._limitType=r}static _create(e,n,r){return new ym(e,n,r)}_apply(e){return new $r(e.firestore,e.converter,ku(e._query,this._limit,this._limitType))}}function Wj(t){return pO("limit",t),ym._create("limit",t,"F")}function fv(t,e,n){if(typeof(n=ie(n))=="string"){if(n==="")throw new z(M.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!I0(e)&&n.indexOf("/")!==-1)throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=e.path.child(ve.fromString(n));if(!K.isDocumentKey(r))throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return O_(t,new K(r))}if(n instanceof ft)return O_(t,n._key);throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${yc(n)}.`)}function pv(t,e){if(!Array.isArray(t)||t.length===0)throw new z(M.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function AI(t,e){const n=function(i,s){for(const o of i)for(const l of o.getFlattenedFilters())if(s.indexOf(l.op)>=0)return l.op;return null}(t.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new z(M.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new z(M.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class xO{convertValue(e,n="none"){switch(_i(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Oe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(yi(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw X()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return ki(e,(i,s)=>{r[i]=this.convertValue(s,n)}),r}convertVectorValue(e){var n,r,i;const s=(i=(r=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(o=>Oe(o.doubleValue));return new lm(s)}convertGeoPoint(e){return new am(Oe(e.latitude),Oe(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=Up(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(na(e));default:return null}}convertTimestamp(e){const n=Dr(e);return new $e(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=ve.fromString(e);he(q0(r));const i=new ra(r.get(1),r.get(3)),s=new K(r.popFirst(5));return i.isEqual(n)||qn(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kI(t,e,n){let r;return r=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class po{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class RI extends SI{constructor(e,n,r,i,s,o){super(e,n,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new $l(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(Ic("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}}class $l extends RI{data(e={}){return super.data(e)}}class bO{constructor(e,n,r,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new po(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(r=>{e.call(n,new $l(this._firestore,this._userDataWriter,r.key,r,new po(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new z(M.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const u=new $l(i._firestore,i._userDataWriter,l.doc.key,l.doc,new po(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>s||l.type!==3).map(l=>{const u=new $l(i._firestore,i._userDataWriter,l.doc.key,l.doc,new po(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let c=-1,d=-1;return l.type!==0&&(c=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),d=o.indexOf(l.doc.key)),{type:DO(l.type),doc:u,oldIndex:c,newIndex:d}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function DO(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return X()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OO(t){t=Xt(t,ft);const e=Xt(t.firestore,Lr);return dO(om(e),t._key).then(n=>CI(e,t,n))}class PI extends xO{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ts(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new ft(this.firestore,null,n)}}function LO(t,e,n){t=Xt(t,ft);const r=Xt(t.firestore,Lr),i=kI(t.converter,e,n);return Ac(r,[wI(Ec(r),"setDoc",t._key,i,t.converter!==null,n).toMutation(t._key,Yt.none())])}function Hj(t,e,n,...r){t=Xt(t,ft);const i=Xt(t.firestore,Lr),s=Ec(i);let o;return o=typeof(e=ie(e))=="string"||e instanceof vc?SO(s,"updateDoc",t._key,e,n,r):IO(s,"updateDoc",t._key,e),Ac(i,[o.toMutation(t._key,Yt.exists(!0))])}function qj(t){return Ac(Xt(t.firestore,Lr),[new Wp(t._key,Yt.none())])}function Kj(t,e){const n=Xt(t.firestore,Lr),r=sm(t),i=kI(t.converter,e);return Ac(n,[wI(Ec(t.firestore),"addDoc",r._key,i,t.converter!==null,{}).toMutation(r._key,Yt.exists(!1))]).then(()=>r)}function VO(t,...e){var n,r,i;t=ie(t);let s={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||dv(e[o])||(s=e[o],o++);const l={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(dv(e[o])){const m=e[o];e[o]=(n=m.next)===null||n===void 0?void 0:n.bind(m),e[o+1]=(r=m.error)===null||r===void 0?void 0:r.bind(m),e[o+2]=(i=m.complete)===null||i===void 0?void 0:i.bind(m)}let u,c,d;if(t instanceof ft)c=Xt(t.firestore,Lr),d=lc(t._key.path),u={next:m=>{e[o]&&e[o](CI(c,t,m))},error:e[o+1],complete:e[o+2]};else{const m=Xt(t,$r);c=Xt(m.firestore,Lr),d=m._query;const g=new PI(c);u={next:I=>{e[o]&&e[o](new bO(c,g,m,I))},error:e[o+1],complete:e[o+2]},PO(t._query)}return function(g,I,R,C){const b=new pI(C),k=new sI(I,b,R);return g.asyncQueue.enqueueAndForget(async()=>rI(await ff(g),k)),()=>{b.Za(),g.asyncQueue.enqueueAndForget(async()=>iI(await ff(g),k))}}(om(c),d,l,u)}function Ac(t,e){return function(r,i){const s=new Pr;return r.asyncQueue.enqueueAndForget(async()=>tO(await hO(r),i,s)),s.promise}(om(t),e)}function CI(t,e,n){const r=n.docs.get(e._key),i=new PI(t);return new RI(t,i,e._key,r,new po(n.hasPendingWrites,n.fromCache),e.converter)}function Gj(){return new um("serverTimestamp")}function Qj(...t){return new cm("arrayUnion",t)}(function(e,n=!0){(function(i){Ns=i})(Si),xt(new Et("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),l=new Lr(new Ox(r.getProvider("auth-internal")),new jx(r.getProvider("app-check-internal")),function(c,d){if(!Object.prototype.hasOwnProperty.apply(c.options,["projectId"]))throw new z(M.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ra(c.options.projectId,d)}(o,i),o);return s=Object.assign({useFetchStreams:n},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),Je(C_,"4.7.3",e),Je(C_,"4.7.3","esm2017")})();var MO="firebase",jO="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Je(MO,jO,"app");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UO=new Map,FO={activated:!1,tokenObservers:[]};function fn(t){return UO.get(t)||Object.assign({},FO)}const mv={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:16*60*1e3};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BO{constructor(e,n,r,i,s){if(this.operation=e,this.retryPolicy=n,this.getWaitDuration=r,this.lowerBound=i,this.upperBound=s,this.pending=null,this.nextErrorWaitInterval=i,i>s)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(e){this.stop();try{this.pending=new $d,this.pending.promise.catch(n=>{}),await $O(this.getNextRun(e)),this.pending.resolve(),await this.pending.promise,this.pending=new $d,this.pending.promise.catch(n=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(n){this.retryPolicy(n)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(e){if(e)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const n=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),n}}}function $O(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zO={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.",throttled:"Requests throttled due to {$httpStatus} error. Attempts allowed again after {$time}"},bu=new Ur("appCheck","AppCheck",zO);function NI(t){if(!fn(t).activated)throw bu.create("use-before-activation",{appName:t.name})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WO="firebase-app-check-database",HO=1,mf="firebase-app-check-store";let yl=null;function qO(){return yl||(yl=new Promise((t,e)=>{try{const n=indexedDB.open(WO,HO);n.onsuccess=r=>{t(r.target.result)},n.onerror=r=>{var i;e(bu.create("storage-open",{originalErrorMessage:(i=r.target.error)===null||i===void 0?void 0:i.message}))},n.onupgradeneeded=r=>{const i=r.target.result;switch(r.oldVersion){case 0:i.createObjectStore(mf,{keyPath:"compositeKey"})}}}catch(n){e(bu.create("storage-open",{originalErrorMessage:n==null?void 0:n.message}))}}),yl)}function KO(t,e){return GO(QO(t),e)}async function GO(t,e){const r=(await qO()).transaction(mf,"readwrite"),s=r.objectStore(mf).put({compositeKey:t,value:e});return new Promise((o,l)=>{s.onsuccess=u=>{o()},r.onerror=u=>{var c;l(bu.create("storage-set",{originalErrorMessage:(c=u.target.error)===null||c===void 0?void 0:c.message}))}})}function QO(t){return`${t.options.appId}-${t.name}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gf=new ma("@firebase/app-check");function gv(t,e){return rc()?KO(t,e).catch(n=>{gf.warn(`Failed to write token to IndexedDB. Error: ${n}`)}):Promise.resolve()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YO={error:"UNKNOWN_ERROR"};function XO(t){return wp.encodeString(JSON.stringify(t),!1)}async function yf(t,e=!1){const n=t.app;NI(n);const r=fn(n);let i=r.token,s;if(i&&!mo(i)&&(r.token=void 0,i=void 0),!i){const u=await r.cachedTokenPromise;u&&(mo(u)?i=u:await gv(n,void 0))}if(!e&&i&&mo(i))return{token:i.token};let o=!1;try{r.exchangeTokenPromise||(r.exchangeTokenPromise=r.provider.getToken().finally(()=>{r.exchangeTokenPromise=void 0}),o=!0),i=await fn(n).exchangeTokenPromise}catch(u){u.code==="appCheck/throttled"?gf.warn(u.message):gf.error(u),s=u}let l;return i?s?mo(i)?l={token:i.token,internalError:s}:l=_v(s):(l={token:i.token},r.token=i,await gv(n,i)):l=_v(s),o&&tL(n,l),l}async function JO(t){const e=t.app;NI(e);const{provider:n}=fn(e);{const{token:r}=await n.getToken();return{token:r}}}function ZO(t,e,n,r){const{app:i}=t,s=fn(i),o={next:n,error:r,type:e};if(s.tokenObservers=[...s.tokenObservers,o],s.token&&mo(s.token)){const l=s.token;Promise.resolve().then(()=>{n({token:l.token}),yv(t)}).catch(()=>{})}s.cachedTokenPromise.then(()=>yv(t))}function xI(t,e){const n=fn(t),r=n.tokenObservers.filter(i=>i.next!==e);r.length===0&&n.tokenRefresher&&n.tokenRefresher.isRunning()&&n.tokenRefresher.stop(),n.tokenObservers=r}function yv(t){const{app:e}=t,n=fn(e);let r=n.tokenRefresher;r||(r=eL(t),n.tokenRefresher=r),!r.isRunning()&&n.isTokenAutoRefreshEnabled&&r.start()}function eL(t){const{app:e}=t;return new BO(async()=>{const n=fn(e);let r;if(n.token?r=await yf(t,!0):r=await yf(t),r.error)throw r.error;if(r.internalError)throw r.internalError},()=>!0,()=>{const n=fn(e);if(n.token){let r=n.token.issuedAtTimeMillis+(n.token.expireTimeMillis-n.token.issuedAtTimeMillis)*.5+3e5;const i=n.token.expireTimeMillis-5*60*1e3;return r=Math.min(r,i),Math.max(0,r-Date.now())}else return 0},mv.RETRIAL_MIN_WAIT,mv.RETRIAL_MAX_WAIT)}function tL(t,e){const n=fn(t).tokenObservers;for(const r of n)try{r.type==="EXTERNAL"&&e.error!=null?r.error(e.error):r.next(e)}catch{}}function mo(t){return t.expireTimeMillis-Date.now()>0}function _v(t){return{token:XO(YO),error:t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nL{constructor(e,n){this.app=e,this.heartbeatServiceProvider=n}_delete(){const{tokenObservers:e}=fn(this.app);for(const n of e)xI(this.app,n.next);return Promise.resolve()}}function rL(t,e){return new nL(t,e)}function iL(t){return{getToken:e=>yf(t,e),getLimitedUseToken:()=>JO(t),addTokenListener:e=>ZO(t,"INTERNAL",e),removeTokenListener:e=>xI(t.app,e)}}const sL="@firebase/app-check",oL="0.8.8",aL="app-check",vv="app-check-internal";function lL(){xt(new Et(aL,t=>{const e=t.getProvider("app").getImmediate(),n=t.getProvider("heartbeat");return rL(e,n)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,n)=>{t.getProvider(vv).initialize()})),xt(new Et(vv,t=>{const e=t.getProvider("app-check").getImmediate();return iL(e)},"PUBLIC").setInstantiationMode("EXPLICIT")),Je(sL,oL)}lL();const bI="@firebase/installations",_m="0.6.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DI=1e4,OI=`w:${_m}`,LI="FIS_v2",uL="https://firebaseinstallations.googleapis.com/v1",cL=60*60*1e3,hL="installations",dL="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fL={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},vi=new Ur(hL,dL,fL);function VI(t){return t instanceof zt&&t.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MI({projectId:t}){return`${uL}/projects/${t}/installations`}function jI(t){return{token:t.token,requestStatus:2,expiresIn:mL(t.expiresIn),creationTime:Date.now()}}async function UI(t,e){const r=(await e.json()).error;return vi.create("request-failed",{requestName:t,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function FI({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function pL(t,{refreshToken:e}){const n=FI(t);return n.append("Authorization",gL(e)),n}async function BI(t){const e=await t();return e.status>=500&&e.status<600?t():e}function mL(t){return Number(t.replace("s","000"))}function gL(t){return`${LI} ${t}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yL({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const r=MI(t),i=FI(t),s=e.getImmediate({optional:!0});if(s){const c=await s.getHeartbeatsHeader();c&&i.append("x-firebase-client",c)}const o={fid:n,authVersion:LI,appId:t.appId,sdkVersion:OI},l={method:"POST",headers:i,body:JSON.stringify(o)},u=await BI(()=>fetch(r,l));if(u.ok){const c=await u.json();return{fid:c.fid||n,registrationStatus:2,refreshToken:c.refreshToken,authToken:jI(c.authToken)}}else throw await UI("Create Installation",u)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $I(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _L(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vL=/^[cdef][\w-]{21}$/,_f="";function wL(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const n=EL(t);return vL.test(n)?n:_f}catch{return _f}}function EL(t){return _L(t).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kc(t){return`${t.appName}!${t.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zI=new Map;function WI(t,e){const n=kc(t);HI(n,e),TL(n,e)}function HI(t,e){const n=zI.get(t);if(n)for(const r of n)r(e)}function TL(t,e){const n=IL();n&&n.postMessage({key:t,fid:e}),SL()}let ni=null;function IL(){return!ni&&"BroadcastChannel"in self&&(ni=new BroadcastChannel("[Firebase] FID Change"),ni.onmessage=t=>{HI(t.data.key,t.data.fid)}),ni}function SL(){zI.size===0&&ni&&(ni.close(),ni=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AL="firebase-installations-database",kL=1,wi="firebase-installations-store";let Vh=null;function vm(){return Vh||(Vh=TT(AL,kL,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(wi)}}})),Vh}async function Du(t,e){const n=kc(t),i=(await vm()).transaction(wi,"readwrite"),s=i.objectStore(wi),o=await s.get(n);return await s.put(e,n),await i.done,(!o||o.fid!==e.fid)&&WI(t,e.fid),e}async function qI(t){const e=kc(t),r=(await vm()).transaction(wi,"readwrite");await r.objectStore(wi).delete(e),await r.done}async function Rc(t,e){const n=kc(t),i=(await vm()).transaction(wi,"readwrite"),s=i.objectStore(wi),o=await s.get(n),l=e(o);return l===void 0?await s.delete(n):await s.put(l,n),await i.done,l&&(!o||o.fid!==l.fid)&&WI(t,l.fid),l}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wm(t){let e;const n=await Rc(t.appConfig,r=>{const i=RL(r),s=PL(t,i);return e=s.registrationPromise,s.installationEntry});return n.fid===_f?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function RL(t){const e=t||{fid:wL(),registrationStatus:0};return KI(e)}function PL(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(vi.create("app-offline"));return{installationEntry:e,registrationPromise:i}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=CL(t,n);return{installationEntry:n,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:NL(t)}:{installationEntry:e}}async function CL(t,e){try{const n=await yL(t,e);return Du(t.appConfig,n)}catch(n){throw VI(n)&&n.customData.serverCode===409?await qI(t.appConfig):await Du(t.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function NL(t){let e=await wv(t.appConfig);for(;e.registrationStatus===1;)await $I(100),e=await wv(t.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await wm(t);return r||n}return e}function wv(t){return Rc(t,e=>{if(!e)throw vi.create("installation-not-found");return KI(e)})}function KI(t){return xL(t)?{fid:t.fid,registrationStatus:0}:t}function xL(t){return t.registrationStatus===1&&t.registrationTime+DI<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bL({appConfig:t,heartbeatServiceProvider:e},n){const r=DL(t,n),i=pL(t,n),s=e.getImmediate({optional:!0});if(s){const c=await s.getHeartbeatsHeader();c&&i.append("x-firebase-client",c)}const o={installation:{sdkVersion:OI,appId:t.appId}},l={method:"POST",headers:i,body:JSON.stringify(o)},u=await BI(()=>fetch(r,l));if(u.ok){const c=await u.json();return jI(c)}else throw await UI("Generate Auth Token",u)}function DL(t,{fid:e}){return`${MI(t)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Em(t,e=!1){let n;const r=await Rc(t.appConfig,s=>{if(!GI(s))throw vi.create("not-registered");const o=s.authToken;if(!e&&VL(o))return s;if(o.requestStatus===1)return n=OL(t,e),s;{if(!navigator.onLine)throw vi.create("app-offline");const l=jL(s);return n=LL(t,l),l}});return n?await n:r.authToken}async function OL(t,e){let n=await Ev(t.appConfig);for(;n.authToken.requestStatus===1;)await $I(100),n=await Ev(t.appConfig);const r=n.authToken;return r.requestStatus===0?Em(t,e):r}function Ev(t){return Rc(t,e=>{if(!GI(e))throw vi.create("not-registered");const n=e.authToken;return UL(n)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function LL(t,e){try{const n=await bL(t,e),r=Object.assign(Object.assign({},e),{authToken:n});return await Du(t.appConfig,r),n}catch(n){if(VI(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await qI(t.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Du(t.appConfig,r)}throw n}}function GI(t){return t!==void 0&&t.registrationStatus===2}function VL(t){return t.requestStatus===2&&!ML(t)}function ML(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+cL}function jL(t){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},t),{authToken:e})}function UL(t){return t.requestStatus===1&&t.requestTime+DI<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function FL(t){const e=t,{installationEntry:n,registrationPromise:r}=await wm(e);return r?r.catch(console.error):Em(e).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function BL(t,e=!1){const n=t;return await $L(n),(await Em(n,e)).token}async function $L(t){const{registrationPromise:e}=await wm(t);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zL(t){if(!t||!t.options)throw Mh("App Configuration");if(!t.name)throw Mh("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!t.options[n])throw Mh(n);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function Mh(t){return vi.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QI="installations",WL="installations-internal",HL=t=>{const e=t.getProvider("app").getImmediate(),n=zL(e),r=Xn(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},qL=t=>{const e=t.getProvider("app").getImmediate(),n=Xn(e,QI).getImmediate();return{getId:()=>FL(n),getToken:i=>BL(n,i)}};function KL(){xt(new Et(QI,HL,"PUBLIC")),xt(new Et(WL,qL,"PRIVATE"))}KL();Je(bI,_m);Je(bI,_m,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ou="analytics",GL="firebase_id",QL="origin",YL=60*1e3,XL="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Tm="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nt=new ma("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JL={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Ut=new Ur("analytics","Analytics",JL);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ZL(t){if(!t.startsWith(Tm)){const e=Ut.create("invalid-gtag-resource",{gtagURL:t});return Nt.warn(e.message),""}return t}function YI(t){return Promise.all(t.map(e=>e.catch(n=>n)))}function e2(t,e){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(t,e)),n}function t2(t,e){const n=e2("firebase-js-sdk-policy",{createScriptURL:ZL}),r=document.createElement("script"),i=`${Tm}?l=${t}&id=${e}`;r.src=n?n==null?void 0:n.createScriptURL(i):i,r.async=!0,document.head.appendChild(r)}function n2(t){let e=[];return Array.isArray(window[t])?e=window[t]:window[t]=e,e}async function r2(t,e,n,r,i,s){const o=r[i];try{if(o)await e[o];else{const u=(await YI(n)).find(c=>c.measurementId===i);u&&await e[u.appId]}}catch(l){Nt.error(l)}t("config",i,s)}async function i2(t,e,n,r,i){try{let s=[];if(i&&i.send_to){let o=i.send_to;Array.isArray(o)||(o=[o]);const l=await YI(n);for(const u of o){const c=l.find(m=>m.measurementId===u),d=c&&e[c.appId];if(d)s.push(d);else{s=[];break}}}s.length===0&&(s=Object.values(e)),await Promise.all(s),t("event",r,i||{})}catch(s){Nt.error(s)}}function s2(t,e,n,r){async function i(s,...o){try{if(s==="event"){const[l,u]=o;await i2(t,e,n,l,u)}else if(s==="config"){const[l,u]=o;await r2(t,e,n,r,l,u)}else if(s==="consent"){const[l,u]=o;t("consent",l,u)}else if(s==="get"){const[l,u,c]=o;t("get",l,u,c)}else if(s==="set"){const[l]=o;t("set",l)}else t(s,...o)}catch(l){Nt.error(l)}}return i}function o2(t,e,n,r,i){let s=function(...o){window[r].push(arguments)};return window[i]&&typeof window[i]=="function"&&(s=window[i]),window[i]=s2(s,t,e,n),{gtagCore:s,wrappedGtag:window[i]}}function a2(t){const e=window.document.getElementsByTagName("script");for(const n of Object.values(e))if(n.src&&n.src.includes(Tm)&&n.src.includes(t))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const l2=30,u2=1e3;class c2{constructor(e={},n=u2){this.throttleMetadata=e,this.intervalMillis=n}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,n){this.throttleMetadata[e]=n}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const XI=new c2;function h2(t){return new Headers({Accept:"application/json","x-goog-api-key":t})}async function d2(t){var e;const{appId:n,apiKey:r}=t,i={method:"GET",headers:h2(r)},s=XL.replace("{app-id}",n),o=await fetch(s,i);if(o.status!==200&&o.status!==304){let l="";try{const u=await o.json();!((e=u.error)===null||e===void 0)&&e.message&&(l=u.error.message)}catch{}throw Ut.create("config-fetch-failed",{httpStatus:o.status,responseMessage:l})}return o.json()}async function f2(t,e=XI,n){const{appId:r,apiKey:i,measurementId:s}=t.options;if(!r)throw Ut.create("no-app-id");if(!i){if(s)return{measurementId:s,appId:r};throw Ut.create("no-api-key")}const o=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},l=new g2;return setTimeout(async()=>{l.abort()},YL),JI({appId:r,apiKey:i,measurementId:s},o,l,e)}async function JI(t,{throttleEndTimeMillis:e,backoffCount:n},r,i=XI){var s;const{appId:o,measurementId:l}=t;try{await p2(r,e)}catch(u){if(l)return Nt.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:o,measurementId:l};throw u}try{const u=await d2(t);return i.deleteThrottleMetadata(o),u}catch(u){const c=u;if(!m2(c)){if(i.deleteThrottleMetadata(o),l)return Nt.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:o,measurementId:l};throw u}const d=Number((s=c==null?void 0:c.customData)===null||s===void 0?void 0:s.httpStatus)===503?Zy(n,i.intervalMillis,l2):Zy(n,i.intervalMillis),m={throttleEndTimeMillis:Date.now()+d,backoffCount:n+1};return i.setThrottleMetadata(o,m),Nt.debug(`Calling attemptFetch again in ${d} millis`),JI(t,m,r,i)}}function p2(t,e){return new Promise((n,r)=>{const i=Math.max(e-Date.now(),0),s=setTimeout(n,i);t.addEventListener(()=>{clearTimeout(s),r(Ut.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function m2(t){if(!(t instanceof zt)||!t.customData)return!1;const e=Number(t.customData.httpStatus);return e===429||e===500||e===503||e===504}class g2{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function y2(t,e,n,r,i){if(i&&i.global){t("event",n,r);return}else{const s=await e,o=Object.assign(Object.assign({},r),{send_to:s});t("event",n,o)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _2(){if(rc())try{await Ip()}catch(t){return Nt.warn(Ut.create("indexeddb-unavailable",{errorInfo:t==null?void 0:t.toString()}).message),!1}else return Nt.warn(Ut.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function v2(t,e,n,r,i,s,o){var l;const u=f2(t);u.then(I=>{n[I.measurementId]=I.appId,t.options.measurementId&&I.measurementId!==t.options.measurementId&&Nt.warn(`The measurement ID in the local Firebase config (${t.options.measurementId}) does not match the measurement ID fetched from the server (${I.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(I=>Nt.error(I)),e.push(u);const c=_2().then(I=>{if(I)return r.getId()}),[d,m]=await Promise.all([u,c]);a2(s)||t2(s,d.measurementId),i("js",new Date);const g=(l=o==null?void 0:o.config)!==null&&l!==void 0?l:{};return g[QL]="firebase",g.update=!0,m!=null&&(g[GL]=m),i("config",d.measurementId,g),d.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w2{constructor(e){this.app=e}_delete(){return delete No[this.app.options.appId],Promise.resolve()}}let No={},Tv=[];const Iv={};let jh="dataLayer",E2="gtag",Sv,ZI,Av=!1;function T2(){const t=[];if(Tp()&&t.push("This is a browser extension environment."),vT()||t.push("Cookies are not available."),t.length>0){const e=t.map((r,i)=>`(${i+1}) ${r}`).join(" "),n=Ut.create("invalid-analytics-context",{errorInfo:e});Nt.warn(n.message)}}function I2(t,e,n){T2();const r=t.options.appId;if(!r)throw Ut.create("no-app-id");if(!t.options.apiKey)if(t.options.measurementId)Nt.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${t.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Ut.create("no-api-key");if(No[r]!=null)throw Ut.create("already-exists",{id:r});if(!Av){n2(jh);const{wrappedGtag:s,gtagCore:o}=o2(No,Tv,Iv,jh,E2);ZI=s,Sv=o,Av=!0}return No[r]=v2(t,Tv,Iv,e,Sv,jh,n),new w2(t)}function S2(t=ga()){t=ie(t);const e=Xn(t,Ou);return e.isInitialized()?e.getImmediate():A2(t)}function A2(t,e={}){const n=Xn(t,Ou);if(n.isInitialized()){const i=n.getImmediate();if(ps(e,n.getOptions()))return i;throw Ut.create("already-initialized")}return n.initialize({options:e})}async function k2(){if(Tp()||!vT()||!rc())return!1;try{return await Ip()}catch{return!1}}function Im(t,e,n,r){t=ie(t),y2(ZI,No[t.app.options.appId],e,n,r).catch(i=>Nt.error(i))}const kv="@firebase/analytics",Rv="0.10.8";function R2(){xt(new Et(Ou,(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("installations-internal").getImmediate();return I2(r,i,n)},"PUBLIC")),xt(new Et("analytics-internal",t,"PRIVATE")),Je(kv,Rv),Je(kv,Rv,"esm2017");function t(e){try{const n=e.getProvider(Ou).getImmediate();return{logEvent:(r,i,s)=>Im(n,r,i,s)}}catch(n){throw Ut.create("interop-component-reg-failed",{reason:n})}}}R2();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P2="type.googleapis.com/google.protobuf.Int64Value",C2="type.googleapis.com/google.protobuf.UInt64Value";function eS(t,e){const n={};for(const r in t)t.hasOwnProperty(r)&&(n[r]=e(t[r]));return n}function vf(t){if(t==null)return null;if(t instanceof Number&&(t=t.valueOf()),typeof t=="number"&&isFinite(t)||t===!0||t===!1||Object.prototype.toString.call(t)==="[object String]")return t;if(t instanceof Date)return t.toISOString();if(Array.isArray(t))return t.map(e=>vf(e));if(typeof t=="function"||typeof t=="object")return eS(t,e=>vf(e));throw new Error("Data cannot be encoded in JSON: "+t)}function Lu(t){if(t==null)return t;if(t["@type"])switch(t["@type"]){case P2:case C2:{const e=Number(t.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+t);return e}default:throw new Error("Data cannot be decoded from JSON: "+t)}return Array.isArray(t)?t.map(e=>Lu(e)):typeof t=="function"||typeof t=="object"?eS(t,e=>Lu(e)):t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sm="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pv={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class ss extends zt{constructor(e,n,r){super(`${Sm}/${e}`,n||""),this.details=r}}function N2(t){if(t>=200&&t<300)return"ok";switch(t){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function x2(t,e){let n=N2(t),r=n,i;try{const s=e&&e.error;if(s){const o=s.status;if(typeof o=="string"){if(!Pv[o])return new ss("internal","internal");n=Pv[o],r=o}const l=s.message;typeof l=="string"&&(r=l),i=s.details,i!==void 0&&(i=Lu(i))}}catch{}return n==="ok"?null:new ss(n,r,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b2{constructor(e,n,r){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||e.get().then(i=>this.auth=i,()=>{}),this.messaging||n.get().then(i=>this.messaging=i,()=>{}),this.appCheck||r.get().then(i=>this.appCheck=i,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e==null?void 0:e.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.appCheck){const n=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return n.error?null:n.token}return null}async getContext(e){const n=await this.getAuthToken(),r=await this.getMessagingToken(),i=await this.getAppCheckToken(e);return{authToken:n,messagingToken:r,appCheckToken:i}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wf="us-central1";function D2(t){let e=null;return{promise:new Promise((n,r)=>{e=setTimeout(()=>{r(new ss("deadline-exceeded","deadline-exceeded"))},t)}),cancel:()=>{e&&clearTimeout(e)}}}class O2{constructor(e,n,r,i,s=wf,o){this.app=e,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new b2(n,r,i),this.cancelAllRequests=new Promise(l=>{this.deleteService=()=>Promise.resolve(l())});try{const l=new URL(s);this.customDomain=l.origin+(l.pathname==="/"?"":l.pathname),this.region=wf}catch{this.customDomain=null,this.region=s}}_delete(){return this.deleteService()}_url(e){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${n}.cloudfunctions.net/${e}`}}function L2(t,e,n){t.emulatorOrigin=`http://${e}:${n}`}function V2(t,e,n){return r=>j2(t,e,r,{})}async function M2(t,e,n,r){n["Content-Type"]="application/json";let i;try{i=await r(t,{method:"POST",body:JSON.stringify(e),headers:n})}catch{return{status:0,json:null}}let s=null;try{s=await i.json()}catch{}return{status:i.status,json:s}}function j2(t,e,n,r){const i=t._url(e);return U2(t,i,n,r)}async function U2(t,e,n,r){n=vf(n);const i={data:n},s={},o=await t.contextProvider.getContext(r.limitedUseAppCheckTokens);o.authToken&&(s.Authorization="Bearer "+o.authToken),o.messagingToken&&(s["Firebase-Instance-ID-Token"]=o.messagingToken),o.appCheckToken!==null&&(s["X-Firebase-AppCheck"]=o.appCheckToken);const l=r.timeout||7e4,u=D2(l),c=await Promise.race([M2(e,i,s,t.fetchImpl),u.promise,t.cancelAllRequests]);if(u.cancel(),!c)throw new ss("cancelled","Firebase Functions instance was deleted.");const d=x2(c.status,c.json);if(d)throw d;if(!c.json)throw new ss("internal","Response is not valid JSON object.");let m=c.json.data;if(typeof m>"u"&&(m=c.json.result),typeof m>"u")throw new ss("internal","Response is missing data field.");return{data:Lu(m)}}const Cv="@firebase/functions",Nv="0.11.8";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F2="auth-internal",B2="app-check-internal",$2="messaging-internal";function z2(t,e){const n=(r,{instanceIdentifier:i})=>{const s=r.getProvider("app").getImmediate(),o=r.getProvider(F2),l=r.getProvider($2),u=r.getProvider(B2);return new O2(s,o,l,u,i,t)};xt(new Et(Sm,n,"PUBLIC").setMultipleInstances(!0)),Je(Cv,Nv,e),Je(Cv,Nv,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W2(t=ga(),e=wf){const r=Xn(ie(t),Sm).getImmediate({identifier:e}),i=Ep("functions");return i&&H2(r,...i),r}function H2(t,e,n){L2(ie(t),e,n)}function q2(t,e,n){return V2(ie(t),e)}z2(fetch.bind(self));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tS="firebasestorage.googleapis.com",nS="storageBucket",K2=2*60*1e3,G2=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be extends zt{constructor(e,n,r=0){super(Uh(e),`Firebase Storage: ${n} (${Uh(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,be.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Uh(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var xe;(function(t){t.UNKNOWN="unknown",t.OBJECT_NOT_FOUND="object-not-found",t.BUCKET_NOT_FOUND="bucket-not-found",t.PROJECT_NOT_FOUND="project-not-found",t.QUOTA_EXCEEDED="quota-exceeded",t.UNAUTHENTICATED="unauthenticated",t.UNAUTHORIZED="unauthorized",t.UNAUTHORIZED_APP="unauthorized-app",t.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",t.INVALID_CHECKSUM="invalid-checksum",t.CANCELED="canceled",t.INVALID_EVENT_NAME="invalid-event-name",t.INVALID_URL="invalid-url",t.INVALID_DEFAULT_BUCKET="invalid-default-bucket",t.NO_DEFAULT_BUCKET="no-default-bucket",t.CANNOT_SLICE_BLOB="cannot-slice-blob",t.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",t.NO_DOWNLOAD_URL="no-download-url",t.INVALID_ARGUMENT="invalid-argument",t.INVALID_ARGUMENT_COUNT="invalid-argument-count",t.APP_DELETED="app-deleted",t.INVALID_ROOT_OPERATION="invalid-root-operation",t.INVALID_FORMAT="invalid-format",t.INTERNAL_ERROR="internal-error",t.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(xe||(xe={}));function Uh(t){return"storage/"+t}function Am(){const t="An unknown error occurred, please check the error payload for server response.";return new be(xe.UNKNOWN,t)}function Q2(t){return new be(xe.OBJECT_NOT_FOUND,"Object '"+t+"' does not exist.")}function Y2(t){return new be(xe.QUOTA_EXCEEDED,"Quota for bucket '"+t+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function X2(){const t="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new be(xe.UNAUTHENTICATED,t)}function J2(){return new be(xe.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Z2(t){return new be(xe.UNAUTHORIZED,"User does not have permission to access '"+t+"'.")}function eV(){return new be(xe.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function tV(){return new be(xe.CANCELED,"User canceled the upload/download.")}function nV(t){return new be(xe.INVALID_URL,"Invalid URL '"+t+"'.")}function rV(t){return new be(xe.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+t+"'.")}function iV(){return new be(xe.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+nS+"' property when initializing the app?")}function sV(){return new be(xe.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function oV(){return new be(xe.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function aV(t){return new be(xe.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function Ef(t){return new be(xe.INVALID_ARGUMENT,t)}function rS(){return new be(xe.APP_DELETED,"The Firebase app was deleted.")}function lV(t){return new be(xe.INVALID_ROOT_OPERATION,"The operation '"+t+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function xo(t,e){return new be(xe.INVALID_FORMAT,"String does not match format '"+t+"': "+e)}function ro(t){throw new be(xe.INTERNAL_ERROR,"Internal error: "+t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e,n){this.bucket=e,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,n){let r;try{r=Mt.makeFromUrl(e,n)}catch{return new Mt(e,"")}if(r.path==="")return r;throw rV(e)}static makeFromUrl(e,n){let r=null;const i="([A-Za-z0-9.\\-_]+)";function s(O){O.path.charAt(O.path.length-1)==="/"&&(O.path_=O.path_.slice(0,-1))}const o="(/(.*))?$",l=new RegExp("^gs://"+i+o,"i"),u={bucket:1,path:3};function c(O){O.path_=decodeURIComponent(O.path)}const d="v[A-Za-z0-9_]+",m=n.replace(/[.]/g,"\\."),g="(/([^?#]*).*)?$",I=new RegExp(`^https?://${m}/${d}/b/${i}/o${g}`,"i"),R={bucket:1,path:3},C=n===tS?"(?:storage.googleapis.com|storage.cloud.google.com)":n,b="([^?#]*)",k=new RegExp(`^https?://${C}/${i}/${b}`,"i"),v=[{regex:l,indices:u,postModify:s},{regex:I,indices:R,postModify:c},{regex:k,indices:{bucket:1,path:2},postModify:c}];for(let O=0;O<v.length;O++){const U=v[O],x=U.regex.exec(e);if(x){const E=x[U.indices.bucket];let _=x[U.indices.path];_||(_=""),r=new Mt(E,_),U.postModify(r);break}}if(r==null)throw nV(e);return r}}class uV{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cV(t,e,n){let r=1,i=null,s=null,o=!1,l=0;function u(){return l===2}let c=!1;function d(...b){c||(c=!0,e.apply(null,b))}function m(b){i=setTimeout(()=>{i=null,t(I,u())},b)}function g(){s&&clearTimeout(s)}function I(b,...k){if(c){g();return}if(b){g(),d.call(null,b,...k);return}if(u()||o){g(),d.call(null,b,...k);return}r<64&&(r*=2);let v;l===1?(l=2,v=0):v=(r+Math.random())*1e3,m(v)}let R=!1;function C(b){R||(R=!0,g(),!c&&(i!==null?(b||(l=2),clearTimeout(i),m(0)):b||(l=1)))}return m(0),s=setTimeout(()=>{o=!0,C(!0)},n),C}function hV(t){t(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dV(t){return t!==void 0}function fV(t){return typeof t=="object"&&!Array.isArray(t)}function km(t){return typeof t=="string"||t instanceof String}function xv(t){return Rm()&&t instanceof Blob}function Rm(){return typeof Blob<"u"}function bv(t,e,n,r){if(r<e)throw Ef(`Invalid value for '${t}'. Expected ${e} or greater.`);if(r>n)throw Ef(`Invalid value for '${t}'. Expected ${n} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pc(t,e,n){let r=e;return n==null&&(r=`https://${e}`),`${n}://${r}/v0${t}`}function iS(t){const e=encodeURIComponent;let n="?";for(const r in t)if(t.hasOwnProperty(r)){const i=e(r)+"="+e(t[r]);n=n+i+"&"}return n=n.slice(0,-1),n}var ai;(function(t){t[t.NO_ERROR=0]="NO_ERROR",t[t.NETWORK_ERROR=1]="NETWORK_ERROR",t[t.ABORT=2]="ABORT"})(ai||(ai={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pV(t,e){const n=t>=500&&t<600,i=[408,429].indexOf(t)!==-1,s=e.indexOf(t)!==-1;return n||i||s}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mV{constructor(e,n,r,i,s,o,l,u,c,d,m,g=!0){this.url_=e,this.method_=n,this.headers_=r,this.body_=i,this.successCodes_=s,this.additionalRetryCodes_=o,this.callback_=l,this.errorCallback_=u,this.timeout_=c,this.progressCallback_=d,this.connectionFactory_=m,this.retry=g,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((I,R)=>{this.resolve_=I,this.reject_=R,this.start_()})}start_(){const e=(r,i)=>{if(i){r(!1,new _l(!1,null,!0));return}const s=this.connectionFactory_();this.pendingConnection_=s;const o=l=>{const u=l.loaded,c=l.lengthComputable?l.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,c)};this.progressCallback_!==null&&s.addUploadProgressListener(o),s.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&s.removeUploadProgressListener(o),this.pendingConnection_=null;const l=s.getErrorCode()===ai.NO_ERROR,u=s.getStatus();if(!l||pV(u,this.additionalRetryCodes_)&&this.retry){const d=s.getErrorCode()===ai.ABORT;r(!1,new _l(!1,null,d));return}const c=this.successCodes_.indexOf(u)!==-1;r(!0,new _l(c,s))})},n=(r,i)=>{const s=this.resolve_,o=this.reject_,l=i.connection;if(i.wasSuccessCode)try{const u=this.callback_(l,l.getResponse());dV(u)?s(u):s()}catch(u){o(u)}else if(l!==null){const u=Am();u.serverResponse=l.getErrorText(),this.errorCallback_?o(this.errorCallback_(l,u)):o(u)}else if(i.canceled){const u=this.appDelete_?rS():tV();o(u)}else{const u=eV();o(u)}};this.canceled_?n(!1,new _l(!1,null,!0)):this.backoffId_=cV(e,n,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&hV(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class _l{constructor(e,n,r){this.wasSuccessCode=e,this.connection=n,this.canceled=!!r}}function gV(t,e){e!==null&&e.length>0&&(t.Authorization="Firebase "+e)}function yV(t,e){t["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function _V(t,e){e&&(t["X-Firebase-GMPID"]=e)}function vV(t,e){e!==null&&(t["X-Firebase-AppCheck"]=e)}function wV(t,e,n,r,i,s,o=!0){const l=iS(t.urlParams),u=t.url+l,c=Object.assign({},t.headers);return _V(c,e),gV(c,n),yV(c,s),vV(c,r),new mV(u,t.method,c,t.body,t.successCodes,t.additionalRetryCodes,t.handler,t.errorHandler,t.timeout,t.progressCallback,i,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function EV(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function TV(...t){const e=EV();if(e!==void 0){const n=new e;for(let r=0;r<t.length;r++)n.append(t[r]);return n.getBlob()}else{if(Rm())return new Blob(t);throw new be(xe.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function IV(t,e,n){return t.webkitSlice?t.webkitSlice(e,n):t.mozSlice?t.mozSlice(e,n):t.slice?t.slice(e,n):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function SV(t){if(typeof atob>"u")throw aV("base-64");return atob(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wn={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Fh{constructor(e,n){this.data=e,this.contentType=n||null}}function AV(t,e){switch(t){case wn.RAW:return new Fh(sS(e));case wn.BASE64:case wn.BASE64URL:return new Fh(oS(t,e));case wn.DATA_URL:return new Fh(RV(e),PV(e))}throw Am()}function sS(t){const e=[];for(let n=0;n<t.length;n++){let r=t.charCodeAt(n);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(n<t.length-1&&(t.charCodeAt(n+1)&64512)===56320))e.push(239,191,189);else{const s=r,o=t.charCodeAt(++n);r=65536|(s&1023)<<10|o&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function kV(t){let e;try{e=decodeURIComponent(t)}catch{throw xo(wn.DATA_URL,"Malformed data URL.")}return sS(e)}function oS(t,e){switch(t){case wn.BASE64:{const i=e.indexOf("-")!==-1,s=e.indexOf("_")!==-1;if(i||s)throw xo(t,"Invalid character '"+(i?"-":"_")+"' found: is it base64url encoded?");break}case wn.BASE64URL:{const i=e.indexOf("+")!==-1,s=e.indexOf("/")!==-1;if(i||s)throw xo(t,"Invalid character '"+(i?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=SV(e)}catch(i){throw i.message.includes("polyfill")?i:xo(t,"Invalid character found")}const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}class aS{constructor(e){this.base64=!1,this.contentType=null;const n=e.match(/^data:([^,]+)?,/);if(n===null)throw xo(wn.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=n[1]||null;r!=null&&(this.base64=CV(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}}function RV(t){const e=new aS(t);return e.base64?oS(wn.BASE64,e.rest):kV(e.rest)}function PV(t){return new aS(t).contentType}function CV(t,e){return t.length>=e.length?t.substring(t.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dr{constructor(e,n){let r=0,i="";xv(e)?(this.data_=e,r=e.size,i=e.type):e instanceof ArrayBuffer?(n?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(n?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=i}size(){return this.size_}type(){return this.type_}slice(e,n){if(xv(this.data_)){const r=this.data_,i=IV(r,e,n);return i===null?null:new dr(i)}else{const r=new Uint8Array(this.data_.buffer,e,n-e);return new dr(r,!0)}}static getBlob(...e){if(Rm()){const n=e.map(r=>r instanceof dr?r.data_:r);return new dr(TV.apply(null,n))}else{const n=e.map(o=>km(o)?AV(wn.RAW,o).data:o.data_);let r=0;n.forEach(o=>{r+=o.byteLength});const i=new Uint8Array(r);let s=0;return n.forEach(o=>{for(let l=0;l<o.length;l++)i[s++]=o[l]}),new dr(i,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lS(t){let e;try{e=JSON.parse(t)}catch{return null}return fV(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NV(t){if(t.length===0)return null;const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function xV(t,e){const n=e.split("/").filter(r=>r.length>0).join("/");return t.length===0?n:t+"/"+n}function uS(t){const e=t.lastIndexOf("/",t.length-2);return e===-1?t:t.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bV(t,e){return e}class _t{constructor(e,n,r,i){this.server=e,this.local=n||e,this.writable=!!r,this.xform=i||bV}}let vl=null;function DV(t){return!km(t)||t.length<2?t:uS(t)}function cS(){if(vl)return vl;const t=[];t.push(new _t("bucket")),t.push(new _t("generation")),t.push(new _t("metageneration")),t.push(new _t("name","fullPath",!0));function e(s,o){return DV(o)}const n=new _t("name");n.xform=e,t.push(n);function r(s,o){return o!==void 0?Number(o):o}const i=new _t("size");return i.xform=r,t.push(i),t.push(new _t("timeCreated")),t.push(new _t("updated")),t.push(new _t("md5Hash",null,!0)),t.push(new _t("cacheControl",null,!0)),t.push(new _t("contentDisposition",null,!0)),t.push(new _t("contentEncoding",null,!0)),t.push(new _t("contentLanguage",null,!0)),t.push(new _t("contentType",null,!0)),t.push(new _t("metadata","customMetadata",!0)),vl=t,vl}function OV(t,e){function n(){const r=t.bucket,i=t.fullPath,s=new Mt(r,i);return e._makeStorageReference(s)}Object.defineProperty(t,"ref",{get:n})}function LV(t,e,n){const r={};r.type="file";const i=n.length;for(let s=0;s<i;s++){const o=n[s];r[o.local]=o.xform(r,e[o.server])}return OV(r,t),r}function hS(t,e,n){const r=lS(e);return r===null?null:LV(t,r,n)}function VV(t,e,n,r){const i=lS(e);if(i===null||!km(i.downloadTokens))return null;const s=i.downloadTokens;if(s.length===0)return null;const o=encodeURIComponent;return s.split(",").map(c=>{const d=t.bucket,m=t.fullPath,g="/b/"+o(d)+"/o/"+o(m),I=Pc(g,n,r),R=iS({alt:"media",token:c});return I+R})[0]}function MV(t,e){const n={},r=e.length;for(let i=0;i<r;i++){const s=e[i];s.writable&&(n[s.server]=t[s.local])}return JSON.stringify(n)}class Pm{constructor(e,n,r,i){this.url=e,this.method=n,this.handler=r,this.timeout=i,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dS(t){if(!t)throw Am()}function jV(t,e){function n(r,i){const s=hS(t,i,e);return dS(s!==null),s}return n}function UV(t,e){function n(r,i){const s=hS(t,i,e);return dS(s!==null),VV(s,i,t.host,t._protocol)}return n}function fS(t){function e(n,r){let i;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?i=J2():i=X2():n.getStatus()===402?i=Y2(t.bucket):n.getStatus()===403?i=Z2(t.path):i=r,i.status=n.getStatus(),i.serverResponse=r.serverResponse,i}return e}function pS(t){const e=fS(t);function n(r,i){let s=e(r,i);return r.getStatus()===404&&(s=Q2(t.path)),s.serverResponse=i.serverResponse,s}return n}function FV(t,e,n){const r=e.fullServerUrl(),i=Pc(r,t.host,t._protocol)+"?alt=media",s="GET",o=t.maxOperationRetryTime,l=new Pm(i,s,(u,c)=>c,o);return l.errorHandler=pS(e),l}function BV(t,e,n){const r=e.fullServerUrl(),i=Pc(r,t.host,t._protocol),s="GET",o=t.maxOperationRetryTime,l=new Pm(i,s,UV(t,n),o);return l.errorHandler=pS(e),l}function $V(t,e){return t&&t.contentType||e&&e.type()||"application/octet-stream"}function zV(t,e,n){const r=Object.assign({},n);return r.fullPath=t.path,r.size=e.size(),r.contentType||(r.contentType=$V(null,e)),r}function WV(t,e,n,r,i){const s=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function l(){let v="";for(let O=0;O<2;O++)v=v+Math.random().toString().slice(2);return v}const u=l();o["Content-Type"]="multipart/related; boundary="+u;const c=zV(e,r,i),d=MV(c,n),m="--"+u+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+d+`\r
--`+u+`\r
Content-Type: `+c.contentType+`\r
\r
`,g=`\r
--`+u+"--",I=dr.getBlob(m,r,g);if(I===null)throw sV();const R={name:c.fullPath},C=Pc(s,t.host,t._protocol),b="POST",k=t.maxUploadRetryTime,w=new Pm(C,b,jV(t,n),k);return w.urlParams=R,w.headers=o,w.body=I.uploadData(),w.errorHandler=fS(e),w}class mS{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=ai.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=ai.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=ai.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,n,r,i){if(this.sent_)throw ro("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(n,e,!0),i!==void 0)for(const s in i)i.hasOwnProperty(s)&&this.xhr_.setRequestHeader(s,i[s].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw ro("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw ro("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw ro("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw ro("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class HV extends mS{initXhr(){this.xhr_.responseType="text"}}function gS(){return new HV}class qV extends mS{initXhr(){this.xhr_.responseType="blob"}}function KV(){return new qV}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ei{constructor(e,n){this._service=e,n instanceof Mt?this._location=n:this._location=Mt.makeFromUrl(n,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,n){return new Ei(e,n)}get root(){const e=new Mt(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return uS(this._location.path)}get storage(){return this._service}get parent(){const e=NV(this._location.path);if(e===null)return null;const n=new Mt(this._location.bucket,e);return new Ei(this._service,n)}_throwIfRoot(e){if(this._location.path==="")throw lV(e)}}function GV(t,e){t._throwIfRoot("getBlob");const n=FV(t.storage,t._location);return t.storage.makeRequestWithTokens(n,KV).then(r=>r)}function QV(t,e,n){t._throwIfRoot("uploadBytes");const r=WV(t.storage,t._location,cS(),new dr(e,!0),n);return t.storage.makeRequestWithTokens(r,gS).then(i=>({metadata:i,ref:t}))}function YV(t){t._throwIfRoot("getDownloadURL");const e=BV(t.storage,t._location,cS());return t.storage.makeRequestWithTokens(e,gS).then(n=>{if(n===null)throw oV();return n})}function XV(t,e){const n=xV(t._location.path,e),r=new Mt(t._location.bucket,n);return new Ei(t.storage,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JV(t){return/^[A-Za-z]+:\/\//.test(t)}function ZV(t,e){return new Ei(t,e)}function yS(t,e){if(t instanceof Cm){const n=t;if(n._bucket==null)throw iV();const r=new Ei(n,n._bucket);return e!=null?yS(r,e):r}else return e!==void 0?XV(t,e):t}function eM(t,e){if(e&&JV(e)){if(t instanceof Cm)return ZV(t,e);throw Ef("To use ref(service, url), the first argument must be a Storage instance.")}else return yS(t,e)}function Dv(t,e){const n=e==null?void 0:e[nS];return n==null?null:Mt.makeFromBucketSpec(n,t)}function tM(t,e,n,r={}){t.host=`${e}:${n}`,t._protocol="http";const{mockUserToken:i}=r;i&&(t._overrideAuthToken=typeof i=="string"?i:_T(i,t.app.options.projectId))}class Cm{constructor(e,n,r,i,s){this.app=e,this._authProvider=n,this._appCheckProvider=r,this._url=i,this._firebaseVersion=s,this._bucket=null,this._host=tS,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=K2,this._maxUploadRetryTime=G2,this._requests=new Set,i!=null?this._bucket=Mt.makeFromBucketSpec(i,this._host):this._bucket=Dv(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Mt.makeFromBucketSpec(this._url,e):this._bucket=Dv(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){bv("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){bv("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const n=await e.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Ei(this,e)}_makeRequest(e,n,r,i,s=!0){if(this._deleted)return new uV(rS());{const o=wV(e,this._appId,r,i,n,this._firebaseVersion,s);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,n){const[r,i]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,n,r,i).getPromise()}}const Ov="@firebase/storage",Lv="0.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _S="storage";function Yj(t,e,n){return t=ie(t),QV(t,e,n)}function Xj(t){return t=ie(t),YV(t)}function Jj(t,e){return t=ie(t),eM(t,e)}function nM(t=ga(),e){t=ie(t);const r=Xn(t,_S).getImmediate({identifier:e}),i=Ep("storage");return i&&rM(r,...i),r}function rM(t,e,n,r={}){tM(t,e,n,r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zj(t,e){return t=ie(t),GV(t)}function iM(t,{instanceIdentifier:e}){const n=t.getProvider("app").getImmediate(),r=t.getProvider("auth-internal"),i=t.getProvider("app-check-internal");return new Cm(n,r,i,e,Si)}function sM(){xt(new Et(_S,iM,"PUBLIC").setMultipleInstances(!0)),Je(Ov,Lv,""),Je(Ov,Lv,"esm2017")}sM();const bo={apiKey:"AIzaSyBKqNojKIxXizCCr6EXTt63b_UsM_uC6gk",authDomain:"tailgatetime-prod.firebaseapp.com",projectId:"tailgatetime-prod",storageBucket:"tailgatetime-prod.firebasestorage.app",messagingSenderId:"483414039896",appId:"1:483414039896:web:8a563f9d1fcabaaba7192d",measurementId:"G-1WN4M42L1W"},oM=!!(bo.apiKey&&bo.authDomain&&bo.projectId),Rn=oM?s_().length?s_()[0]:IT(bo):null,Ge=Rn?Nx(Rn):null,Is=Rn?yO(Rn):null,Vv=Rn?W2(Rn):null,eU=Rn?nM(Rn):null;let Bh=null;function vS(){return!Rn||typeof window>"u"||!bo.measurementId?Promise.resolve(null):(Bh||(Bh=k2().then(t=>t?S2(Rn):null).catch(()=>null)),Bh)}function aM(t){typeof window>"u"||typeof document>"u"||vS().then(e=>{if(e)try{Im(e,"page_view",{page_location:window.location.href,page_path:t,page_title:document.title})}catch(n){console.warn("Firebase page analytics failed",n)}}).catch(e=>console.warn("Firebase page analytics failed",e))}function lM(t,e){vS().then(n=>{if(n)try{Im(n,t,e)}catch(r){console.warn("Firebase custom analytics failed",{name:t,error:r})}}).catch(n=>console.warn("Firebase custom analytics failed",{name:t,error:n}))}async function tU(){return null}function nU(t,e){}const wS=L.createContext({user:null,loading:!0,isAdmin:!1,adminLoading:!0,refreshAdminClaim:async()=>{}});function uM({children:t}){const[e,n]=L.useState(null),[r,i]=L.useState(!0),[s,o]=L.useState(!1),[l,u]=L.useState(!0),c=L.useCallback(async g=>{var I;if(!g||!Is){o(!1),u(!1);return}u(!0);try{const R=await OO(sm(Is,"users",g.uid));o(R.exists()&&((I=R.data())==null?void 0:I.admin)===!0)}catch(R){console.error("Failed to resolve admin access",R),o(!1)}finally{u(!1)}},[]);L.useEffect(()=>{if(!Ge){i(!1),u(!1);return}const g=wN(Ge,I=>{n(I),i(!1),c(I),I==null||I.uid,I==null||I.email});return()=>g()},[c]);const d=L.useCallback(async()=>{await c((Ge==null?void 0:Ge.currentUser)??null)},[c]),m=L.useMemo(()=>({user:e,loading:r,isAdmin:s,adminLoading:l,refreshAdminClaim:d}),[l,s,r,d,e]);return p.jsx(wS.Provider,{value:m,children:t})}function Pa(){return L.useContext(wS)}function Dt({children:t}){const{user:e,loading:n}=Pa(),r=pn();if(n)return p.jsx("div",{className:"page-loading",children:"Loading..."});if(!e){const i=`${r.pathname}${r.search}`;return p.jsx(si,{to:`/login?redirect=${encodeURIComponent(i)}`,replace:!0})}return p.jsx(p.Fragment,{children:t})}function wl({children:t}){const{user:e,loading:n,isAdmin:r,adminLoading:i}=Pa(),s=pn();if(n||i)return p.jsx("div",{className:"page-loading",children:"Loading..."});if(!e){const o=`${s.pathname}${s.search}`;return p.jsx(si,{to:`/login?redirect=${encodeURIComponent(o)}`,replace:!0})}return r?p.jsx(p.Fragment,{children:t}):p.jsx(si,{to:"/dashboard",replace:!0})}function cM(t){const n=[{path:"/",title:"TailgateTime Home"},{path:"/login",title:"TailgateTime Login"},{path:"/dashboard",title:"TailgateTime Host Dashboard"},{path:"/dashboard/host-page",title:"Your Host Page | TailgateTime"},{path:"/hosts/:slug",title:"Host | TailgateTime"},{path:"/tailgates/new",title:"Create Tailgate"},{path:"/account",title:"Account & Payouts"},{path:"/account/payout-history",title:"Payout History"},{path:"/account/notifications",title:"Notification Preferences"},{path:"/account/change-password",title:"Change Password"},{path:"/tailgates/:id/edit",title:"Edit Tailgate"},{path:"/tailgates/:id/checkin",title:"Tailgate Check-in"},{path:"/tailgates/:id/feed",title:"Tailgate Feed"},{path:"/tailgates/:id",title:"Tailgate Details"},{path:"/checkin",title:"Check-in Hub"},{path:"/messages",title:"Messages"},{path:"/discover",title:"Discover Tailgates"},{path:"/about",title:"About | TailgateTime"},{path:"/user-guide",title:"User Guide"},{path:"/admin/spotlight",title:"Admin Spotlight"},{path:"/admin/metrics",title:"Admin Metrics"},{path:"/admin/ticket-analytics",title:"Paid Event Analytics"},{path:"/admin/ops",title:"Admin Ops"}].find(r=>gu({path:r.path,end:!0},t));return(n==null?void 0:n.title)??"TailgateTime"}function hM(){const t=pn(),e=L.useRef(null);return L.useEffect(()=>{const n=`${t.pathname}${t.search}`,r=cM(t.pathname);if(document.title=r,aM(n),typeof window.fbq=="function"){if(e.current===null){e.current=n;return}e.current!==n&&(e.current=n,window.fbq("track","PageView"))}},[t.hash,t.pathname,t.search]),null}function rU({size:t=20,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("path",{d:"M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"}),p.jsx("path",{d:"M13.73 21a2 2 0 01-3.46 0"})]})}function iU({size:t=20,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("rect",{x:"3",y:"3",width:"8",height:"8",rx:"2"}),p.jsx("rect",{x:"13",y:"3",width:"8",height:"5",rx:"2"}),p.jsx("rect",{x:"13",y:"10",width:"8",height:"11",rx:"2"}),p.jsx("rect",{x:"3",y:"13",width:"8",height:"8",rx:"2"})]})}function ES({size:t=20,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("circle",{cx:"12",cy:"12",r:"9"}),p.jsx("path",{d:"M15.8 8.2l-2.1 6.1-6.1 2.1 2.1-6.1 6.1-2.1z"})]})}function dM({size:t=20,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("circle",{cx:"12",cy:"8",r:"4"}),p.jsx("path",{d:"M4 20c1.8-3.6 5-5.5 8-5.5s6.2 1.9 8 5.5"})]})}function sU({size:t=18,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2"}),p.jsx("path",{d:"M16 2v4M8 2v4M3 10h18"})]})}function oU({size:t=18,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("path",{d:"M12 22s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z"}),p.jsx("circle",{cx:"12",cy:"10",r:"2.5"})]})}function aU({size:t=18,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("path",{d:"M14 3h7v7"}),p.jsx("path",{d:"M10 14L21 3"}),p.jsx("path",{d:"M21 14v7H3V3h7"})]})}function lU({size:t=18,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("rect",{x:"8",y:"8",width:"12",height:"12",rx:"2"}),p.jsx("path",{d:"M4 16V6a2 2 0 012-2h10"})]})}function fM({size:t=18,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"5"}),p.jsx("circle",{cx:"12",cy:"12",r:"4"}),p.jsx("circle",{cx:"17.5",cy:"6.5",r:"1",fill:"currentColor",stroke:"none"})]})}function pM({size:t=18,...e}){return p.jsx("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:p.jsx("path",{d:"M14.5 8H17V4.7h-2.6c-3 0-4.6 1.8-4.6 4.8V12H7v3.2h2.8V20h3.4v-4.8h2.9L16.7 12h-3.5V9.9c0-1.2.5-1.9 1.8-1.9z"})})}function Nm({size:t=20,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("path",{d:"M12 1v22"}),p.jsx("path",{d:"M17 5H9a4 4 0 000 8h6a4 4 0 110 8H7"})]})}function mM({size:t=20,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),p.jsx("path",{d:"M7 8h10M7 12h6M9 16l2 2 4-4"})]})}function gM({size:t=20,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("path",{d:"M21 15a4 4 0 01-4 4H7l-4 3V7a4 4 0 014-4h10a4 4 0 014 4z"}),p.jsx("path",{d:"M7 8h10M7 12h6"})]})}function yM({size:t=20,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("path",{d:"M12 2l1.7 4.9L19 8l-4.9 1.7L12 15l-2.1-5.3L5 8l5.3-1.1L12 2z"}),p.jsx("path",{d:"M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"})]})}function uU({size:t=20,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("path",{d:"M3 8a3 3 0 013-3h13a2 2 0 010 4H8a2 2 0 100 4h11a2 2 0 012 2v1a3 3 0 01-3 3H6a3 3 0 01-3-3V8z"}),p.jsx("circle",{cx:"17",cy:"12",r:"1"})]})}function cU({size:t=20,...e}){return p.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:[p.jsx("path",{d:"M4 20V10"}),p.jsx("path",{d:"M10 20V4"}),p.jsx("path",{d:"M16 20v-7"}),p.jsx("path",{d:"M22 20v-11"}),p.jsx("path",{d:"M2 20h20"})]})}function hU({size:t=18,...e}){return p.jsx("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,...e,children:p.jsx("path",{d:"M15 18l-6-6 6-6"})})}const xm="/assets/ttnobg-DWR3rnF1.png";function TS(){const{user:t}=Pa(),e=pn(),n=e.pathname,r=new URLSearchParams(e.search).get("mode");return p.jsx("header",{className:"public-nav-shell",children:p.jsxs("div",{className:"public-nav",children:[p.jsxs(Me,{to:"/",className:"public-brand",children:[p.jsx("img",{src:xm,alt:"TailgateTime"}),p.jsx("strong",{children:"TailgateTime"})]}),p.jsxs("nav",{className:"public-nav-links","aria-label":"Public site",children:[p.jsx(Me,{to:"/",className:n==="/"?"active":"",children:"Home"}),p.jsx(Me,{to:"/about",className:n.startsWith("/about")?"active":"",children:"About"}),p.jsx(Me,{to:"/discover",className:n.startsWith("/discover")?"active":"",children:"Discover"}),p.jsx("a",{href:"/contact.html",children:"Contact & Support"}),p.jsx("a",{href:"https://www.instagram.com/tailgatetime25/",target:"_blank",rel:"noopener noreferrer",className:"public-nav-social-link","aria-label":"TailgateTime on Instagram",title:"Instagram",children:p.jsx(fM,{size:16})}),p.jsx("a",{href:"https://www.facebook.com/profile.php?id=61577940414994",target:"_blank",rel:"noopener noreferrer",className:"public-nav-social-link","aria-label":"TailgateTime on Facebook",title:"Facebook",children:p.jsx(pM,{size:16})})]}),p.jsx("div",{className:"public-auth-actions",children:t?p.jsx(Me,{to:"/dashboard",className:"public-auth-btn signup",children:"My Dashboard"}):p.jsxs(p.Fragment,{children:[p.jsx(Me,{to:"/login?mode=login",className:`public-auth-btn login ${r==="login"?"active":""}`.trim(),children:"Login"}),p.jsx(Me,{to:"/login?mode=signup",className:`public-auth-btn signup ${r==="signup"?"active":""}`.trim(),children:"Sign Up"})]})})]})})}function IS(){return p.jsxs("footer",{className:"site-footer",children:[p.jsxs("div",{className:"site-footer-links",children:[p.jsx(Me,{to:"/",children:"Home"}),p.jsx(Me,{to:"/about",children:"About"}),p.jsx(Me,{to:"/discover",children:"Discover"}),p.jsx("a",{href:"/contact.html",children:"Contact & Support"}),p.jsx("a",{href:"/privacy-policy.html",children:"Privacy"}),p.jsx("a",{href:"/terms.html",children:"Terms"})]}),p.jsx("p",{className:"site-footer-legal",children:"© 2026 TailgateTime. All rights reserved."})]})}const bm="abuse-guard:";function Dm(){if(typeof window>"u")return null;try{return window.localStorage}catch{return null}}function _M(t){const e=Dm();if(!e)return{attempts:[],blockedUntil:0};try{const n=e.getItem(`${bm}${t}`);if(!n)return{attempts:[],blockedUntil:0};const r=JSON.parse(n);return{attempts:Array.isArray(r.attempts)?r.attempts.filter(i=>Number.isFinite(i)):[],blockedUntil:Number.isFinite(r.blockedUntil)?Number(r.blockedUntil):0}}catch{return{attempts:[],blockedUntil:0}}}function $h(t,e){const n=Dm();if(n)try{n.setItem(`${bm}${t}`,JSON.stringify(e))}catch{}}function vM(t,e){const n=Date.now(),r=_M(t),i=r.attempts.filter(s=>n-s<e.windowMs);if(r.blockedUntil>n)return $h(t,{attempts:i,blockedUntil:r.blockedUntil}),{allowed:!1,retryAfterMs:r.blockedUntil-n};if(i.push(n),i.length>e.maxAttempts){const s=n+e.blockMs;return $h(t,{attempts:i,blockedUntil:s}),{allowed:!1,retryAfterMs:e.blockMs}}return $h(t,{attempts:i,blockedUntil:0}),{allowed:!0,retryAfterMs:0}}function wM(t){const e=Dm();if(e)try{e.removeItem(`${bm}${t}`)}catch{}}function EM(t){const e=Math.max(1,Math.ceil(t/1e3)),n=Math.floor(e/60),r=e%60;return n===0?`${e}s`:r===0?`${n}m`:`${n}m ${r}s`}const TM={maxAttempts:5,windowMs:60*1e3,blockMs:10*60*1e3};function IM(t){return!t||!t.startsWith("/")||t.startsWith("//")?"/dashboard":t}function SM(t,e){switch(typeof t=="object"&&t&&"code"in t?String(t.code):""){case"auth/invalid-email":return"Enter a valid email address.";case"auth/email-already-in-use":return"That email is already in use. Try signing in instead.";case"auth/weak-password":return"Use a stronger password with at least 8 characters.";case"auth/user-not-found":case"auth/wrong-password":case"auth/invalid-credential":return"Email or password is incorrect.";case"auth/popup-closed-by-user":return"Google sign-in was canceled.";case"auth/too-many-requests":return"Too many attempts. Please wait and try again.";default:return e?"Could not create account right now. Please try again.":"Could not sign in right now. Please try again."}}function AM(t){return{length:t.length>=8,lower:/[a-z]/.test(t),upper:/[A-Z]/.test(t),number:/[0-9]/.test(t),symbol:/[^A-Za-z0-9]/.test(t)}}function kM(t){const e=t.replace(/\D/g,"").slice(0,10),n=e.slice(0,3),r=e.slice(3,6),i=e.slice(6,10);return e.length<=3?n:e.length<=6?`(${n}) ${r}`:`(${n}) ${r}-${i}`}function SS(t){const e=t.replace(/\D/g,"");return e.length!==10?null:`+1${e}`}function RM(t){return!!SS(t)}async function Mv(t){var m;const{user:e,firstName:n,lastName:r,displayName:i,emailFallback:s,phone:o}=t;if(!Is)return;const l=(i==null?void 0:i.trim())||((m=e.displayName)==null?void 0:m.trim())||"",u=(o==null?void 0:o.trim())??"",c=u?SS(u):null,d={email:e.email??s??"",displayName:l,updatedAt:new Date};n!=null&&n.trim()&&(d.firstName=n.trim()),r!=null&&r.trim()&&(d.lastName=r.trim()),u&&(d.phone=u,d.phoneNumber=u,c&&(d.phoneE164=c)),await LO(sm(Is,"users",e.uid),d,{merge:!0})}function PM(){const{user:t}=Pa(),[e,n]=MP(),r=e.get("mode")==="signup",i=IM(e.get("redirect")),[s,o]=L.useState(""),[l,u]=L.useState(""),[c,d]=L.useState(""),[m,g]=L.useState(""),[I,R]=L.useState(""),[C,b]=L.useState(""),[k,w]=L.useState(!1),[v,O]=L.useState(r),[U,x]=L.useState(!1),[E,_]=L.useState(!1),[T,A]=L.useState(!1),[P,N]=L.useState(null),[S,De]=L.useState({}),me=L.useMemo(()=>AM(l),[l]),zr=me.length&&me.lower&&me.upper&&me.number,nt=[me.length,me.lower,me.upper,me.number,me.symbol].filter(Boolean).length,$=nt<=1?"Weak":nt<=2?"Fair":nt<=3?"Good":nt<=4?"Strong":"Very strong";if(L.useEffect(()=>{O(r)},[r]),L.useEffect(()=>{v||(b(""),w(!1),_(!1),De({}))},[v]),L.useEffect(()=>{if(P){const q=setTimeout(()=>N(null),6e3);return()=>clearTimeout(q)}},[P]),t)return t.uid,p.jsx(si,{to:i,replace:!0});const G=q=>{O(q==="signup"),N(null),De({});const de=new URLSearchParams(e);de.set("mode",q),n(de,{replace:!0})},Q=q=>{S[q]&&De(oe=>{const de={...oe};return delete de[q],de})},ge=async q=>{if(q.preventDefault(),N(null),!Ge){N("Firebase config missing. Add env variables to enable login.");return}const oe=s.trim().toLowerCase(),de={};if(oe?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(oe)||(de.email="Enter a valid email address."):de.email="Email is required.",l||(de.password="Password is required."),v&&(c.trim()||(de.firstName="First name is required."),m.trim()||(de.lastName="Last name is required."),RM(I)||(de.phone="Enter a valid phone number."),zr||(de.password="Use at least 8 characters with upper, lower, and a number."),C?C!==l&&(de.confirmPassword="Passwords do not match."):de.confirmPassword="Confirm your password.",k||(de.terms="You must accept the terms to create an account.")),Object.keys(de).length>0){De(de),N("Please fix the highlighted fields and try again.");return}De({});const Wt=v?"auth-signup":"auth-login",Ht=vM(Wt,TM);if(!Ht.allowed){N(`Too many ${v?"sign-up":"sign-in"} attempts from this browser. Wait ${EM(Ht.retryAfterMs)} and try again.`);return}try{if(A(!0),v){const rt=await fN(Ge,oe,l),Na=c.trim(),xa=m.trim(),Jn=`${Na} ${xa}`.trim();Jn&&await gN(rt.user,{displayName:Jn}),await Mv({user:rt.user,firstName:Na,lastName:xa,displayName:Jn,emailFallback:oe,phone:I.trim()})}else{const rt=await pN(Ge,oe,l);await Mv({user:rt.user,emailFallback:oe})}wM(Wt)}catch(rt){N(SM(rt,v))}finally{A(!1)}};return p.jsxs("div",{className:"public-page",children:[p.jsx(TS,{}),p.jsx("div",{className:"login-page",children:p.jsxs("div",{className:`login-card ${v?"signup":"signin"}`,children:[p.jsxs("div",{className:"logo",children:[p.jsx("img",{className:"logo-image",src:xm,alt:"TailgateTime logo"}),p.jsxs("div",{children:[p.jsx("p",{className:"logo-title",children:"TailgateTime"}),p.jsx("p",{className:"logo-subtitle",children:"Host Dashboard"})]})]}),p.jsxs("div",{className:"auth-mode-toggle",role:"tablist","aria-label":"Authentication mode",children:[p.jsx("button",{type:"button",role:"tab","aria-selected":!v,className:`auth-mode-tab ${v?"":"active"}`,onClick:()=>G("login"),children:"Sign in"}),p.jsx("button",{type:"button",role:"tab","aria-selected":v,className:`auth-mode-tab ${v?"active":""}`,onClick:()=>G("signup"),children:"Sign up"})]}),p.jsx("h1",{children:v?"Create your TailgateTime account":"Sign in to TailgateTime"}),p.jsx("p",{className:"auth-subcopy",children:Ge?v?"Set up your account to host, discover, and manage game-day plans.":"Welcome back. Sign in to continue where you left off.":"Add Firebase config to enable authentication."}),P?p.jsx("div",{className:"error-banner",children:P}):null,p.jsxs("form",{className:"login-form",onSubmit:ge,children:[v?p.jsxs("div",{className:"auth-name-grid",children:[p.jsxs("label",{className:"input-group",children:[p.jsx("span",{className:"input-label",children:"First Name"}),p.jsx("input",{className:`text-input ${S.firstName?"invalid":""}`,type:"text",autoComplete:"given-name",value:c,onChange:q=>{d(q.target.value),Q("firstName")},placeholder:"First Name",disabled:!Ge||T}),S.firstName?p.jsx("p",{className:"input-error",children:S.firstName}):null]}),p.jsxs("label",{className:"input-group",children:[p.jsx("span",{className:"input-label",children:"Last Name"}),p.jsx("input",{className:`text-input ${S.lastName?"invalid":""}`,type:"text",autoComplete:"family-name",value:m,onChange:q=>{g(q.target.value),Q("lastName")},placeholder:"Last Name",disabled:!Ge||T}),S.lastName?p.jsx("p",{className:"input-error",children:S.lastName}):null]})]}):null,v?p.jsxs("label",{className:"input-group",children:[p.jsx("span",{className:"input-label",children:"Phone"}),p.jsx("input",{className:`text-input ${S.phone?"invalid":""}`,type:"tel",autoComplete:"tel",inputMode:"tel",value:I,onChange:q=>{R(kM(q.target.value)),Q("phone")},placeholder:"(555) 555-5555",disabled:!Ge||T}),S.phone?p.jsx("p",{className:"input-error",children:S.phone}):null]}):null,p.jsxs("label",{className:"input-group",children:[p.jsx("span",{className:"input-label",children:"Email"}),p.jsx("input",{className:`text-input ${S.email?"invalid":""}`,type:"email",autoComplete:"email",value:s,onChange:q=>{o(q.target.value),Q("email")},placeholder:"you@tailgatetime.com",disabled:!Ge||T}),S.email?p.jsx("p",{className:"input-error",children:S.email}):null]}),p.jsxs("label",{className:"input-group",children:[p.jsx("span",{className:"input-label",children:"Password"}),p.jsxs("div",{className:"auth-password-wrap",children:[p.jsx("input",{className:`text-input ${S.password?"invalid":""}`,type:U?"text":"password",autoComplete:v?"new-password":"current-password",value:l,onChange:q=>{u(q.target.value),Q("password")},placeholder:"••••••••",disabled:!Ge||T}),p.jsx("button",{type:"button",className:"auth-password-toggle",onClick:()=>x(q=>!q),children:U?"Hide":"Show"})]}),S.password?p.jsx("p",{className:"input-error",children:S.password}):null]}),v?p.jsxs(p.Fragment,{children:[p.jsxs("label",{className:"input-group",children:[p.jsx("span",{className:"input-label",children:"Confirm Password"}),p.jsxs("div",{className:"auth-password-wrap",children:[p.jsx("input",{className:`text-input ${S.confirmPassword?"invalid":""}`,type:E?"text":"password",autoComplete:"new-password",value:C,onChange:q=>{b(q.target.value),Q("confirmPassword")},placeholder:"••••••••",disabled:!Ge||T}),p.jsx("button",{type:"button",className:"auth-password-toggle",onClick:()=>_(q=>!q),children:E?"Hide":"Show"})]}),S.confirmPassword?p.jsx("p",{className:"input-error",children:S.confirmPassword}):null]}),p.jsxs("div",{className:"signup-password-panel",children:[p.jsx("div",{className:"signup-password-meter",children:p.jsx("div",{className:`signup-password-meter-bar strength-${nt}`,style:{width:l?`${Math.max(16,nt*20)}%`:"0%"}})}),p.jsxs("p",{className:"signup-password-strength",children:["Password strength: ",$]}),p.jsxs("ul",{className:"signup-password-rules",children:[p.jsx("li",{className:me.length?"met":"",children:"At least 8 characters"}),p.jsx("li",{className:me.upper?"met":"",children:"One uppercase letter"}),p.jsx("li",{className:me.lower?"met":"",children:"One lowercase letter"}),p.jsx("li",{className:me.number?"met":"",children:"One number"}),p.jsx("li",{className:me.symbol?"met":"",children:"One symbol (recommended)"})]})]}),p.jsxs("label",{className:"auth-checkbox-row",children:[p.jsx("input",{type:"checkbox",checked:k,onChange:q=>{w(q.target.checked),Q("terms")},disabled:!Ge||T}),p.jsx("span",{children:"I agree to the Terms and Privacy Policy."})]}),S.terms?p.jsx("p",{className:"input-error",children:S.terms}):null]}):null,p.jsx("button",{className:"primary-button",type:"submit",disabled:T||!Ge,children:T?"Working...":v?"Create account":"Sign in"})]}),p.jsx("button",{className:"ghost-button",type:"button",onClick:()=>G(v?"login":"signup"),children:v?"Already have an account? Sign in":"New here? Create account"})]})}),p.jsx(IS,{})]})}function Vu(t){return t instanceof Date&&!Number.isNaN(t.getTime())}function CM(t,e){return t.getFullYear()===e.getFullYear()&&t.getMonth()===e.getMonth()&&t.getDate()===e.getDate()}function AS(t){return new Intl.DateTimeFormat("en-US",{weekday:"long",month:"short",day:"numeric"}).format(t)}function zl(t){return new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit"}).format(t)}function zh(t){return`${AS(t)} · ${zl(t)}`}function NM(t,e){return Vu(t)?!Vu(e)||t.getTime()===e.getTime()?zl(t):`${zl(t)} - ${zl(e)}`:"TBD"}function jv(t,e){return Vu(t)?!Vu(e)||t.getTime()===e.getTime()?zh(t):CM(t,e)?`${AS(t)} · ${NM(t,e)}`:`${zh(t)} - ${zh(e)}`:"Date TBD"}function xM(t){const e=(t??0)/100;return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e)}function dU(t){const e=(t??0)/100;return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(e)}function fU(t){if(!t)return"Host";const e=t.trim();return e?e.includes("@")?e.split("@")[0]:e.split(" ")[0]:"Host"}const bM="/assets/app-store-badge-DpjR1r1e.svg",DM="/assets/google-play-badge-XvR5LaEp.png",OM=new Set(["discover","search","map","host_page","host_share","game_page","direct_link","instagram","facebook","google","email","push_notification","other"]),kS="tt_paid_tailgate_attribution",Uv="tt_paid_tailgate_visitor",LM="tt_paid_tailgate_event:";function Wh(t){const e=(t??"").trim().toLowerCase().replace(/[\s-]+/g,"_");return OM.has(e)?e:e.includes("instagram")?"instagram":e.includes("facebook")||e==="fb"?"facebook":e.includes("google")?"google":e.includes("email")||e.includes("newsletter")?"email":e.includes("push")?"push_notification":null}function RS(){if(typeof window>"u")return null;try{const t=JSON.parse(window.sessionStorage.getItem(kS)??"null");return t&&typeof t=="object"?t:null}catch{return null}}function VM(t){if(typeof window>"u")return{source:"other",campaign:"",medium:""};const e=new URLSearchParams(window.location.search),n=Wh(e.get("utm_source")),r=Wh(e.get("source"));let i=null;if(document.referrer)try{const l=new URL(document.referrer);l.origin!==window.location.origin&&(i=Wh(l.hostname)??"other")}catch{i=null}const s=RS(),o={source:r??n??i??(s==null?void 0:s.source)??"direct_link",campaign:(e.get("utm_campaign")??(s==null?void 0:s.campaign)??"").slice(0,160),medium:(e.get("utm_medium")??(s==null?void 0:s.medium)??"").slice(0,80)};try{window.sessionStorage.setItem(kS,JSON.stringify(o))}catch{}return o}function MM(){var t,e;if(typeof window>"u")return"";try{const n=window.localStorage.getItem(Uv);if(n)return n;const r=((e=(t=globalThis.crypto)==null?void 0:t.randomUUID)==null?void 0:e.call(t))??`${Date.now()}-${Math.random().toString(36).slice(2)}`;return window.localStorage.setItem(Uv,r),r}catch{return""}}function jM(t){if(!t||typeof window>"u")return!1;try{const e=`${LM}${t}`;if(window.sessionStorage.getItem(e))return!0;window.sessionStorage.setItem(e,"1")}catch{return!1}return!1}function UM(t,e){if(!e.tailgateId||jM(e.dedupeKey))return;const n=VM(),r={tailgateId:e.tailgateId,hostId:e.hostId,ticketTypeId:e.ticketTypeId,gameId:e.gameId,source:e.source??n.source,campaign:e.campaign??n.campaign,medium:e.medium??n.medium,platform:e.platform??"web",price:e.price,quantity:e.quantity,purchaseId:e.purchaseId,visitorId:MM()};try{lM(t,r)}catch(i){console.warn("Firebase analytics event failed",{eventName:t,error:i})}if(Vv)try{q2(Vv,"recordPaidTailgateAnalyticsEvent")({eventName:t,...r}).catch(s=>{console.warn("Paid tailgate reporting event failed",{eventName:t,error:s})})}catch(i){console.warn("Paid tailgate reporting is unavailable",{eventName:t,error:i})}}function Fv(t,e){t.forEach(n=>{n.visibilityType==="open_paid"&&UM("paid_tailgate_impression",{tailgateId:n.id,hostId:n.hostId,source:e,dedupeKey:`impression:${e}:${n.id}`})})}function Bv(t,e){const n=new URLSearchParams({source:e}),r=RS();return r!=null&&r.campaign&&n.set("utm_campaign",r.campaign),r!=null&&r.medium&&n.set("utm_medium",r.medium),`/tailgates/${encodeURIComponent(t)}?${n.toString()}`}const FM="https://apps.apple.com/us/app/tailgatetime/id6748784028",BM="https://play.google.com/store/apps/details?id=com.vsventures.TailgateTime",$M="Buffalo Tailgates",PS="The Experience Event and Tailgate",zM=["open_free","open_paid"],WM=8,Wl=xm,$v="/images/buffalo_tailgates-logo.png",HM=[{title:"Run check-in smoothly",description:"Use host tools to validate arrivals and keep your gate flowing.",icon:p.jsx(mM,{size:18})},{title:"Track payouts clearly",description:"Follow paid-event performance and Stripe status in one dashboard.",icon:p.jsx(Nm,{size:18})},{title:"Message your guests",description:"Send updates fast when times, lots, or plans shift on game day.",icon:p.jsx(gM,{size:18})}],zv=[{title:"Personal invites",description:"Create a private tailgate, send invites directly to friends and family, and keep the guest list under your control.",badge:"Invite-only",icon:p.jsx(dM,{size:18})},{title:"Open free events",description:"Publish a public tailgate anyone can discover, join, and follow before kickoff without charging admission.",badge:"Public + Free",icon:p.jsx(ES,{size:18})},{title:"Open paid events",description:"List a public paid event, sell spots through the app, and manage attendance and payouts in one place.",badge:"Public + Paid",icon:p.jsx(Nm,{size:18})}],qM=[{title:"1. Choose your event type",description:"Decide whether it is a personal invite, an open free tailgate, or an open paid event."},{title:"2. Share or publish it",description:"Send direct invites to your group or publish your event so fans can discover it."},{title:"3. Run game day",description:"Track RSVPs, check in guests, message attendees, and manage paid access when needed."}],KM=[{quote:"TailgateTime made our pre-game party effortless.",byline:"Dan, Steelers fan"},{quote:"Best tailgating app I've ever used.",byline:"Curt, college football enthusiast"},{quote:"Keeps everyone on the same page, even Grandma.",byline:"Victor, family tailgater"}],GM=[{src:"/images/bt1.jpg",alt:"Buffalo Tailgates fans gathered on game day"},{src:"/images/bt2.jpg",alt:"Buffalo Tailgates setup with fans and tents"},{src:"/images/bt3.jpg",alt:"Buffalo Tailgates crowd before kickoff"},{src:"/images/bt4.jpg",alt:"Buffalo Tailgates community event scene"}],QM=[{src:"/images/events_experience/img_1.jpeg",alt:"The Experience Event & Tailgate community gathered on game day"},{src:"/images/events_experience/img_2.jpeg",alt:"Guests playing games at The Experience Event & Tailgate"},{src:"/images/events_experience/img_3.jpeg",alt:"The Experience Event & Tailgate hospitality setup"}],Di=[{id:"buffalo-tailgates",name:"Buffalo Tailgates",shortName:"Buffalo Tailgates",logo:"/images/buffalo_tailgates-logo.png",description:"Local game-day hosts bringing Bills fans together with easier planning, discovery, and check-in.",location:"Buffalo, NY",hostQuery:"Buffalo Tailgates",images:GM},{id:"the-experience",name:"The Experience Event & Tailgate",shortName:"The Experience Event & Tailgate",logo:"/images/events_experience/logo.png",description:"Elevated Ohio game-day events bringing fans together with food, entertainment, and memorable tailgate experiences.",location:"Columbus, OH",hostQuery:PS,images:QM}];function la(t){return typeof t!="object"||t===null||Array.isArray(t)?null:t}function Ca(...t){for(const e of t)if(typeof e=="string"&&e.trim())return e.trim()}function El(t){if(Array.isArray(t)){for(const e of t)if(typeof e=="string"&&e.trim())return e.trim()}}function _n(t){if(typeof t=="number"&&Number.isFinite(t))return t;if(typeof t=="string"){const e=Number(t);if(Number.isFinite(e))return e}}function gn(t){if(!t)return null;if(t instanceof Date)return t;if(typeof t=="string"||typeof t=="number"){const n=new Date(t);return Number.isNaN(n.getTime())?null:n}const e=t;if(typeof e.toDate=="function"){const n=e.toDate();return Number.isNaN(n.getTime())?null:n}if(typeof e.seconds=="number"){const n=new Date(e.seconds*1e3);return Number.isNaN(n.getTime())?null:n}return null}function YM(t){const e=String(t.visibilityType??"").toLowerCase();return e==="open_free"||e==="open_paid"?e:e==="private"||t.isPrivate===!0?"private":(_n(t.ticketPriceCents)??_n(t.priceCents)??_n(t.ticketPrice)??0)>0?"open_paid":"open_free"}function XM(t){var n;const e=(n=Ca(t.status,t.eventStatus))==null?void 0:n.toLowerCase();return e==="cancelled"||e==="canceled"||!!t.cancelledAt}function JM(t){const e=la(t.location);return Ca(t.locationSummary,t.venueName,t.address,t.displayAddress,t.locationLabel,e==null?void 0:e.lotName,e==null?void 0:e.venueName,e==null?void 0:e.name,e==null?void 0:e.displayAddress,e==null?void 0:e.address)}function ZM(t){const e=la(t.host),n=la(t.hostProfile);return Ca(t.hostName,t.displayName,t.hostDisplayName,e==null?void 0:e.displayName,e==null?void 0:e.name,n==null?void 0:n.displayName,n==null?void 0:n.name)}function ej(t,e=Wl){const n=la(t.cover),r=la(t.media);return Ca(t.coverImageUrl,t.coverPhotoUrl,t.heroImageUrl,t.bannerImageUrl,t.imageUrl,t.photoURL,t.photoUrl,n==null?void 0:n.url,n==null?void 0:n.imageUrl,n==null?void 0:n.downloadUrl,n==null?void 0:n.src,r==null?void 0:r.coverImageUrl,r==null?void 0:r.imageUrl,El(t.coverImageUrls),El(n==null?void 0:n.imageUrls),El(r==null?void 0:r.coverImageUrls),El(r==null?void 0:r.imageUrls))??e}function tj(t,e){const n=YM(e);if(n!=="open_free"&&n!=="open_paid"||XM(e))return null;const r=gn(e.dateTime)??gn(e.eventTargetTime)??gn(e.startDateTime)??gn(e.startAt)??gn(e.eventDateTime)??gn(e.eventDate),i=gn(e.endDateTime)??gn(e.endAt)??gn(e.eventEndAt)??gn(e.tailgateEndAt),s=(r==null?void 0:r.getTime())??0;if(!r||Number.isNaN(s)||s<Date.now())return null;const o=_n(e.ticketPriceCents)??_n(e.priceCents)??_n(e.ticketPrice),l=Math.max(0,Math.floor(_n(e.confirmedPaidCount)??_n(e.ticketsSold)??_n(e.rsvpsConfirmed)??_n(e.confirmedCount)??0));return{id:t,name:Ca(e.eventName,e.name,e.title)??"Untitled Tailgate",hostName:ZM(e),visibilityType:n,startDateTime:r,endDateTime:i,locationSummary:JM(e),coverImageUrl:ej(e),priceLabel:n==="open_paid"?o?xM(o):"Paid":"Free",confirmedCount:l}}function nj(t){var e;return((e=t.hostName)==null?void 0:e.toLowerCase())===$M.toLowerCase()}function rj(t){var e;return((e=t.hostName)==null?void 0:e.toLowerCase())===PS.toLowerCase()}const ij=[{title:"Find public tailgates fast",description:"Browse open events by date and lock in plans before kickoff.",icon:p.jsx(ES,{size:18})},{title:"See paid and free options",description:"Compare event type, capacity, and ticket details in one place.",icon:p.jsx(Nm,{size:18})},{title:"Jump into game-day energy",description:"Open event details and feed updates without bouncing between pages.",icon:p.jsx(yM,{size:18})}];function sj(){const{user:t}=Pa(),[e,n]=L.useState(0),[r,i]=L.useState(0),[s,o]=L.useState(!1),[l,u]=L.useState([]),[c,d]=L.useState([]),[m,g]=L.useState([]),[I,R]=L.useState(!0),[C,b]=L.useState(null);L.useEffect(()=>{if(!Is){u([]),d([]),g([]),R(!1),b(null);return}R(!0),b(null);const x=CO(gO(Is,"tailgateEvents"),NO("visibilityType","in",[...zM])),E=VO(x,_=>{const T=_.docs.map(A=>tj(A.id,A.data())).filter(A=>!!A).sort((A,P)=>{var De,me;const N=((De=A.startDateTime)==null?void 0:De.getTime())??Number.POSITIVE_INFINITY,S=((me=P.startDateTime)==null?void 0:me.getTime())??Number.POSITIVE_INFINITY;return N-S});u(T.slice(0,WM)),d(T.filter(nj).map(A=>A.coverImageUrl===Wl?{...A,coverImageUrl:$v}:A)),g(T.filter(rj).map(A=>A.coverImageUrl===Wl?{...A,coverImageUrl:"/images/events_experience/logo.png"}:A)),R(!1),b(null)},_=>{console.error("Failed to load homepage tailgate listings",_),u([]),d([]),g([]),R(!1),b("Upcoming tailgates are not available right now.")});return()=>E()},[]),L.useEffect(()=>{if(s||typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const x=window.setInterval(()=>{i(E=>E===Di.length-1?0:E+1)},1e4);return()=>window.clearInterval(x)},[s]),L.useEffect(()=>{if(n(0),typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const x=window.setInterval(()=>{n(E=>E===Di[r].images.length-1?0:E+1)},5e3);return()=>window.clearInterval(x)},[r]);const k=()=>{n(x=>x===0?v.images.length-1:x-1)},w=()=>{n(x=>x===v.images.length-1?0:x+1)},v=Di[r],O=v.id==="buffalo-tailgates"?c:m;L.useEffect(()=>{Fv(l,"discover"),Fv(O,"host_page")},[O,l]);const U=x=>{i(x),o(!0)};return p.jsxs("main",{className:"homepage",children:[p.jsx(TS,{}),p.jsx("section",{className:"homepage-hero-shell",children:p.jsx("div",{className:"homepage-hero",children:p.jsxs("div",{className:"homepage-hero-copy",children:[p.jsx("p",{className:"homepage-kicker",children:"True Home Base"}),p.jsx("h1",{children:"Host private invites, open free tailgates, or paid public events in one app."}),p.jsx("p",{children:"TailgateTime helps you organize personal guest lists, publish discoverable free events, and run paid tailgates with check-in, messaging, and payouts built in."}),p.jsx("div",{className:"homepage-hero-tags","aria-label":"TailgateTime event types",children:zv.map(x=>p.jsx("span",{className:"homepage-hero-tag",children:x.badge},x.title))}),p.jsxs("div",{className:"homepage-cta-row",children:[p.jsx("a",{href:FM,target:"_blank",rel:"noopener noreferrer",children:p.jsx("img",{src:bM,alt:"Download on the App Store"})}),p.jsx("a",{href:BM,target:"_blank",rel:"noopener noreferrer",children:p.jsx("img",{src:DM,alt:"Get it on Google Play"})})]}),p.jsx("div",{className:"homepage-secondary-links",children:p.jsx(Me,{to:"/about",className:"homepage-inline-link",children:"Get to know TailgateTime"})})]})})}),p.jsxs("section",{className:"homepage-modes-shell",children:[p.jsxs("div",{className:"homepage-section-header",children:[p.jsx("h2",{children:"Built for every kind of tailgate you want to host"}),p.jsx("p",{children:"Use the same app whether you are inviting your own crew or opening the lot up to more fans."})]}),p.jsx("div",{className:"homepage-modes-grid",children:zv.map(x=>p.jsxs("article",{className:"homepage-mode-card",children:[p.jsxs("div",{className:"homepage-mode-topline",children:[p.jsx("span",{className:"homepage-feature-icon",children:x.icon}),p.jsx("span",{className:"homepage-mode-badge",children:x.badge})]}),p.jsx("h3",{children:x.title}),p.jsx("p",{children:x.description})]},x.title))})]}),p.jsx("section",{className:"homepage-discover-shell",children:p.jsxs("div",{className:"homepage-discover-card",children:[p.jsxs("div",{className:"homepage-discover-copy",children:[p.jsx("p",{className:"homepage-kicker",children:"Discover Tailgates"}),p.jsx("h2",{children:"Join open tailgates before game day starts."}),p.jsx("p",{children:"Browse public events, compare free and paid options, and lock in your plans with one tap."}),p.jsxs("div",{className:"homepage-discover-actions",children:[p.jsx(Me,{to:"/discover",className:"primary-button",children:"Explore Tailgates"}),t?null:p.jsx(Me,{to:"/login?mode=signup",className:"public-auth-btn login",children:"Start Hosting"})]})]}),p.jsx("div",{className:"homepage-discover-grid",children:ij.map(x=>p.jsxs("article",{className:"homepage-discover-item",children:[p.jsx("span",{className:"homepage-feature-icon",children:x.icon}),p.jsx("h3",{children:x.title}),p.jsx("p",{children:x.description})]},x.title))}),p.jsxs("div",{className:"homepage-discover-events","aria-label":"Upcoming open tailgates",children:[p.jsxs("div",{className:"homepage-discover-events-header",children:[p.jsxs("div",{children:[p.jsx("span",{children:"Upcoming open tailgates"}),p.jsx("p",{children:"Live listings fans can join from Discover."})]}),p.jsx(Me,{to:"/discover",children:"View all"})]}),I?p.jsx("p",{className:"homepage-discover-events-state",children:"Loading upcoming tailgates..."}):C?p.jsx("p",{className:"homepage-discover-events-state",children:C}):l.length>0?p.jsx("div",{className:"homepage-discover-events-grid",children:l.map(x=>p.jsxs(Me,{to:Bv(x.id,"discover"),className:"homepage-discover-event-card","aria-label":`View ${x.name}`,children:[p.jsx("div",{className:`homepage-discover-event-media ${x.coverImageUrl===Wl?"is-logo":"has-image"}`,children:p.jsx("img",{src:x.coverImageUrl,alt:"",loading:"lazy"})}),p.jsxs("div",{className:"homepage-discover-event-heading",children:[p.jsx("h3",{children:x.name}),p.jsx("span",{className:`homepage-discover-event-chip ${x.visibilityType==="open_paid"?"paid":"free"}`,children:x.visibilityType==="open_paid"?"Open Paid":"Open Free"})]}),p.jsx("p",{className:"homepage-discover-event-date",children:jv(x.startDateTime,x.endDateTime)}),p.jsxs("div",{className:"homepage-discover-event-footer",children:[p.jsx("span",{children:x.locationSummary??"Location coming soon"}),p.jsx("strong",{children:x.priceLabel})]})]},x.id))}):p.jsx("p",{className:"homepage-discover-events-state",children:"No upcoming open tailgates yet."})]})]})}),p.jsxs("section",{className:"homepage-partners-shell",onMouseEnter:()=>o(!0),onMouseLeave:()=>o(!1),children:[p.jsxs("div",{className:"homepage-section-header homepage-partners-header",children:[p.jsx("p",{className:"homepage-kicker",children:"Featured Partners"}),p.jsx("h2",{children:"Meet the communities making game day better."}),p.jsx("p",{children:"Explore the partners using TailgateTime to bring fans together before kickoff."})]}),p.jsx("div",{className:"homepage-partner-tabs",role:"tablist","aria-label":"Featured partners",children:Di.map((x,E)=>p.jsxs("button",{type:"button",role:"tab",id:`partner-tab-${x.id}`,"aria-controls":`partner-panel-${x.id}`,"aria-selected":E===r,className:E===r?"active":"",onClick:()=>U(E),children:[p.jsx("span",{className:"homepage-partner-tab-logo",children:p.jsx("img",{src:x.logo,alt:""})}),p.jsxs("span",{className:"homepage-partner-tab-copy",children:[p.jsx("strong",{children:x.shortName}),p.jsx("small",{children:"Featured community"})]}),p.jsx("span",{className:"homepage-partner-tab-marker","aria-hidden":"true"})]},x.id))}),p.jsxs("div",{className:"homepage-partners-grid",children:[p.jsxs("article",{className:"homepage-partner-card featured",role:"tabpanel",id:`partner-panel-${v.id}`,"aria-labelledby":`partner-tab-${v.id}`,children:[p.jsxs("div",{className:"homepage-partner-content",children:[p.jsxs("div",{className:"homepage-partner-topline",children:[p.jsx("span",{className:"homepage-partner-logo",children:p.jsx("img",{src:v.logo,alt:`${v.name} logo`})}),p.jsx("span",{children:"Featured partner"})]}),p.jsx("h3",{children:v.name}),p.jsx("p",{children:v.description}),p.jsx("small",{children:v.location}),p.jsxs("div",{className:"homepage-partner-listings","aria-label":`${v.name} listings`,children:[p.jsxs("div",{className:"homepage-partner-listings-header",children:[p.jsx("span",{children:"Upcoming listings"}),p.jsxs("div",{children:[O.length>0?p.jsxs("small",{children:[O.length," live"]}):null,p.jsx(Me,{to:`/discover?host=${encodeURIComponent(v.hostQuery)}`,children:"View all"})]})]}),I?p.jsx("p",{className:"homepage-partner-listing-state",children:"Loading listings..."}):C?p.jsx("p",{className:"homepage-partner-listing-state",children:C}):O.length>0?p.jsx("div",{className:"homepage-partner-listings-scroll",children:O.map(x=>p.jsxs(Me,{to:Bv(x.id,"host_page"),className:"homepage-partner-listing-panel","aria-label":`View ${x.name}`,children:[p.jsx("div",{className:`homepage-partner-listing-media ${x.coverImageUrl===$v?"is-logo":"has-image"}`,children:p.jsx("img",{src:x.coverImageUrl,alt:"",loading:"lazy"})}),p.jsxs("div",{className:"homepage-partner-listing-heading",children:[p.jsx("h4",{children:x.name}),p.jsx("span",{className:`homepage-partner-listing-chip ${x.visibilityType==="open_paid"?"paid":"free"}`,children:x.visibilityType==="open_paid"?"Open Paid":"Open Free"})]}),p.jsx("p",{className:"homepage-partner-listing-date",children:jv(x.startDateTime,x.endDateTime)}),p.jsxs("div",{className:"homepage-partner-listing-body",children:[p.jsxs("div",{className:"homepage-partner-listing-copy",children:[p.jsx("p",{children:x.locationSummary??"Location coming soon"}),p.jsxs("p",{className:"homepage-partner-listing-size",children:[x.confirmedCount," confirmed"]})]}),p.jsxs("div",{className:"homepage-partner-listing-meta",children:[p.jsx("strong",{children:x.priceLabel}),p.jsx("span",{children:"View"})]})]})]},x.id))}):p.jsx("p",{className:"homepage-partner-listing-state",children:"No upcoming open listings yet."})]})]}),p.jsxs("div",{className:"homepage-partner-carousel","aria-label":`${v.name} photos`,children:[p.jsx("div",{className:"homepage-partner-carousel-slides",children:v.images.map((x,E)=>p.jsx("img",{className:`homepage-partner-carousel-image ${E===e?"active":""}`,src:x.src,alt:E===e?x.alt:"","aria-hidden":E===e?void 0:"true"},x.src))}),p.jsxs("div",{className:"homepage-partner-carousel-controls",children:[p.jsx("button",{type:"button","aria-label":`Show previous ${v.name} photo`,onClick:k,children:"<"}),p.jsx("button",{type:"button","aria-label":`Show next ${v.name} photo`,onClick:w,children:">"})]}),p.jsxs("div",{className:"homepage-partner-carousel-dots","aria-label":`${v.name} photo selector`,children:[p.jsxs("span",{className:"homepage-partner-carousel-count",children:["Photo ",e+1," of ",v.images.length]}),v.images.map((x,E)=>p.jsx("button",{type:"button",className:E===e?"active":"","aria-label":`Show ${v.name} photo ${E+1}`,"aria-current":E===e?"true":void 0,onClick:()=>n(E),children:E+1},x.src))]})]})]}),p.jsxs("div",{className:"homepage-partner-pagination","aria-live":"polite",children:[p.jsxs("span",{children:["Partner ",r+1," of ",Di.length]}),p.jsx("div",{"aria-hidden":"true",children:Di.map((x,E)=>p.jsx("span",{className:E===r?"active":""},x.id))})]})]})]}),p.jsxs("section",{className:"homepage-journey-shell",children:[p.jsxs("div",{className:"homepage-section-header",children:[p.jsx("h2",{children:"How TailgateTime Works"}),p.jsx("p",{children:"Pick the right event format first, then run the whole day from the same place."})]}),p.jsx("div",{className:"homepage-journey-grid",children:qM.map(x=>p.jsxs("article",{className:"homepage-journey-card",children:[p.jsx("h3",{children:x.title}),p.jsx("p",{children:x.description})]},x.title))})]}),p.jsxs("section",{className:"homepage-feature-shell",children:[p.jsxs("div",{className:"homepage-feature-header",children:[p.jsx("h2",{children:"Host tools that actually move fast"}),p.jsx("p",{children:"Built for invite-only hangouts, open community tailgates, and paid entry events."})]}),p.jsx("div",{className:"homepage-feature-grid",children:HM.map(x=>p.jsxs("article",{className:"homepage-feature-card",children:[p.jsx("span",{className:"homepage-feature-icon",children:x.icon}),p.jsx("h3",{children:x.title}),p.jsx("p",{children:x.description})]},x.title))})]}),p.jsxs("section",{className:"homepage-social-shell",children:[p.jsx("div",{className:"homepage-section-header",children:p.jsx("h2",{children:"Built for Real Tailgaters"})}),p.jsx("div",{className:"homepage-social-grid",children:KM.map(x=>p.jsxs("article",{className:"homepage-social-card",children:[p.jsxs("p",{children:['"',x.quote,'"']}),p.jsx("small",{children:x.byline})]},x.quote))})]}),t?null:p.jsx("section",{className:"homepage-signup-shell",children:p.jsxs("div",{className:"homepage-signup-card",children:[p.jsx("p",{className:"homepage-kicker",children:"Start Hosting"}),p.jsx("h2",{children:"Create your host account and launch your next tailgate."}),p.jsx("p",{children:"Sign up to send personal invites, publish open free events, or run paid tailgates from one dashboard."}),p.jsxs("div",{className:"homepage-signup-actions",children:[p.jsx(Me,{to:"/login?mode=signup",className:"public-auth-btn signup",children:"Sign Up"}),p.jsx(Me,{to:"/login?mode=login",className:"public-auth-btn login",children:"Login"})]})]})}),p.jsx(IS,{})]})}const CS=L.createContext(null);function oj({children:t}){const e=L.useRef([]),[n,r]=L.useState(null),i=L.useCallback(c=>{e.current.push(c),r(d=>d||(e.current.shift()??null))},[]),s=L.useCallback(c=>{r(d=>d&&(d.resolve(c),e.current.shift()??null))},[]),o=L.useCallback(c=>new Promise(d=>{i({kind:"confirm",title:c.title??"Please confirm",message:c.message,confirmLabel:c.confirmLabel??"Confirm",cancelLabel:c.cancelLabel??"Cancel",tone:c.tone??"default",resolve:d})}),[i]),l=L.useCallback(c=>new Promise(d=>{i({kind:"alert",title:c.title??"Notice",message:c.message,confirmLabel:c.confirmLabel??"OK",cancelLabel:"Cancel",tone:c.tone??"default",resolve:()=>d()})}),[i]),u=L.useMemo(()=>({confirm:o,alert:l}),[l,o]);return L.useEffect(()=>{if(!n)return;const c=d=>{d.key==="Escape"&&s(n.kind==="alert")};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[n,s]),p.jsxs(CS.Provider,{value:u,children:[t,n?p.jsx("div",{className:"create-wizard-modal-overlay app-dialog-overlay",role:"dialog","aria-modal":"true",children:p.jsxs("div",{className:`create-wizard-modal app-dialog app-dialog-${n.tone}`,children:[p.jsxs("div",{className:"create-wizard-modal-header",children:[p.jsx("h3",{children:n.title}),n.kind==="confirm"?p.jsx("button",{type:"button",className:"secondary-button",onClick:()=>s(!1),children:"×"}):null]}),p.jsx("p",{className:"app-dialog-copy",children:n.message}),p.jsxs("div",{className:"app-dialog-actions",children:[n.kind==="confirm"?p.jsx("button",{type:"button",className:"secondary-button",onClick:()=>s(!1),children:n.cancelLabel}):null,p.jsx("button",{type:"button",className:`primary-button${n.tone==="danger"?" app-dialog-danger":""}`,onClick:()=>s(!0),children:n.confirmLabel})]})]})}):null]})}function pU(){const t=L.useContext(CS);if(!t)throw new Error("useDialog must be used within DialogProvider.");return t}const aj=L.lazy(()=>Pe(()=>import("./HostDashboard-DXESQhOf.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))),lj=L.lazy(()=>Pe(()=>import("./CreateTailgateWizard-D-IPMTnR.js"),__vite__mapDeps([9,1,10,3,11,12,5]))),uj=L.lazy(()=>Pe(()=>import("./AccountPayouts-jPiK-ABK.js"),__vite__mapDeps([13,1,12,10,6]))),cj=L.lazy(()=>Pe(()=>import("./AccountPayoutHistory-YmYVmTtx.js"),__vite__mapDeps([14,1]))),hj=L.lazy(()=>Pe(()=>import("./ChangePassword-D4RfVB4K.js"),__vite__mapDeps([15,1]))),dj=L.lazy(()=>Pe(()=>import("./TailgateDetails-C6vAs5GO.js"),__vite__mapDeps([16,1,10,3,4,5]))),fj=L.lazy(()=>Pe(()=>import("./TailgateEdit-B33Cfnms.js"),[])),pj=L.lazy(()=>Pe(()=>import("./TailgateCheckin-QsboIw2s.js"),__vite__mapDeps([17,1,4]))),mj=L.lazy(()=>Pe(()=>import("./CheckinHub-BXQNUZ-4.js"),__vite__mapDeps([18,1]))),gj=L.lazy(()=>Pe(()=>import("./Messages-D17Toq_2.js"),__vite__mapDeps([19,1]))),yj=L.lazy(()=>Pe(()=>import("./NotificationPreferences-DMGMEa49.js"),__vite__mapDeps([20,1]))),_j=L.lazy(()=>Pe(()=>import("./DiscoverTailgates-D4FE3AUW.js"),__vite__mapDeps([21,1,4,3,11,5]))),vj=L.lazy(()=>Pe(()=>import("./EventFeed-DaFdsI3C.js"),__vite__mapDeps([22,1]))),wj=L.lazy(()=>Pe(()=>import("./UserGuide-SXlBIEdO.js"),[])),Ej=L.lazy(()=>Pe(()=>import("./About-Bew5s9C8.js"),[])),Tj=L.lazy(()=>Pe(()=>import("./AdminSpotlight-DPqP_76Q.js"),__vite__mapDeps([23,1,24,2]))),Ij=L.lazy(()=>Pe(()=>import("./AdminMetrics-3n2MSFb8.js"),__vite__mapDeps([25,1,24,2]))),Sj=L.lazy(()=>Pe(()=>import("./AdminOps-lx46znnU.js"),__vite__mapDeps([26,1,24,2,3]))),Aj=L.lazy(()=>Pe(()=>import("./AdminTicketAnalytics-DLgOTedr.js"),__vite__mapDeps([27,1,24,2]))),kj=L.lazy(()=>Pe(()=>import("./PublicHostPage-CXl4XRb0.js"),__vite__mapDeps([28,8,4,3]))),Rj=L.lazy(()=>Pe(()=>import("./HostPageSettings-CzQN-ox1.js"),__vite__mapDeps([29,1,2,7,8,4,6,28,3]))),Pj=L.lazy(()=>Pe(()=>import("./HostPromotionPage-jLZUjJzy.js"),__vite__mapDeps([30,1,2,31,4,5]))),Cj=L.lazy(()=>Pe(()=>import("./TailgateCreatedSuccess-Bp9HPrsM.js"),__vite__mapDeps([32,1,2,31,4,5])));function Nj(){return p.jsx("div",{className:"page-shell","aria-busy":"true"})}function Te(t){return p.jsx(L.Suspense,{fallback:p.jsx(Nj,{}),children:t})}function xj(){return p.jsx(uM,{children:p.jsxs(oj,{children:[p.jsx(hM,{}),p.jsxs(IP,{children:[p.jsx(ue,{path:"/",element:p.jsx(sj,{})}),p.jsx(ue,{path:"/login",element:p.jsx(PM,{})}),p.jsx(ue,{path:"/signup",element:p.jsx(si,{to:"/login?mode=signup",replace:!0})}),p.jsx(ue,{path:"/dashboard",element:Te(p.jsx(Dt,{children:p.jsx(aj,{})}))}),p.jsx(ue,{path:"/hosts/:slug",element:Te(p.jsx(kj,{}))}),p.jsx(ue,{path:"/dashboard/host-page",element:Te(p.jsx(Dt,{children:p.jsx(Rj,{})}))}),p.jsx(ue,{path:"/tailgates/new",element:Te(p.jsx(Dt,{children:p.jsx(lj,{})}))}),p.jsx(ue,{path:"/account",element:Te(p.jsx(Dt,{children:p.jsx(uj,{})}))}),p.jsx(ue,{path:"/account/payout-history",element:Te(p.jsx(Dt,{children:p.jsx(cj,{})}))}),p.jsx(ue,{path:"/account/notifications",element:Te(p.jsx(Dt,{children:p.jsx(yj,{})}))}),p.jsx(ue,{path:"/account/change-password",element:Te(p.jsx(Dt,{children:p.jsx(hj,{})}))}),p.jsx(ue,{path:"/tailgates/:id",element:Te(p.jsx(dj,{}))}),p.jsx(ue,{path:"/tailgates/:id/edit",element:Te(p.jsx(Dt,{children:p.jsx(fj,{})}))}),p.jsx(ue,{path:"/tailgates/:id/created",element:Te(p.jsx(Dt,{children:p.jsx(Cj,{})}))}),p.jsx(ue,{path:"/tailgates/:id/promote",element:Te(p.jsx(Dt,{children:p.jsx(Pj,{})}))}),p.jsx(ue,{path:"/tailgates/:id/checkin",element:Te(p.jsx(Dt,{children:p.jsx(pj,{})}))}),p.jsx(ue,{path:"/tailgates/:id/feed",element:Te(p.jsx(vj,{}))}),p.jsx(ue,{path:"/checkin",element:Te(p.jsx(Dt,{children:p.jsx(mj,{})}))}),p.jsx(ue,{path:"/messages",element:Te(p.jsx(Dt,{children:p.jsx(gj,{})}))}),p.jsx(ue,{path:"/discover",element:Te(p.jsx(_j,{}))}),p.jsx(ue,{path:"/about",element:Te(p.jsx(Ej,{}))}),p.jsx(ue,{path:"/release-2-0",element:p.jsx(si,{to:"/about",replace:!0})}),p.jsx(ue,{path:"/user-guide",element:Te(p.jsx(wj,{}))}),p.jsx(ue,{path:"/admin/spotlight",element:Te(p.jsx(wl,{children:p.jsx(Tj,{})}))}),p.jsx(ue,{path:"/admin/metrics",element:Te(p.jsx(wl,{children:p.jsx(Ij,{})}))}),p.jsx(ue,{path:"/admin/ticket-analytics",element:Te(p.jsx(wl,{children:p.jsx(Aj,{})}))}),p.jsx(ue,{path:"/admin/ops",element:Te(p.jsx(wl,{children:p.jsx(Sj,{})}))}),p.jsx(ue,{path:"*",element:p.jsx(si,{to:"/",replace:!0})})]})]})})}if(window.location.hash.startsWith("#/")){const t=window.location.hash.slice(1);window.history.replaceState(null,"",t)}Hh.createRoot(document.getElementById("root")).render(p.jsx(ew.StrictMode,{children:p.jsx(bP,{children:p.jsx(xj,{})})}));export{NM as $,Ge as A,qj as B,jj as C,Lj as D,Cs as E,Uj as F,ur as G,pU as H,aU as I,dU as J,gM as K,Me as L,rU as M,dM as N,LO as O,gN as P,Mj as Q,Vj as R,Dj as S,zj as T,Rn as U,W2 as V,UM as W,yM as X,lU as Y,mM as Z,iU as _,sU as a,TS as a0,VM as a1,Qj as a2,vM as a3,EM as a4,tU as a5,wM as a6,Zj as a7,Gj as a8,Pe as a9,si as aa,Bv as ab,Fv as ac,IS as ad,xm as ae,$e as af,ew as ag,Wj as ah,zh as ai,Oj as aj,lM as ak,fM as al,pM as am,hU as an,cU as ao,ES as ap,uU as aq,oA as ar,bj as as,oU as b,xM as c,Is as d,gO as e,jv as f,nU as g,sm as h,Pa as i,p as j,fU as k,pn as l,Vv as m,q2 as n,VO as o,OO as p,CO as q,L as r,eU as s,Kj as t,vp as u,Hj as v,NO as w,Jj as x,Yj as y,Xj as z};
