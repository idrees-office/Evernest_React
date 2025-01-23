import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../slices/themeConfigSlice';
import Swal from 'sweetalert2';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import Table from "./../../components/Table";
import Loader from '../../services/loader';

const Roles = () => {
    const dispatch = useDispatch();
    const loader   = Loader();

    const [options] = useState([
        { value: '1', name: 'Active' },
        { value: '0', name: 'Inactive' }
    ]);
    
    interface Role {
        id: number;
        name: string;
    }
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
            const response = await apiClient.get(`${getBaseUrl()}/users/get_user_role`);
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

        try {
            const response = await apiClient.post(`${getBaseUrl()}/users/create_role`, formData);
            
            if (response.data.status === 'success') {
                showSuccessToast(response.data.message);
                setFormData({
                    id: '',
                    name: ''
                });
                fetchRoleLists();
                setErrors({})
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                showServerError(error.response?.data?.message || 'An error occurred');
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

    const handleDelete = async (user: any) => {
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
                const response = await apiClient.delete(`${getBaseUrl()}/roles/delete_user/${user.id}`);
                if (response.data.status === 'success') {
                    showSuccessToast('Roles deleted successfully');
                    fetchRoleLists(); // Refresh the user list
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
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm">{errors.name}</span>
                                )}
                            </div>

                            <div className="sm:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Submit
                                </button>
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
                                            <button 
                                                type="button"
                                                onClick={() => handleEdit(role)}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => handleDelete(role)}
                                                className="btn btn-sm btn-outline-danger"
                                            >
                                                Delete
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
