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
import { newleads } from '../../slices/leadsSlice';
import Select from 'react-select';

const Assign = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast    = Toast();
    const loader   = Loader();
    const combinedRef = useRef<any>({ fetched: false, form: null});
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [disable, setDisable] = useState(true);

    

    useEffect(() => {
        if (!combinedRef.current.fetched) {
            dispatch(setPageTitle('New Leads'));
            dispatch(newleads());
            combinedRef.current.fetched = true;
        }
    }, [dispatch]); 
    const { leads, loading, agents }  =  useSelector((state: IRootState) => state.leadslices);

    const transformedAgents = agents.map(agent => ({
        value: agent?.client_user_id,
        label: agent?.client_user_name,
    }));
    const tableData = (Array.isArray(leads) ? leads : []).map((lead: any, index: number) => ({
        lead_id : lead.lead_id || 'Unknown',
        title   : lead.lead_title || 'Unknown',
        name    : lead.customer_name || 'Unknown',
        phone   : lead.customer_phone || 'Unknown',
        source  : lead.lead_source || 'Unknown',
        date    : new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date(lead.created_at)),
    }));

    const AddLead = () => {
        console.log('Add Amenitie');
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
        
        console.log('Assigning leads', leadIds, 'to agent', agentId)
      }

    return (
    <div>
        <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
        <div className="flex items-center">
            <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                <IconBell />
            </div>
            <span className="ltr:mr-3 rtl:ml-3">New leads: </span>
            <button onClick={() => { AddLead(); }} className="btn btn-primary btn-sm">
                <IconPlus /> Add Lead
            </button>
        </div>
        <div className="flex items-center space-x-2">
            <Select placeholder="Select an option" options={transformedAgents} isDisabled={disable} className="z-10" onChange={(selectedOption) => { if (selectedOption?.value !== undefined) AssignLead(selectedOption.value); }}/>
            <button type="button" className="btn btn-danger btn-sm"><IconTrash /></button>
        </div>
    </div>
        <div className="datatables">
        <Table title="New leads"
            columns={[
                    {
                        accessor: 'lead_id',
                        title: 'Select',
                        sortable: false,
                        render: (record) => (
                        <input type="checkbox" className="form-checkbox" checked={selectedRecords.some((selected) => selected.lead_id === record.lead_id)}
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
        </div>
    </div>
    )

}

export default Assign;
