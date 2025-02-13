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
import { newleads, destoryLeads, assignleads } from '../../slices/leadsSlice';
import Select from 'react-select';
import LeadModal from '../../components/LeadModal';
import '../dashboard/dashboard.css'; 
import Swal from 'sweetalert2';

const Assign = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast    = Toast();
    const loader   = Loader();
    const combinedRef = useRef<any>({ fetched: false, form: null});
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [disable, setDisable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        if (!combinedRef.current.fetched) {
            dispatch(setPageTitle('New Leads'));
            dispatch(newleads());
            combinedRef.current.fetched = true;
        }
    }, [dispatch]); 
    
    const { leads, loading, agents }  =  useSelector((state: IRootState) => state.leadslices);
    
    const transformedAgents = agents?.map(agent => ({
        value: agent?.client_user_id,
        label: agent?.client_user_name,
        phone: agent?.client_user_phone,
    }));

    const tableData = (Array.isArray(leads) ? leads : []).map((lead: any, index: number) => ({
        id      : lead.lead_id || 'Unknown',
        title   : lead.lead_title || 'Unknown',
        name    : lead.customer_name || 'Unknown',
        phone   : lead.customer_phone || 'Unknown',
        source  : lead.lead_source || 'Unknown',
        date    : new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date(lead.created_at)),
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

      const AssignLead = async (agentId: number, phone:number) => {
        if (selectedRecords.length === 0) { 
            toast.error('Please select at least one lead to assign');
            return;
        }
        const leadIds = selectedRecords.map((record) => record.id);
        const formData = new FormData();
        leadIds.forEach((id) => formData.append('lead_id[]', id));
        formData.append('agent_id', agentId.toString());
        formData.append('agent_phone', phone.toString());
        const response = await dispatch(assignleads({ formData }) as any);
        if (response.payload.status === 200 || response.payload.status === 201){
             toast.success('Leads Have Been Assigned Successfully');
             dispatch(newleads());
             setSelectedRecords([]);
             setDisable(true);
        }
      }
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
                    dispatch(newleads());
                    setDisable(true);
                } else {
                    toast.error('Failed to remove leads. Please try again.');
                }
            } catch (error) {
                toast.error('An error occurred while removing leads.');
            }
        }
    };
    return (
    <div>
        <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
            <div className="flex items-center">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3">Details of Your New Leads: </span>
                    <button onClick={openLeadModal} className="btn btn-success btn-sm"> <IconPlus /> Add Lead
                </button>
            </div> 
            <div className="flex items-center space-x-2">
                <Select placeholder="Select an option" options={transformedAgents} isDisabled={disable} className="cursor-pointer custom-multiselect z-10 w-[300px]" onChange={(selectedOption) => { if (selectedOption?.value !== undefined) AssignLead(selectedOption.value, selectedOption.phone); }}/>
                <button  onClick={() => { RemoveLead(); }} type="button"  className="btn btn-default btn-sm" style={{ background: "#d33", color : '#fff' }}><IconTrash/></button>
            </div>
        </div>
        
        <div className="datatables mt-6">
        {loading ? ( loader  )   :  tableData.length > 0 ?  (
         <Table title="New leads"
            columns={[
                    {
                        accessor: 'id',
                        title: 'Select',
                        sortable: false,
                        render: (record) => (
                        <input type="checkbox" className="form-checkbox" checked={selectedRecords.some((selected) => selected.id === record.id)}
                        onChange={(e) => handleCheckboxChange(record, e.target.checked)} /> ),
                    },
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
export default Assign;
