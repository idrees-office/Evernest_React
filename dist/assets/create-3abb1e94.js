import{f as k,u as D,c as F,T as C,b as _,r as c,g as T,s as E,j as e,a as l,h as j,S as B}from"./index-7836fd15.js";import{l as g}from"./index-86e471de.js";/* empty css                   *//* empty css              */import{S as z}from"./react-select.esm-183c7593.js";import{o as b}from"./status-47ec63e3.js";import"./_baseIsEqual-3873d123.js";import"./objectWithoutPropertiesLoose-f3b3ace0.js";import"./extends-4c19d496.js";import"./floating-ui.dom.browser.min-b8726d47.js";import"./IconThumbUp-dd89f5a9.js";import"./IconTrash-4efbbb8e.js";const U=()=>{const{id:o}=k(),h=!!o,m=D(),f=F(),x=C();_(a=>a.blogs.success);const i=c.useRef(null),[N,u]=c.useState(null),[t,v]=c.useState({}),[d,S]=c.useState(""),[p,w]=c.useState("");return c.useEffect(()=>{var a;h==!0?m(T(Number(o))).unwrap().then(s=>{if(i.current){const n=i.current;n.querySelector('input[name="title"]').value=s.title||"",n.slug.value=s.slug||"",n.seo_title.value=s.seo_title||"",u(s.status||"")}}).catch(s=>{}):((a=i.current)==null||a.reset(),u(null)),m(E("Create Blogs"))},[m,h,o]),e("div",{children:e("div",{className:"flex flex-col xl:flex-row",children:l("div",{className:"panel flex-1 px-2 py-2",children:[l("div",{className:"flex justify-between items-center",children:[e("h5",{className:"text-lg font-semibold dark:text-white-light"}),e("a",{onClick:()=>f("/pages/blogs/list"),className:"btn btn-secondary btn-sm mt-2 cursor-pointer",children:" Back "})]}),l("form",{encType:"multipart/form-data",ref:i,onSubmit:async a=>{if(a.preventDefault(),!i.current)return;const s=new FormData(i.current),n=d==="<p><br></p>"||d.trim()===""?"":d,y=p==="<p><br></p>"||p.trim()===""?"":p;s.append("description",n),s.append("seo_description",y);try{const r=await m(j({formData:s,id:Number(o)}));[200,201].includes(r.payload.status)?(x.success(r.payload.data.message),i.current.reset(),f("/pages/blogs/list")):v(r.payload)}catch(r){B.fire("Error:",r.message||r)}},children:[e("hr",{className:"my-6 border-[#e0e6ed] dark:border-[#1b2e4b]"}),e("div",{className:"mt-8 px-4",children:e("div",{className:"flex flex-col justify-between lg:flex-row",children:l("div",{className:"mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6",children:[l("div",{className:"mt-4 items-center",children:[e("label",{htmlFor:"titlemark",className:"text-white-dark",children:" Title "}),e("input",{id:"titlemark",autoComplete:"off",type:"text",className:"form-input flex-1",placeholder:"Title",name:"title"}),(t==null?void 0:t.title)&&e("p",{className:"text-danger error",children:t.title[0]})]}),l("div",{className:"mt-4 items-center",children:[e("label",{htmlFor:"description",className:"text-white-dark",children:"  Description "}),e(g,{theme:"snow",placeholder:"Description",value:d,onChange:S}),(t==null?void 0:t.description)&&e("p",{className:"text-danger error",children:t.description[0]})]}),l("div",{className:"mt-4",children:[e("label",{htmlFor:"slugmark",className:"text-white-dark",children:" Slug"}),e("input",{id:"slugmark",autoComplete:"off",type:"text",className:"form-input flex-1",placeholder:"Slug",name:"slug"}),(t==null?void 0:t.slug)&&e("p",{className:"text-danger error",children:t.slug[0]})]}),l("div",{className:"mt-4",children:[e("label",{htmlFor:"seotitle",className:"text-white-dark",children:" Seo Title "}),e("input",{id:"seotitle",autoComplete:"off",type:"text",className:"form-input flex-1",placeholder:"Seo Title",name:"seo_title"}),(t==null?void 0:t.seo_title)&&e("p",{className:"text-danger error",children:t.seo_title[0]})]}),l("div",{className:"mt-4",children:[e("label",{htmlFor:"seotitle",className:"text-white-dark",children:" Seo Description "}),e(g,{theme:"snow",placeholder:"SEO Description",value:p,onChange:w}),(t==null?void 0:t.seo_description)&&e("p",{className:"text-danger error",children:t.seo_description[0]})]}),l("div",{className:"mt-4 items-center",children:[e("label",{htmlFor:"ctnFile",className:"text-white-dark",children:" Image "}),e("input",{id:"ctnFile",type:"file",className:"form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-secondary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary",name:"blogs_image"})]}),l("div",{className:"mt-4",children:[e("label",{htmlFor:"ctnstatus",className:"text-white-dark",children:" Status "}),e(z,{placeholder:"Select an option",name:"status",options:b,value:b.find(a=>a.value==N),onChange:a=>{u(a.value)}}),(t==null?void 0:t.status)&&e("p",{className:"text-danger error",children:t.status[0]})]}),e("div",{className:"mt-4",children:e("button",{className:"btn btn-secondary w-full",children:"Save"})})]})})})]})]})})})};export{U as default};
