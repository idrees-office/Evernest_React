import { useState, useEffect, useRef } from 'react';
import { Disclosure } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import { setPageTitle } from '../../slices/themeConfigSlice';
import IconMail from '../../components/Icon/IconMail';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconBookmark from '../../components/Icon/IconBookmark';
import IconVideo from '../../components/Icon/IconVideo';
import IconRefresh from '../../components/Icon/IconRefresh';
import IconMenu from '../../components/Icon/IconMenu';
import IconSearch from '../../components/Icon/IconSearch';
import IconUser from '../../components/Icon/IconUser';
import IconArrowLeft from '../../components/Icon/IconArrowLeft';
import IconPrinter from '../../components/Icon/IconPrinter';
import { topBarStatus, SidebarStatus, MatchColorList, DropdownOption } from '../../services/status';
import { Leadslist } from '../../slices/dashboardSlice';
import IconPhone from '../../components/Icon/IconPhone';
import Select from 'react-select';
import { updateSingleLead } from '../../slices/dashboardSlice';
import Toast from '../../services/toast';


const DashboardBox = () => {
    const dispatch        = useDispatch<AppDispatch>();
    const TopbarStatuses  = topBarStatus();
    const SidebarStatuses = SidebarStatus();
    const colorsarray     = MatchColorList();
    const dropdownOption  = DropdownOption();
    const combinedRef     = useRef<any>({ fetched: false, form: null, topbarButtonRefs: {} as Record<number, HTMLButtonElement | null>, });
    const toast           = Toast();
    const loginuser       = useSelector((state: IRootState) => state.auth.user || {});
    const leads           = useSelector((state: IRootState) => state.leadsslice.leads);
    const currentStatus   = useSelector((state: IRootState) => state.leadsslice.lead_status);
    const [AllLeadList, setAllLeadList] = useState<any[]>([]);
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [selectedTab, setSelectedTab] = useState<any>();

    const [isShowMailMenu, setIsShowMailMenu] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [searchText, setSearchText] = useState<any>('');
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [pager, setPager] = useState<any>({
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        startIndex: 0,
        endIndex: 0,
    });

    useEffect(() => {
        if (loginuser?.client_user_id && !combinedRef.current.fetched) {
            const formData = new FormData();
            formData.append('client_user_id', loginuser.client_user_id);
            dispatch(Leadslist({ formData })); // this is will fetch all leads on page load
            combinedRef.current.fetched = true;
        }
    }, [loginuser?.client_user_id, dispatch]);
 
    // once lead loaded and globale state is set from dashboardSlice .. it will set the current page state as well
    useEffect(() => {
        if(currentStatus > 0){            
            getLeads(currentStatus);
        }else{
            setAllLeadList(leads || []);
        }
    }, [leads]);

    useEffect(() => {
        const totalPages = Math.ceil(AllLeadList.length / pager.pageSize);
        const startIndex = (pager.currentPage - 1) * pager.pageSize;
        const endIndex = Math.min(startIndex + pager.pageSize, AllLeadList.length);
        setPager((prev:any) => ({
            ...prev,
            totalPages,
            startIndex,
            endIndex,
        }));
    }, [AllLeadList, pager.currentPage, pager.pageSize]);

    const getNotesByLeadStatus = (leadStatus:number) => {    
        const option = TopbarStatuses.find((opt) => opt.value == leadStatus);
        return option && typeof option.notes === "string" ? option.notes : "Unknown Status";
    };
    const getNotes2ByLeadStatus = (leadStatus:number) => {
        const option = TopbarStatuses.find((opt) => opt.value == leadStatus);
        return option && typeof option.notes2 === 'string' ? option.notes2 : 'Unknown Status';
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (combinedRef.current.form) {
            const formData = new FormData(combinedRef.current.form);
            const selectedStatus = formData.get('lead_status');
            try {
                    const response = await dispatch(updateSingleLead({ formData }) as any);
                    if (response.payload.status === 200 || response.payload.status === 201){
                        setSelectedLead(null);
                    }else{
                        setErrors(response.payload.errors);
                        return
                    }
                } catch (error: any) {
                    console.error('Error creating/updating news:', error);
            }
        }
    }

    const getLeads = (status: number) => {
        const filterLead = leads.filter((lead: any) => lead.lead_status == status);        
        setAllLeadList(filterLead);
        setSelectedTab(status);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pager.totalPages) {
            setPager((prev:any) => ({
                ...prev,
                currentPage: newPage,
            }));
        }
    };

    return (
        <div>
            <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
                <div className={`overlay bg-black/60 z-[5] w-full h-full rounded-md absolute hidden ${isShowMailMenu ? '!block xl:!hidden' : ''}`} onClick={() => setIsShowMailMenu(!isShowMailMenu)}
                ></div>
                <div className={`panel xl:block p-4 dark:gray-50 w-[250px] max-w-full flex-none space-y-3 xl:relative absolute z-10 xl:h-auto h-full hidden ltr:xl:rounded-r-md ltr:rounded-r-none rtl:xl:rounded-l-md rtl:rounded-l-none overflow-hidden ${isShowMailMenu ? '!block' : '' }`}>
                    <div className="flex flex-col h-full pb-16">
                        {/* onClick={() => openMail('add', null)} */}
                        <div className="pb-5"> <button className="btn btn-primary w-full" type="button"> Add Lead </button>
                        </div>
                        <PerfectScrollbar className="relative ltr:pr-3.5 rtl:pl-3.5 ltr:-mr-3.5 rtl:-ml-3.5 h-full grow">
                            <div className="space-y-1">
                                {
                                    SidebarStatuses.map((sidebarstatus) => (
                                        <button key={sidebarstatus?.value} type="button" className={`w-full flex justify-between items-center p-2 hover:bg-white-dark/10 rounded-md dark:hover:text-primary hover:text-primary dark:hover:bg-[#181F32] font-medium h-10`}  onClick={() => getLeads(sidebarstatus?.value,)} >
                                        <div className="flex items-center">
                                            {sidebarstatus.icon}
                                            <div className="ltr:ml-3 rtl:mr-3">{sidebarstatus?.label}</div>
                                        </div>
                                        <div className="bg-primary-light dark:bg-[#060818] rounded-md py-0.5 px-2 font-semibold whitespace-nowrap">
                                            24
                                        </div>
                                    </button>
                                    ))
                                }
                                <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
                                <button type="button" className={`w-full flex justify-between items-center p-2 hover:bg-white-dark/10 rounded-md dark:hover:text-primary hover:text-primary dark:hover:bg-[#181F32] font-medium h-10`}>
                                    <div className="flex items-center">
                                        <IconVideo className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">New meeting</div>
                                    </div>
                                </button>
                                <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
                <div className="panel p-0 flex-1 overflow-x-hidden h-full">
                    {!selectedLead && !isEdit && (
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center flex-wrap-reverse gap-4 p-4">
                                <div className="flex items-center w-full sm:w-auto">
                                    <div className="ltr:mr-4 rtl:ml-4">
                                        <Tippy content="Refresh">
                                            <button type="button" className="hover:text-primary flex items-center">
                                                <IconRefresh />
                                            </button>
                                        </Tippy>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center sm:w-auto w-full">
                                    <div className="flex items-center ltr:mr-4 rtl:ml-4">
                                        <button type="button" className="xl:hidden hover:text-primary block ltr:mr-3 rtl:ml-3" onClick={() => setIsShowMailMenu(!isShowMailMenu)}>
                                            <IconMenu />
                                        </button>
                                        <div className="relative group">
                                            <input type="text" className="form-input ltr:pr-8 rtl:pl-8 peer" placeholder="Search Mail" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                                            <div className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                                <IconSearch />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
                            <div className="flex flex-wrap flex-col md:flex-row xl:w-auto justify-between items-center px-4 pb-4">
                                <div className="w-full sm:w-auto grid grid-cols-4 sm:grid-cols-7 gap-1 mt-4">
                                    {TopbarStatuses.map((status) => (
                                        <button 
                                            key={status.value} 
                                            onClick={() => getLeads(status.value)}  
                                            type="button"  
                                            className={`btn ${selectedTab === status.value ? status.activeColor : status.outlineColor} flex`}
                                        > 
                                            {status.icon} {status.label}  
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 md:flex-auto flex-1">
                                    <div className="flex items-center md:justify-end justify-center">
                                        <div className="ltr:mr-3 rtl:ml-3"> {pager.startIndex + 1 + '-' + (pager.endIndex) + ' of ' + AllLeadList.length} </div>
                                        <button onClick={() => handlePageChange(pager.currentPage - 1)} type="button" disabled={pager.currentPage === 1}
                                            className="bg-[#f4f4f4] rounded-md p-1 enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 ltr:mr-3 rtl:ml-3 disabled:opacity-60 disabled:cursor-not-allowed">
                                            <IconCaretDown className="w-5 h-5 rtl:-rotate-90 rotate-90" />
                                        </button>
                                        <button onClick={() => handlePageChange(pager.currentPage + 1)} type="button" disabled={pager.currentPage === pager.totalPages} className="bg-[#f4f4f4] rounded-md p-1 enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 disabled:opacity-60 disabled:cursor-not-allowed"> <IconCaretDown className="w-5 h-5 rtl:rotate-90 -rotate-90" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
                                {AllLeadList.length ? (
                                    <div className="table-responsive grow overflow-y-auto sm:min-h-[300px] min-h-[400px]">
                                        <table className="table-hover">
                                            <tbody>
                                              { AllLeadList.slice(pager.startIndex, pager.endIndex).map((lead: any) => {
                                                    return (
                                                        <tr key={lead.lead_id} className="cursor-pointer" onClick={() => setSelectedLead(lead)}>
                                                            <td>
                                                                <div className="flex items-center whitespace-nowrap">
                                                                    <div className="ltr:mr-3 rtl:ml-3">
                                                                        <Tippy content="Important">
                                                                            <button type="button" className={`enabled:hover:text-primary disabled:opacity-60 rotate-90 flex items-center ${ lead.isImportant ? 'text-primary' : ''
                                                                                }`} disabled={selectedTab === 'trash'}>
                                                                                <IconBookmark bookmark={false} className={`w-4.5 h-4.5 ${lead.isImportant && 'fill-primary'}`} />
                                                                            </button>
                                                                        </Tippy>
                                                                    </div>
                                                                    <div className={`dark:text-gray-300 whitespace-nowrap font-semibold ${ !lead.isUnread ? 'text-gray-500 dark:text-gray-500 font-normal' : ''}`}
                                                                    > {lead?.lead_title || 'Not Found'}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flex items-center whitespace-nowrap">
                                                                    <div className="ltr:mr-1 rtl:ml-1">
                                                                        <Tippy content="Important">
                                                                            <button
                                                                                type="button" className={`enabled:hover:text-primary disabled:opacity-60 flex items-center ${ 
                                                                                    lead.isImportant ? 'text-primary' : ''
                                                                                }`}>
                                                                                <IconUser/>
                                                                            </button>
                                                                        </Tippy>
                                                                    </div>
                                                                    <div className={`dark:text-gray-300 whitespace-nowrap font-semibold ${ !lead.isUnread ? 'text-gray-500 dark:text-gray-500 font-normal' : ''}`}
                                                                    > {lead?.customer_name || 'Not Found'}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flex items-center whitespace-nowrap">
                                                                    <div className="ltr:mr-1 rtl:ml-1">
                                                                        <Tippy content="Important">
                                                                            <button
                                                                                type="button" className={`enabled:hover:text-primary disabled:opacity-60 flex items-center ${ 
                                                                                    lead.isImportant ? 'text-primary' : ''
                                                                                }`}>
                                                                                <IconPhone/>
                                                                            </button>
                                                                        </Tippy>
                                                                    </div>
                                                                    <div className={`dark:text-gray-300 whitespace-nowrap font-semibold ${ !lead.isUnread ? 'text-gray-500 dark:text-gray-500 font-normal' : ''}`}
                                                                    > {lead?.customer_phone || 'Not Found'}
                                                                    </div>
                                                                </div>
                                                            </td>                      
                                                            <td>
                                                                <div className="flex items-center">
                                                                    {colorsarray.find((data) => data.value == lead?.lead_status) && (
                                                                        <div className={`w-2 h-2 rounded-full ${
                                                                                colorsarray.find((data) => data.value == lead?.lead_status)?.bgColor
                                                                            }`}
                                                                        ></div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                             {/* <td className="whitespace-nowrap font-medium ltr:text-right rtl:text-left">{showTime(lead)}</td>  */}
                                                            <td className="whitespace-nowrap font-medium ltr:text-right rtl:text-left">10:15 PM</td> 
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="grid place-content-center min-h-[300px] font-semibold text-lg h-full">No data available</div>
                                )}
                        </div>
                    )}
                    {selectedLead && !isEdit && (
                        <div>
                            <div className="flex items-center justify-between flex-wrap p-4">
                                <div className="flex items-center">
                                    <button type="button" className="ltr:mr-2 rtl:ml-2 hover:text-primary" onClick={() => setSelectedLead(null)}>
                                        <IconArrowLeft className="w-5 h-5 rotate-180" />
                                    </button>
                                    <h4 className="text-base md:text-lg font-medium ltr:mr-2 rtl:ml-2">
                                        {selectedLead?.lead_title}
                                        </h4>
                                    <div className="badge bg-info hover:top-0">{selectedLead?.lead_status}</div>
                                </div>
                                <div>
                                    <Tippy content="Print">
                                            <button type="button"> <IconPrinter /> </button>
                                    </Tippy>
                                </div>
                            </div>
                            <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
                            <div className="p-4 relative">
                            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-5">
                                <div className="panel">
                                    <div className="flex items-center justify-between mb-5">
                                        <h5 className="font-semibold text-lg dark:text-white-light">Client Detail </h5>
                                    </div>
                                    <div className="data">
                                        <ul className="mt-5 m-auto space-y-4 font-semibold text-white-dark">
                                            <li className="flex items-center gap-2 text-dark">
                                                <IconUser className="shrink-0" />
                                                {selectedLead?.customer_name || 'Not-Found'}
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <IconPhone />
                                                <span className="whitespace-nowrap text-secondary" dir="ltr">
                                                {selectedLead?.customer_phone || 'Not-Found'}
                                                </span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <IconPhone />
                                                <span className="whitespace-nowrap text-secondary" dir="ltr">
                                                {selectedLead?.customer_phone2 || 'Not-Found'}
                                                </span>
                                            </li>
                                            <li>
                                                <button className="flex items-center gap-2">
                                                    <IconMail className="w-5 h-5 shrink-0" />
                                                    <span className="text-info truncate">{selectedLead?.customer_email || 'Not-Found'}</span>
                                                </button>
                                            </li>
                                            <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
                                            <li className="flex items-center gap-2"> <IconUser className="shrink-0" />
                                                {selectedLead?.agents?.client_user_name}
                                            </li>
                                            <div className="h-px border-b border-white-light dark:border-[#1b2e4b]"></div>
                                        </ul>
                                    </div>
                                     <form encType="multipart/form-data" ref={(el) => (combinedRef.current.form = el)} onSubmit={handleSubmit}>
                                        <div className="mt-1">
                                            <div className="flex flex-col justify-between lg:flex-row">
                                                <div className="w-full cursor-pointer">
                                                    <div className="mt-3 items-center">
                                                       <Select placeholder="Move Lead...." options={dropdownOption} name="lead_status"  className="cursor-pointer"/>
                                                      <input type="hidden" name="lead_id" className="form-input" value={selectedLead?.lead_id} />
                                                      <input type="hidden" name="agent_id" className="form-input" value={selectedLead?.agent_id} />
                                                      <input type="hidden" name="login_user_id" className="form-input" value={loginuser?.client_user_id}/>
                                                      {errors?.lead_status && <p className="text-danger error">{errors.lead_status[0]}</p>}
                                                    </div>
                                                    <div className="mt-3 items-center cursor-pointer">
                                                       <textarea id="description" className="form-textarea min-h-[130px]" name="lead_comment" placeholder="Comments"></textarea>
                                                       {errors?.lead_comment && <p className="text-danger error">{errors.lead_comment[0]}</p>}
                                                    </div>   
                                                    <div className="mt-4">
                                                        <button className="btn btn-secondary w-full">Save</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="panel lg:col-span-2 xl:col-span-4">
                                <div className="mb-5">
                                    <h5 className="font-semibold text-lg dark:text-white-light">History of the Leads </h5>
                                </div>
                                <div className="mb-5">
                                    <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
                                        <table className="whitespace-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>History</th>
                                                </tr>
                                            </thead>
                                            <tbody className="dark:text-white-dark">
                                                {selectedLead?.comments?.map((comment:any, i:any) => (
                                                    <div className="maindiv" key={i}>
                                                    <small>{comment?.created_at || 'Invalid Time'}</small>&nbsp;
                                                    <small> {comment?.user_id !== null ? comment?.user_name : i > 0 ? selectedLead.comments[i - 1]?.user_name : ''}
                                                    </small> 
                                                    <small dangerouslySetInnerHTML={{ __html: getNotesByLeadStatus(comment.lead_status || '') }}></small>
                                                    {comment.lead_status === '2' && ( <small>&nbsp;{comment?.agent_name}</small> )}
                                                    {i > 0 && ( 
                                                        <small dangerouslySetInnerHTML={{__html: getNotes2ByLeadStatus(selectedLead.comments[i - 1]?.lead_status || ''), }}></small>
                                                    )}
                                                    {comment.lead_comment && (
                                                        <div className="b-1 shadow-none" style={{ marginBottom: '4px' }}>
                                                        <small>{comment?.updated_at || 'Invalid Time'}</small>&nbsp;
                                                        <small>{comment?.user_name} :</small>&nbsp;
                                                        <small>{comment?.lead_comment}</small>
                                                        </div>
                                                    )}
                                                    </div>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                  </div>
                                </div>
                              </div> 
                            </div>
                    </div>
                )}
                
                    {isEdit && (
                        <div className="relative">
                            <div className="py-4 px-6 flex items-center">
                                <button type="button" className="xl:hidden hover:text-primary block ltr:mr-3 rtl:ml-3" onClick={() => setIsShowMailMenu(!isShowMailMenu)}>
                                    <IconMenu />
                                </button>
                                <h4 className="text-lg text-gray-600 dark:text-gray-400 font-medium">Message</h4>
                            </div>
                            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black dark:via-white to-indigo-900/20 opacity-[0.1]"></div>
                            <form className="p-6 grid gap-6">
                                <div>
                                    <input id="to" type="text" className="form-input" placeholder="Enter To" />
                                </div>
                                <div>
                                    <input id="cc" type="text" className="form-input" placeholder="Enter Cc"  />
                                </div>
                                <div>
                                    <input id="title" type="text" className="form-input" placeholder="Enter Subject" />
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                                        multiple
                                        accept="image/*,.zip,.pdf,.xls,.xlsx,.txt.doc,.docx"
                                        required
                                    />
                                </div>
                                <div className="flex items-center ltr:ml-auto rtl:mr-auto mt-8">
                                    <button type="button" className="btn btn-outline-danger ltr:mr-3 rtl:ml-3">
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-success ltr:mr-3 rtl:ml-3">
                                        Save
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardBox;
