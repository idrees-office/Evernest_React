import{j as e,F as T,a as s,Y as v,b as M,r as c,u as R,c as Z,T as z,Z as x,s as H,L as V}from"./index-5883d406.js";import{I as B}from"./IconPhone-42aa55a2.js";import{l as W}from"./lodash-2da8a0bf.js";const q=({className:r,fill:m=!1,duotone:d=!0})=>e(T,{children:m?s("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:r,children:[e("path",{opacity:d?"0.5":"1",d:"M13.1061 22H10.8939C7.44737 22 5.72409 22 4.54903 20.9882C3.37396 19.9764 3.13025 18.2827 2.64284 14.8952L2.36407 12.9579C1.98463 10.3208 1.79491 9.00229 2.33537 7.87495C2.87583 6.7476 4.02619 6.06234 6.32691 4.69181L7.71175 3.86687C9.80104 2.62229 10.8457 2 12 2C13.1543 2 14.199 2.62229 16.2882 3.86687L17.6731 4.69181C19.9738 6.06234 21.1242 6.7476 21.6646 7.87495C22.2051 9.00229 22.0154 10.3208 21.6359 12.9579L21.3572 14.8952C20.8697 18.2827 20.626 19.9764 19.451 20.9882C18.2759 22 16.5526 22 13.1061 22Z",fill:"currentColor"}),e("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V15C11.25 14.5858 11.5858 14.25 12 14.25C12.4142 14.25 12.75 14.5858 12.75 15V18C12.75 18.4142 12.4142 18.75 12 18.75Z",fill:"currentColor"})]}):s("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:r,children:[e("path",{opacity:d?"0.5":"1",d:"M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z",stroke:"currentColor",strokeWidth:"1.5"}),e("path",{d:"M12 15L12 18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})}),C={updateApi:`${v()}/users/update_user`,updateApi2:`${v()}/users/update_status`,agentApi:`${v()}/users/user_list`},Y=()=>{const r=M(t=>t.auth.user||{}),m=c.useRef({profile:null}),d=R(),S=Z(),b=z(),[l,y]=c.useState({}),[F,I]=c.useState([]),N=c.useRef(!1),[p,w]=c.useState();c.useEffect(()=>{const t=W.debounce(async()=>{try{const n=await x.get(C.agentApi);I(n.data)}catch{b.error("Failed to fetch agents")}},500);N.current||(d(H("Account Setting")),t(),N.current=!0)},[d]);const[h,$]=c.useState("home"),[i,k]=c.useState({client_user_name:(r==null?void 0:r.client_user_name)||"",client_user_id:(r==null?void 0:r.client_user_id)||"",client_user_designation:(r==null?void 0:r.client_user_designation)||"",client_user_email:(r==null?void 0:r.client_user_email)||"",client_user_phone:(r==null?void 0:r.client_user_phone)||""}),A=t=>{$(t)},_=t=>{const{name:n,value:a}=t.target;k(f=>({...f,[n]:a}))},D=async t=>{var n,a,f;t.preventDefault();try{if(m.current.profile){const u=new FormData(m.current.profile),P=u.get("client_user_id"),g=await x.post(C.updateApi+"/"+P,u);if(g.status===200||g.status===201){const o=g.data.user;o&&(d({type:"auth/updateUser",payload:o}),localStorage.setItem("authUser",JSON.stringify(o)),k({client_user_name:o.client_user_name||"",client_user_id:o.client_user_id||"",client_user_designation:o.client_user_designation||"",client_user_email:o.client_user_email||"",client_user_phone:o.client_user_phone||""})),S("/"),y({}),b.success("Profile updated successfully")}}}catch(u){(a=(n=u.response)==null?void 0:n.data)!=null&&a.errors?y(u.response.data.errors):((f=u.response)==null?void 0:f.status)===403&&(window.location.href="/error")}},E=t=>{w(Number(t))},j=async t=>{const n=t?0:1;try{const a=await x.post(`${C.updateApi2}`,{selectedAgentId:p,client_user_status:n});(a.status===200||a.status===201)&&(b.success(`${a.data.message}`),w(void 0))}catch(a){console.error("Error updating status:",a)}};return s("div",{children:[s("ul",{className:"flex space-x-2 rtl:space-x-reverse",children:[e("li",{children:e(V,{to:"#",className:"text-primary hover:underline",children:" Users "})}),e("li",{className:"before:content-['/'] ltr:before:mr-2 rtl:before:ml-2",children:e("span",{children:"Account Settings"})})]}),s("div",{className:"pt-5",children:[e("div",{children:s("ul",{className:"sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto",children:[e("li",{className:"inline-block",children:s("button",{onClick:()=>A("home"),className:`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${h==="home"?"!border-primary text-primary":""}`,children:[e(q,{}),"Home"]})}),e("li",{className:"inline-block",children:s("button",{onClick:()=>A("danger-zone"),className:`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${h==="danger-zone"?"!border-primary text-primary":""}`,children:[e(B,{}),"Danger Zone"]})})]})}),h==="home"?e("div",{children:s("form",{ref:t=>m.current.profile=t,onSubmit:D,className:"border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black",children:[e("h6",{className:"text-lg font-bold mb-5",children:"General Information"}),s("div",{className:"flex flex-col sm:flex-row",children:[e("div",{className:"ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5",children:e("img",{src:"https://oldweb.brur.ac.bd/wp-content/uploads/2019/03/male.jpg",alt:"img",className:"w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto"})}),s("div",{className:"flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5",children:[s("div",{children:[e("label",{htmlFor:"name",children:"Full Name"}),e("input",{id:"name",name:"client_user_name",type:"text",placeholder:"Name",className:"form-input",value:i.client_user_name,onChange:_}),e("input",{id:"name",name:"client_user_id",type:"hidden",className:"form-input",value:r==null?void 0:r.client_user_id}),l.client_user_name&&e("span",{className:"text-red-500 text-sm",children:l.client_user_name})]}),s("div",{children:[e("label",{htmlFor:"profession",children:"Designation"}),e("input",{id:"profession",name:"client_user_designation",type:"text",placeholder:"Web Developer",className:"form-input",value:i.client_user_designation,onChange:_}),l.client_user_designation&&e("span",{className:"text-red-500 text-sm",children:l.client_user_designation})]}),s("div",{children:[e("label",{htmlFor:"profession",children:"Email"}),e("input",{id:"profession",name:"client_user_email",type:"text",placeholder:"Email",className:"form-input",value:i==null?void 0:i.client_user_email,onChange:_}),l.client_user_email&&e("span",{className:"text-red-500 text-sm",children:l.client_user_email})]}),s("div",{children:[e("label",{htmlFor:"profession",children:"Phone"}),e("input",{id:"profession",type:"text",name:"client_user_phone",placeholder:"Phone",className:"form-input",value:i==null?void 0:i.client_user_phone,onChange:_}),l.client_user_phone&&e("span",{className:"text-red-500 text-sm",children:l.client_user_phone})]}),e("div",{className:"sm:col-span-2 mt-3",children:e("button",{type:"submit",className:"btn btn-primary",children:" Save "})})]})]})]})}):"",h==="danger-zone"?e("div",{className:"",children:e("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-5",children:s("div",{className:"panel space-y-5",children:[e("h5",{className:"font-semibold text-lg mb-4",children:"Deactivate Account "}),e("p",{children:"The agent is no longer part of the team."}),s("select",{name:"client_user_id",className:"mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md",value:p??"",onChange:t=>E(t.target.value),children:[e("option",{value:"",children:"Select Agent"}),F.map(t=>e("option",{value:t.client_user_id,children:t.client_user_name},t.client_user_id))]}),s("label",{className:"w-12 h-6 relative",children:[e("input",{type:"checkbox",disabled:!p,className:"custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer",id:"custom_switch_checkbox7",onChange:t=>j(t.target.checked)}),e("span",{className:`block h-full rounded-full relative flex items-center justify-center transition-all duration-300 before:absolute before:left-1 before:bottom-1 before:w-4 before:h-4 before:rounded-full before:transition-all before:duration-300
                                ${p?"bg-green-500 peer-checked:bg-primary before:bg-white peer-checked:before:left-7":"bg-red-500 before:bg-gray-300 opacity-60 cursor-not-allowed"}`})]})]})})}):""]})]})};export{Y as default};
