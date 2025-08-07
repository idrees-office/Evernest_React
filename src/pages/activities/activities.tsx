// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import { Fragment, useEffect, useRef, useState } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import Swal from 'sweetalert2';
// import { useDispatch, useSelector } from 'react-redux';
// import { setPageTitle } from '../../slices/themeConfigSlice';
// import IconPlus from '../../components/Icon/IconPlus';
// import IconX from '../../components/Icon/IconX';
// import { AppDispatch, IRootState } from '../../store';
// import '../dashboard/dashboard.css'; 
// import { getBaseUrl } from '../../components/BaseUrl';
// import apiClient from '../../utils/apiClient';
// import Toast from '../../services/toast';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import Select from 'react-select';

// const endpoints = {
//     createApi: `${getBaseUrl()}/activities/store`,
//     listApi: `${getBaseUrl()}/activities/show`,
//     editApi: `${getBaseUrl()}/activities/edit`,
//     updateApi: `${getBaseUrl()}/activities/update`,
//     reportApi: `${getBaseUrl()}/activities/report`,
// };

// const Activities = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const toast = Toast();
//     const combinedRef = useRef<any>({ fetched: false, form: null});
//     const [transformedAgents, setTransformedAgents] = useState<any[]>([]);
//     const [selectedAgent, setSelectedAgent] = useState<any>({}); 
//     const [errors, setErrors] = useState<Record<string, string[]>>({});
//     const loginuser = useSelector((state:IRootState) => state.auth.user)
//     useEffect(() => {
//         if (!combinedRef.current.fetched) {
//             dispatch(setPageTitle('Agents Activites'));
//             fetchActivities();
//             combinedRef.current.fetched = true;
//         }
//     }, [dispatch]);

//     const now = new Date();
//     const getMonth = (dt: Date, add: number = 0) => {
//         let month = dt.getMonth() + 1 + add;
//         const str = (month < 10 ? '0' + month : month).toString();
//         return str;
//     };
//     const [events, setEvents] = useState<any>([]);
//     const [isAddEventModal, setIsAddEventModal] = useState(false);
//     const [params, setParams] = useState<any>([]);
//     const dateFormat = (dt: any) => {
//         dt = new Date(dt);
//         const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
//         const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
//         const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
//         const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
//         dt = dt.getFullYear() + '-' + month + '-' + date + 'T' + hours + ':' + mins;
//         return dt;
//     };
//     const fetchActivities = async () => {
//         const response = await apiClient.get(endpoints.listApi);
//         if(response.status == 200 || response.status === 201){
//             const data = response.data.activities;
//             const agentdata = response.data.agents;
//             const filterAgents = agentdata?.map((agent:any) => ({
//                 value: agent?.client_user_id,
//                 label: agent?.client_user_name,
//                 phone: agent?.client_user_phone,
//             }));
//             setTransformedAgents(filterAgents)
//             let eventsList = data.map((activity:any) => ({
//                 id: activity.id || 'undefine',
//                 title: activity.title || 'undefine', 
//                 start: activity.start_date || 'undefine',
//                 end : activity.end_date || 'undefine',
//                 description: activity.description || 'undefine',
//                 className: 'info', 
//             }));
//             setTimeout(() => {
//                 setEvents((prevEvents:any) => [...new Set([...prevEvents, ...eventsList])]);
//             });
//         }
//     }
//     const handleModal = () => {
//         setParams(null)
//         setIsAddEventModal(true);
//         combinedRef.current.form?.reset();
//     };

