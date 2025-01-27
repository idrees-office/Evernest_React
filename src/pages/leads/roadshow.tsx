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
import { download, roadshowleads } from '../../slices/leadsSlice';
import Select from 'react-select';
import LeadModal from '../../components/LeadModal';
import { createLeads} from '../../slices/dashboardSlice';
import '../dashboard/dashboard.css'; 
import { DropdownOption } from '../../services/status';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import { CountryList } from '../../services/status';

const RoadShow = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast    = Toast();
    const loader   = Loader();
    const list     = CountryList;
    const dropdownOption  = DropdownOption();
    const combinedRef = useRef<any>({ fetched: false, form: null});
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [disable, setDisable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<string>("Canada");
    const [roadshowleadState, setRoadShowLeadState] = useState<any[]>([]);

    useEffect(() => {
        if (!combinedRef.current.fetched) {
            dispatch(setPageTitle('Re-Assign Leads'));
            dispatch(roadshowleads({ cityname: selectedCity }));
            combinedRef.current.fetched = true;
        }
    }, [dispatch]); 
    const { leads, loading, agents }  =  useSelector((state: IRootState) => state.leadslices);
    
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
      const SelectCity = (value:any) => {
        setSelectedCity(value.value);
        dispatch(roadshowleads({ cityname: value.value }));
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
            : 'Invalid Date'; 
        return {
            key     : `ro-${lead.lead_id}` || `ro-${index}`,
            title   : lead?.lead_title || 'Unknown',
            name    : lead?.customer_name || 'Unknown',
            phone   : lead?.customer_phone || 'Unknown',
            email   : lead?.customer_email || 'Unknown',
            date    : formattedDate,
        };
    });

    const copyEmails = () => {
        const allEmails = tableData.map((row) => row.email).join('\n');
        navigator.clipboard
            .writeText(allEmails)
            .then(() => {
                toast.success('Emails copied to clipboard!');
            })
            .catch(() => {
                toast.error('Failed to copy emails.');
            });
    };
    return (
    <div>
        <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
        <div className="flex items-center">
            <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3"><IconBell /></div>
            <span className="ltr:mr-3 rtl:ml-3"> Details of Your Road-Show Leads.</span>
        </div> 
         <div className="flex items-center space-x-2">
            <Select placeholder="Choose City.." options={list.map(item => ({ value: item.value, label: item.name }))} onChange={(selectedOption) => SelectCity(selectedOption)}name="name" className="cursor-pointer custom-multiselect z-10 w-[300px]" />
        </div>
    </div>
        <div className="datatables">
        {loading ? ( loader  )   : (
        <Table title="Export-pdf Agents-wise"
            columns={[
                    { accessor: 'title', title: 'Title', sortable: true },
                    { accessor: 'name',  title: 'Name', sortable: true },
                    { accessor: 'phone',  title: 'Phone', sortable: true },
                    {
                        accessor: 'email',
                        title: 'Email',
                        sortable: true,
                        render: (row: any) => (
                            <span className="badge bg-secondary cursor-pointer" onClick={copyEmails} >
                                {row.email}
                            </span>
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
export default RoadShow;
