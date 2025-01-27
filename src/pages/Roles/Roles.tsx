import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../slices/themeConfigSlice';
import Swal from 'sweetalert2';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import Table from "../../components/Table";
import Loader from '../../services/loader';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';

const endpoints = {
    listApi    : `${getBaseUrl()}/users/get_user_role`,
    createApi  : `${getBaseUrl()}/users/create_role`,
    destoryApi : `${getBaseUrl()}/users/delete_role`,
};

const Roles = () => {
    const dispatch = useDispatch();
    
    const [roles, rolesList] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
    });

    useEffect(() => {
        dispatch(setPageTitle('Create Role'));
        fetchRoleLists();
    }, []);

    const tableData = (Array.isArray(roles) ? roles : []).map((role: any, index: number) => ({
        id: role.id,
        name: role.name,
        role: role
        
    }));

    const fetchRoleLists = async () => {
        try {
            const response = await apiClient.get(endpoints.listApi);
            if (response.data) {
                rolesList(response.data);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                window.location.href = '/error';
            }
            showServerError('Something wrong on server');
        }
    };

    const [errors, setErrors] = useState<Record<string, string>>({});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await apiClient.post(
                formData.id ? `${endpoints.createApi}/${formData.id}` : endpoints.createApi,
                formData
            );

            if (response.status === 200 || response.status === 201) {
                showSuccessToast(response.data.message);
                setFormData({ id: '', name: '' });
                fetchRoleLists();
            }
        } catch (error: any) {
            console.log(error);
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.status === 403) {
                window.location.href = '/error';
            } else {
                // showServerError();
            }
        }
    };

    const showSuccessToast = (message: string) => {
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: message,
            icon: 'success',
        });
    };

    const showServerError = (response:any) => {
        Swal.fire({
            text: response,
            icon: 'error',
            title: 'Server Error',
        });
    };

    const handleEdit = async (user: any) => {
        setFormData({
            id: user.id,
            name: user.name,
        });
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });
        if (result.isConfirmed) {
            try {
                const response = await apiClient.delete(endpoints.destoryApi+'/'+id);
                if (response.status == 200 || response.status === 200) {
                    showSuccessToast('Roles deleted successfully');
                    fetchRoleLists(); 
                }
            } catch (error: any) {
                if (error.response?.status === 403) {
                    window.location.href = '/error';
                }
                showServerError('Something wrong on server');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-wrap -mx-4">
                <div className="w-full lg:w-1/3 px-4">
                    <div className="panel">
                        <div className="panel-body">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input name="name" type="text" placeholder="Name" className="form-input" value={formData.name} onChange={handleChange} />
                                {errors.name && ( <span className="text-red-500 text-sm">{errors.name}</span> )}
                            </div>
                            <div className="sm:col-span-2 flex justify-end mt-3">
                                <button type="submit" className="btn btn-primary"> Submit </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-2/3 px-2">
                    <div className="datatables">
                        <Table title="Role List"
                            columns={[
                                { accessor: 'id', title: '#', sortable: true },
                                { accessor: 'name',  title: 'Name', sortable: true },
                                { accessor: 'action',  title: 'Action', sortable: true,
                                    render: (role) => (
                                        <div className="flex space-x-2">
                                            <button type="button" onClick={() => handleEdit(role)} className="btn px-1 py-0.5 rounded text-white bg-info">
                                                <IconPencil />
                                            </button>
                                            <button type="button" onClick={() => handleDelete(role.id)} className="btn px-1 py-0.5 rounded text-white" style={{ background: '#d33', color: '#fff' }}>
                                                <IconTrashLines />
                                            </button>
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

export default Roles;
