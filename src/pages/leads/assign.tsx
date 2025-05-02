import { useState, useEffect, useRef } from 'react';
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
import { newleads, destoryLeads, assignleads } from '../../slices/leadsSlice';
import Select from 'react-select';
import LeadModal from '../../components/LeadModal';
import '../dashboard/dashboard.css'; 
import Swal from 'sweetalert2';
import { DataTableSortStatus } from 'mantine-datatable';

const Assign = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast = Toast();
    
    const combinedRef = useRef<any>({ 
        fetched: false, 
        form: null,
        prevPage: 1,
        prevPerPage: 10,
        prevSortStatus: { columnAccessor: 'id', direction: 'desc' },
        searchTimeout: null
    });

    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [disable, setDisable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'desc',
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const { leads, loading, agents, total, last_page } = useSelector((state: IRootState) => state.leadslices);

    useEffect(() => {
        const shouldFetchInitial = !combinedRef.current.fetched;
        const pageChanged = combinedRef.current.prevPage !== currentPage;
        const perPageChanged = combinedRef.current.prevPerPage !== perPage;
        const sortChanged = combinedRef.current.prevSortStatus.columnAccessor !== sortStatus.columnAccessor || 
                            combinedRef.current.prevSortStatus.direction !== sortStatus.direction;
    
        if (shouldFetchInitial) {
            dispatch(setPageTitle('New Leads'));
            combinedRef.current.fetched = true;
        }
    
        if (shouldFetchInitial || pageChanged || perPageChanged || sortChanged) {

            if(searchTerm.length > 4) {

            }
            dispatch(newleads({ 
                page: currentPage, 
                perPage,
                sortField: sortStatus.columnAccessor,
                sortOrder: sortStatus.direction,
                search: searchTerm 
            }));
    
            // Update refs with current values
            combinedRef.current.prevPage = currentPage;
            combinedRef.current.prevPerPage = perPage;
            combinedRef.current.prevSortStatus = sortStatus;
        }
    }, [dispatch, currentPage, perPage, sortStatus]);

    // Separate useEffect for search with debounce
    useEffect(() => {
        if (combinedRef.current.fetched) {
            // Clear previous timeout
            if (combinedRef.current.searchTimeout) {
                clearTimeout(combinedRef.current.searchTimeout);
            }
            // Set new timeout
            combinedRef.current.searchTimeout = setTimeout(() => {
                dispatch(newleads({ 
                    page: 1, 
                    perPage,
                    sortField: sortStatus.columnAccessor,
                    sortOrder: sortStatus.direction,
                    search: searchTerm 
                }));
                setCurrentPage(1);
            }, 500);
        }

        return () => {
            if (combinedRef.current.searchTimeout) {
                clearTimeout(combinedRef.current.searchTimeout);
            }
        };
    }, [searchTerm]);

    const transformedAgents = agents?.map(agent => ({
        value: agent?.client_user_id,
        label: agent?.client_user_name,
        phone: agent?.client_user_phone,
    }));

    const tableData = (Array.isArray(leads) ? leads : []).map((lead: any) => ({
        id: lead.lead_id || 'Unknown',
        title: lead.lead_title || 'Unknown',
        name: lead.customer_name || 'Unknown',
        phone: lead.customer_phone || 'Unknown',
        source: lead.lead_source || 'Unknown',
        date: lead.created_at ? new Date(lead.created_at).toLocaleString() : 'Unknown',
    }));

    const openLeadModal = () => {
        setIsModalOpen(true);
    };

    const handleCheckboxChange = (record: any, isChecked: boolean) => {
        if (isChecked) {
            setSelectedRecords((prevSelected) => [...prevSelected, record]);
            setDisable(false);
        } else {
            setSelectedRecords((prevSelected) => prevSelected.filter((selected) => selected.id !== record.id));
            if(selectedRecords.length === 1) { setDisable(true); } 
        }
    };

    const AssignLead = async (agentId: number, phone: number) => {
        if (selectedRecords.length === 0) { 
            toast.error('Please select at least one lead to assign');
            return;
        }
        const leadIds = selectedRecords.map((record) => record.id);
        const formData = new FormData();
        leadIds.forEach((id) => formData.append('lead_id[]', id));
        formData.append('agent_id', agentId.toString());
        formData.append('agent_phone', phone.toString());
        
        try {
            const response = await dispatch(assignleads({ formData }) as any);
            if (response.payload.status === 200 || response.payload.status === 201){
                toast.success('Leads Have Been Assigned Successfully');
                setCurrentPage(1);
                setSelectedRecords([]);
                setDisable(true);
            }
        } catch (error) {
            toast.error('Failed to assign leads');
        }
    };

    const RemoveLead = async () => {
        if (selectedRecords.length === 0) {
            toast.error('Please select at least one lead to remove');
            return;
        }
        
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to remove ${selectedRecords.length} selected lead(s). This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                const leadIds = selectedRecords.map((record) => record.id);
                const formData = new FormData();
                leadIds.forEach((id) => formData.append('lead_id[]', id));
                
                const response = await dispatch(destoryLeads({ formData }) as any);
                if (response.payload.status === 200 || response.payload.status === 201) {
                    toast.success('Lead removed successfully');
                    setSelectedRecords([]);
                    setCurrentPage(1);
                    setDisable(true);
                } else {
                    toast.error('Failed to remove leads. Please try again.');
                }
            } catch (error) {
                toast.error('An error occurred while removing leads.');
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedRecords([]);
        setDisable(true);
    };

    const handlePerPageChange = (pageSize: number) => {
        setPerPage(pageSize);
        setCurrentPage(1);
        setSelectedRecords([]);
        setDisable(true);
    };

    const handleSortChange = (status: DataTableSortStatus) => {
        setSortStatus(status);
        setCurrentPage(1);
    };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        
    };

    const columns = [
        { 
            accessor: 'id', 
            title: 'Select', 
            sortable: false, 
            render: (record: any) => (
                <input 
                    type="checkbox"  
                    className="form-checkbox" 
                    checked={selectedRecords.some((selected) => selected.id === record.id)}
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
                    <Select 
                        placeholder="Select an option" 
                        options={transformedAgents} 
                        isDisabled={disable} 
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
                    > 
                        <IconTrash/> 
                    </button>
                </div>
            </div>
            <div className="datatables mt-6">
                {loading ? ( 
                    <Loader /> 
                ) : tableData.length > 0 ? (
                    <Table 
                        title="New Leads" 
                        columns={columns} 
                        rows={tableData} 
                        totalRecords={total || 0} 
                        currentPage={currentPage} 
                        recordsPerPage={perPage} 
                        onPageChange={handlePageChange} 
                        onRecordsPerPageChange={handlePerPageChange} 
                        onSortChange={handleSortChange} 
                        sortStatus={sortStatus} 
                        isLoading={loading}
                        onSearchChange={onSearchChange}
                        searchValue={searchTerm}
                    />
                ) : (
                    <div className="panel text-center text-primary-500 mt-4">
                        <span className='badge bg-secondary'> Sorry, I am unable to retrieve data. Please check your API . </span>
                    </div>
                )}
            </div>
            <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Assign;
