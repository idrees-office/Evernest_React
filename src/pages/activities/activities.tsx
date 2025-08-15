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
import { useNavigate } from 'react-router-dom';

const endpoints = {
    createApi: `${getBaseUrl()}/activities/store`,
    listApi: `${getBaseUrl()}/activities/show`,
    editApi: `${getBaseUrl()}/activities/edit`,
    updateApi: `${getBaseUrl()}/activities/update`,
    reportApi: `${getBaseUrl()}/activities/report`,
    googleCreateEvent: `${getBaseUrl()}/google/create-event`,
    googleDeleteEvent: `${getBaseUrl()}/google/delete-event`,
    googleUpdateEvent: `${getBaseUrl()}/google/update-event`,
    googleEditEvent: `${getBaseUrl()}/google/edit-event`,
    
};

const Activities = () => {
    const dispatch = useDispatch<AppDispatch>();
    const toast = Toast();
    const combinedRef = useRef<any>({ fetched: false, form: null});
    const [transformedAgents, setTransformedAgents] = useState<any[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<any>({}); 
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const loginuser = useSelector((state:IRootState) => state.auth.user);
    const [events, setEvents] = useState<any>([]);
    const [isAddEventModal, setIsAddEventModal] = useState(false);
    const [params, setParams] = useState<any>(null);
    const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
    const [isGoogleConnected, setIsGoogleConnected] = useState(false);
    const navigate = useNavigate();

    const [GoogleId, SetGoogleId] = useState('');
    

    useEffect(() => {
        if (!combinedRef.current.fetched) {
            dispatch(setPageTitle('Agents Activites'));
            fetchActivities();
            checkGoogleConnection();
            combinedRef.current.fetched = true;
        }
    }, [dispatch]);

    // Check if user has Google Calendar connected
    const checkGoogleConnection = async () => {
        try {
            const response = await apiClient.get(`${getBaseUrl()}/google/check-connection`);
            setIsGoogleConnected(response.data.connected);
        } catch (error) {
            console.error('Error checking Google connection:', error);
            setIsGoogleConnected(false);
        }
    };

    const syncWithGoogleCalendar = async (eventData: any, googleEventId: string | null = null) => {
        try {
            const endpoint = googleEventId ? `${endpoints.googleUpdateEvent}/${googleEventId}` : endpoints.googleCreateEvent;
            const method = googleEventId ? 'put' : 'post';
            const response = await apiClient[method](endpoint, eventData);

            console.log(response);

            if (response.data?.google_event_id) {
                Swal.fire('Success!', 'Event synced with Google Calendar', 'success');
                SetGoogleId(response.data.google_event_id);
                return response.data.google_event_id;
            }
        } catch (error: any) {
            toast.error('Failed to sync with Google Calendar');
        }
        return null;
    };


  

    const dateFormat = (dt: any) => {
        dt = new Date(dt);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
        const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
        return `${dt.getFullYear()}-${month}-${date}T${hours}:${mins}`;
    };
    
    const fetchActivities = async () => {
        try {
            const response = await apiClient.get(endpoints.listApi);
            if(response.status === 200 || response.status === 201) {
                const data = response.data.activities;
                const agentdata = response.data.agents;
                const filterAgents = agentdata?.map((agent:any) => ({
                    value: agent?.client_user_id,
                    label: agent?.client_user_name,
                    phone: agent?.client_user_phone,
                    email: agent?.client_user_email,
                }));
                setTransformedAgents(filterAgents);
                const eventsList = data.map((activity:any) => ({
                    id: activity.id,
                    title: activity.title,
                    start: activity.start_date,
                    end: activity.end_date,
                    description: activity.description,
                    className: 'info',
                    agents: activity.agents || [],
                    google_event_id: activity.google_event_id || null
                }));
                setEvents(eventsList);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            toast.error('Failed to fetch activities');
        }
    };

    const handleModal = () => {
        setParams(null);
        if (transformedAgents.length > 0) {
             const loggedInAgent = transformedAgents.find(a => a.value == loginuser?.client_user_id);  
            setSelectedAgents(loggedInAgent);
        }
        setIsAddEventModal(true);
        if (combinedRef.current.form) {
            combinedRef.current.form.reset();
        }
    };

    const saveActivities = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!combinedRef.current.form) return;
    const form = combinedRef.current.form;
    const isEditing = params !== null;
    const syncWithGoogle = form.elements.namedItem('sync_with_google')?.checked || false;
    try {
        if (!isGoogleConnected || !syncWithGoogle) {
            throw new Error('Google Calendar connection required');
        }

        let agentIds: number[] = [];
        if (loginuser?.roles[0].name === 'super admin') {
            agentIds = selectedAgents.map(agent => agent.value);
        } else {
            agentIds = [loginuser?.client_user_id];
        }
        const formData = {
            title: form.elements.namedItem('title')?.value || '',
            description: form.elements.namedItem('description')?.value || '',
            start_date: form.elements.namedItem('start_date')?.value,
            end_date: form.elements.namedItem('end_date')?.value || form.elements.namedItem('start_date')?.value,
            timeZone: 'Asia/Dubai',
            create_meet: true,
            send_updates: 'all',
            attendees: selectedAgents.map(agent => {
                const agentInfo = transformedAgents.find(a => a.value === agent.value);
                return agentInfo?.email;
            }).filter(Boolean),
             agents: agentIds
        };
        const organizerEmail = loginuser?.client_user_email;
        if (organizerEmail && !formData.attendees.includes(organizerEmail)) {
            formData.attendees.push(organizerEmail);
        }
        let googleResponse;
        if (isEditing && GoogleId) {
            googleResponse = await apiClient.put(`${endpoints.googleUpdateEvent}/${GoogleId}`, formData);
             console.log(googleResponse);
        } else {
            googleResponse = await apiClient.post(endpoints.googleCreateEvent, formData);

        }
        const eventAgents = agentIds.map(agentId => {
            const agent = transformedAgents.find(a => a.value === agentId);
            return {
                client_user_id: agentId,
                client_user_name: agent?.label || '',
                client_user_email: agent?.email || ''
            };
        });

        if (googleResponse.status === 200) {
            toast.success('Event saved to Google Calendar successfully');
            setIsAddEventModal(false);
            const googleEvent = googleResponse.data;
            const updatedEvent = {
                id: googleEvent.db.id,
                title: googleEvent.db.title,
                start: googleEvent.db.start_date || googleEvent.db.start_date ,
                end: googleEvent.db.end_date || googleEvent.db.end_date,
                description: googleEvent.db.description,
                className: 'primary',
                agents: eventAgents,
                google_event_id: googleEvent.google.google_event_id
            };

            setEvents((prevEvents: any) => {
                if (isEditing && GoogleId) {
                    return prevEvents.map((event: any) =>
                        event.google_event_id === GoogleId
                            ? updatedEvent
                            : event
                    );
                } else {
                    return [...prevEvents, updatedEvent];
                }
            });

        }
    } catch (error: any) {
        console.error('Error saving event:', error);
        if (error.response?.status === 422) {
            setErrors(error.response.data.errors || {});
        } else {
            toast.error(error.message || 'Failed to save event to Google Calendar');
        }
    }
};

    const handleEventClick = async (clickInfo: any) => {
        try {
            const event = clickInfo.event;
            if(event.id) {
            const eventId = event.id;
            setParams(eventId);
            const { data, status, } = await apiClient.get(`${endpoints.editApi}/${eventId}`);
            SetGoogleId(data?.google_event_id)
            if (![200, 201].includes(status)) {
                console.error("Failed to fetch event details.");
                return;
            }

            setIsAddEventModal(true);
            setTimeout(() => {
                if (combinedRef.current?.form) {
                const form = combinedRef.current.form;
                form.elements.namedItem('title')?.setAttribute("value", data.title || '');
                form.elements.namedItem('start_date')?.setAttribute("value", dateFormat(data.start_date) || '');
                form.elements.namedItem('end_date')?.setAttribute("value", dateFormat(data.end_date) || '');
                const descriptionField = form.elements.namedItem('description') as HTMLTextAreaElement;
                if (descriptionField) {
                    descriptionField.value = data.description || '';
                }
                
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

    const handleEventDelete = async (googleEventId: string | null) => {
        try {
            if (isGoogleConnected && googleEventId) {
                const response =  await apiClient.delete(`${endpoints.googleDeleteEvent}/${googleEventId}`);
            }
            setEvents((prevEvents:any) => prevEvents.filter((event:any) => event.google_event_id !== googleEventId));
            toast.success('Event deleted successfully');
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('Failed to delete event');
        }
    };

    const SelectSingleAgent = (agentId: number, agentName: string) => {
        setSelectedAgent({ agent_id: agentId, agent_name: agentName });
    };  

    const exportPDF = async () => {
        let filteredEvents = events;
        let agentName = selectedAgent?.agent_name || "All Agents Report";
        
        if (selectedAgent?.agent_id) {
            try {
                const { data, status } = await apiClient.get(`${endpoints.reportApi}/${selectedAgent?.agent_id}`);
                if (status === 200 || status === 201) {
                    filteredEvents = data.activities.length > 0 ? data.activities : []; 
                    agentName = selectedAgent.agent_name; 
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
        doc.text(`Agent: ${agentName}`, 14, 20);
        const tableColumn = ["ID", "Title", "Start Date", "End Date", "Description"];
        const tableRows: any = [];
        
        if (filteredEvents.length === 0) {
            tableRows.push(["-", "No records found", "-", "-", "-"]);
        } else {
            filteredEvents.forEach((event: any) => {
                tableRows.push([
                    event.id || "-",
                    event.title || "-",
                    new Date(event.start).toLocaleString() || "-",
                    new Date(event.end).toLocaleString() || "-",
                    event.description || "-",
                ]);
            });
        }
        
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });
        
        doc.save(`Agent_Activities_Report_${agentName.replace(/ /g, '_')}.pdf`);
    };
    
    const editDate = (data: any) => {
        let obj = { event: { start: data.start, end: data.end } };
        handleEventClick(obj);
    };

    const formatDateForMySQL = (isoDate: string) => {
        return new Date(isoDate).toISOString().slice(0, 19).replace("T", " ");
    };
    
    const handleEventDrag = async (dropInfo: any) => {
        const { event } = dropInfo;
        const originalEvent = events.find((ev: any) => ev.id === event.id);
        
        if (!originalEvent) return;
        
        const updatedEvent = { 
            id: event.id, 
            start_date: formatDateForMySQL(event.startStr), 
            end_date: formatDateForMySQL(event.endStr),
            google_event_id: originalEvent.googleEventId
        };
        
        // Update local state first for responsive UI
        setEvents((prevEvents:any) => 
            prevEvents.map((ev: any) => 
                ev.id === event.id ? { ...ev, start: event.startStr, end: event.endStr } : ev
            )
        );

        try {
            // Update in our database
            const response = await apiClient.post(`${endpoints.updateApi}/${event.id}`, updatedEvent);
            
            if (response.status === 200 || response.status === 201) { 
                // If Google Calendar is connected, update there too
                if (isGoogleConnected && originalEvent.googleEventId) {
                    const googleEventData = {
                        title: originalEvent.title,
                        description: originalEvent.description,
                        start_date: formatDateForMySQL(event.startStr),
                        end_date: formatDateForMySQL(event.endStr),
                        agents: originalEvent.agents.map((agent: any) => agent.client_user_email).join(', ')
                    };
                    
                    await syncWithGoogleCalendar(googleEventData, originalEvent.googleEventId);
                }
                
                toast.success('Event updated successfully'); 
            }
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Failed to update event. Please try again.");
            // Revert local state if update fails
            setEvents((prevEvents:any) => 
                prevEvents.map((ev: any) => 
                    ev.id === event.id ? originalEvent : ev
                )
            );
        }
    };

    return (
        <div>
            <div className="panel mb-5">
                <div className="mb-4 flex justify-between items-center">
                    <div className="text-lg font-semibold">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleModal}>
                            Add Activity
                        </button>
                        {isGoogleConnected && (
                            <span className="ml-2 text-success text-sm">
                                <i className="fas fa-check-circle mr-1"></i> Connected to Google Calendar
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Select 
                            id="agentDropdown" 
                            value={transformedAgents.find(agent => agent.value === selectedAgent?.agent_id) || null} 
                            placeholder="Select an agent" 
                            options={transformedAgents}  
                            className="cursor-pointer custom-multiselect z-10 w-[300px]" 
                            onChange={(selectedOption) => { 
                                if (selectedOption?.value !== undefined) {
                                    SelectSingleAgent(selectedOption.value, selectedOption.label); 
                                }
                            }}
                        />
                        <button type="button" className="btn btn-info btn-sm" onClick={exportPDF}>
                            Export PDF
                        </button>
                    </div>
                </div>
                <div className="calendar-wrapper">
                    <FullCalendar 
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        editable={true}
                        selectable={true}
                        droppable={true}
                        eventClick={handleEventClick}
                        select={editDate}
                        eventDrop={handleEventDrag}
                        events={events}
                        eventContent={(eventInfo) => (
                            <div className="fc-event-main-frame">
                                <div className="fc-event-title-container">
                                    <div className="fc-event-title fc-sticky">
                                        {eventInfo.event.title}
                                        {eventInfo.event.extendedProps.googleEventId && (
                                            <span className="ml-1 text-xs text-success" title="Synced with Google Calendar">
                                                <i className="fab fa-google"></i>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Add/Edit Event Modal */}
            <Transition appear show={isAddEventModal} as={Fragment}>
                <Dialog as="div" onClose={() => setIsAddEventModal(false)} open={isAddEventModal} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child as={Fragment} enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button type="button" className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none" onClick={() => setIsAddEventModal(false)}>
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params ? 'Edit Activity' : 'Add New Activity'}
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
                                                    <Select id="agentDropdown" name='agents[]' 
                                                        isMulti 
                                                        placeholder="Select agents" 
                                                        options={transformedAgents}  
                                                        className="cursor-pointer custom-multiselect z-10" 
                                                        isSearchable={true}
                                                        value={selectedAgents}
                                                        onChange={(selectedOptions: any) => {
                                                            setSelectedAgents(selectedOptions || []);
                                                        }}
                                                        closeMenuOnSelect={false}
                                                        hideSelectedOptions={false}
                                                    />
                                                    {errors?.["agents.0"] && (
                                                        <p className="text-danger error">{errors["agents.0"][0]}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <label htmlFor="agentDropdown">Agent</label>
                                                    <input type="hidden" name="agents[]" value={loginuser?.client_user_id} />
                                                    <div>
                                                        <input type="text" className="form-input" value={loginuser?.client_user_name || ''} readOnly />
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div>
                                                <label htmlFor="start">From</label>
                                                <input id="start" type="datetime-local" name="start_date" className="form-input" placeholder="Event Start Date" />
                                                {errors?.start_date && <p className="text-danger error">{errors.start_date[0]}</p>}
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="end">To <small className='text-primary'>(optional)</small></label>
                                                <input id="end" type="datetime-local" name="end_date" className="form-input" placeholder="Event End Date"/>
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="description">Description</label>
                                                <textarea id="description" name="description" className="form-textarea min-h-[130px]" placeholder="Description"></textarea>
                                                {errors?.description && <p className="text-danger error">{errors.description[0]}</p>}
                                            </div>
                                            
                                            {isGoogleConnected && (
                                                    <div className="flex items-center">
                                                        <input 
                                                            type="checkbox" 
                                                            id="sync_with_google" 
                                                            name="sync_with_google" 
                                                            defaultChecked 
                                                            className="form-checkbox" 
                                                        />
                                                        <label htmlFor="sync_with_google" className="ml-2">
                                                            Sync with Google Calendar
                                                        </label>
                                                    </div>
                                                )}
                                            
                                            <div className="flex justify-end items-center gap-2">
                                                {params && (
                                                    <button type="button" className="btn btn-danger btn-sm" 
                                                        onClick={() => { handleEventDelete(GoogleId); setIsAddEventModal(false);}} >
                                                        Delete
                                                    </button>
                                                )}
                                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setIsAddEventModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-secondary btn-sm">
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