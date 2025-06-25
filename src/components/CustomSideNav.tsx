import { useSelector } from 'react-redux';
import IconSettings from './Icon/IconSettings';
import IconX from './Icon/IconX';
import { IRootState } from '../store';
import { useEffect, useState } from 'react';
import Toast from '../services/toast';
import apiClient from '../utils/apiClient';
import { setLoading } from '../slices/dashboardSlice';
import { useDispatch } from 'react-redux';

interface CustomSideNavProps { isOpen: boolean; onClose: () => void; leadId?: string;  onSuccess?: () => void;  }

const CustomSideNav: React.FC<CustomSideNavProps> = ({ isOpen, onClose, leadId, onSuccess  }) => {
    const dispatch = useDispatch();
    const toast = Toast();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');

    useEffect(() => {
        if (isOpen && leadId) {
            fetchAgents();
        }
    }, [isOpen, leadId]);

    const fetchAgents = async () => {
        try {
            const response = await apiClient.get('/users/user_list?for_select=1');
            setAgents(response.data);
        } catch (error) {
            toast.error('Failed to fetch agents');
        }
    };

    const handleAssign = async () => {
        try {
            if (!selectedAgent || !leadId) {
                toast.error('Please select an agent and make sure lead is specified');
                return;
            }

            dispatch(setLoading(true));
            const response = await apiClient.post('/leads/direct_assignlead_agent', { lead_id: leadId, agent_id: selectedAgent, });
            if (response.status === 200) {
                toast.success('Lead assigned successfully');
                onClose();
                 if (onSuccess) {
                    onSuccess();
                }
                
            }
        } catch (error) {
            toast.error('Failed to assign lead');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div>
            <nav className={`${(isOpen && 'ltr:!right-0 rtl:!left-0') || ''} bg-white fixed ltr:-right-[400px] rtl:-left-[400px] top-0 bottom-0 w-full max-w-[400px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 z-[51] dark:bg-black p-4`}>
                <button type="button" className="bg-success ltr:rounded-tl-full rtl:rounded-tr-full ltr:rounded-bl-full rtl:rounded-br-full absolute ltr:-left-12 rtl:-right-12 top-0 bottom-0 my-auto w-12 h-10 flex justify-center items-center text-white cursor-pointer" onClick={onClose}>
                    <IconSettings className="animate-[spin_3s_linear_infinite] w-5 h-5" />
                </button>
                <div className="overflow-y-auto overflow-x-hidden perfect-scrollbar h-full">
                    <div className="text-center relative pb-5">
                        <button type="button" className="absolute top-0 ltr:right-0 rtl:left-0 opacity-30 hover:opacity-100 dark:text-white" onClick={onClose}>
                            <IconX className="w-5 h-5" />
                        </button>
                        <h4 className="mb-4 dark:text-white">Assign Lead #{leadId}</h4>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Select Agent</label>
                            <select 
                                className="form-select w-full" 
                                value={selectedAgent} 
                                onChange={(e) => setSelectedAgent(e.target.value)}
                            >
                                <option value="">Select an agent</option>
                                {agents.map((agent: any) => (
                                    <option key={agent.client_user_id} value={agent.client_user_id}>
                                        {agent.client_user_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button  className="btn btn-primary w-full"  onClick={handleAssign}  disabled={!selectedAgent}>
                            Assign Lead
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default CustomSideNav;
