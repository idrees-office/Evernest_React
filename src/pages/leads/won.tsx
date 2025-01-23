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
import { destoryLeads, closeleads } from '../../slices/leadsSlice';
import Select from 'react-select';
import LeadModal from '../../components/LeadModal';
import { createLeads } from '../../slices/dashboardSlice';
import '../dashboard/dashboard.css'; 

const ReAssign = () => {
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
            dispatch(setPageTitle('Re-Assign Leads'));
            dispatch(closeleads());
            combinedRef.current.fetched = true;
        }
    }, [dispatch]); 
    const { leads, loading, agents }  =  useSelector((state: IRootState) => state.leadslices);

    const tableData = (Array.isArray(leads) ? leads : []).map((lead: any, index: number) => ({
        title   : lead.lead_title || 'Unknown',
        name    : lead.customer_name || 'Unknown',
        phone   : lead.customer_phone || 'Unknown',
        status  : lead.lead_status || 'Unknown',
        date    : new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date(lead.updated_at)),
    }));

    const openLeadModal = () => {
        setIsModalOpen(true);
    }
    const handleCheckboxChange = (record: any, isChecked: boolean) => {
        if (isChecked) {
          setSelectedRecords((prevSelected) => [...prevSelected, record]);
          setDisable(false);
        } else {
          setSelectedRecords((prevSelected) => prevSelected.filter((selected) => selected.lead_id !== record.lead_id));
          if(selectedRecords.length === 1) { setDisable(true); } 
        }
      };

      const AssignLead = (agentId: number) => {
        if (selectedRecords.length === 0) {
          toast.error('Please select at least one lead to assign');
          return;
        }
        const leadIds = selectedRecords.map((record) => record.lead_id);  
        console.log(agentId);
        console.log(leadIds);
      }
      const RemoveLead = async () => {
        if (selectedRecords.length === 0) {
          toast.error('Please select at least one lead to remove');
          return;
        }
        const leadIds = selectedRecords.map((record) => record.lead_id);
        const formData = new FormData();
        leadIds.forEach((id) => formData.append('lead_id[]', id));
        const response = await dispatch(destoryLeads({ formData }) as any);
        if (response.payload.status === 200 || response.payload.status === 201){
            toast.success('Lead removed successfully');
            setSelectedRecords([]);
            dispatch(closeleads()); 
            setDisable(true);       
        }
      }
    return (
    <div>
        <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
        <div className="flex items-center">
            <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                <IconBell />
            </div>
            <span className="ltr:mr-3 rtl:ml-3"> Details of Your Closed Deal. </span>
            {/* <button onClick={openLeadModal} className="btn btn-primary btn-sm"> <IconPlus /> Add Lead</button> */}
        </div> 
        <div className="flex items-center space-x-2">
          {/* use select input here if you want */}
        </div>
    </div>
        <div className="datatables">
        {loading ? ( loader  )   : (
          <Table title="Re-Assign leads"
              columns={[
                      { accessor: 'title', title: 'Title', sortable: true },
                      { accessor: 'name',  title: 'Name', sortable: true },
                      { accessor: 'phone',  title: 'Phone', sortable: true },
                      { accessor: 'status', title: 'Status', sortable: true,
                          render: (record) => (
                              record.status === '16' ? ( 
                                  <span className="badge bg-success">Close Deel</span>
                              ):  (
                                  <span className="badge bg-secondary">Unknown</span>
                              )
                          ),
                        },
                        { accessor: 'date',  title: 'Date', sortable: true },
                  ]} 
                rows={tableData}
              />
          )}
        </div>
        <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}  />
    </div>
    )
}
export default ReAssign;
