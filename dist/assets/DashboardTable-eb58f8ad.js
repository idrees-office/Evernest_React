import{r as e,j as r,a as h}from"./index-5883d406.js";import{l as P}from"./lodash-2da8a0bf.js";import{N as w}from"./index-ec7ab6e9.js";const j=({columns:n,rows:d,title:g})=>{const[o,m]=e.useState(1),u=[10,20,30,50,100],[t,y]=e.useState(u[0]),[s,S]=e.useState([]),[f,p]=e.useState([]),[l,x]=e.useState(""),[i,D]=e.useState({columnAccessor:"id",direction:"asc"});e.useEffect(()=>{const a=d.filter(N=>n.some(E=>String(N[E.accessor]||"").toLowerCase().includes(l.toLowerCase()))),c=P.sortBy(a,i.columnAccessor);S(i.direction==="desc"?c.reverse():c),m(1)},[d,l,n,i]),e.useEffect(()=>{const a=(o-1)*t,c=a+t;p(s.slice(a,c))},[o,t,s]);const v=`Showing ${Math.min((o-1)*t+1,s.length)} to ${Math.min(o*t,s.length)} of ${s.length} entries`;return r("div",{children:h("div",{className:"panel mt-6",children:[h("div",{className:"flex md:items-center md:flex-row flex-col mb-5 gap-5",children:[r("h5",{className:"font-semibold text-lg dark:text-white-light",children:g}),r("div",{className:"ltr:ml-auto rtl:mr-auto",children:r("input",{type:"text",className:"form-input w-auto",placeholder:"Search...",value:l,onChange:a=>x(a.target.value)})})]}),r(w,{records:f,columns:n,totalRecords:s.length,recordsPerPage:t,page:o,onPageChange:m}),r("div",{className:"mt-4 text-sm text-gray-600 dark:text-gray-400",children:v})]})})};export{j as D};
