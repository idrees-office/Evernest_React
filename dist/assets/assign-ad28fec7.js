import{u as D,c as T,T as A,r as i,s as P,_ as f,b as B,a as d,j as a,$ as R,S as U,a0 as F}from"./index-7836fd15.js";import{T as j}from"./Table-8acba02a.js";import{I as E}from"./IconBell-f7cf784e.js";import{I as M}from"./IconPlus-8123fe79.js";import{I as W}from"./IconTrash-4efbbb8e.js";import{L as Y}from"./loader-59de9761.js";import{S as $}from"./react-select.esm-183c7593.js";import{L as z}from"./LeadModal-9e103544.js";/* empty css                  */import"./index-d8ecb226.js";import"./floating-ui.dom.browser.min-b8726d47.js";import"./extends-4c19d496.js";import"./_baseIsEqual-3873d123.js";import"./objectWithoutPropertiesLoose-f3b3ace0.js";import"./transition-0e9a6b10.js";const oe=()=>{const o=D();T();const l=A(),N=Y(),b=i.useRef({fetched:!1,form:null}),[n,m]=i.useState([]),[v,u]=i.useState(!0),[k,g]=i.useState(!1);i.useEffect(()=>{b.current.fetched||(o(P("New Leads")),o(f()),b.current.fetched=!0)},[o]);const{leads:w,loading:x,agents:p}=B(e=>e.leadslices),S=p==null?void 0:p.map(e=>({value:e==null?void 0:e.client_user_id,label:e==null?void 0:e.client_user_name,phone:e==null?void 0:e.client_user_phone})),y=(Array.isArray(w)?w:[]).map((e,s)=>({id:e.lead_id||"Unknown",title:e.lead_title||"Unknown",name:e.customer_name||"Unknown",phone:e.customer_phone||"Unknown",source:e.lead_source||"Unknown",date:new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date(e.created_at))})),_=()=>{g(!0)},I=(e,s)=>{s?(m(r=>[...r,e]),u(!1)):(m(r=>r.filter(t=>t.id!==e.id)),n.length===1&&u(!0))},C=async(e,s)=>{if(n.length===0){l.error("Please select at least one lead to assign");return}const r=n.map(h=>h.id),t=new FormData;r.forEach(h=>t.append("lead_id[]",h)),t.append("agent_id",e.toString()),t.append("agent_phone",s.toString());const c=await o(R({formData:t}));(c.payload.status===200||c.payload.status===201)&&(l.success("Leads Have Been Assigned Successfully"),o(f()),m([]),u(!0))},L=async()=>{if(n.length===0){l.error("Please select at least one lead to remove");return}if((await U.fire({title:"Are you sure?",text:`You are about to remove ${n.length} selected lead(s). This action cannot be undone.`,icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!",cancelButtonText:"Cancel"})).isConfirmed)try{const s=n.map(c=>c.id),r=new FormData;s.forEach(c=>r.append("lead_id[]",c));const t=await o(F({formData:r}));t.payload.status===200||t.payload.status===201?(l.success("Lead removed successfully"),m([]),o(f()),u(!0)):l.error("Failed to remove leads. Please try again.")}catch{l.error("An error occurred while removing leads.")}};return d("div",{children:[d("div",{className:"panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative",children:[d("div",{className:"flex items-center",children:[a("div",{className:"rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3",children:a(E,{})}),a("span",{className:"ltr:mr-3 rtl:ml-3",children:"Details of Your New Leads: "}),d("button",{onClick:_,className:"btn btn-primary btn-sm",children:[" ",a(M,{})," Add Lead"]})]}),d("div",{className:"flex items-center space-x-2",children:[a($,{placeholder:"Select an option",options:S,isDisabled:v,className:"cursor-pointer custom-multiselect z-10 w-[300px]",onChange:e=>{(e==null?void 0:e.value)!==void 0&&C(e.value,e.phone)}}),a("button",{onClick:()=>{L()},type:"button",className:"btn btn-default btn-sm",style:{background:"#d33",color:"#fff"},children:a(W,{})})]})]}),a("div",{className:"datatables mt-6",children:x?N:y.length>0?a(j,{title:"New leads",columns:[{accessor:"id",title:"Select",sortable:!1,render:e=>a("input",{type:"checkbox",className:"form-checkbox",checked:n.some(s=>s.id===e.id),onChange:s=>I(e,s.target.checked)})},{accessor:"title",title:"Title",sortable:!0},{accessor:"name",title:"Name",sortable:!0},{accessor:"phone",title:"Phone",sortable:!0},{accessor:"source",title:"Source",sortable:!0,render:e=>e.source==="Facebook"?a("span",{className:"badge bg-info",children:"Facebook"}):e.source==="Instagram"?a("span",{className:"badge bg-secondary",children:"Instagram"}):e.source==="created own"?a("span",{className:"badge bg-success",children:"Created own"}):e.source==="Website"?a("span",{className:"badge bg-warning",children:"Website"}):e.source==="Reshuffle"?a("span",{className:"badge bg-primary",children:"Reshuffle"}):e.source==="Walk-in"?a("span",{className:"badge bg-danger",children:"Walk-in"}):e.source==="Other"?a("span",{className:"badge bg-secondary",children:"Other"}):a("span",{className:"badge bg-secondary",children:"Unknown"})},{accessor:"date",title:"Date",sortable:!0}],rows:y}):a("div",{className:"panel text-center text-primary-500 mt-4",children:a("span",{className:"badge bg-secondary",children:" Sorry, I am unable to retrieve data. Please check your API . "})})}),a(z,{isOpen:k,onClose:()=>g(!1)})]})};export{oe as default};
