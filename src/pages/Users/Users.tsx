import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../slices/themeConfigSlice';
import Swal from 'sweetalert2';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Loader from '../../services/loader';
import { options } from '../../services/status';
import Select from 'react-select';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPencil from '../../components/Icon/IconPencil';
import Table from '../../components/Table';
import { AppDispatch } from '../../store';

const endpoints = {
    createApi: `${getBaseUrl()}/users/create_user`,
    roleApi: `${getBaseUrl()}/users/get_user_role?for_select=1`,
    listApi: `${getBaseUrl()}/users/user_list`,
    destoryApi: `${getBaseUrl()}/users/delete_user`,
    updateApi: `${getBaseUrl()}/users/update_user`,
};

const Users = () => {
    const dispatch = useDispatch<AppDispatch>();
    const loader = Loader();
    const combinedRef = useRef<any>({ userformRef: null });
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState<any | null>(null);
    const [headId, setHeadId] = useState<any | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [urole, setRoles] = useState<any | null>(null);
    const [selectedRole, setSelectedRole] = useState<any | null>(null);
    const requestMade = useRef(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'client_user_id', direction: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [teamHeads, setTeamHeads] = useState<any[]>([]);

    useEffect(() => {
        if (!requestMade.current) {
            dispatch(setPageTitle('Create User'));
            fetchRoles();
            requestMade.current = true;
        }
    }, [dispatch]);

    useEffect(() => {
        fetchUserLists();
    }, [page, pageSize, sortStatus, searchQuery]);

    const fetchRoles = async () => {
        try {
            const response = await apiClient.get(endpoints.roleApi);
            if (response.data) {
                const roleOptions = response.data.map((role: any) => ({
                    value: role.id,
                    label: role.name,
                }));
                setRoles(roleOptions);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                window.location.href = '/error';
            }
        }
    };

    const fetchUserLists = async () => {
        try {
            const params = {
                page,
                per_page: pageSize,
                sort_field: sortStatus.columnAccessor,
                sort_order: sortStatus.direction,
                search: searchQuery
            };
            const response = await apiClient.get(endpoints.listApi, { params });
            if (response.data) {
                const allUsers = response.data.data.data || [];
                setUsers(allUsers);

                const heads = response.data.users.filter((user: any) =>
                    user.roles?.some((role: any) => role.name === 'Team Head')
                );
                console.log(heads);

                setTeamHeads(heads);
                setTotalRecords(response.data.data.total || 0);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                window.location.href = '/error';
            }
            // showServerError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (combinedRef.current.userformRef) {
                const formData = new FormData(combinedRef.current.userformRef);
                const userId = formData.get('client_user_id');
                const response = userId
                    ? await apiClient.post(`${endpoints.updateApi}/${userId}`, formData)
                    : await apiClient.post(endpoints.createApi, formData);

                if (response.status === 200 || response.status === 201) {
                    showSuccessToast(response.data.message);
                    fetchUserLists();
                    setErrors({});
                    combinedRef.current.userformRef.reset();
                    setSelectedRole(null);
                    setStatus(null);
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
            title: 'Server Errors',
        });
    };

    const handleEdit = async (user: any) => {
        if (combinedRef.current.userformRef) {
            const form = combinedRef.current.userformRef;
            form.reset();
            form.client_user_id.value = user.client_user_id || '';
            form.client_user_name.value = user.client_user_name || '';
            form.client_user_email.value = user.client_user_email || '';
            form.client_user_phone.value = user.client_user_phone || '';
            form.client_user_designation.value = user.client_user_designation || '';
            form.client_sort_order.value = user.client_sort_order || '';
            setStatus(user.client_user_status || '');

            const userrole = user.roles && user.roles[0];
            if (userrole) {
                const selectedRole = {
                    value: userrole.id,
                    label: userrole.name,
                };
                setSelectedRole(selectedRole);
            } else {
                setSelectedRole(null);
            }
        }
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
                const response = await apiClient.delete(endpoints.destoryApi + `/${user.client_user_id}`);
                if (response.status === 200 || response.status === 201) {
                    showSuccessToast('User deleted successfully');
                    fetchUserLists();
                }
            } catch (error: any) {
                if (error.response?.status === 403) {
                    window.location.href = '/error';
                }
                // showServerError();
            }
        }
    };

    const handleRoleChange = (selectedOption: any) => {
        setSelectedRole(selectedOption);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset to first page when searching
    };

    const handlePageChange = (p: number) => {
        setPage(p);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1);
    };

    const columns = [
        {
            accessor: 'client_user_id',
            title: '#',
            width: 80,
            key: 'id'
        },
        {
            accessor: 'client_user_name',
            title: 'Name',
            sortable: true,
            key: 'client_user_name_column'
        },
        {
            accessor: 'client_user_email',
            title: 'Email',
            sortable: true,
            key: 'email-column'
        },
        {
            accessor: 'actions',
            title: 'Actions',
            width: 120,
            key: 'actions-column',
            render: (item: any) => (
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="btn px-1 py-0.5 rounded text-white bg-info"
                        key={`edit-${item.client_user_id}`}
                    >
                        <IconPencil />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="btn px-1 py-0.5 rounded text-white bg-red-600"
                        key={`delete-${item.client_user_id}`}
                    >
                        <IconTrashLines />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <form ref={(el) => (combinedRef.current.userformRef = el)} onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-wrap -mx-4">
                <div className="w-full lg:w-1/3 px-4">
                    <div className="panel">
                        <div className="panel-body">
                            {/* <div className="grid mb-2">
                                <div className="form-group">
                                    <label htmlFor="client_user_name">Team Head</label>
                                    <Select
                                        name="team_head_id"
                                        placeholder="Select Team Head"
                                        options={teamHeads.map(head => ({
                                            value: head.client_user_id,
                                            label: head.client_user_name
                                        }))}
                                        value={teamHeads.find(head => head.client_user_id === headId) 
                                            ? { 
                                                value: headId, 
                                                label: teamHeads.find(head => head.client_user_id === headId).client_user_name 
                                            } 
                                            : null
                                        }
                                        onChange={(selected) => setHeadId(selected?.value || null)}
                                        
                                    />
                                    {errors.team_head_id && (
                                        <span className="text-red-500 text-sm">
                                            {errors.team_head_id}
                                        </span>
                                    )}
                                </div>
                            </div> */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label htmlFor="client_user_name">Username</label>
                                    <input
                                        name="client_user_name"
                                        type="text"
                                        placeholder="Username"
                                        className="form-input"
                                    />
                                    <input type="hidden" name="client_user_id" id="client_user_id" />
                                    {errors.client_user_name && (
                                        <span className="text-red-500 text-sm">
                                            {errors.client_user_name}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client_user_phone">Phone</label>
                                    <input
                                        name="client_user_phone"
                                        type="tel"
                                        placeholder="Phone"
                                        className="form-input"
                                    />
                                    {errors.client_user_phone && (
                                        <span className="text-red-500 text-sm">
                                            {errors.client_user_phone}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client_user_designation">Designation</label>
                                    <input
                                        name="client_user_designation"
                                        type="text"
                                        placeholder="Designation"
                                        className="form-input"
                                    />
                                    {errors.client_user_designation && (
                                        <span className="text-red-500 text-sm">
                                            {errors.client_user_designation}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client_user_email">Email</label>
                                    <input
                                        name="client_user_email"
                                        type="email"
                                        placeholder="Email"
                                        className="form-input"
                                    />
                                    {errors.client_user_email && (
                                        <span className="text-red-500 text-sm">
                                            {errors.client_user_email}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input name="password" type="password" placeholder="Password" className="form-input" />
                                    {errors.password && (
                                        <span className="text-red-500 text-sm">
                                            {errors.password}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client_user_status">Status</label>
                                    <Select
                                        name="client_user_status"
                                        placeholder="Select an option"
                                        options={options}
                                        value={options.find((option) => option.value === status)}
                                        onChange={(selected) => setStatus(selected?.value || null)}
                                    />
                                    {errors.client_user_status && (
                                        <span className="text-red-500 text-sm">
                                            {errors.client_user_status}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="client_sort_order">Sort Order</label>
                                    <input
                                        name="client_sort_order"
                                        type="text"
                                        placeholder="Sort Order"
                                        className="form-input"
                                    />
                                    {errors.client_sort_order && (
                                        <span className="text-red-500 text-sm">
                                            {errors.client_sort_order}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role_id">Role</label>
                                    <Select
                                        name="role_id"
                                        placeholder="Select an option"
                                        options={urole || []}
                                        value={selectedRole}
                                        onChange={handleRoleChange}
                                    />
                                    {errors.role_id && (
                                        <span className="text-red-500 text-sm">
                                            {errors.role_id}
                                        </span>
                                    )}
                                </div>
                                <div className="sm:col-span-2 flex justify-end">
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-2/3 px-2 mt-6 lg:mt-0 md-mt-0">
                    <div className="datatables">
                        <Table
                            columns={columns}
                            rows={users}
                            title="List of all Users"
                            idAccessor="client_user_id"
                            totalRecords={totalRecords}
                            currentPage={page}
                            recordsPerPage={pageSize}
                            onPageChange={handlePageChange}
                            onRecordsPerPageChange={handlePageSizeChange}
                            onSortChange={setSortStatus}
                            onSearchChange={handleSearchChange}
                            sortStatus={sortStatus}
                            isLoading={false}
                            minHeight={200}
                            noRecordsText="No users found"
                            searchValue={searchQuery}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Users;
