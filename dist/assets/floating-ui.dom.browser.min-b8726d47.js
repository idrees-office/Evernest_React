function Rt(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]}function At(e){var t=document.createElement("style");return t.setAttribute("data-emotion",e.key),e.nonce!==void 0&&t.setAttribute("nonce",e.nonce),t.appendChild(document.createTextNode("")),t.setAttribute("data-s",""),t}var Et=function(){function e(n){var r=this;this._insertTag=function(o){var i;r.tags.length===0?r.insertionPoint?i=r.insertionPoint.nextSibling:r.prepend?i=r.container.firstChild:i=r.before:i=r.tags[r.tags.length-1].nextSibling,r.container.insertBefore(o,i),r.tags.push(o)},this.isSpeedy=n.speedy===void 0?!0:n.speedy,this.tags=[],this.ctr=0,this.nonce=n.nonce,this.key=n.key,this.container=n.container,this.prepend=n.prepend,this.insertionPoint=n.insertionPoint,this.before=null}var t=e.prototype;return t.hydrate=function(r){r.forEach(this._insertTag)},t.insert=function(r){this.ctr%(this.isSpeedy?65e3:1)===0&&this._insertTag(At(this));var o=this.tags[this.tags.length-1];if(this.isSpeedy){var i=Rt(o);try{i.insertRule(r,i.cssRules.length)}catch{}}else o.appendChild(document.createTextNode(r));this.ctr++},t.flush=function(){this.tags.forEach(function(r){return r.parentNode&&r.parentNode.removeChild(r)}),this.tags=[],this.ctr=0},e}(),S="-ms-",xe="-moz-",A="-webkit-",rt="comm",Fe="rule",Ne="decl",$t="@import",it="@keyframes",Ct=Math.abs,Ae=String.fromCharCode,kt=Object.assign;function St(e,t){return k(e,0)^45?(((t<<2^k(e,0))<<2^k(e,1))<<2^k(e,2))<<2^k(e,3):0}function ot(e){return e.trim()}function Tt(e,t){return(e=t.exec(e))?e[0]:e}function E(e,t,n){return e.replace(t,n)}function Le(e,t){return e.indexOf(t)}function k(e,t){return e.charCodeAt(t)|0}function ce(e,t,n){return e.slice(t,n)}function N(e){return e.length}function Ve(e){return e.length}function he(e,t){return t.push(e),e}function Ot(e,t){return e.map(t).join("")}var Ee=1,ee=1,st=0,T=0,C=0,te="";function $e(e,t,n,r,o,i,s){return{value:e,root:t,parent:n,type:r,props:o,children:i,line:Ee,column:ee,length:s,return:""}}function oe(e,t){return kt($e("",null,null,"",null,null,0),e,{length:-e.length},t)}function Lt(){return C}function Pt(){return C=T>0?k(te,--T):0,ee--,C===10&&(ee=1,Ee--),C}function L(){return C=T<st?k(te,T++):0,ee++,C===10&&(ee=1,Ee++),C}function B(){return k(te,T)}function me(){return T}function de(e,t){return ce(te,e,t)}function fe(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function at(e){return Ee=ee=1,st=N(te=e),T=0,[]}function ct(e){return te="",e}function ge(e){return ot(de(T-1,Pe(e===91?e+2:e===40?e+1:e)))}function Dt(e){for(;(C=B())&&C<33;)L();return fe(e)>2||fe(C)>3?"":" "}function Mt(e,t){for(;--t&&L()&&!(C<48||C>102||C>57&&C<65||C>70&&C<97););return de(e,me()+(t<6&&B()==32&&L()==32))}function Pe(e){for(;L();)switch(C){case e:return T;case 34:case 39:e!==34&&e!==39&&Pe(C);break;case 40:e===41&&Pe(e);break;case 92:L();break}return T}function Wt(e,t){for(;L()&&e+C!==47+10;)if(e+C===42+42&&B()===47)break;return"/*"+de(t,T-1)+"*"+Ae(e===47?e:L())}function Ft(e){for(;!fe(B());)L();return de(e,T)}function Nt(e){return ct(ye("",null,null,null,[""],e=at(e),0,[0],e))}function ye(e,t,n,r,o,i,s,a,f){for(var l=0,h=0,c=s,u=0,d=0,p=0,m=1,g=1,x=1,y=0,w="",v=o,R=i,$=r,b=w;g;)switch(p=y,y=L()){case 40:if(p!=108&&k(b,c-1)==58){Le(b+=E(ge(y),"&","&\f"),"&\f")!=-1&&(x=-1);break}case 34:case 39:case 91:b+=ge(y);break;case 9:case 10:case 13:case 32:b+=Dt(p);break;case 92:b+=Mt(me()-1,7);continue;case 47:switch(B()){case 42:case 47:he(Vt(Wt(L(),me()),t,n),f);break;default:b+="/"}break;case 123*m:a[l++]=N(b)*x;case 125*m:case 59:case 0:switch(y){case 0:case 125:g=0;case 59+h:d>0&&N(b)-c&&he(d>32?qe(b+";",r,n,c-1):qe(E(b," ","")+";",r,n,c-2),f);break;case 59:b+=";";default:if(he($=je(b,t,n,l,h,o,a,w,v=[],R=[],c),i),y===123)if(h===0)ye(b,t,$,$,v,i,c,a,R);else switch(u===99&&k(b,3)===110?100:u){case 100:case 109:case 115:ye(e,$,$,r&&he(je(e,$,$,0,0,o,a,w,o,v=[],c),R),o,R,c,a,r?v:R);break;default:ye(b,$,$,$,[""],R,0,a,R)}}l=h=d=0,m=x=1,w=b="",c=s;break;case 58:c=1+N(b),d=p;default:if(m<1){if(y==123)--m;else if(y==125&&m++==0&&Pt()==125)continue}switch(b+=Ae(y),y*m){case 38:x=h>0?1:(b+="\f",-1);break;case 44:a[l++]=(N(b)-1)*x,x=1;break;case 64:B()===45&&(b+=ge(L())),u=B(),h=c=N(w=b+=Ft(me())),y++;break;case 45:p===45&&N(b)==2&&(m=0)}}return i}function je(e,t,n,r,o,i,s,a,f,l,h){for(var c=o-1,u=o===0?i:[""],d=Ve(u),p=0,m=0,g=0;p<r;++p)for(var x=0,y=ce(e,c+1,c=Ct(m=s[p])),w=e;x<d;++x)(w=ot(m>0?u[x]+" "+y:E(y,/&\f/g,u[x])))&&(f[g++]=w);return $e(e,t,n,o===0?Fe:a,f,l,h)}function Vt(e,t,n){return $e(e,t,n,rt,Ae(Lt()),ce(e,2,-2),0)}function qe(e,t,n,r){return $e(e,t,n,Ne,ce(e,0,r),ce(e,r+1,-1),r)}function J(e,t){for(var n="",r=Ve(e),o=0;o<r;o++)n+=t(e[o],o,e,t)||"";return n}function Bt(e,t,n,r){switch(e.type){case $t:case Ne:return e.return=e.return||e.value;case rt:return"";case it:return e.return=e.value+"{"+J(e.children,r)+"}";case Fe:e.value=e.props.join(",")}return N(n=J(e.children,r))?e.return=e.value+"{"+n+"}":""}function Ht(e){var t=Ve(e);return function(n,r,o,i){for(var s="",a=0;a<t;a++)s+=e[a](n,r,o,i)||"";return s}}function zt(e){return function(t){t.root||(t=t.return)&&e(t)}}function It(e){var t=Object.create(null);return function(n){return t[n]===void 0&&(t[n]=e(n)),t[n]}}var Gt=function(t,n,r){for(var o=0,i=0;o=i,i=B(),o===38&&i===12&&(n[r]=1),!fe(i);)L();return de(t,T)},_t=function(t,n){var r=-1,o=44;do switch(fe(o)){case 0:o===38&&B()===12&&(n[r]=1),t[r]+=Gt(T-1,n,r);break;case 2:t[r]+=ge(o);break;case 4:if(o===44){t[++r]=B()===58?"&\f":"",n[r]=t[r].length;break}default:t[r]+=Ae(o)}while(o=L());return t},jt=function(t,n){return ct(_t(at(t),n))},Ke=new WeakMap,qt=function(t){if(!(t.type!=="rule"||!t.parent||t.length<1)){for(var n=t.value,r=t.parent,o=t.column===r.column&&t.line===r.line;r.type!=="rule";)if(r=r.parent,!r)return;if(!(t.props.length===1&&n.charCodeAt(0)!==58&&!Ke.get(r))&&!o){Ke.set(t,!0);for(var i=[],s=jt(n,i),a=r.props,f=0,l=0;f<s.length;f++)for(var h=0;h<a.length;h++,l++)t.props[l]=i[f]?s[f].replace(/&\f/g,a[h]):a[h]+" "+s[f]}}},Kt=function(t){if(t.type==="decl"){var n=t.value;n.charCodeAt(0)===108&&n.charCodeAt(2)===98&&(t.return="",t.value="")}};function ft(e,t){switch(St(e,t)){case 5103:return A+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return A+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return A+e+xe+e+S+e+e;case 6828:case 4268:return A+e+S+e+e;case 6165:return A+e+S+"flex-"+e+e;case 5187:return A+e+E(e,/(\w+).+(:[^]+)/,A+"box-$1$2"+S+"flex-$1$2")+e;case 5443:return A+e+S+"flex-item-"+E(e,/flex-|-self/,"")+e;case 4675:return A+e+S+"flex-line-pack"+E(e,/align-content|flex-|-self/,"")+e;case 5548:return A+e+S+E(e,"shrink","negative")+e;case 5292:return A+e+S+E(e,"basis","preferred-size")+e;case 6060:return A+"box-"+E(e,"-grow","")+A+e+S+E(e,"grow","positive")+e;case 4554:return A+E(e,/([^-])(transform)/g,"$1"+A+"$2")+e;case 6187:return E(E(E(e,/(zoom-|grab)/,A+"$1"),/(image-set)/,A+"$1"),e,"")+e;case 5495:case 3959:return E(e,/(image-set\([^]*)/,A+"$1$`$1");case 4968:return E(E(e,/(.+:)(flex-)?(.*)/,A+"box-pack:$3"+S+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+A+e+e;case 4095:case 3583:case 4068:case 2532:return E(e,/(.+)-inline(.+)/,A+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(N(e)-1-t>6)switch(k(e,t+1)){case 109:if(k(e,t+4)!==45)break;case 102:return E(e,/(.+:)(.+)-([^]+)/,"$1"+A+"$2-$3$1"+xe+(k(e,t+3)==108?"$3":"$2-$3"))+e;case 115:return~Le(e,"stretch")?ft(E(e,"stretch","fill-available"),t)+e:e}break;case 4949:if(k(e,t+1)!==115)break;case 6444:switch(k(e,N(e)-3-(~Le(e,"!important")&&10))){case 107:return E(e,":",":"+A)+e;case 101:return E(e,/(.+:)([^;!]+)(;|!.+)?/,"$1"+A+(k(e,14)===45?"inline-":"")+"box$3$1"+A+"$2$3$1"+S+"$2box$3")+e}break;case 5936:switch(k(e,t+11)){case 114:return A+e+S+E(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return A+e+S+E(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return A+e+S+E(e,/[svh]\w+-[tblr]{2}/,"lr")+e}return A+e+S+e+e}return e}var Yt=function(t,n,r,o){if(t.length>-1&&!t.return)switch(t.type){case Ne:t.return=ft(t.value,t.length);break;case it:return J([oe(t,{value:E(t.value,"@","@"+A)})],o);case Fe:if(t.length)return Ot(t.props,function(i){switch(Tt(i,/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":return J([oe(t,{props:[E(i,/:(read-\w+)/,":"+xe+"$1")]})],o);case"::placeholder":return J([oe(t,{props:[E(i,/:(plac\w+)/,":"+A+"input-$1")]}),oe(t,{props:[E(i,/:(plac\w+)/,":"+xe+"$1")]}),oe(t,{props:[E(i,/:(plac\w+)/,S+"input-$1")]})],o)}return""})}},Xt=[Yt],dn=function(t){var n=t.key;if(n==="css"){var r=document.querySelectorAll("style[data-emotion]:not([data-s])");Array.prototype.forEach.call(r,function(m){var g=m.getAttribute("data-emotion");g.indexOf(" ")!==-1&&(document.head.appendChild(m),m.setAttribute("data-s",""))})}var o=t.stylisPlugins||Xt,i={},s,a=[];s=t.container||document.head,Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="'+n+' "]'),function(m){for(var g=m.getAttribute("data-emotion").split(" "),x=1;x<g.length;x++)i[g[x]]=!0;a.push(m)});var f,l=[qt,Kt];{var h,c=[Bt,zt(function(m){h.insert(m)})],u=Ht(l.concat(o,c)),d=function(g){return J(Nt(g),u)};f=function(g,x,y,w){h=y,d(g?g+"{"+x.styles+"}":x.styles),w&&(p.inserted[x.name]=!0)}}var p={key:n,sheet:new Et({key:n,container:s,nonce:t.nonce,speedy:t.speedy,prepend:t.prepend,insertionPoint:t.insertionPoint}),nonce:t.nonce,inserted:i,registered:{},insert:f};return p.sheet.hydrate(a),p},Zt=!0;function hn(e,t,n){var r="";return n.split(" ").forEach(function(o){e[o]!==void 0?t.push(e[o]+";"):r+=o+" "}),r}var Ut=function(t,n,r){var o=t.key+"-"+n.name;(r===!1||Zt===!1)&&t.registered[o]===void 0&&(t.registered[o]=n.styles)},pn=function(t,n,r){Ut(t,n,r);var o=t.key+"-"+n.name;if(t.inserted[n.name]===void 0){var i=n;do t.insert(n===i?"."+o:"",i,t.sheet,!0),i=i.next;while(i!==void 0)}};function Jt(e){for(var t=0,n,r=0,o=e.length;o>=4;++r,o-=4)n=e.charCodeAt(r)&255|(e.charCodeAt(++r)&255)<<8|(e.charCodeAt(++r)&255)<<16|(e.charCodeAt(++r)&255)<<24,n=(n&65535)*1540483477+((n>>>16)*59797<<16),n^=n>>>24,t=(n&65535)*1540483477+((n>>>16)*59797<<16)^(t&65535)*1540483477+((t>>>16)*59797<<16);switch(o){case 3:t^=(e.charCodeAt(r+2)&255)<<16;case 2:t^=(e.charCodeAt(r+1)&255)<<8;case 1:t^=e.charCodeAt(r)&255,t=(t&65535)*1540483477+((t>>>16)*59797<<16)}return t^=t>>>13,t=(t&65535)*1540483477+((t>>>16)*59797<<16),((t^t>>>15)>>>0).toString(36)}var Qt={animationIterationCount:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},en=/[A-Z]|^ms/g,tn=/_EMO_([^_]+?)_([^]*?)_EMO_/g,lt=function(t){return t.charCodeAt(1)===45},Ye=function(t){return t!=null&&typeof t!="boolean"},Te=It(function(e){return lt(e)?e:e.replace(en,"-$&").toLowerCase()}),Xe=function(t,n){switch(t){case"animation":case"animationName":if(typeof n=="string")return n.replace(tn,function(r,o,i){return V={name:o,styles:i,next:V},o})}return Qt[t]!==1&&!lt(t)&&typeof n=="number"&&n!==0?n+"px":n};function le(e,t,n){if(n==null)return"";if(n.__emotion_styles!==void 0)return n;switch(typeof n){case"boolean":return"";case"object":{if(n.anim===1)return V={name:n.name,styles:n.styles,next:V},n.name;if(n.styles!==void 0){var r=n.next;if(r!==void 0)for(;r!==void 0;)V={name:r.name,styles:r.styles,next:V},r=r.next;var o=n.styles+";";return o}return nn(e,t,n)}case"function":{if(e!==void 0){var i=V,s=n(e);return V=i,le(e,t,s)}break}}if(t==null)return n;var a=t[n];return a!==void 0?a:n}function nn(e,t,n){var r="";if(Array.isArray(n))for(var o=0;o<n.length;o++)r+=le(e,t,n[o])+";";else for(var i in n){var s=n[i];if(typeof s!="object")t!=null&&t[s]!==void 0?r+=i+"{"+t[s]+"}":Ye(s)&&(r+=Te(i)+":"+Xe(i,s)+";");else if(Array.isArray(s)&&typeof s[0]=="string"&&(t==null||t[s[0]]===void 0))for(var a=0;a<s.length;a++)Ye(s[a])&&(r+=Te(i)+":"+Xe(i,s[a])+";");else{var f=le(e,t,s);switch(i){case"animation":case"animationName":{r+=Te(i)+":"+f+";";break}default:r+=i+"{"+f+"}"}}}return r}var Ze=/label:\s*([^\s;\n{]+)\s*(;|$)/g,V,mn=function(t,n,r){if(t.length===1&&typeof t[0]=="object"&&t[0]!==null&&t[0].styles!==void 0)return t[0];var o=!0,i="";V=void 0;var s=t[0];s==null||s.raw===void 0?(o=!1,i+=le(r,n,s)):i+=s[0];for(var a=1;a<t.length;a++)i+=le(r,n,t[a]),o&&(i+=s[a]);Ze.lastIndex=0;for(var f="",l;(l=Ze.exec(i))!==null;)f+="-"+l[1];var h=Jt(i)+f;return{name:h,styles:i,next:V}};function ne(e){return e.split("-")[1]}function Be(e){return e==="y"?"height":"width"}function W(e){return e.split("-")[0]}function X(e){return["top","bottom"].includes(W(e))?"x":"y"}function Ue(e,t,n){let{reference:r,floating:o}=e;const i=r.x+r.width/2-o.width/2,s=r.y+r.height/2-o.height/2,a=X(t),f=Be(a),l=r[f]/2-o[f]/2,h=a==="x";let c;switch(W(t)){case"top":c={x:i,y:r.y-o.height};break;case"bottom":c={x:i,y:r.y+r.height};break;case"right":c={x:r.x+r.width,y:s};break;case"left":c={x:r.x-o.width,y:s};break;default:c={x:r.x,y:r.y}}switch(ne(t)){case"start":c[a]-=l*(n&&h?-1:1);break;case"end":c[a]+=l*(n&&h?-1:1)}return c}const rn=async(e,t,n)=>{const{placement:r="bottom",strategy:o="absolute",middleware:i=[],platform:s}=n,a=i.filter(Boolean),f=await(s.isRTL==null?void 0:s.isRTL(t));let l=await s.getElementRects({reference:e,floating:t,strategy:o}),{x:h,y:c}=Ue(l,r,f),u=r,d={},p=0;for(let m=0;m<a.length;m++){const{name:g,fn:x}=a[m],{x:y,y:w,data:v,reset:R}=await x({x:h,y:c,initialPlacement:r,placement:u,strategy:o,middlewareData:d,rects:l,platform:s,elements:{reference:e,floating:t}});h=y??h,c=w??c,d={...d,[g]:{...d[g],...v}},R&&p<=50&&(p++,typeof R=="object"&&(R.placement&&(u=R.placement),R.rects&&(l=R.rects===!0?await s.getElementRects({reference:e,floating:t,strategy:o}):R.rects),{x:h,y:c}=Ue(l,u,f)),m=-1)}return{x:h,y:c,placement:u,strategy:o,middlewareData:d}};function He(e){return typeof e!="number"?function(t){return{top:0,right:0,bottom:0,left:0,...t}}(e):{top:e,right:e,bottom:e,left:e}}function we(e){return{...e,top:e.y,left:e.x,right:e.x+e.width,bottom:e.y+e.height}}async function ze(e,t){var n;t===void 0&&(t={});const{x:r,y:o,platform:i,rects:s,elements:a,strategy:f}=e,{boundary:l="clippingAncestors",rootBoundary:h="viewport",elementContext:c="floating",altBoundary:u=!1,padding:d=0}=t,p=He(d),m=a[u?c==="floating"?"reference":"floating":c],g=we(await i.getClippingRect({element:(n=await(i.isElement==null?void 0:i.isElement(m)))==null||n?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(a.floating)),boundary:l,rootBoundary:h,strategy:f})),x=c==="floating"?{...s.floating,x:r,y:o}:s.reference,y=await(i.getOffsetParent==null?void 0:i.getOffsetParent(a.floating)),w=await(i.isElement==null?void 0:i.isElement(y))&&await(i.getScale==null?void 0:i.getScale(y))||{x:1,y:1},v=we(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({rect:x,offsetParent:y,strategy:f}):x);return{top:(g.top-v.top+p.top)/w.y,bottom:(v.bottom-g.bottom+p.bottom)/w.y,left:(g.left-v.left+p.left)/w.x,right:(v.right-g.right+p.right)/w.x}}const be=Math.min,q=Math.max;function De(e,t,n){return q(e,be(t,n))}const gn=e=>({name:"arrow",options:e,async fn(t){const{element:n,padding:r=0}=e||{},{x:o,y:i,placement:s,rects:a,platform:f}=t;if(n==null)return{};const l=He(r),h={x:o,y:i},c=X(s),u=Be(c),d=await f.getDimensions(n),p=c==="y"?"top":"left",m=c==="y"?"bottom":"right",g=a.reference[u]+a.reference[c]-h[c]-a.floating[u],x=h[c]-a.reference[c],y=await(f.getOffsetParent==null?void 0:f.getOffsetParent(n));let w=y?c==="y"?y.clientHeight||0:y.clientWidth||0:0;w===0&&(w=a.floating[u]);const v=g/2-x/2,R=l[p],$=w-d[u]-l[m],b=w/2-d[u]/2+v,P=De(R,b,$),_=ne(s)!=null&&b!=P&&a.reference[u]/2-(b<R?l[p]:l[m])-d[u]/2<0;return{[c]:h[c]-(_?b<R?R-b:$-b:0),data:{[c]:P,centerOffset:b-P}}}}),on=["top","right","bottom","left"];on.reduce((e,t)=>e.concat(t,t+"-start",t+"-end"),[]);const sn={left:"right",right:"left",bottom:"top",top:"bottom"};function ve(e){return e.replace(/left|right|bottom|top/g,t=>sn[t])}function an(e,t,n){n===void 0&&(n=!1);const r=ne(e),o=X(e),i=Be(o);let s=o==="x"?r===(n?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[i]>t.floating[i]&&(s=ve(s)),{main:s,cross:ve(s)}}const cn={start:"end",end:"start"};function Oe(e){return e.replace(/start|end/g,t=>cn[t])}const yn=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var n;const{placement:r,middlewareData:o,rects:i,initialPlacement:s,platform:a,elements:f}=t,{mainAxis:l=!0,crossAxis:h=!0,fallbackPlacements:c,fallbackStrategy:u="bestFit",fallbackAxisSideDirection:d="none",flipAlignment:p=!0,...m}=e,g=W(r),x=W(s)===s,y=await(a.isRTL==null?void 0:a.isRTL(f.floating)),w=c||(x||!p?[ve(s)]:function(D){const I=ve(D);return[Oe(D),I,Oe(I)]}(s));c||d==="none"||w.push(...function(D,I,Z,j){const G=ne(D);let M=function(ie,Se,wt){const Ge=["left","right"],_e=["right","left"],bt=["top","bottom"],vt=["bottom","top"];switch(ie){case"top":case"bottom":return wt?Se?_e:Ge:Se?Ge:_e;case"left":case"right":return Se?bt:vt;default:return[]}}(W(D),Z==="start",j);return G&&(M=M.map(ie=>ie+"-"+G),I&&(M=M.concat(M.map(Oe)))),M}(s,p,d,y));const v=[s,...w],R=await ze(t,m),$=[];let b=((n=o.flip)==null?void 0:n.overflows)||[];if(l&&$.push(R[g]),h){const{main:D,cross:I}=an(r,i,y);$.push(R[D],R[I])}if(b=[...b,{placement:r,overflows:$}],!$.every(D=>D<=0)){var P,_;const D=(((P=o.flip)==null?void 0:P.index)||0)+1,I=v[D];if(I)return{data:{index:D,overflows:b},reset:{placement:I}};let Z=(_=b.filter(j=>j.overflows[0]<=0).sort((j,G)=>j.overflows[1]-G.overflows[1])[0])==null?void 0:_.placement;if(!Z)switch(u){case"bestFit":{var re;const j=(re=b.map(G=>[G.placement,G.overflows.filter(M=>M>0).reduce((M,ie)=>M+ie,0)]).sort((G,M)=>G[1]-M[1])[0])==null?void 0:re[0];j&&(Z=j);break}case"initialPlacement":Z=s}if(r!==Z)return{reset:{placement:Z}}}return{}}}},xn=function(e){return e===void 0&&(e={}),{name:"inline",options:e,async fn(t){const{placement:n,elements:r,rects:o,platform:i,strategy:s}=t,{padding:a=2,x:f,y:l}=e,h=we(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({rect:o.reference,offsetParent:await(i.getOffsetParent==null?void 0:i.getOffsetParent(r.floating)),strategy:s}):o.reference),c=await(i.getClientRects==null?void 0:i.getClientRects(r.reference))||[],u=He(a),d=await i.getElementRects({reference:{getBoundingClientRect:function(){if(c.length===2&&c[0].left>c[1].right&&f!=null&&l!=null)return c.find(p=>f>p.left-u.left&&f<p.right+u.right&&l>p.top-u.top&&l<p.bottom+u.bottom)||h;if(c.length>=2){if(X(n)==="x"){const v=c[0],R=c[c.length-1],$=W(n)==="top",b=v.top,P=R.bottom,_=$?v.left:R.left,re=$?v.right:R.right;return{top:b,bottom:P,left:_,right:re,width:re-_,height:P-b,x:_,y:b}}const p=W(n)==="left",m=q(...c.map(v=>v.right)),g=be(...c.map(v=>v.left)),x=c.filter(v=>p?v.left===g:v.right===m),y=x[0].top,w=x[x.length-1].bottom;return{top:y,bottom:w,left:g,right:m,width:m-g,height:w-y,x:g,y}}return h}},floating:r.floating,strategy:s});return o.reference.x!==d.reference.x||o.reference.y!==d.reference.y||o.reference.width!==d.reference.width||o.reference.height!==d.reference.height?{reset:{rects:d}}:{}}}},wn=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){const{x:n,y:r}=t,o=await async function(i,s){const{placement:a,platform:f,elements:l}=i,h=await(f.isRTL==null?void 0:f.isRTL(l.floating)),c=W(a),u=ne(a),d=X(a)==="x",p=["left","top"].includes(c)?-1:1,m=h&&d?-1:1,g=typeof s=="function"?s(i):s;let{mainAxis:x,crossAxis:y,alignmentAxis:w}=typeof g=="number"?{mainAxis:g,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...g};return u&&typeof w=="number"&&(y=u==="end"?-1*w:w),d?{x:y*m,y:x*p}:{x:x*p,y:y*m}}(t,e);return{x:n+o.x,y:r+o.y,data:o}}}};function ut(e){return e==="x"?"y":"x"}const bn=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:r,placement:o}=t,{mainAxis:i=!0,crossAxis:s=!1,limiter:a={fn:g=>{let{x,y}=g;return{x,y}}},...f}=e,l={x:n,y:r},h=await ze(t,f),c=X(W(o)),u=ut(c);let d=l[c],p=l[u];if(i){const g=c==="y"?"bottom":"right";d=De(d+h[c==="y"?"top":"left"],d,d-h[g])}if(s){const g=u==="y"?"bottom":"right";p=De(p+h[u==="y"?"top":"left"],p,p-h[g])}const m=a.fn({...t,[c]:d,[u]:p});return{...m,data:{x:m.x-n,y:m.y-r}}}}},vn=function(e){return e===void 0&&(e={}),{options:e,fn(t){const{x:n,y:r,placement:o,rects:i,middlewareData:s}=t,{offset:a=0,mainAxis:f=!0,crossAxis:l=!0}=e,h={x:n,y:r},c=X(o),u=ut(c);let d=h[c],p=h[u];const m=typeof a=="function"?a(t):a,g=typeof m=="number"?{mainAxis:m,crossAxis:0}:{mainAxis:0,crossAxis:0,...m};if(f){const w=c==="y"?"height":"width",v=i.reference[c]-i.floating[w]+g.mainAxis,R=i.reference[c]+i.reference[w]-g.mainAxis;d<v?d=v:d>R&&(d=R)}if(l){var x,y;const w=c==="y"?"width":"height",v=["top","left"].includes(W(o)),R=i.reference[u]-i.floating[w]+(v&&((x=s.offset)==null?void 0:x[u])||0)+(v?0:g.crossAxis),$=i.reference[u]+i.reference[w]+(v?0:((y=s.offset)==null?void 0:y[u])||0)-(v?g.crossAxis:0);p<R?p=R:p>$&&(p=$)}return{[c]:d,[u]:p}}}},Rn=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){const{placement:n,rects:r,platform:o,elements:i}=t,{apply:s=()=>{},...a}=e,f=await ze(t,a),l=W(n),h=ne(n),c=X(n)==="x",{width:u,height:d}=r.floating;let p,m;l==="top"||l==="bottom"?(p=l,m=h===(await(o.isRTL==null?void 0:o.isRTL(i.floating))?"start":"end")?"left":"right"):(m=l,p=h==="end"?"top":"bottom");const g=d-f[p],x=u-f[m];let y=g,w=x;if(c?w=be(u-f.right-f.left,x):y=be(d-f.bottom-f.top,g),!t.middlewareData.shift&&!h){const R=q(f.left,0),$=q(f.right,0),b=q(f.top,0),P=q(f.bottom,0);c?w=u-2*(R!==0||$!==0?R+$:q(f.left,f.right)):y=d-2*(b!==0||P!==0?b+P:q(f.top,f.bottom))}await s({...t,availableWidth:w,availableHeight:y});const v=await o.getDimensions(i.floating);return u!==v.width||d!==v.height?{reset:{rects:!0}}:{}}}};function O(e){var t;return((t=e.ownerDocument)==null?void 0:t.defaultView)||window}function H(e){return O(e).getComputedStyle(e)}const Je=Math.min,se=Math.max,Re=Math.round;function dt(e){const t=H(e);let n=parseFloat(t.width),r=parseFloat(t.height);const o=e.offsetWidth,i=e.offsetHeight,s=Re(n)!==o||Re(r)!==i;return s&&(n=o,r=i),{width:n,height:r,fallback:s}}function Y(e){return pt(e)?(e.nodeName||"").toLowerCase():""}let pe;function ht(){if(pe)return pe;const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?(pe=e.brands.map(t=>t.brand+"/"+t.version).join(" "),pe):navigator.userAgent}function z(e){return e instanceof O(e).HTMLElement}function F(e){return e instanceof O(e).Element}function pt(e){return e instanceof O(e).Node}function Qe(e){return typeof ShadowRoot>"u"?!1:e instanceof O(e).ShadowRoot||e instanceof ShadowRoot}function Ce(e){const{overflow:t,overflowX:n,overflowY:r,display:o}=H(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&!["inline","contents"].includes(o)}function fn(e){return["table","td","th"].includes(Y(e))}function Me(e){const t=/firefox/i.test(ht()),n=H(e),r=n.backdropFilter||n.WebkitBackdropFilter;return n.transform!=="none"||n.perspective!=="none"||!!r&&r!=="none"||t&&n.willChange==="filter"||t&&!!n.filter&&n.filter!=="none"||["transform","perspective"].some(o=>n.willChange.includes(o))||["paint","layout","strict","content"].some(o=>{const i=n.contain;return i!=null&&i.includes(o)})}function We(){return/^((?!chrome|android).)*safari/i.test(ht())}function Ie(e){return["html","body","#document"].includes(Y(e))}function mt(e){return F(e)?e:e.contextElement}const gt={x:1,y:1};function Q(e){const t=mt(e);if(!z(t))return gt;const n=t.getBoundingClientRect(),{width:r,height:o,fallback:i}=dt(t);let s=(i?Re(n.width):n.width)/r,a=(i?Re(n.height):n.height)/o;return s&&Number.isFinite(s)||(s=1),a&&Number.isFinite(a)||(a=1),{x:s,y:a}}function U(e,t,n,r){var o,i;t===void 0&&(t=!1),n===void 0&&(n=!1);const s=e.getBoundingClientRect(),a=mt(e);let f=gt;t&&(r?F(r)&&(f=Q(r)):f=Q(e));const l=a?O(a):window,h=We()&&n;let c=(s.left+(h&&((o=l.visualViewport)==null?void 0:o.offsetLeft)||0))/f.x,u=(s.top+(h&&((i=l.visualViewport)==null?void 0:i.offsetTop)||0))/f.y,d=s.width/f.x,p=s.height/f.y;if(a){const m=O(a),g=r&&F(r)?O(r):r;let x=m.frameElement;for(;x&&r&&g!==m;){const y=Q(x),w=x.getBoundingClientRect(),v=getComputedStyle(x);w.x+=(x.clientLeft+parseFloat(v.paddingLeft))*y.x,w.y+=(x.clientTop+parseFloat(v.paddingTop))*y.y,c*=y.x,u*=y.y,d*=y.x,p*=y.y,c+=w.x,u+=w.y,x=O(x).frameElement}}return{width:d,height:p,top:u,right:c+d,bottom:u+p,left:c,x:c,y:u}}function K(e){return((pt(e)?e.ownerDocument:e.document)||window.document).documentElement}function ke(e){return F(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function yt(e){return U(K(e)).left+ke(e).scrollLeft}function ue(e){if(Y(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Qe(e)&&e.host||K(e);return Qe(t)?t.host:t}function xt(e){const t=ue(e);return Ie(t)?t.ownerDocument.body:z(t)&&Ce(t)?t:xt(t)}function ae(e,t){var n;t===void 0&&(t=[]);const r=xt(e),o=r===((n=e.ownerDocument)==null?void 0:n.body),i=O(r);return o?t.concat(i,i.visualViewport||[],Ce(r)?r:[]):t.concat(r,ae(r))}function et(e,t,n){let r;if(t==="viewport")r=function(s,a){const f=O(s),l=K(s),h=f.visualViewport;let c=l.clientWidth,u=l.clientHeight,d=0,p=0;if(h){c=h.width,u=h.height;const m=We();(!m||m&&a==="fixed")&&(d=h.offsetLeft,p=h.offsetTop)}return{width:c,height:u,x:d,y:p}}(e,n);else if(t==="document")r=function(s){const a=K(s),f=ke(s),l=s.ownerDocument.body,h=se(a.scrollWidth,a.clientWidth,l.scrollWidth,l.clientWidth),c=se(a.scrollHeight,a.clientHeight,l.scrollHeight,l.clientHeight);let u=-f.scrollLeft+yt(s);const d=-f.scrollTop;return H(l).direction==="rtl"&&(u+=se(a.clientWidth,l.clientWidth)-h),{width:h,height:c,x:u,y:d}}(K(e));else if(F(t))r=function(s,a){const f=U(s,!0,a==="fixed"),l=f.top+s.clientTop,h=f.left+s.clientLeft,c=z(s)?Q(s):{x:1,y:1};return{width:s.clientWidth*c.x,height:s.clientHeight*c.y,x:h*c.x,y:l*c.y}}(t,n);else{const s={...t};if(We()){var o,i;const a=O(e);s.x-=((o=a.visualViewport)==null?void 0:o.offsetLeft)||0,s.y-=((i=a.visualViewport)==null?void 0:i.offsetTop)||0}r=s}return we(r)}function tt(e,t){return z(e)&&H(e).position!=="fixed"?t?t(e):e.offsetParent:null}function nt(e,t){const n=O(e);let r=tt(e,t);for(;r&&fn(r)&&H(r).position==="static";)r=tt(r,t);return r&&(Y(r)==="html"||Y(r)==="body"&&H(r).position==="static"&&!Me(r))?n:r||function(o){let i=ue(o);for(;z(i)&&!Ie(i);){if(Me(i))return i;i=ue(i)}return null}(e)||n}function ln(e,t,n){const r=z(t),o=K(t),i=U(e,!0,n==="fixed",t);let s={scrollLeft:0,scrollTop:0};const a={x:0,y:0};if(r||!r&&n!=="fixed")if((Y(t)!=="body"||Ce(o))&&(s=ke(t)),z(t)){const f=U(t,!0);a.x=f.x+t.clientLeft,a.y=f.y+t.clientTop}else o&&(a.x=yt(o));return{x:i.left+s.scrollLeft-a.x,y:i.top+s.scrollTop-a.y,width:i.width,height:i.height}}const un={getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:r,strategy:o}=e;const i=n==="clippingAncestors"?function(l,h){const c=h.get(l);if(c)return c;let u=ae(l).filter(g=>F(g)&&Y(g)!=="body"),d=null;const p=H(l).position==="fixed";let m=p?ue(l):l;for(;F(m)&&!Ie(m);){const g=H(m),x=Me(m);g.position==="fixed"?d=null:(p?x||d:x||g.position!=="static"||!d||!["absolute","fixed"].includes(d.position))?d=g:u=u.filter(y=>y!==m),m=ue(m)}return h.set(l,u),u}(t,this._c):[].concat(n),s=[...i,r],a=s[0],f=s.reduce((l,h)=>{const c=et(t,h,o);return l.top=se(c.top,l.top),l.right=Je(c.right,l.right),l.bottom=Je(c.bottom,l.bottom),l.left=se(c.left,l.left),l},et(t,a,o));return{width:f.right-f.left,height:f.bottom-f.top,x:f.left,y:f.top}},convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{rect:t,offsetParent:n,strategy:r}=e;const o=z(n),i=K(n);if(n===i)return t;let s={scrollLeft:0,scrollTop:0},a={x:1,y:1};const f={x:0,y:0};if((o||!o&&r!=="fixed")&&((Y(n)!=="body"||Ce(i))&&(s=ke(n)),z(n))){const l=U(n);a=Q(n),f.x=l.x+n.clientLeft,f.y=l.y+n.clientTop}return{width:t.width*a.x,height:t.height*a.y,x:t.x*a.x-s.scrollLeft*a.x+f.x,y:t.y*a.y-s.scrollTop*a.y+f.y}},isElement:F,getDimensions:function(e){return z(e)?dt(e):e.getBoundingClientRect()},getOffsetParent:nt,getDocumentElement:K,getScale:Q,async getElementRects(e){let{reference:t,floating:n,strategy:r}=e;const o=this.getOffsetParent||nt,i=this.getDimensions;return{reference:ln(t,await o(n),r),floating:{x:0,y:0,...await i(n)}}},getClientRects:e=>Array.from(e.getClientRects()),isRTL:e=>H(e).direction==="rtl"};function An(e,t,n,r){r===void 0&&(r={});const{ancestorScroll:o=!0,ancestorResize:i=!0,elementResize:s=!0,animationFrame:a=!1}=r,f=o&&!a,l=f||i?[...F(e)?ae(e):e.contextElement?ae(e.contextElement):[],...ae(t)]:[];l.forEach(d=>{f&&d.addEventListener("scroll",n,{passive:!0}),i&&d.addEventListener("resize",n)});let h,c=null;if(s){let d=!0;c=new ResizeObserver(()=>{d||n(),d=!1}),F(e)&&!a&&c.observe(e),F(e)||!e.contextElement||a||c.observe(e.contextElement),c.observe(t)}let u=a?U(e):null;return a&&function d(){const p=U(e);!u||p.x===u.x&&p.y===u.y&&p.width===u.width&&p.height===u.height||n(),u=p,h=requestAnimationFrame(d)}(),n(),()=>{var d;l.forEach(p=>{f&&p.removeEventListener("scroll",n),i&&p.removeEventListener("resize",n)}),(d=c)==null||d.disconnect(),c=null,a&&cancelAnimationFrame(h)}}const En=(e,t,n)=>{const r=new Map,o={platform:un,...n},i={...o.platform,_c:r};return rn(e,t,{...o,platform:i})};export{bn as E,vn as L,wn as O,An as P,xn as T,yn as b,dn as c,hn as g,pn as i,Rn as k,gn as m,Ut as r,mn as s,En as z};
