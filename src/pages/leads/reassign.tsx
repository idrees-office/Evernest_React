// import { useState, useEffect, useRef, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { IRootState, AppDispatch } from '../../store';
// import Table from '../../components/Table';
// import IconBell from '../../components/Icon/IconBell';
// import IconPlus from '../../components/Icon/IconPlus';
// import IconTrash from '../../components/Icon/IconTrash';
// import { useNavigate } from 'react-router-dom';
// import Toast from '../../services/toast';
// import Loader from '../../services/loader';
// import { setPageTitle } from '../../slices/themeConfigSlice';
// import { newleads, destoryLeads, assignleads, reassigleads } from '../../slices/leadsSlice';
// import Select from 'react-select';
// import LeadModal from '../../components/LeadModal';
// import '../dashboard/dashboard.css'; 
// import Swal from 'sweetalert2';
// import { DataTableSortStatus } from 'mantine-datatable';

// const ReAssign = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();
//     const toast = Toast();
//     const combinedRef = useRef<any>({ 
//         fetched: false, 
//         form: null,
//         prevPage: 1,
//         prevPerPage: 10,
//         prevSortStatus: { columnAccessor: 'id', direction: 'desc' }
//     });

//     const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
//     const [disable, setDisable] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState<string>('');
//     const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
//         columnAccessor: 'id',
//         direction: 'desc',
//     });
//     const { leads, loading, agents, total, last_page, current_page, per_page } = useSelector((state: IRootState) => state.leadslices);
//     const [allSelected, setAllSelected] = useState(false);
//     const [bulkSelectedIds, setBulkSelectedIds] = useState<Set<string>>(new Set());
//     useEffect(() => {
//         dispatch(setPageTitle('Re-Assign Leads'));

//         const fetchData = () => {
//             dispatch(reassigleads({
//                 page: searchTerm ? 1 : current_page,
//                 perPage : per_page, 
//                 sortField: sortStatus.columnAccessor, 
//                 sortOrder: sortStatus.direction, 
//                 search: searchTerm 
//             }));
//         };
//         if (!combinedRef.current.fetched) {
//             fetchData();
//             combinedRef.current.fetched = true;
//             return;
//         }
//     }, [dispatch, current_page, per_page, sortStatus, searchTerm]);


//     const transformedAgents = agents?.map(agent => ({
//         value: agent?.client_user_id,
//         label: agent?.client_user_name,
//         phone: agent?.client_user_phone,
//     })) || [];

//     const tableData = useMemo(() => {
//         return (Array.isArray(leads) ? leads : []).map((lead: any) => ({
//             id     : lead.lead_id || 'Unknown',
//             title  : lead.lead_title || 'Unknown',
//             name   : lead.customer_name || 'Unknown',
//             phone  : lead.customer_phone || 'Unknown',
//             source : lead.lead_source || 'Unknown',
//             date   : lead.updated_at || 'Unknown',
//         }));
//     }, [leads]);

//     const openLeadModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCheckboxChange = (record: any, isChecked: boolean) => {
//         if (isChecked) {
//             setSelectedRecords((prevSelected) => [...prevSelected, record]);
//             setDisable(false);
//         } else {
//             setSelectedRecords((prevSelected) => prevSelected.filter((selected) => selected.id !== record.id));
//             if(selectedRecords.length === 1) { setDisable(true); } 
//         }
//     };

//     const AssignLead = async (agentId: number, phone: number) => {
//         if (selectedRecords.length === 0) { 
//             toast.error('Please select at least one lead to assign');
//             return;
//         }
//         const leadIds = selectedRecords.map((record) => record.id);
//         const formData = new FormData();
//         leadIds.forEach((id) => formData.append('lead_id[]', id));
//         formData.append('agent_id', agentId.toString());
//         formData.append('agent_phone', phone.toString());
//         try {
//             const response = await dispatch(assignleads({ formData }) as any);
//             if (response.payload.status === 200 || response.payload.status === 201){
//                 toast.success('Leads Have Been Assigned Successfully');
//                 setSelectedRecords([]);
//                 setDisable(true);
//             }
//         } catch (error) {
//             toast.error('Failed to assign leads');
//         }
//     };

//     const RemoveLead = async () => {
//         if (selectedRecords.length === 0) {
//             toast.error('Please select at least one lead to remove');
//             return;
//         }

