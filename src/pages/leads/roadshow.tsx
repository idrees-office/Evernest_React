import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import Table from '../../components/Table';
import IconBell from '../../components/Icon/IconBell';
import IconTrash from '../../components/Icon/IconTrash';
import IconPlus from '../../components/Icon/IconPlus';
import { useNavigate } from 'react-router-dom';
import Toast from '../../services/toast';
import { setPageTitle } from '../../slices/themeConfigSlice';
import { roadshowleads, destoryLeads } from '../../slices/leadsSlice';
import Select from 'react-select';
import LeadModal from '../../components/LeadModal';
import { CountryList } from '../../services/status';
import { DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';

const RoadShow = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast = Toast();
    
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [disable, setDisable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const combinedRef = useRef<any>({  fetched: false,  form: null, prevPage: 1, prevPerPage: 10, prevSortStatus: { columnAccessor: 'id', direction: 'desc' } });
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'lead_id',
        direction: 'desc',
    });
    
    const { leads, loading, total, current_page, per_page } = useSelector((state: IRootState) => state.leadslices);

    useEffect(() => {
              dispatch(setPageTitle('All Leads'));
              const fetchData = () => {
                  dispatch(roadshowleads({ 
                      page: current_page, 
                      perPage: per_page,
                      sortField: sortStatus.columnAccessor,
                      sortOrder: sortStatus.direction,
                      search: searchTerm
                  }));
              };
              if (!combinedRef.current.fetched) {
                  combinedRef.current.fetched = true;
                  fetchData();
                  return;
              }
              fetchData();
      
              combinedRef.current.prevPage = current_page;
              combinedRef.current.prevPerPage = per_page;
              combinedRef.current.prevSortStatus = sortStatus;
          }, [dispatch, current_page, per_page, sortStatus, searchTerm]);

   

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

    const SelectCity = (value: any) => {
        setSelectedCity(value?.value || '');
        setSelectedRecords([]);
        setDisable(true);
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
                    setDisable(true);
                    // Refresh the data
                    dispatch(roadshowleads({ 
                        sortField: sortStatus.columnAccessor,
                        sortOrder: sortStatus.direction,
                        search: searchTerm,
                        cityname: selectedCity
                    }));
                } else {
                    toast.error('Failed to remove leads. Please try again.');
                }
            } catch (error) {
                toast.error('An error occurred while removing leads.');
            }
        }
    };

    const handlePageChange = (page: number) => {
        dispatch(roadshowleads({ 
            page,
            sortField: sortStatus.columnAccessor,
            sortOrder: sortStatus.direction,
            search: searchTerm,
            cityname: selectedCity
        }));
        setSelectedRecords([]);
        setDisable(true);
    };

    const handlePerPageChange = (pageSize: number) => {
        dispatch(roadshowleads({ 
            perPage: pageSize,
            sortField: sortStatus.columnAccessor,
            sortOrder: sortStatus.direction,
            search: searchTerm,
            cityname: selectedCity
        }));
        setSelectedRecords([]);
        setDisable(true);
    };

    const handleSortChange = (status: DataTableSortStatus) => {
        setSortStatus(status);
        dispatch(roadshowleads({ 
            sortField: status.columnAccessor,
            sortOrder: status.direction,
            search: searchTerm,
            cityname: selectedCity
        }));
    };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const tableData = (Array.isArray(leads) ? leads : []).map((lead: any) => ({
        id: lead.lead_id || 'Unknown',
        title: lead.lead_title || 'Unknown',
        name: lead.customer_name || 'Unknown',
        phone: lead.customer_phone || 'Unknown',
        email: lead.customer_email || 'Unknown',
        date: lead.created_at ? new Date(lead.created_at).toLocaleString() : 'Unknown',
    }));

    const columns = [
        { accessor: 'title', title: 'Title', sortable: true },
        { accessor: 'name', title: 'Name', sortable: true },
        { accessor: 'phone', title: 'Phone', sortable: true },
        {
            accessor: 'email',
            title: 'Email',
            sortable: true,
            render: (record: any) => (
                <span 
                    className="badge bg-secondary cursor-pointer" 
                    onClick={() => {
                        navigator.clipboard.writeText(record.email)
                            .then(() => toast.success('Email copied to clipboard!'))
                            .catch(() => toast.error('Failed to copy email'));
                    }}
                >
                    {record.email}
                </span>
            ),
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
                    <span className="ltr:mr-3 rtl:ml-3">Details of Your RoadShow Leads: </span>
                    <button onClick={openLeadModal} className="btn btn-success btn-sm"> 
                        <IconPlus /> Add Lead 
                    </button>
                </div> 
                <div className="flex items-center space-x-2">
                    <Select 
                        placeholder="Choose City.." 
                        options={CountryList.map(item => ({ value: item.value, label: item.name }))} 
                        onChange={SelectCity}
                        className="cursor-pointer custom-multiselect z-10 w-[300px]" 
                        isClearable
                    />
                    <button 
                        onClick={RemoveLead} 
                        type="button" 
                        className="btn btn-default btn-sm" 
                        style={{ background: "#d33", color: '#fff' }} 
                        disabled={disable}
                    > 
                        <IconTrash/> 
                    </button>
                </div>
            </div>
            <div className="datatables mt-6">
                <Table 
                    title="RoadShow Leads"  
                    columns={columns}  
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

export default RoadShow;