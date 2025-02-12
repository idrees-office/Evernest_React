import{u as U,c as R,T as W,r as n,s as E,a3 as g,b as F,a as r,j as t,a4 as j}from"./index-7836fd15.js";import{T as z}from"./Table-8acba02a.js";import{I as M}from"./IconBell-f7cf784e.js";import{I as O}from"./IconPlus-8123fe79.js";import{L as Y}from"./loader-59de9761.js";import{S as w}from"./react-select.esm-183c7593.js";import{L as B}from"./LeadModal-9e103544.js";/* empty css                  */import{D as $}from"./status-47ec63e3.js";import{E as q}from"./jspdf.plugin.autotable-8d384558.js";import"./index-d8ecb226.js";import"./floating-ui.dom.browser.min-b8726d47.js";import"./extends-4c19d496.js";import"./_baseIsEqual-3873d123.js";import"./objectWithoutPropertiesLoose-f3b3ace0.js";import"./transition-0e9a6b10.js";import"./IconThumbUp-dd89f5a9.js";import"./IconTrash-4efbbb8e.js";const de=()=>{const l=U();R();const m=W(),S=Y(),u=$(),p=n.useRef({fetched:!1,form:null});n.useState([]),n.useState(!0);const[y,N]=n.useState(!1),[f,v]=n.useState(null),[c,x]=n.useState(null);n.useEffect(()=>{p.current.fetched||(l(E("Re-Assign Leads")),l(g()),p.current.fetched=!0)},[l]);const{leads:b,loading:D,agents:i}=F(e=>e.leadslices),_=i==null?void 0:i.map(e=>({value:e==null?void 0:e.client_user_id,label:e==null?void 0:e.client_user_name})),k=e=>{v(e)},A=e=>{x(e.value)},L=async()=>{var s;if(!f){m.error("Please select an agent before downloading.");return}if(!c){m.error("Please select a status before downloading.");return}const e=new FormData;e.append("lead_status",c),e.append("agent_id",f.toString());const a=await l(j({formData:e}));if(a.payload.status===200||a.payload.status===201){l(g());const o=new q;o.setFontSize(16),I(c),o.text(`Agent: ${a.payload.agent_name}`,10,10),o.text("Lead Status: Not Responding",180,10,{align:"right"}),o.text(" ",10,10);const T=[["Lead Title","Comment","Time"]],C=(s=a.payload.data)==null?void 0:s.map(d=>[d.lead_title,d.lead_comment,P(d.updated_at)]);o.autoTable({head:T,body:C,startY:30,columnStyles:{0:{cellWidth:"auto"},1:{cellWidth:"auto"},2:{cellWidth:"auto"}},theme:"grid",styles:{cellPadding:3,fontSize:12,fontStyle:"normal"},headStyles:{fillColor:[22,160,133],textColor:[255,255,255],fontStyle:"bold"},bodyStyles:{fillColor:[240,240,240]}}),o.save("reports.pdf")}},P=e=>new Date(e).toLocaleString(),I=e=>{const a=u.find(s=>s.value===e);return a?a.label:"Unknown Status"},h=(Array.isArray(b)?b:[]).map((e,a)=>{const s=e==null?void 0:e.created_at,o=s&&!isNaN(new Date(s).getTime())?new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date(s)):"Invalid Date";return{id:e.lead_id||"Unknown",title:(e==null?void 0:e.lead_title)||"Unknown",name:(e==null?void 0:e.customer_name)||"Unknown",phone:(e==null?void 0:e.customer_phone)||"Unknown",source:(e==null?void 0:e.lead_source)||"Unknown",date:o}});return r("div",{children:[r("div",{className:"panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative",children:[r("div",{className:"flex items-center",children:[r("div",{className:"rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3",children:[" ",t(M,{})," "]}),t("span",{className:"ltr:mr-3 rtl:ml-3",children:" Details of Your Agents Pdf Reports. "})]}),r("div",{className:"flex items-center space-x-2",children:[t("div",{className:"w-[300px]",children:t(w,{placeholder:"Select an option",options:_,classNamePrefix:"custom-select",className:"custom-multiselect z-10",onChange:e=>{(e==null?void 0:e.value)!==void 0&&k(e.value)}})}),t(w,{placeholder:"Move Lead....",options:u,onChange:e=>A(e),name:"lead_status",className:"cursor-pointer custom-multiselect z-10 w-[300px]"}),r("button",{onClick:()=>{L()},type:"button",className:"btn btn-secondary btn-sm",children:[t(O,{}),"Download "]})]})]}),t("div",{className:"datatables mt-6",children:D?S:h.length>0?t(z,{title:"Export-pdf Agents-wise",columns:[{accessor:"title",title:"Title",sortable:!0},{accessor:"name",title:"Name",sortable:!0},{accessor:"phone",title:"Phone",sortable:!0},{accessor:"source",title:"Source",sortable:!0,render:e=>e.source==="Facebook"?t("span",{className:"badge bg-info",children:"Facebook"}):e.source==="Instagram"?t("span",{className:"badge bg-secondary",children:"Instagram"}):e.source==="created own"?t("span",{className:"badge bg-success",children:"Created own"}):e.source==="Website"?t("span",{className:"badge bg-warning",children:"Website"}):e.source==="Reshuffle"?t("span",{className:"badge bg-primary",children:"Reshuffle"}):e.source==="Walk-in"?t("span",{className:"badge bg-danger",children:"Walk-in"}):e.source==="Other"?t("span",{className:"badge bg-secondary",children:"Other"}):t("span",{className:"badge bg-secondary",children:"Unknown"})},{accessor:"date",title:"Date",sortable:!0}],rows:h}):t("div",{className:"panel text-center text-primary-500 mt-4",children:t("span",{className:"badge bg-secondary",children:" Sorry, I am unable to retrieve data. Please check your API . "})})}),t(B,{isOpen:y,onClose:()=>N(!1)})]})};export{de as default};
