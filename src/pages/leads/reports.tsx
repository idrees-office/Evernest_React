import { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import Table from '../../components/Table';
import IconBell from '../../components/Icon/IconBell';
import IconPlus from '../../components/Icon/IconPlus';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import { useNavigate } from 'react-router-dom';
import Toast from '../../services/toast';
import Loader from '../../services/loader';
import { setPageTitle } from '../../slices/themeConfigSlice';
import { allLeads, download } from '../../slices/leadsSlice';
import Select from 'react-select';
import LeadModal from '../../components/LeadModal';
import { createLeads } from '../../slices/dashboardSlice';
import '../dashboard/dashboard.css'; 
import { DropdownOption } from '../../services/status';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import { DataTableSortStatus } from 'mantine-datatable';
import IconSearch from '../../components/Icon/IconSearch';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconEye from '../../components/Icon/IconEye';
import LeadDetailModal from '../../components/LeadDetailModal';


const Reports = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast    = Toast();
    const loader   = Loader();
    const dropdownOption  = DropdownOption();
    const combinedRef = useRef<any>({  fetched: false,  form: null, prevPage: 1, prevPerPage: 10, prevSortStatus: { columnAccessor: 'lead_id', direction: 'desc' } });
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [disable, setDisable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'lead_id', direction: 'desc', });

    type Lead = {
        lead_id: number;
        lead_title?: string;
        customer_name?: string;
        customer_phone?: string;
        lead_source?: string;
        created_at?: string;
        comments?: any[]; // Add other fields as needed
    };
    
    const { leads, loading, agents, total, last_page, current_page, per_page } = useSelector((state: IRootState) => state.leadslices) as {
        leads: Lead[];
        loading: boolean;
        agents: any[];
        total: number;
        last_page: number;
        current_page: number;
        per_page: number;
    };
    const [dateRange, setDateRange] = useState<string>('');

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<any>(null);

      useEffect(() => {
        dispatch(setPageTitle('Agents Reports'));

        const fetchData = () => {
            dispatch(allLeads({ 
                page: searchTerm ? 1 : current_page, 
                perPage: per_page,
                sortField: sortStatus.columnAccessor,
                sortOrder: sortStatus.direction,
                search: searchTerm,
                date_range: dateRange 
            }));
        };
        if (!combinedRef.current.fetched) {
            fetchData();
            combinedRef.current.fetched = true;
            return;
        } 

    }, [dispatch, current_page, per_page, sortStatus, searchTerm]);

    const transformedAgents = agents?.map(agent => ({
        value: agent?.client_user_id,
        label: agent?.client_user_name,
        phone: agent?.client_user_phone,
    }));

    const openLeadModal = () => {
        setIsModalOpen(true);
    }
    const handleCheckboxChange = (record: any, isChecked: boolean) => {
        if (isChecked) {
          setSelectedRecords((prevSelected) => [...prevSelected, record]);
          setDisable(false);
        } else {
          setSelectedRecords((prevSelected) => prevSelected.filter((selected) => selected.id !== record.id));
          if(selectedRecords.length === 1) { setDisable(true); } 
        }
      };
      const SelectAgent = (agentId: number) => {
        setSelectedAgent(agentId);
      }
      const SelectStatus = (status:any) => {
        setSelectedStatus(status.value);
      }

      const Search = async () => {
        if (!selectedAgent) {
            toast.error('Please select an agent before Search.');
            return;
        }
        
        dispatch(allLeads({ 
            page: 1, 
            perPage: per_page,
            sortField: sortStatus.columnAccessor,
            sortOrder: sortStatus.direction,
            search: searchTerm,
            date_range: dateRange,
            agent_id: selectedAgent
        }));
    }

      const getLeadStatusLabel = (leadStatus: any) => {
        const status = dropdownOption.find(option => option.value === leadStatus);
        return status ? status.label : 'Unknown Status';
      }

     const setDate = async () => {

     }
      
    
     const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };


    const tableData = useMemo(() => {
      return (Array.isArray(leads) ? leads : []).map((lead: any) => ({
          id: lead.lead_id || 'Unknown',
          title: lead.lead_title || 'Unknown',
          name: lead.customer_name || 'Unknown',
          phone: lead.customer_phone || 'Unknown',
          source: lead.lead_source || 'Unknown',
          date: lead.created_at ? new Date(lead.created_at).toLocaleString() : 'Unknown',
      }));
    }, [leads]);  

    const handlePageChange = (page: number) => {
           dispatch(allLeads({ 
               page,
               sortField: sortStatus.columnAccessor,
               sortOrder: sortStatus.direction,
               search: searchTerm,

               agent_id: selectedAgent, 
               date_range: dateRange

              
           }));
           setSelectedRecords([]);
           setDisable(true);
      };
      const handlePerPageChange = (pageSize: number) => {
           dispatch(allLeads({ 
               perPage: pageSize,
               sortField: sortStatus.columnAccessor,
               sortOrder: sortStatus.direction,
               search: searchTerm,
               agent_id: selectedAgent,  
              date_range: dateRange  
           }));
           setSelectedRecords([]);
           setDisable(true);
       };
       const handleSortChange = (status: DataTableSortStatus) => {
          setSortStatus(status);
          dispatch(allLeads({ 
              page: 1, 
              perPage: per_page,
              sortField: sortStatus.columnAccessor,
              sortOrder: sortStatus.direction,
              search: searchTerm,
              agent_id: selectedAgent, 
              date_range: dateRange   
          }));
      };
      const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        dispatch(allLeads({ 
            page: 1, 
            perPage: per_page,
            sortField: sortStatus.columnAccessor,
            sortOrder: sortStatus.direction,
            search: newSearchTerm  
        }));
    };

     const columns = [
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
        {
            accessor: 'actions', 
            title: 'Actions',
            render: (record: any) => {
                const fullLead = leads.find((l: any) => l.lead_id === record.id);
                return (
                    <button type="button" className="btn btn-secondary btn-sm" style={{ height: '23px', borderRadius: '13px' }} onClick={() => {  setIsDetailModalOpen(true); setSelectedLead(fullLead?.comments || []);  }} >
                        View
                    </button>
                );
            },
        },

    ];
    return (
    <div>
        <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
        <div className="flex items-center">
            <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3"> <IconBell /> </div>
            <span className="ltr:mr-3 rtl:ml-3"> Details of Your Agents Reports. </span>
        </div> 
        <div className="flex items-center space-x-2">
        <div className="w-[500px]">
            <Select placeholder="Select an option" options={transformedAgents} classNamePrefix="custom-select" className="custom-multiselect z-10"
            onChange={(selectedOption) =>  { if (selectedOption?.value !== undefined) SelectAgent(selectedOption.value); }} />
        </div>
        <Flatpickr 
            options={{ 
                mode: 'range', 
                dateFormat: 'Y-m-d',
            }} 
            className="form-input" 
            placeholder='Y-m-d' 
            onChange={(dates) => {
                if (dates.length === 2) {  const startDate = formatDate(dates[0]); const endDate = formatDate(dates[1]); setDateRange(`${startDate},${endDate}`);
                } else {
                    setDateRange('');
                }
            }} 
        />
        {/* <Flatpickr 
            options={{ 
                mode: 'range', 
                dateFormat: 'Y-m-d',
            }} 
            className="form-input" 
            placeholder='Y-m-d' 
            onChange={(dates) => {
                if (dates.length === 2) { const startDate = dates[0]; const endDate = dates[1];
                    setDateRange(`${startDate},${endDate}`);
                } else {
                    setDateRange('');
                }
            }} 
        /> */}
        <button onClick={() => { Search(); }}  type="button" className="btn btn-secondary btn-sm"><IconSearch /> &nbsp; Search </button>
    </div>
    </div>
       <div className="datatables mt-6"> 
              <Table title="All Leads" columns={columns}  rows={tableData}  totalRecords={total || 0}  currentPage={current_page} recordsPerPage={per_page} onPageChange={handlePageChange} onRecordsPerPageChange={handlePerPageChange} onSortChange={handleSortChange} sortStatus={sortStatus} isLoading={loading}onSearchChange={onSearchChange}searchValue={searchTerm}noRecordsText="No records found matching your search criteria"
              />
            </div>
            <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}  />
            <LeadDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} comments={selectedLead} />
    </div>
    )
}
export default Reports;