//         const result = await Swal.fire({
//             title: 'Are you sure?',
//             text: `You are about to remove ${selectedRecords.length} selected lead(s). This action cannot be undone.`,
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#d33',
//             cancelButtonColor: '#3085d6',
//             confirmButtonText: 'Yes, delete it!',
//             cancelButtonText: 'Cancel',
//         });
//         if (result.isConfirmed) {
//             try {
//                 const leadIds = selectedRecords.map((record) => record.id);
//                 const formData = new FormData();
//                 leadIds.forEach((id) => formData.append('lead_id[]', id));
//                 const response = await dispatch(destoryLeads({ formData }) as any);
//                 if (response.payload.status === 200 || response.payload.status === 201) {
//                     toast.success('Lead removed successfully');
//                     setSelectedRecords([]);
//                     setDisable(true);
//                 } else {
//                     toast.error('Failed to remove leads. Please try again.');
//                 }
//             } catch (error) {
//                 toast.error('An error occurred while removing leads.');
//             }
//         }
//     };

//     const handlePageChange = (page: number) => {
//         dispatch(reassigleads({ 
//             page,
//             sortField: sortStatus.columnAccessor,
//             sortOrder: sortStatus.direction,
//             search: searchTerm  
//         }));
//         setSelectedRecords([]);
//         setDisable(true);
//     };

//     const handlePerPageChange = (pageSize: number) => {
//         dispatch(reassigleads({ 
//             perPage: pageSize,
//             sortField: sortStatus.columnAccessor,
//             sortOrder: sortStatus.direction,
//             search: searchTerm  
//         }));
//         setSelectedRecords([]);
//         setDisable(true);
//     };

//     const handleSortChange = (status: DataTableSortStatus) => {
//         setSortStatus(status);
//         dispatch(reassigleads({ 
//             sortField: status.columnAccessor,
//             sortOrder: status.direction,
//             search: searchTerm  
//         }));
//     };

//     const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newSearchTerm = e.target.value;
//         setSearchTerm(newSearchTerm);
//          dispatch(reassigleads({ 
//             page: 1, 
//             perPage: per_page,
//             sortField: sortStatus.columnAccessor,
//             sortOrder: sortStatus.direction,
//             search: newSearchTerm  
//         }));
//     };


//     const handleSelectAllCurrentPage = (isChecked: boolean) => {
//         const newSelectedIds = new Set(bulkSelectedIds);
        
//         if (isChecked) {
//             tableData.forEach(record => newSelectedIds.add(record.id));
//         } else {
//             tableData.forEach(record => newSelectedIds.delete(record.id));
//         }
        
//         setBulkSelectedIds(newSelectedIds);
//         setDisable(newSelectedIds.size === 0);
//         setAllSelected(isChecked);
//     };


//     const columns = [
//         // { 
//         //     accessor: 'id', 
//         //     title: 'Select', 
//         //     sortable: false, 
//         //     render: (record: any) => (
//         //         <input type="checkbox" className="form-checkbox" checked={selectedRecords.some((selected) => selected.id === record.id)} onChange={(e) => handleCheckboxChange(record, e.target.checked)} />
//         //     ),
//         // },

//         { 
//         accessor: 'id', 
//         title: (
//             <div className="flex items-center">
//                 <input 
//                     type="checkbox" 
//                     className="form-checkbox mr-2" 
//                     checked={allSelected || (tableData.length > 0 && tableData.every(record => bulkSelectedIds.has(record.id)))}
//                     onChange={(e) => handleSelectAllCurrentPage(e.target.checked)}
//                 />
//                 Select
//                 {bulkSelectedIds.size > 0 && (
//                     <span className="ml-2 text-xs">({bulkSelectedIds.size} selected)</span>
//                 )}
//             </div>
//         ), 
//         sortable: false, 
//         render: (record: any) => (
//             <input 
//                 type="checkbox" 
//                 className="form-checkbox" 
//                 checked={bulkSelectedIds.has(record.id)} 
//                 onChange={(e) => handleCheckboxChange(record, e.target.checked)} 
//             />
//         ),
//     },

