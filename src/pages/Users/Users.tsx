import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../slices/themeConfigSlice';
import Swal from 'sweetalert2';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import Table from "./../../components/Table";
import Loader from '../../services/loader';

const Users = () => {
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
    
    const [defineRoles, setDefineRoles] = useState<Role[]>([]);
    const [users, usersList] = useState([]);
    
    const [formData, setFormData] = useState({
        client_user_id: '',
        client_user_name: '',
        client_user_phone: '',
        client_user_designation: '',
        client_user_email: '',
        password: '',
        client_user_status: '',
        client_sort_order: '',
        role_id: ''
    });

    useEffect(() => {
        dispatch(setPageTitle('Create User'));
        fetchRoles();
        fetchUserLists();
    }, []);

    const tableData = (Array.isArray(users) ? users : []).map((user: any, index: number) => ({
        client_user_id: user.client_user_id,
        client_user_name: user.client_user_name,
        client_user_email: user.client_user_email,
        client_role: user.roles[0]?.name,
        user: user
        
    }));

    const fetchRoles = async () => {
        try {
            const response = await apiClient.get(`${getBaseUrl()}/users/get_user_role`);
            if (response.data) {
                setDefineRoles(response.data);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                window.location.href = '/error';
            }
            showServerError();
        }
    };

    const fetchUserLists = async () => {
        try {
            const response = await apiClient.get(`${getBaseUrl()}/users/user_list`);
            if (response.data) {
                usersList(response.data);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                window.location.href = '/error';
            }
            showServerError();
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
            const response = await apiClient.post(`${getBaseUrl()}/users/create_user`, formData);
            
            if (response.data.status === 'success') {
                showSuccessToast(response.data.message);
                setFormData({
                    client_user_id: '',
                    client_user_name: '',
                    client_user_phone: '',
                    client_user_designation: '',
                    client_user_email: '',
                    password: '',
                    client_user_status: '',
                    client_sort_order: '',
                    role_id: ''
                });
                fetchUserLists();
                setErrors({})
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
            else if(error.response?.status === 403) {
                window.location.href = '/error';
            }
            else {
                showServerError();
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

    const showServerError = () => {
        Swal.fire({
            text: 'Something went wrong on the server',
            icon: 'error',
            title: 'Server Error',
        });
    };

    const handleEdit = async (user: any) => {
        setFormData({
            client_user_id: user.client_user_id,
            client_user_name: user.client_user_name,
            client_user_phone: user.client_user_phone,
            client_user_designation: user.client_user_designation,
            client_user_email: user.client_user_email,
            password: '',
            client_user_status: user.client_user_status.toString(),
            client_sort_order: user.client_sort_order,
            role_id: user.roles[0]?.id.toString() || ''
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
                const response = await apiClient.delete(`${getBaseUrl()}/users/delete_user/${user.client_user_id}`);
                if (response.data.status === 'success') {
                    showSuccessToast('User deleted successfully');
                    fetchUserLists(); // Refresh the user list
                }
            } catch (error: any) {
                if (error.response?.status === 403) {
                    window.location.href = '/error';
                }
                showServerError();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-wrap -mx-4">
                <div className="w-full lg:w-1/3 px-4">
                    <div className="panel">
                        {/* <h2 className="font-semibold fs-3">Create User</h2> */}
                        <div className="panel-body">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label htmlFor="client_user_name">Username</label>
                                    <input
                                        name="client_user_name"
                                        type="text"
                                        placeholder="Username"
                                        className="form-input"
                                        value={formData.client_user_name}
                                        onChange={handleChange}
                                    />
                                    {errors.client_user_name && (
                                        <span className="text-red-500 text-sm">{errors.client_user_name}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="client_user_phone">Phone</label>
                                    <input
                                        name="client_user_phone"
                                        type="tel"
                                        placeholder="Phone"
                                        className="form-input"
                                        value={formData.client_user_phone}
                                        onChange={handleChange}
                                    />
                                    {errors.client_user_phone && (
                                        <span className="text-red-500 text-sm">{errors.client_user_phone}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="client_user_designation">Designation</label>
                                    <input
                                        name="client_user_designation"
                                        type="text"
                                        placeholder="Designation"
                                        className="form-input"
                                        value={formData.client_user_designation}
                                        onChange={handleChange}
                                    />
                                    {errors.client_user_designation && (
                                        <span className="text-red-500 text-sm">{errors.client_user_designation}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="client_user_email">Email</label>
                                    <input
                                        name="client_user_email"
                                        type="email"
                                        placeholder="Email"
                                        className="form-input"
                                        value={formData.client_user_email}
                                        onChange={handleChange}
                                    />
                                    {errors.client_user_email && (
                                        <span className="text-red-500 text-sm">{errors.client_user_email}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <span className="text-red-500 text-sm">{errors.password}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="client_user_status">Status</label>
                                    <select
                                        name="client_user_status"
                                        className="form-select"
                                        value={formData.client_user_status}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Status</option>
                                        {options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.client_user_status && (
                                        <span className="text-red-500 text-sm">{errors.client_user_status}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="client_sort_order">Sort Order</label>
                                    <input
                                        name="client_sort_order"
                                        type="text"
                                        placeholder="Sort Order"
                                        className="form-input"
                                        value={formData.client_sort_order}
                                        onChange={handleChange}
                                    />
                                    {errors.client_sort_order && (
                                        <span className="text-red-500 text-sm">{errors.client_sort_order}</span>
                                    )}
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="client_user_status">Status</label>
                                    <select
                                        name="client_user_status"
                                        className="form-select"
                                        value={formData.role_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Roles</option>
                                        {defineRoles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.role_id && (
                                    <span className="text-red-500 text-sm">{errors.role_id}</span>
                                )}

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
                                        <div className="flex space-x-2">
                                            <button 
                                                type="button"
                                                onClick={() => handleEdit(user.user)}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => handleDelete(user.user)}
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

export default Users;
