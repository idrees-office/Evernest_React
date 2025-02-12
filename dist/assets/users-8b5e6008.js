import{Y as u,u as L,r as i,s as k,Z as d,S as x,j as e,a as n}from"./index-7836fd15.js";import{T as O}from"./Table-8acba02a.js";import{o as S}from"./status-47ec63e3.js";import{S as R}from"./react-select.esm-183c7593.js";import{I as Y}from"./IconTrashLines-7e462f94.js";import{I as q}from"./IconPencil-d3767a77.js";import"./index-d8ecb226.js";import"./floating-ui.dom.browser.min-b8726d47.js";import"./extends-4c19d496.js";import"./_baseIsEqual-3873d123.js";import"./IconThumbUp-dd89f5a9.js";import"./IconTrash-4efbbb8e.js";import"./objectWithoutPropertiesLoose-f3b3ace0.js";const m={createApi:`${u()}/users/create_user`,roleApi:`${u()}/users/get_user_role`,listApi:`${u()}/users/user_list`,destoryApi:`${u()}/users/delete_user`,updateApi:`${u()}/users/update_user`},se=()=>{const w=L(),c=i.useRef({userformRef:null}),[g,A]=i.useState([]),[C,E]=i.useState(null),[r,b]=i.useState({}),[F,D]=i.useState(null),[$,_]=i.useState(null),N=i.useRef(!1);i.useEffect(()=>{N.current||(w(k("Create User")),T(),h(),N.current=!0)},[w]);const P=(Array.isArray(g)?g:[]).map((t,s)=>{var a;return{id:t.client_user_id,client_user_name:t.client_user_name,client_user_email:t.client_user_email,client_role:(a=t.roles[0])==null?void 0:a.name,user:t}}),T=async()=>{var t;try{const s=await d.get(m.roleApi);if(s.data){const a=s.data.map(l=>({value:l.id,label:l.name}));D(a)}}catch(s){((t=s.response)==null?void 0:t.status)===403&&(window.location.href="/error"),p()}},h=async()=>{var t;try{const s=await d.get(m.listApi);s.data&&A(s.data)}catch(s){((t=s.response)==null?void 0:t.status)===403&&(window.location.href="/error"),p()}},U=async t=>{var s,a,l;t.preventDefault();try{if(c.current.userformRef){const o=new FormData(c.current.userformRef),y=o.get("client_user_id"),f=y?await d.post(`${m.updateApi}/${y}`,o):await d.post(m.createApi,o);(f.status===200||f.status===201)&&(v(f.data.message),h(),b({}),c.current.userformRef.reset())}}catch(o){(a=(s=o.response)==null?void 0:s.data)!=null&&a.errors?b(o.response.data.errors):((l=o.response)==null?void 0:l.status)===403?window.location.href="/error":p()}},v=t=>{x.fire({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0,title:t,icon:"success"})},p=()=>{x.fire({text:"Something went wrong on the server",icon:"error",title:"Server Error"})},B=async t=>{if(c.current.userformRef){const s=c.current.userformRef;s.reset(),s.client_user_id.value=t.client_user_id||"",s.client_user_name.value=t.client_user_name||"",s.client_user_email.value=t.client_user_email||"",s.client_user_phone.value=t.client_user_phone||"",s.client_user_designation.value=t.client_user_designation||"",s.client_sort_order.value=t.client_sort_order||"",E(t.client_user_status||"");const a=t.roles&&t.roles[0];if(a){const l={value:a.id,label:a.name};_(l)}else _(null)}},I=async t=>{var a;if((await x.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonText:"Yes, delete it!",cancelButtonText:"No, cancel!"})).isConfirmed)try{const l=await d.delete(m.destoryApi+`/${t.client_user_id}`);(l.status===200||l.status===201)&&(v("User deleted successfully"),h())}catch(l){((a=l.response)==null?void 0:a.status)===403&&(window.location.href="/error"),p()}},j=t=>{_(t)};return e("form",{ref:t=>c.current.userformRef=t,onSubmit:U,className:"space-y-5",children:n("div",{className:"flex flex-wrap -mx-4",children:[e("div",{className:"w-full lg:w-1/3 px-4",children:e("div",{className:"panel",children:e("div",{className:"panel-body",children:n("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[n("div",{className:"form-group",children:[e("label",{htmlFor:"client_user_name",children:"Username"}),e("input",{name:"client_user_name",type:"text",placeholder:"Username",className:"form-input"}),e("input",{type:"hidden",name:"client_user_id",id:"client_user_id"}),r.client_user_name&&e("span",{className:"text-red-500 text-sm",children:r.client_user_name})]}),n("div",{className:"form-group",children:[e("label",{htmlFor:"client_user_phone",children:"Phone"}),e("input",{name:"client_user_phone",type:"tel",placeholder:"Phone",className:"form-input"}),r.client_user_phone&&e("span",{className:"text-red-500 text-sm",children:r.client_user_phone})]}),n("div",{className:"form-group",children:[e("label",{htmlFor:"client_user_designation",children:"Designation"}),e("input",{name:"client_user_designation",type:"text",placeholder:"Designation",className:"form-input"}),r.client_user_designation&&e("span",{className:"text-red-500 text-sm",children:r.client_user_designation})]}),n("div",{className:"form-group",children:[e("label",{htmlFor:"client_user_email",children:"Email"}),e("input",{name:"client_user_email",type:"email",placeholder:"Email",className:"form-input"}),r.client_user_email&&e("span",{className:"text-red-500 text-sm",children:r.client_user_email})]}),n("div",{className:"form-group",children:[e("label",{htmlFor:"password",children:"Password"}),e("input",{name:"password",type:"password",placeholder:"Password",className:"form-input"}),r.password&&e("span",{className:"text-red-500 text-sm",children:r.password})]}),n("div",{className:"form-group",children:[e("label",{htmlFor:"client_user_status",children:"Status"}),e(R,{name:"client_user_status",placeholder:"Select an option",options:S,value:S.find(t=>t.value===C)}),r.client_user_status&&e("span",{className:"text-red-500 text-sm",children:r.client_user_status})]}),n("div",{className:"form-group",children:[e("label",{htmlFor:"client_sort_order",children:"Sort Order"}),e("input",{name:"client_sort_order",type:"text",placeholder:"Sort Order",className:"form-input"}),r.client_sort_order&&e("span",{className:"text-red-500 text-sm",children:r.client_sort_order})]}),n("div",{className:"form-group",children:[e("label",{htmlFor:"role_id",children:"Role"}),e(R,{name:"role_id",placeholder:"Select an option",options:F||[],value:$,onChange:j})]}),r.role_id&&e("span",{className:"text-red-500 text-sm",children:r.role_id}),e("div",{className:"sm:col-span-2 flex justify-end",children:e("button",{type:"submit",className:"btn btn-primary",children:"Submit"})})]})})})}),e("div",{className:"w-full lg:w-2/3 px-2 mt-6 lg:mt-0 md-mt-0",children:e("div",{className:"datatables",children:e(O,{title:"List of all users:",columns:[{accessor:"id",title:"#",sortable:!0},{accessor:"client_user_name",title:"Name",sortable:!0},{accessor:"client_user_email",title:"Email",sortable:!0},{accessor:"client_role",title:"Role",sortable:!0},{accessor:"action",title:"Action",sortable:!0,render:t=>n("div",{className:"flex space-x-2",children:[e("button",{type:"button",onClick:()=>B(t.user),className:"btn px-1 py-0.5 rounded text-white bg-info",children:e(q,{})}),e("button",{type:"button",onClick:()=>I(t.user),className:"btn px-1 py-0.5 rounded text-white",style:{background:"#d33",color:"#fff"},children:e(Y,{})})]})}],rows:P})})})]})})};export{se as default};
