import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../slices/themeConfigSlice';
import Swal from 'sweetalert2';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import Table from "./../../components/Table";
import Loader from '../../services/loader';
import IconPencil from '../../components/Icon/IconPencil';
import Tippy from '@tippyjs/react';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconTrash from '../../components/Icon/IconTrash';
import Toast from '../../services/toast';
import { createuser, userlist, userroles, destoryuser, edituser } from '../../slices/teamSlice';
import { AppDispatch, IRootState } from '../../store';
import { options } from '../../services/status';
import Select from 'react-select';
import { useParams } from 'react-router-dom';

const Users = () => {
    const dispatch = useDispatch<AppDispatch>();
    const loader   = Loader();
    const toast    = Toast();
    const combinedRef = useRef<any>({ userformRef: null});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { team, loading, roles }  =  useSelector((state: IRootState) => state.teamlices);
    const [status, setStatus] = useState<any | null>(null);
    const [urole, setRoles] = useState<any | null>(null);
    const [paramsId, paramsSetId] = useState<any>();

    useEffect(() => {
        dispatch(setPageTitle('Create User'));
        dispatch(userlist());
        dispatch(userroles());
    }, []);


      useEffect(() => {
        if (paramsId !== undefined) {
        dispatch(edituser(paramsId)).unwrap().then((response: any) => {
            if (combinedRef.current.userformRef) {
                const form = combinedRef.current.userformRef;
                form.reset(); 
                form.client_user_name.value = response.client_user_name || '';
                form.client_user_email.value = response.client_user_email || '';
                form.client_user_phone.value = response.client_user_phone || '';
                form.client_user_designation.value = response.client_user_designation || '';
                form.client_sort_order.value = response.client_sort_order || '';
                setStatus(response.client_user_status || '');

                const userRole = response.roles && response.roles[0] ? response.roles[0].id : '';
                setRoles(userRole);
                
            }
            })
            .catch((error: any) => {
            console.error('Failed to fetch amenity details:', error);
            });
        }
    }, [paramsId, dispatch]);

    // save
    const saveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (combinedRef.current.userformRef) {
            const formData = new FormData(combinedRef.current.userformRef);
            try {
                const response = await dispatch(createuser({ formData }) as any);
                if (response.payload.status === 200 || response.payload.status === 201){
                    toast.success('Lead Create Successfully');
                    setErrors({}); 
                    combinedRef.current.userformRef.reset();
                    dispatch(userlist());
                }else{
                    setErrors(response.payload.errors);
                    return
                }
            } catch (error: any) { console.error('Error creating/updating news:', error); }
        }
    };
    //list
    const tableData = (Array.isArray(team) ? team : []).map((user: any, index: number) => ({
        client_user_id: user?.client_user_id || 'Unknow',
        client_user_name: user?.client_user_name || 'Unknow',
        client_user_email: user?.client_user_email || 'Unknow',
        client_role: user?.roles ? user?.roles[0]?.name : 'Unknow',
        user: user 
    }));
    // delete
    const handelDistory = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });
         if (result.isConfirmed) {
                dispatch(destoryuser(id)).unwrap().then((res) => {
                toast.success('Delete Successfully');
                dispatch(userlist());
            })
            .catch((error:any) => {
                Swal.fire('Error!', 'Failed to delete the blog.', 'error');
            });
        }
    };

    const handleEdit = async (id: number) => {  
        if(id){
            paramsSetId(id); 
        }
    };  

    return (
        <form ref={(el) => (combinedRef.current.userformRef = el)} className="space-y-5" onSubmit={saveUser}>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full lg:w-1/3 px-4">
                    <div className="panel">
                        <div className="panel-body">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label htmlFor="client_user_name">Username</label>
                                    <input name="client_user_name" type="text" placeholder="Username" className="form-input"/>
                                    {errors?.client_user_name && <p className="text-danger error">{errors.client_user_name[0]}</p>}
                                    
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client_user_phone">Phone</label>
                                    <input name="client_user_phone" type="tel" placeholder="Phone" className="form-input"/>
                                    {errors?.client_user_phone && <p className="text-danger error">{errors.client_user_phone[0]}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client_user_designation">Designation</label>
                                    <input name="client_user_designation" type="text" placeholder="Designation" className="form-input" />
                                    {errors?.client_user_designation && <p className="text-danger error">{errors.client_user_designation[0]}</p>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="client_user_email">Email</label>
                                    <input name="client_user_email" type="email" placeholder="Email" className="form-input" />
                                    {errors?.client_user_email && <p className="text-danger error">{errors.client_user_email[0]}</p>}
                                    
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input name="password" type="password" placeholder="Password" className="form-input" />
                                    {errors?.password && <p className="text-danger error">{errors.password[0]}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="client_user_status">Status</label>
                                    <Select name="client_user_status" placeholder="Select an option" options={options} value={options.find((option) => option.value === status)}  onChange={(selectedOption: any) => { setStatus(selectedOption);  }} />
                                    {errors?.client_user_status && <p className="text-danger error">{errors.client_user_status[0]}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client_sort_order">Sort Order</label>
                                    <input name="client_sort_order" type="text" placeholder="Sort Order" className="form-input" />
                                    {errors?.client_sort_order && <p className="text-danger error">{errors.client_sort_order[0]}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role_id">Roles</label>
                                    <Select name="role_id" placeholder="Select an option" options={roles.map(item => ({ value: item.id, label: item.name }))} onChange={(selectedrole: any) => { setRoles(selectedrole?.id); }}  value={roles.find((option) => option.id === urole)}  
                                    />
                                    {errors?.role_id && <p className="text-danger error">{errors.role_id[0]}</p>}
                                </div>
                                <div className="sm:col-span-2 flex justify-end">
                                    <button type="submit" className="btn btn-primary"> Submit </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full lg:w-2/3 px-2">
                    <div className="datatables">
                        <Table title="User List"
                            columns={[
                                { accessor: 'client_user_id', title: '#', sortable: true },
                                { accessor: 'client_user_name',  title: 'Name', sortable: true },
                                { accessor: 'client_user_email',  title: 'Email', sortable: true },
                                { accessor: 'client_role', title: 'Role', sortable: true},
                                { accessor: 'action',  title: 'Action', sortable: true,
                                    render: (user) => (
                                    <div className="flex items-center w-max mx-auto gap-2">
                                        <button type="button" onClick={() => handleEdit(user?.client_user_id)} className="btn px-1 py-0.5 rounded text-white bg-info"><IconPencil/></button>
                                        <button type="button" onClick={() => handelDistory(user?.client_user_id)} className="btn px-1 py-0.5 rounded text-white" style={{ background: "#d33", color : '#fff' }}><IconTrashLines/></button>

                                    </div>
                                    ),
                                },
                            ]} 
                            rows={tableData}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Users;