//         { accessor: 'title', title: 'Title', sortable: true },
//         { accessor: 'name', title: 'Name', sortable: true },
//         { accessor: 'phone', title: 'Phone', sortable: true },
//         { 
//             accessor: 'source', 
//             title: 'Source', 
//             sortable: true,
//             render: (record: any) => {
//                 switch (record.source) {
//                     case 'Facebook': return <span className="badge bg-info">Facebook</span>;
//                     case 'Instagram': return <span className="badge bg-secondary">Instagram</span>;
//                     case 'created own': return <span className="badge bg-success">Created own</span>;
//                     case 'Website': return <span className="badge bg-warning">Website</span>;
//                     case 'Reshuffle': return <span className="badge bg-primary">Reshuffle</span>;
//                     case 'Walk-in': return <span className="badge bg-danger">Walk-in</span>;
//                     case 'Other': return <span className="badge bg-secondary">Other</span>;
//                     default: return <span className="badge bg-secondary">Unknown</span>;
//                 }
//             },
//         },
//         { accessor: 'date', title: 'Date', sortable: true },
//     ];

//     return (
//         <div>
//             <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
//                 <div className="flex items-center">
//                     <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
//                         <IconBell />
//                     </div>
//                     <span className="ltr:mr-3 rtl:ml-3">Details of Your New Leads: </span>
//                     <button onClick={openLeadModal} className="btn btn-success btn-sm"> 
//                         <IconPlus /> Add Lead
//                     </button>
//                 </div> 
//                 <div className="flex items-center space-x-2">
//                     <Select 
//                         placeholder="Select an option" 
//                         options={transformedAgents} 
//                         isDisabled={disable} 
//                         className="cursor-pointer custom-multiselect z-10 w-[300px]" 
//                         onChange={(selectedOption) => { 
//                             if (selectedOption?.value !== undefined) {
//                                 AssignLead(selectedOption.value, selectedOption.phone);
//                             }
//                         }}
//                     />
//                     <button 
//                         onClick={RemoveLead}  
//                         type="button" 
//                         className="btn btn-default btn-sm" 
//                         style={{ background: "#d33", color: '#fff' }} 
//                     > 
//                         <IconTrash/> 
//                     </button>
//                 </div>
//             </div>
//             <div className="datatables mt-6">
//                     <Table 
//                         title="Re-Assign Leads"  
//                         columns={columns}  
//                         rows={tableData}  
//                         totalRecords={total || 0}  
//                         currentPage={current_page} 
//                         recordsPerPage={per_page} 
//                         onPageChange={handlePageChange} 
//                         onRecordsPerPageChange={handlePerPageChange} 
//                         onSortChange={handleSortChange} 
//                         sortStatus={sortStatus} 
//                         isLoading={loading}
//                         onSearchChange={onSearchChange}
//                         searchValue={searchTerm}
//                         noRecordsText="No records found matching your search criteria"
//                     />
//             </div>
//             <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//         </div>
//     );
// };
// export default ReAssign;



import { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import Table from '../../components/Table';
import IconBell from '../../components/Icon/IconBell';
import IconPlus from '../../components/Icon/IconPlus';
import IconTrash from '../../components/Icon/IconTrash';
import { useNavigate } from 'react-router-dom';
import Toast from '../../services/toast';
import Loader from '../../services/loader';
import { setPageTitle } from '../../slices/themeConfigSlice';
import { newleads, destoryLeads, assignleads, reassigleads } from '../../slices/leadsSlice';
import Select from 'react-select';
import LeadModal from '../../components/LeadModal';
import '../dashboard/dashboard.css'; 
import Swal from 'sweetalert2';
import { DataTableSortStatus } from 'mantine-datatable';
import { setLoading } from '../../slices/dashboardSlice';

const ReAssign = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast = Toast();
    const combinedRef = useRef<any>({ 
        fetched: false, 
        form: null,
        prevPage: 1,
        prevPerPage: 10,
        prevSortStatus: { columnAccessor: 'id', direction: 'desc' }
    });

    // State for bulk selection
    const [allSelected, setAllSelected] = useState(false);
    const [bulkSelectedIds, setBulkSelectedIds] = useState<Set<string>>(new Set());
    const [disable, setDisable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'desc',
    });

    const { leads, loading, agents, total, last_page, current_page, per_page } = useSelector((state: IRootState) => state.leadslices);

    useEffect(() => {
        dispatch(setPageTitle('Re-Assign Leads'));
        fetchData();
    }, [dispatch, current_page, per_page, sortStatus, searchTerm]);

    const fetchData = () => {
        dispatch(reassigleads({
            page: searchTerm ? 1 : current_page,
            perPage: per_page, 
            sortField: sortStatus.columnAccessor, 
            sortOrder: sortStatus.direction, 
            search: searchTerm 
        }));
    };

    const transformedAgents = agents?.map(agent => ({
        value: agent?.client_user_id,
        label: agent?.client_user_name,
        phone: agent?.client_user_phone,
    })) || [];

    const tableData = useMemo(() => {
        return (Array.isArray(leads) ? leads : []).map((lead: any) => ({
            id: lead.lead_id || 'Unknown',
            title: lead.lead_title || 'Unknown',
            name: lead.customer_name || 'Unknown',
            phone: lead.customer_phone || 'Unknown',
            source: lead.lead_source || 'Unknown',
            date: lead.updated_at || 'Unknown',
        }));
    }, [leads]);

    const openLeadModal = () => {
        setIsModalOpen(true);
    };

    const handleCheckboxChange = (record: any, isChecked: boolean) => {
        const newSelectedIds = new Set(bulkSelectedIds);
        if (isChecked) {
            newSelectedIds.add(record.id);
        } else {
            newSelectedIds.delete(record.id);
        }
        setBulkSelectedIds(newSelectedIds);
        setDisable(newSelectedIds.size === 0);
        setAllSelected(false);
    };

    const handleSelectAllCurrentPage = (isChecked: boolean) => {
        const newSelectedIds = new Set(bulkSelectedIds);
        
        if (isChecked) {
            tableData.forEach(record => newSelectedIds.add(record.id));
        } else {
            tableData.forEach(record => newSelectedIds.delete(record.id));
        }
        
        setBulkSelectedIds(newSelectedIds);
        setDisable(newSelectedIds.size === 0);
        setAllSelected(isChecked);
    };

    const handleSelectAllPages = async (isChecked: boolean) => {
        if (isChecked) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `This will select ALL leads matching your search criteria (${total} records).`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, select all',
                cancelButtonText: 'Cancel'
            });
            
            if (!result.isConfirmed) return;
            
            try {
                setLoading(true);
                const response = await dispatch(reassigleads({
                    page: 1,
                    perPage: total,
                    sortField: sortStatus.columnAccessor,
                    sortOrder: sortStatus.direction,
                    search: searchTerm,
                    idsOnly: true
                }) as any);
                
                if (response.payload?.data?.ids) {
                    setBulkSelectedIds(new Set(response.payload.data.ids));
                    setDisable(false);
                    setAllSelected(true);
                }
            } catch (error) {
                toast.error('Failed to select all records');
            } finally {
               setLoading(false);
            }
        } else {
            setBulkSelectedIds(new Set());
            setDisable(true);
            setAllSelected(false);
        }
    };

    const AssignLead = async (agentId: number, phone: number) => {
        if (bulkSelectedIds.size === 0) { 
            toast.error('Please select at least one lead to assign');
            return;
        }
        
        const formData = new FormData();
        Array.from(bulkSelectedIds).forEach((id) => formData.append('lead_id[]', id));
        formData.append('agent_id', agentId.toString());
        formData.append('agent_phone', phone.toString());
        
        try {
            const response = await dispatch(assignleads({ formData }) as any);
            if (response.payload.status === 200 || response.payload.status === 201){
                toast.success(`${bulkSelectedIds.size} leads have been assigned successfully`);
                setBulkSelectedIds(new Set());
                setDisable(true);
                setAllSelected(false);
            }
        } catch (error) {
            toast.error('Failed to assign leads');
        }
    };

    const RemoveLead = async () => {
        if (bulkSelectedIds.size === 0) {
            toast.error('Please select at least one lead to remove');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to remove ${bulkSelectedIds.size} selected lead(s). This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });
        
        if (result.isConfirmed) {
            try {
                const formData = new FormData();
                Array.from(bulkSelectedIds).forEach((id) => formData.append('lead_id[]', id));
                const response = await dispatch(destoryLeads({ formData }) as any);
                if (response.payload.status === 200 || response.payload.status === 201) {
                    toast.success(`${bulkSelectedIds.size} leads removed successfully`);
                    setBulkSelectedIds(new Set());
                    setDisable(true);
                    setAllSelected(false);
                } else {
                    toast.error('Failed to remove leads. Please try again.');
                }
            } catch (error) {
                toast.error('An error occurred while removing leads.');
            }
        }
    };

    const handlePageChange = (page: number) => {
        dispatch(reassigleads({ 
            page,
            sortField: sortStatus.columnAccessor,
            sortOrder: sortStatus.direction,
            search: searchTerm  
        }));
    };

    const handlePerPageChange = (pageSize: number) => {
        dispatch(reassigleads({ 
            perPage: pageSize,
            sortField: sortStatus.columnAccessor,
            sortOrder: sortStatus.direction,
            search: searchTerm  
        }));
    };

    const handleSortChange = (status: DataTableSortStatus) => {
        setSortStatus(status);
        dispatch(reassigleads({ 
            sortField: status.columnAccessor,
            sortOrder: status.direction,
            search: searchTerm  
        }));
    };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        dispatch(reassigleads({ 
            page: 1, 
            perPage: per_page,
            sortField: sortStatus.columnAccessor,
            sortOrder: sortStatus.direction,
            search: newSearchTerm  
        }));
    };

    const columns = [
        { 
            accessor: 'id', 
            title: (
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        className="form-checkbox mr-2" 
                        checked={allSelected || (tableData.length > 0 && tableData.every(record => bulkSelectedIds.has(record.id)))}
                        onChange={(e) => handleSelectAllCurrentPage(e.target.checked)}
                    />
                    Select
                    {bulkSelectedIds.size > 0 && (
                        <span className="ml-2 text-xs">({bulkSelectedIds.size} selected)</span>
                    )}
                </div>
            ), 
            sortable: false, 
            render: (record: any) => (
                <input 
                    type="checkbox" 
                    className="form-checkbox" 
                    checked={bulkSelectedIds.has(record.id)} 
                    onChange={(e) => handleCheckboxChange(record, e.target.checked)} 
                />
            ),
        },
        { accessor: 'title', title: 'Title', sortable: true },
        { accessor: 'name', title: 'Name', sortable: true },
        { accessor: 'phone', title: 'Phone', sortable: true },
        { 
            accessor: 'source', 
            title: 'Source', 
            sortable: true,
            render: (record: any) => {
                switch (record.source) {
                    case 'Facebook': return <span className="badge bg-info">Facebook</span>;
                    case 'Instagram': return <span className="badge bg-secondary">Instagram</span>;
                    case 'created own': return <span className="badge bg-success">Created own</span>;
                    case 'Website': return <span className="badge bg-warning">Website</span>;
                    case 'Reshuffle': return <span className="badge bg-primary">Reshuffle</span>;
                    case 'Walk-in': return <span className="badge bg-danger">Walk-in</span>;
                    case 'Other': return <span className="badge bg-secondary">Other</span>;
                    default: return <span className="badge bg-secondary">Unknown</span>;
                }
            },
        },
        { accessor: 'date', title: 'Date', sortable: true },
    ];

    return (
        <div>
            <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
                <div className="flex items-center">
                    <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                        <IconBell />
                    </div>
                    <span className="ltr:mr-3 rtl:ml-3">Details of Your New Leads: </span>
                    <button onClick={openLeadModal} className="btn btn-success btn-sm"> 
                        <IconPlus /> Add Lead
                    </button>
                </div> 
                <div className="flex items-center space-x-2">
                    {/* <button 
                        onClick={() => handleSelectAllPages(!allSelected)}
                        className="btn btn-primary btn-sm"
                    >
                        {allSelected ? 'Clear All' : 'Select All'} ({total})
                    </button> */}
                    <Select 
                        placeholder="Select an option" 
                        options={transformedAgents} 
                        isDisabled={bulkSelectedIds.size === 0} 
                        className="cursor-pointer custom-multiselect z-10 w-[300px]" 
                        onChange={(selectedOption) => { 
                            if (selectedOption?.value !== undefined) {
                                AssignLead(selectedOption.value, selectedOption.phone);
                            }
                        }}
                    />
                    <button 
                        onClick={RemoveLead}  
                        type="button" 
                        className="btn btn-default btn-sm" 
                        style={{ background: "#d33", color: '#fff' }} 
                        disabled={bulkSelectedIds.size === 0}
                    > 
                        <IconTrash/> 
                    </button>
                </div>
            </div>
            <div className="datatables mt-6">
                <Table 
                    title="Re-Assign Leads"  
                    columns={columns ? columns : []}  
                    rows={tableData}  
                    totalRecords={total || 0}  
                    currentPage={current_page} 
                    recordsPerPage={per_page} 
                    onPageChange={handlePageChange} 
                    onRecordsPerPageChange={handlePerPageChange} 
                    onSortChange={handleSortChange} 
                    sortStatus={sortStatus} 
                    isLoading={loading}
                    onSearchChange={onSearchChange}
                    searchValue={searchTerm}
                    noRecordsText="No records found matching your search criteria"
                />
            </div>
            <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ReAssign;
