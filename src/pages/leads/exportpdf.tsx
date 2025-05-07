import { useState, useEffect, useRef, Fragment } from 'react';
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

const ExportPdf = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast    = Toast();
    const loader   = Loader();
    const dropdownOption  = DropdownOption();
    const combinedRef = useRef<any>({  fetched: false,  form: null, prevPage: 1, prevPerPage: 10, prevSortStatus: { columnAccessor: 'id', direction: 'desc' } });
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [disable, setDisable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc', });
    const { leads, loading, agents, total, last_page, current_page, per_page } = useSelector((state: IRootState) => state.leadslices);

      useEffect(() => {
          dispatch(setPageTitle('All Leads'));
          const fetchData = () => {
              dispatch(allLeads({ 
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

      const DownloadPdf = async () => {
        if (!selectedAgent) {
            toast.error('Please select an agent before downloading.');
            return;
        }
        if (!selectedStatus) {
            toast.error('Please select a status before downloading.');
            return;
        }
        const formData = new FormData();
        formData.append('lead_status', selectedStatus);
        formData.append('agent_id', selectedAgent.toString());
        const response = await dispatch(download({ formData }) as any);
        if (response.payload.status === 200 || response.payload.status === 201){
            dispatch(allLeads({ 
              page: current_page, 
              perPage: per_page,
              sortField: sortStatus.columnAccessor,
              sortOrder: sortStatus.direction,
              search: searchTerm  
          }));
            const doc = new jsPDF();
            doc.setFontSize(16);
            const leadStatusLabel = getLeadStatusLabel(selectedStatus);
            doc.text(`Agent: ${response.payload.agent_name}`, 10, 10);
            doc.text(`Lead Status: Not Responding`, 180, 10, { align: 'right' }); 
            doc.text(' ', 10, 10);
            const headers = [['Lead Title', 'Comment', 'Time']];
            const body = response.payload.data?.map((row: any) => [
                row.lead_title,
                row.lead_comment,
                formatDate(row.updated_at), 
              ]);
              (doc as any).autoTable({
                head: headers,
                body: body,
                startY: 30,  
                columnStyles: { 
                  0: { cellWidth: 'auto' },
                  1: { cellWidth: 'auto' },
                  2: { cellWidth: 'auto' } 
                },
                theme: 'grid', 
                styles: {
                  cellPadding: 3,
                  fontSize: 12, 
                  fontStyle: 'normal',
                },
                headStyles: {
                  fillColor: [22, 160, 133], 
                  textColor: [255, 255, 255], 
                  fontStyle: 'bold', 
                },
                bodyStyles: {
                  fillColor: [240, 240, 240],
                }
              });
              doc.save('reports.pdf');
        }
      }
      const formatDate =  (date: string) => {
        const formattedDate = new Date(date);
        return formattedDate.toLocaleString(); 
      } 
      const getLeadStatusLabel = (leadStatus: any) => {
        const status = dropdownOption.find(option => option.value === leadStatus);
        return status ? status.label : 'Unknown Status';
      }
      
    const tableData = (Array.isArray(leads) ? leads : []).map((lead: any) => ({
      id: lead.lead_id || 'Unknown',
      title: lead.lead_title || 'Unknown',
      name: lead.customer_name || 'Unknown',
      phone: lead.customer_phone || 'Unknown',
      source: lead.lead_source || 'Unknown',
      date: lead.created_at ? new Date(lead.created_at).toLocaleString() : 'Unknown',
   }));

    const handlePageChange = (page: number) => {
           dispatch(allLeads({ 
               page,
               sortField: sortStatus.columnAccessor,
               sortOrder: sortStatus.direction,
               search: searchTerm  
           }));
           setSelectedRecords([]);
           setDisable(true);
      };
      const handlePerPageChange = (pageSize: number) => {
           dispatch(allLeads({ 
               perPage: pageSize,
               sortField: sortStatus.columnAccessor,
               sortOrder: sortStatus.direction,
               search: searchTerm  
           }));
           setSelectedRecords([]);
           setDisable(true);
       };
   
       const handleSortChange = (status: DataTableSortStatus) => {
           setSortStatus(status);
           dispatch(allLeads({ 
               sortField: status.columnAccessor,
               sortOrder: status.direction,
               search: searchTerm  
           }));
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
                <input type="checkbox" className="form-checkbox" checked={selectedRecords.some((selected) => selected.id === record.id)} onChange={(e) => handleCheckboxChange(record, e.target.checked)} />
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
            <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3"> <IconBell /> </div>
            <span className="ltr:mr-3 rtl:ml-3"> Details of Your Agents Pdf Reports. </span>
        </div> 
        <div className="flex items-center space-x-2">
        <div className="w-[300px]">
            <Select placeholder="Select an option" options={transformedAgents} classNamePrefix="custom-select" className="custom-multiselect z-10"
            onChange={(selectedOption) =>  { if (selectedOption?.value !== undefined) SelectAgent(selectedOption.value); }} />
        </div>
        <Select placeholder="Move Lead...." options={dropdownOption} onChange={(selectedOption) => SelectStatus(selectedOption)} name="lead_status"  className="cursor-pointer custom-multiselect z-10 w-[300px]"/>        
        <button onClick={() => { DownloadPdf(); }}  type="button" className="btn btn-secondary btn-sm"><IconPlus /> Download </button>
    </div>
    </div>
       <div className="datatables mt-6"> 
              <Table title="All Leads"  
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
        <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}  />
    </div>
    )
}
export default ExportPdf;
