import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { setPageTitle } from '../../slices/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconHome from '../../components/Icon/IconHome';
import IconPhone from '../../components/Icon/IconPhone';
import apiClient from '../../utils/apiClient';
import { getBaseUrl } from '../../components/BaseUrl';
import Toast from '../../services/toast';
import { debounce } from "lodash";

const endpoints = {
    updateApi  : `${getBaseUrl()}/users/update_user`,
    updateApi2 : `${getBaseUrl()}/users/update_status`,
    agentApi   : `${getBaseUrl()}/users/user_list?for_select=1`,
};

const UserProfile    = () => {
    const LoginUser  = useSelector((state: any) => state.auth.user || {});
    const combineRef = useRef<any>({ profile: null });
    const dispatch   = useDispatch();
    const navigate   = useNavigate();
    const toast      = Toast();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [allAgents, setAllAgents] = useState<any[]>([]);
    const requestMade = useRef(false);
    const [selectedAgentId, setSelectedAgentId] = useState<number>();

    useEffect(() => {
        const fetchData = debounce(async () => {
            try {
                const response = await apiClient.get(endpoints.agentApi);
                setAllAgents(response.data);
            } catch (error) {
                toast.error("Failed to fetch agents");
            }
        }, 500); 
        if (!requestMade.current) {
            dispatch(setPageTitle("Account Setting"));
            fetchData();
            requestMade.current = true;
        }
    }, [dispatch]);
    const [tabs, setTabs] = useState<string>('home');
    const [formData, setFormData] = useState({
        client_user_name: LoginUser?.client_user_name || '',
        client_user_id: LoginUser?.client_user_id || '',
        client_user_designation: LoginUser?.client_user_designation || '',
        client_user_email: LoginUser?.client_user_email || '',
        client_user_phone: LoginUser?.client_user_phone || '',
    });

    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleAgentChange = async (userId: string) => {
        combineRef.current.userformRef.role_id.value = ''; 
        try {
            const response = await apiClient.get(`/users/user_permissions/${userId}`);
            // setCheckedItems(response.data);
        } catch (error) {
            toast.error('Failed to fetch user permissions');
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (combineRef.current.profile) {
                const formData = new FormData(combineRef.current.profile);
                const userId = formData.get('client_user_id');
                const response = await apiClient.post(endpoints.updateApi+'/'+userId, formData);              
                if (response.status === 200 || response.status === 201) {
                const updatedUser = response.data.user;
                if (updatedUser) {
                    dispatch({ type: 'auth/updateUser', payload: updatedUser });
                    localStorage.setItem('authUser', JSON.stringify(updatedUser));
                    setFormData({
                        client_user_name: updatedUser.client_user_name || '',
                        client_user_id: updatedUser.client_user_id || '',
                        client_user_designation: updatedUser.client_user_designation || '',
                        client_user_email: updatedUser.client_user_email || '',
                        client_user_phone: updatedUser.client_user_phone || '',
                    });
                }
                navigate('/');
                setErrors({});
                toast.success('Profile updated successfully');
                }
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.status === 403) {
                window.location.href = '/error';
            } else {
                // showServerError();
            }
        }
    };

    const handleAgent = (id: any) => {
        setSelectedAgentId(Number(id));
    }

    const handleCheckbox = async (checked:any) => {
        const client_user_status = checked ? 0 : 1;
        try {
            const response = await apiClient.post(`${endpoints.updateApi2}`, { selectedAgentId, client_user_status });
            if (response.status === 200 || response.status === 201) {
                toast.success(`${response.data.message}`);
                setSelectedAgentId(undefined);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
    
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline"> Users </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Account Settings</span>
                </li>
            </ul>
            <div className="pt-5">
                <div>
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('home')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconHome />
                                Home
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('danger-zone')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'danger-zone' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconPhone />
                                Danger Zone
                            </button>
                        </li>
                    </ul>
                </div>
                {tabs === 'home' ? (
                    <div>
                        <form ref={(el) => (combineRef.current.profile = el)} onSubmit={handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                            <h6 className="text-lg font-bold mb-5">General Information</h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                    <img src="https://oldweb.brur.ac.bd/wp-content/uploads/2019/03/male.jpg" alt="img" className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name">Full Name</label>
                                        <input id="name" name='client_user_name' type="text" placeholder="Name" className="form-input" value={formData.client_user_name}
                                        onChange={handleInputChange} />
                                        <input id="name" name='client_user_id' type="hidden"  className="form-input" value={LoginUser?.client_user_id} />
                                        {errors.client_user_name && <span className="text-red-500 text-sm">{errors.client_user_name}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="profession">Designation</label>
                                        <input id="profession" name='client_user_designation' type="text" placeholder="Web Developer" className="form-input" value={formData.client_user_designation} onChange={handleInputChange}/>
                                        {errors.client_user_designation && <span className="text-red-500 text-sm">{errors.client_user_designation}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="profession">Email</label>
                                        <input id="profession" name='client_user_email' type="text" placeholder="Email" className="form-input" value={formData?.client_user_email} onChange={handleInputChange}/>
                                        {errors.client_user_email && <span className="text-red-500 text-sm">{errors.client_user_email}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="profession">Phone</label>
                                        <input id="profession" type="text" name='client_user_phone' placeholder="Phone" className="form-input" value={formData?.client_user_phone} onChange={handleInputChange}/>
                                        {errors.client_user_phone && <span className="text-red-500 text-sm">{errors.client_user_phone}</span>}
                                    </div>
                                    <div className="sm:col-span-2 mt-3">
                                        <button type="submit" className="btn btn-success"> Save </button> 
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (   ''  )}
                {tabs === 'danger-zone' ? (
                    <div className="">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="panel space-y-5">
                            <h5 className="font-semibold text-lg mb-4">Deactivate Account </h5>
                            <p>The agent is no longer part of the team.</p>
                            <select name="client_user_id"  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" value={selectedAgentId ?? ''} onChange={(e) => handleAgent(e.target.value)}>
                                <option value="">Select Agent</option>
                                    {allAgents.map((agent) => (
                                        <option key={agent.client_user_id} value={agent.client_user_id}>{agent.client_user_name}</option>
                                    ))}
                            </select> 
                            <label className="w-12 h-6 relative">
                            <input type="checkbox" disabled={!selectedAgentId} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox7" onChange={(e) => handleCheckbox(e.target.checked)} />
                            <span className={`block h-full rounded-full relative flex items-center justify-center transition-all duration-300 before:absolute before:left-1 before:bottom-1 before:w-4 before:h-4 before:rounded-full before:transition-all before:duration-300
                                ${ selectedAgentId ? "bg-green-500 peer-checked:bg-primary before:bg-white peer-checked:before:left-7" : "bg-red-500 before:bg-gray-300 opacity-60 cursor-not-allowed" }`}></span>
                          </label>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default UserProfile;