//     const saveActivities = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!combinedRef.current.form) return;
//         const formData = new FormData(combinedRef.current.form);
//         const isEditing = params ? Number(params) : null;
//         try {
//             const response = isEditing ? await apiClient.post(`${endpoints.updateApi}/${params}`, formData)  : await apiClient.post(endpoints.createApi, formData);
//             if (response.status === 200 || response.status === 201) {
//                 toast.success(response.data.message);
//                 setIsAddEventModal(false);
//                 const data = response.data.data;
//                 const updatedEvent = {
//                     id    : data.id,
//                     title : data.title,
//                     start : data.start_date,
//                     end   : data.end_date,
//                     description : data.description,
//                     className   : 'info',
//                 };
//                 setEvents((prevEvents:any) =>
//                     isEditing ? prevEvents.map((event:any) => (event.id === data.id ? updatedEvent : event))  : [...prevEvents, updatedEvent] 
//                 );
//             }
//         } catch (error: any) {
//             if (error.response?.status === 403) {
//                 // window.location.href = '/error';
//             } else if(error.status === 422){
//                 setErrors(error.response.data)
//             }   
//             else  {
//                 toast.error('Failed to save event. Please try again.');
//                 console.error('Error saving event:', error);
//             }
//         }
//     };

//     const handleEventClick = async (clickInfo: any) => {
//         try {
//             const event = clickInfo?.event
//             if(event.id){
//                 const eventId = event.id;
//                 setParams(eventId);
//                 const { data, status } = await apiClient.get(`${endpoints.editApi}/${eventId}`);
//                 if (![200, 201].includes(status)) {
//                     console.error("Failed to fetch event details.");
//                     return;
//                 }
//                 setIsAddEventModal(true);
//                 setTimeout(() => {
//                     if (combinedRef.current?.form) {
//                         const form = combinedRef.current.form;
//                         form.elements.namedItem('title')?.setAttribute("value", data.title || '');
//                         form.elements.namedItem('start_date')?.setAttribute("value", data.start_date || '');
//                         form.elements.namedItem('end_date')?.setAttribute("value", data.end_date || '');
//                         const descriptionField = form.elements.namedItem('description') as HTMLTextAreaElement;
//                         if (descriptionField) {
//                             descriptionField.value = data.description || '';
//                         }
//                     }
//                 }, 100);
//             }else{
//                 setIsAddEventModal(true);
//                 setTimeout(() => {
//                     if (combinedRef.current?.form) {
//                         const form = combinedRef.current.form;
//                         form.elements.namedItem('start_date')?.setAttribute("value", dateFormat(event.start) || '');
//                         form.elements.namedItem('end_date')?.setAttribute("value", dateFormat(event.end) || '');
//                     }
//                 }, 100);
//             }
//         } catch (error) {
//             toast.error("Failed to load event details.");
//         }
//     };

//     const SelectSingleAgent = async (agentId: number, agentName:string) => {
//         const data = { agent_id : agentId, agent_name : agentName }
//         setSelectedAgent(data);
//     }  

//     const exportPDF = async () => {
//         let filteredEvents = events;
//         let agentName = selectedAgent?.agent_name || "All Agents Report";
//         if (selectedAgent?.agent_id) {
//             try {
//                 const { data, status } = await apiClient.get(`${endpoints.reportApi}/${selectedAgent?.agent_id}`);
//                 if (status === 200 || status === 201) {
//                     filteredEvents = data.activities.length > 0 ? data.activities : []; 
//                     agentName = selectedAgent.agent_name || 'All Agents Report'; 
//                 } else {
//                     toast.error("Failed to fetch agent-specific events.");
//                     return;
//                 }
//             } catch (error) {
//                 console.error("Error fetching agent events:", error);
//                 toast.error("Error fetching agent-specific events.");
//                 return;
//             }
//         }
//         const doc = new jsPDF();
//         doc.text(`Agent: ${agentName || 'All Agents Report'}`, 14, 20);
//         const tableColumn = ["ID", "Title", "Start Date", "End Date", "Description"];
//         const tableRows: any = [];
//         if (filteredEvents.length === 0) {
//             tableRows.push(["-", "No records found", "-", "-", "-"]);
//         } else {
//             filteredEvents.forEach((event: any) => {
//                 tableRows.push([
//                     event.id || "-",
//                     event.title || "-",
//                     event.start || "-",
//                     event.end || "-",
//                     event.description || "-",
//                 ]);
//             });
//         }
//         autoTable(doc, {
//             head: [tableColumn],
//             body: tableRows,
//             startY: 30,
//         });
//         doc.save(`Agent_Activities_Report_${agentName || 'All'}.pdf`);
//         setTimeout(() => setSelectedAgent(null), 0);
//     };
//     const editDate = (data: any) => {
//         let obj = { event: { start: data.start, end: data.end, }, };
//         handleEventClick(obj);
//     };

