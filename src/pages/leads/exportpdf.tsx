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

const ExportPdf = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast    = Toast();
    const loader   = Loader();
    const dropdownOption  = DropdownOption();
    const combinedRef = useRef<any>({ fetched: false, form: null});
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [disable, setDisable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    useEffect(() => {
        if (!combinedRef.current.fetched) {
            dispatch(setPageTitle('Re-Assign Leads'));
            dispatch(allLeads());
            combinedRef.current.fetched = true;
        }
    }, [dispatch]); 
    const { leads, loading, agents }  =  useSelector((state: IRootState) => state.leadslices);

    const transformedAgents = agents?.map(agent => ({
        value: agent?.client_user_id,
        label: agent?.client_user_name,
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
            dispatch(allLeads());
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

    const tableData = (Array.isArray(leads) ? leads : []).map((lead: any, index: number) => {
        const createdAt = lead?.created_at;
        const formattedDate = createdAt && !isNaN(new Date(createdAt).getTime())
            ? new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
              }).format(new Date(createdAt))
            : 'Invalid Date'; // Default if invalid date
        
        return {
            id      : lead.lead_id || 'Unknown',
            title   : lead?.lead_title || 'Unknown',
            name    : lead?.customer_name || 'Unknown',
            phone   : lead?.customer_phone || 'Unknown',
            source  : lead?.lead_source || 'Unknown',
            date    : formattedDate,
        };
    });
    

    return (
    <div>
        <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
        <div className="flex items-center">
            <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3"> <IconBell /> </div>
            <span className="ltr:mr-3 rtl:ml-3"> Details of Your Agents Pdf Reports. </span>
            {/* <span className="ltr:mr-3 rtl:ml-3">Export-pdf Agents-wise:</span> <button onClick={openLeadModal} className="btn btn-primary btn-sm"> <IconPlus /> Add Lead
            </button> */}
        </div> 
        <div className="flex items-center space-x-2">
        <div className="w-[300px]">
            <Select placeholder="Select an option" options={transformedAgents} classNamePrefix="custom-select" className="custom-multiselect z-10"
            onChange={(selectedOption) =>  { if (selectedOption?.value !== undefined) SelectAgent(selectedOption.value); }} />
        </div>
        <Select placeholder="Move Lead...." options={dropdownOption} onChange={(selectedOption) => SelectStatus(selectedOption)} name="lead_status"  className="cursor-pointer custom-multiselect z-10 w-[300px]"/>        
        <button onClick={() => { DownloadPdf(); }}  type="button" className="btn btn-secondary btn-sm"><IconPlus />Download </button>
    </div>
    </div>
        <div className="datatables mt-6">
        {loading ? ( loader  )   :  tableData.length > 0 ?  (
         <Table title="Export-pdf Agents-wise"
            columns={[
                    { accessor: 'title', title: 'Title', sortable: true },
                    { accessor: 'name',  title: 'Name', sortable: true },
                    { accessor: 'phone',  title: 'Phone', sortable: true },
                    { accessor: 'source', title: 'Source', sortable: true,
                        render: (record) => (
                            record.source === 'Facebook' ? ( 
                                <span className="badge bg-info">Facebook</span>
                            ): record.source === 'Instagram' ? (
                                <span className="badge bg-secondary">Instagram</span>
                            ) : record.source === 'created own' ? (
                                <span className="badge bg-success">Created own</span>
                            ) : record.source === 'Website' ? (
                                <span className="badge bg-warning">Website</span>
                            ) : record.source === 'Reshuffle' ? (
                                <span className="badge bg-primary">Reshuffle</span>
                            ) : record.source === 'Walk-in' ? (
                                <span className="badge bg-danger">Walk-in</span>
                            ) : record.source === 'Other' ? (
                                <span className="badge bg-secondary">Other</span>
                            ) : (
                                <span className="badge bg-secondary">Unknown</span>
                            )
                        ),
                      },
                      { accessor: 'date',  title: 'Date', sortable: true },
                ]} 
              rows={tableData}
            />
            ) : (
              <div className="panel text-center text-primary-500 mt-4">
                <span className='badge bg-secondary'> Sorry, I am unable to retrieve data. Please check your API . </span>
              </div>
          )}
        </div>
        <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}  />
    </div>
    )
}
export default ExportPdf;