//     const formatDateForMySQL = (isoDate: string) => {
//         const date = new Date(isoDate);
//         return date.toISOString().slice(0, 19).replace("T", " ");
//     };
//     const handleEventDrag = async (dropInfo: any) => {
//         const { event } = dropInfo;
//         const updatedEvent = { id: event.id, start_date: formatDateForMySQL(event.startStr), end_date: formatDateForMySQL(event.endStr), };
//         setEvents((prevEvents: any) => prevEvents.map((ev: any) => (ev.id === event.id ? { ...ev, start: event.startStr, end: event.endStr } : ev)));
//         try {
//             const response = await apiClient.post(`${endpoints.updateApi}/${event.id}`, updatedEvent);
//             if (response.status === 200 || response.status === 201) { toast.success('Event updated successfully'); }
//         } catch (error) {
//             console.error("Error updating event:", error);
//             toast.error("Failed to update event. Please try again.");
//         }
//     };

//     return (
//         <div>
//             <div className="panel mb-5">
//                 <div className="mb-4 flex justify-between items-center">
//                     <div className="text-lg font-semibold">
//                         <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleModal()}>Add-Request</button></div>
//                     <div className="flex gap-2">
//                         <Select id="agentDropdown" value={transformedAgents.find(agent => agent.value === selectedAgent?.agent_id) || null} placeholder="Select an option" options={transformedAgents}  className="cursor-pointer custom-multiselect z-10 w-[300px]" onChange={(selectedOption) => { if (selectedOption?.value !== undefined) SelectSingleAgent(selectedOption.value, selectedOption.label); }}/>
//                         <button type="button" className="btn btn-info btn-sm" onClick={exportPDF}> Export PDF </button>
//                     </div>
//                 </div>
//                 <div className="calendar-wrapper">
//                     <FullCalendar
//                         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//                         initialView="dayGridMonth"
//                         headerToolbar={{
//                             left: 'prev,next',
//                             center: 'title',
//                             right: 'dayGridMonth,timeGridWeek,timeGridDay',
//                         }}
//                         editable={true}
//                         dayMaxEvents={true}
//                         selectable={true}
//                         droppable={true}
//                         eventClick={(event: any) => handleEventClick(event)}
//                         select={(event: any) => editDate(event)}
//                         eventDrop={handleEventDrag}
//                         // eventResize={handleEventResize}
//                         events={events}
//                     />
//                 </div>
//             </div>
//             <Transition appear show={isAddEventModal} as={Fragment}>
//                 <Dialog as="div" onClose={() => setIsAddEventModal(false)} open={isAddEventModal} className="relative z-[51]">
//                     <Transition.Child as={Fragment} enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
//                     <Dialog.Overlay className="fixed inset-0 bg-[black]/60" />
//                     </Transition.Child>
//                     <div className="fixed inset-0 overflow-y-auto">
//                         <div className="flex min-h-full items-center justify-center px-4 py-8">
//                             <Transition.Child as={Fragment} enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
//                                 <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
//                                     <button type="button" className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none" onClick={() => setIsAddEventModal(false)} > <IconX /> </button>
//                                     <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
//                                         {params ? 'Edit Activities' : 'Meeting Request'}
//                                     </div>
//                                     <div className="p-5">
//                                         <form className="space-y-5" ref={(el) => (combinedRef.current.form = el)} onSubmit={saveActivities}>
//                                             <div>
//                                                 <label htmlFor="title">Title</label>
//                                                 <input id="title" type="text" name="title" className="form-input" placeholder="Title" />
//                                                 <div className="text-danger" id="titleErr"></div>
//                                                 {errors?.title && <p className="text-danger error">{errors.title[0]}</p>}
//                                             </div>
//                                             {loginuser?.roles[0].name === 'super admin' ? (
//                                             <div>
//                                                 <label htmlFor="agentDropdown">Agent</label>
//                                                 <Select 
//                                                     id="agentDropdown" 
//                                                     name='agents[]' 
//                                                     isMulti 
//                                                     placeholder="Select agents" 
//                                                     options={transformedAgents}  
//                                                     className="cursor-pointer custom-multiselect z-10" 
//                                                     isSearchable={true} 
//                                                 />
//                                                 {errors?.["agents.0"] && (
//                                                     <p className="text-danger error">{errors["agents.0"][0]}</p>
//                                                 )}
//                                             </div>
//                                         ) : (
//                                             <div>
//                                                 <label htmlFor="agentDropdown">Agent</label>
//                                                 <Select 
//                                                     id="agentDropdown" 
//                                                     name='agents[]' 
//                                                     placeholder="Agent" 
//                                                     options={transformedAgents.filter(agent => agent.value === loginuser?.client_user_id )}  
//                                                     className="cursor-pointer custom-multiselect z-10" 
//                                                     isSearchable={false}
//                                                     value={transformedAgents.filter(agent => agent.value === loginuser?.client_user_id )}
//                                                 />
//                                             </div>
//                                         )}
//                                             <div>
//                                                 <label htmlFor="dateStart">From</label>
//                                                 <input id="start" type="datetime-local" name="start_date" className="form-input" placeholder="Event Start Date" />
//                                                 <div className="text-danger" id="startDateErr"></div>
//                                                 {errors?.start_date && <p className="text-danger error">{errors.start_date[0]}</p>}
//                                             </div>
//                                             <div>
//                                                 <label htmlFor="dateend">To, <small className='text-primary'>optional</small> </label>
//                                                 <input id="dateend" type="datetime-local" name="end_date" className="form-input" placeholder="Event End Date"/>
//                                                 <div className="text-danger" id="startDateErr"></div>
//                                             </div>
//                                             <div>
//                                                 <label htmlFor="description1">Description</label>
//                                                 <textarea id="description1" name="description" className="form-textarea min-h-[130px]" placeholder="Description" ></textarea>
//                                                  {errors?.description && <p className="text-danger error">{errors.description[0]}</p>}
//                                             </div>
//                                             <div className="flex justify-end items-center">
//                                                 <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setIsAddEventModal(false)}> Cancel </button>
//                                                 <button type="submit" className="btn btn-secondary btn-sm ltr:ml-4 rtl:mr-4">
//                                                      {params ? 'Update' : 'Submit'}
//                                                 </button>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </Dialog.Panel>
//                             </Transition.Child>
//                         </div>
//                     </div>
//                 </Dialog>
//             </Transition>
//         </div>
//     );
// };

// export default Activities;


import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../slices/themeConfigSlice';
import IconPlus from '../../components/Icon/IconPlus';
import IconX from '../../components/Icon/IconX';
import { AppDispatch, IRootState } from '../../store';
import '../dashboard/dashboard.css'; 
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import Toast from '../../services/toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Select from 'react-select';

const endpoints = {
    createApi: `${getBaseUrl()}/activities/store`,
    listApi: `${getBaseUrl()}/activities/show`,
    editApi: `${getBaseUrl()}/activities/edit`,
    updateApi: `${getBaseUrl()}/activities/update`,
    reportApi: `${getBaseUrl()}/activities/report`,
};

const Activities = () => {
    const dispatch = useDispatch<AppDispatch>();
    const toast = Toast();
    const combinedRef = useRef<any>({ fetched: false, form: null});
    const [transformedAgents, setTransformedAgents] = useState<any[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<any>({}); 
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const loginuser = useSelector((state:IRootState) => state.auth.user)
    useEffect(() => {
        if (!combinedRef.current.fetched) {
            dispatch(setPageTitle('Agents Activites'));
            fetchActivities();
            combinedRef.current.fetched = true;
        }
    }, [dispatch]);

    const now = new Date();
    const getMonth = (dt: Date, add: number = 0) => {
        let month = dt.getMonth() + 1 + add;
        const str = (month < 10 ? '0' + month : month).toString();
        return str;
    };
    const [events, setEvents] = useState<any>([]);
    const [isAddEventModal, setIsAddEventModal] = useState(false);
    const [params, setParams] = useState<any>(null);
    const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
    
    const dateFormat = (dt: any) => {
        dt = new Date(dt);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
        const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
        dt = dt.getFullYear() + '-' + month + '-' + date + 'T' + hours + ':' + mins;
        return dt;
    };
    
    const fetchActivities = async () => {
        const response = await apiClient.get(endpoints.listApi);
        if(response.status == 200 || response.status === 201){
            const data = response.data.activities;
            const agentdata = response.data.agents;
            const filterAgents = agentdata?.map((agent:any) => ({
                value: agent?.client_user_id,
                label: agent?.client_user_name,
                phone: agent?.client_user_phone,
            }));
            setTransformedAgents(filterAgents)
            let eventsList = data.map((activity:any) => ({
                id: activity.id || 'undefine',
                title: activity.title || 'undefine', 
                start: activity.start_date || 'undefine',
                end : activity.end_date || 'undefine',
                description: activity.description || 'undefine',
                className: 'info', 
                agents: activity.agents || []
            }));
            setTimeout(() => {
                setEvents((prevEvents:any) => [...new Set([...prevEvents, ...eventsList])]);
            });
        }
    }
    
    const handleModal = () => {
        setParams(null);
        setSelectedAgents([]);
        setIsAddEventModal(true);
        if (combinedRef.current.form) {
            combinedRef.current.form.reset();
        }
    };

    const saveActivities = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!combinedRef.current.form) return;
        const formData = new FormData(combinedRef.current.form);
        const isEditing = params !== null;
        
        try {
            const response = isEditing 
                ? await apiClient.post(`${endpoints.updateApi}/${params}`, formData)  
                : await apiClient.post(endpoints.createApi, formData);
                
            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message);
                setIsAddEventModal(false);
                const data = response.data.data;
                const updatedEvent = {
                    id: data.id,
                    title: data.title,
                    start: data.start_date,
                    end: data.end_date,
                    description: data.description,
                    className: 'info',
                    agents: data.agents || []
                };
                
                setEvents((prevEvents:any) =>
                    isEditing 
                        ? prevEvents.map((event:any) => (event.id === data.id ? updatedEvent : event))  
                        : [...prevEvents, updatedEvent] 
                );
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                // window.location.href = '/error';
            } else if(error.response?.status === 422){
                setErrors(error.response.data.errors || {})
            } else {
                toast.error('Failed to save event. Please try again.');
                console.error('Error saving event:', error);
            }
        }
    };

    const handleEventClick = async (clickInfo: any) => {
        try {
            const event = clickInfo.event;
            if(event.id){
                const eventId = event.id;
                setParams(eventId);
                const { data, status } = await apiClient.get(`${endpoints.editApi}/${eventId}`);
                
                if (![200, 201].includes(status)) {
                    console.error("Failed to fetch event details.");
                    return;
                }
                
                setIsAddEventModal(true);
                setTimeout(() => {
                    if (combinedRef.current?.form) {
                        const form = combinedRef.current.form;
                        
                        // Set basic fields
                        form.elements.namedItem('title')?.setAttribute("value", data.title || '');
                        form.elements.namedItem('start_date')?.setAttribute("value", dateFormat(data.start_date) || '');
                        form.elements.namedItem('end_date')?.setAttribute("value", dateFormat(data.end_date) || '');
                        
                        const descriptionField = form.elements.namedItem('description') as HTMLTextAreaElement;
                        if (descriptionField) {
                            descriptionField.value = data.description || '';
                        }
                        
                        // Handle agents selection
                        if (data.agents && data.agents.length > 0) {
                            const agentValues = data.agents.map((agent: any) => ({
                                value: agent.client_user_id,
                                label: agent.client_user_name
                            }));
                            setSelectedAgents(agentValues);
                        } else {
                            setSelectedAgents([]);
                        }
                    }
                }, 100);
            } else {
                setIsAddEventModal(true);
                setTimeout(() => {
                    if (combinedRef.current?.form) {
                        const form = combinedRef.current.form;
                        form.elements.namedItem('start_date')?.setAttribute("value", dateFormat(event.start) || '');
                        form.elements.namedItem('end_date')?.setAttribute("value", dateFormat(event.end) || '');
                    }
                }, 100);
            }
        } catch (error) {
            toast.error("Failed to load event details.");
            console.error("Error loading event details:", error);
        }
    };

    const SelectSingleAgent = async (agentId: number, agentName:string) => {
        const data = { agent_id : agentId, agent_name : agentName }
        setSelectedAgent(data);
    }  

    const exportPDF = async () => {
        let filteredEvents = events;
        let agentName = selectedAgent?.agent_name || "All Agents Report";
        if (selectedAgent?.agent_id) {
            try {
                const { data, status } = await apiClient.get(`${endpoints.reportApi}/${selectedAgent?.agent_id}`);
                if (status === 200 || status === 201) {
                    filteredEvents = data.activities.length > 0 ? data.activities : []; 
                    agentName = selectedAgent.agent_name || 'All Agents Report'; 
                } else {
                    toast.error("Failed to fetch agent-specific events.");
                    return;
                }
            } catch (error) {
                console.error("Error fetching agent events:", error);
                toast.error("Error fetching agent-specific events.");
                return;
            }
        }
        const doc = new jsPDF();
        doc.text(`Agent: ${agentName || 'All Agents Report'}`, 14, 20);
        const tableColumn = ["ID", "Title", "Start Date", "End Date", "Description"];
        const tableRows: any = [];
        if (filteredEvents.length === 0) {
            tableRows.push(["-", "No records found", "-", "-", "-"]);
        } else {
            filteredEvents.forEach((event: any) => {
                tableRows.push([
                    event.id || "-",
                    event.title || "-",
                    event.start || "-",
                    event.end || "-",
                    event.description || "-",
                ]);
            });
        }
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });
        doc.save(`Agent_Activities_Report_${agentName || 'All'}.pdf`);
        setTimeout(() => setSelectedAgent(null), 0);
    };
    
    const editDate = (data: any) => {
        let obj = { event: { start: data.start, end: data.end, }, };
        handleEventClick(obj);
    };

    const formatDateForMySQL = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toISOString().slice(0, 19).replace("T", " ");
    };
    
    const handleEventDrag = async (dropInfo: any) => {
        const { event } = dropInfo;
        const updatedEvent = { 
            id: event.id, 
            start_date: formatDateForMySQL(event.startStr), 
            end_date: formatDateForMySQL(event.endStr), 
        };
        
        setEvents((prevEvents: any) => 
            prevEvents.map((ev: any) => 
                ev.id === event.id ? { ...ev, start: event.startStr, end: event.endStr } : ev
            )
        );
        
        try {
            const response = await apiClient.post(`${endpoints.updateApi}/${event.id}`, updatedEvent);
            if (response.status === 200 || response.status === 201) { 
                toast.success('Event updated successfully'); 
            }
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Failed to update event. Please try again.");
        }
    };

    return (
        <div>
            <div className="panel mb-5">
                <div className="mb-4 flex justify-between items-center">
                    <div className="text-lg font-semibold">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleModal()}>Add-Request</button></div>
                    <div className="flex gap-2">
                        <Select 
                            id="agentDropdown" 
                            value={transformedAgents.find(agent => agent.value === selectedAgent?.agent_id) || null} 
                            placeholder="Select an option" 
                            options={transformedAgents}  
                            className="cursor-pointer custom-multiselect z-10 w-[300px]" 
                            onChange={(selectedOption) => { 
                                if (selectedOption?.value !== undefined) {
                                    SelectSingleAgent(selectedOption.value, selectedOption.label); 
                                }
                            }}
                        />
                        <button type="button" className="btn btn-info btn-sm" onClick={exportPDF}> Export PDF </button>
                    </div>
                </div>
                <div className="calendar-wrapper">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        editable={true}
                        dayMaxEvents={true}
                        selectable={true}
                        droppable={true}
                        eventClick={(event: any) => handleEventClick(event)}
                        select={(event: any) => editDate(event)}
                        eventDrop={handleEventDrag}
                        events={events}
                    />
                </div>
            </div>
            <Transition appear show={isAddEventModal} as={Fragment}>
                <Dialog as="div" onClose={() => setIsAddEventModal(false)} open={isAddEventModal} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <Dialog.Overlay className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child as={Fragment} enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button type="button" className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none" onClick={() => setIsAddEventModal(false)} > <IconX /> </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params ? 'Edit Activities' : 'Meeting Request'}
                                    </div>
                                    <div className="p-5">
                                        <form className="space-y-5" ref={(el) => (combinedRef.current.form = el)} onSubmit={saveActivities}>
                                            <div>
                                                <label htmlFor="title">Title</label>
                                                <input id="title" type="text" name="title" className="form-input" placeholder="Title" />
                                                {errors?.title && <p className="text-danger error">{errors.title[0]}</p>}
                                            </div>
                                            {loginuser?.roles[0].name === 'super admin' ? (
                                                <div>
                                                    <label htmlFor="agentDropdown">Agent</label>
                                                    <Select 
                                                        id="agentDropdown" 
                                                        name='agents[]' 
                                                        isMulti 
                                                        placeholder="Select agents" 
                                                        options={transformedAgents}  
                                                        className="cursor-pointer custom-multiselect z-10" 
                                                        isSearchable={true}
                                                        value={selectedAgents}
                                                        onChange={(selectedOptions:any) => {
                                                            setSelectedAgents(selectedOptions || []);
                                                        }}
                                                    />
                                                    {errors?.["agents.0"] && (
                                                        <p className="text-danger error">{errors["agents.0"][0]}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <label htmlFor="agentDropdown">Agent</label>
                                                    <Select 
                                                        id="agentDropdown" 
                                                        name='agents[]' 
                                                        placeholder="Agent" 
                                                        options={transformedAgents.filter(agent => agent.value === loginuser?.client_user_id )}  
                                                        className="cursor-pointer custom-multiselect z-10" 
                                                        isSearchable={false}
                                                        value={transformedAgents.filter(agent => agent.value === loginuser?.client_user_id )}
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <label htmlFor="dateStart">From</label>
                                                <input id="start" type="datetime-local" name="start_date" className="form-input" placeholder="Event Start Date" />
                                                {errors?.start_date && <p className="text-danger error">{errors.start_date[0]}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="dateend">To, <small className='text-primary'>optional</small> </label>
                                                <input id="dateend" type="datetime-local" name="end_date" className="form-input" placeholder="Event End Date"/>
                                            </div>
                                            <div>
                                                <label htmlFor="description1">Description</label>
                                                <textarea id="description1" name="description" className="form-textarea min-h-[130px]" placeholder="Description" ></textarea>
                                                {errors?.description && <p className="text-danger error">{errors.description[0]}</p>}
                                            </div>
                                            <div className="flex justify-end items-center">
                                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setIsAddEventModal(false)}> Cancel </button>
                                                <button type="submit" className="btn btn-secondary btn-sm ltr:ml-4 rtl:mr-4">
                                                    {params ? 'Update' : 'Submit'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Activities;
