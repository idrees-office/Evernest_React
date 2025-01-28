import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'; // Assuming you're using axios
import Toast from '../../services/toast';
import apiClient from '../../utils/apiClient';

interface PermissionData {
    id: number;
    name: string;
    counter: number;
}

interface FormData {
    roles: string;
    clients: string;
    checkedItems: number[];
}

const AssignPermission = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [allAgents, setAllAgents] = useState<any[]>([]);
    const [dataSource, setDataSource] = useState<PermissionData[]>([]);
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    
    const { register, handleSubmit, reset } = useForm<FormData>();
    const toast = Toast();

    useEffect(() => {
        getRoles();
        getAgents();
        getPermissions();
    }, []);

    const getRoles = async () => {
        try {
            const response = await apiClient.get('/users/get_user_role');
            setRoles(response.data);
        } catch (error) {
            toast.error('Failed to fetch roles');
        }
    };

    const getAgents = async () => {
        try {
            const response = await apiClient.get('/users/user_list');
            setAllAgents(response.data);
        } catch (error) {
            toast.error('Failed to fetch agents');
        }
    };

    const getPermissions = async () => {
        try {
            const response = await apiClient.get('/users/get_permissions');
            const formattedData = response.data.map((item: any, index: number) => ({
                ...item,
                counter: index + 1
            }));
            setDataSource(formattedData);
        } catch (error) {
            toast.error('Failed to fetch permissions');
        }
    };

    const handleRoleChange = async (roleId: string) => {
        reset({ clients: '' }); // Reset client selection
        try {
            const response = await apiClient.get(`/users/role_permissions/${roleId}`);
            setCheckedItems(response.data);
        } catch (error) {
            toast.error('Failed to fetch role permissions');
        }
    };

    const handleAgentChange = async (userId: string) => {
        reset({ roles: '' }); // Reset role selection
        try {
            console.log(userId);
            const response = await apiClient.get(`/users/user_permissions/${userId}`);
            setCheckedItems(response.data);
        } catch (error) {
            toast.error('Failed to fetch user permissions');
        }
    };

    const toggleCheckbox = (item: PermissionData) => {
        setCheckedItems(prev => {
            if (prev.includes(item.id)) {
                return prev.filter(id => id !== item.id);
            }
            return [...prev, item.id];
        });
    };

    const onSubmit = async (formData: FormData) => {
        try {
            const payload = new FormData();
            if (formData.clients) {
                payload.append('client_user_id', formData.clients);
            }
            if (formData.roles) {
                payload.append('role_id', formData.roles);
            }
            payload.append('permission', checkedItems.join(','));

            const response = await apiClient.post('/users/assign_permission', payload);
            if (response.data.status === 'success') {
                toast.success('Permissions assigned successfully');
                reset();
                setCheckedItems([]);
            }
        } catch (error) {
            toast.error('Failed to assign permissions');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white shadow-md rounded-md">
            <div className="mb-4">
                <h2 className="text-xl font-bold">Assign Permission</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">User-Role</label>
                    <select
                        {...register('roles')}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Users</label>
                    <select
                        {...register('clients')}
                        onChange={(e) => handleAgentChange(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
                    >
                        <option value="">Select Agent</option>
                        {allAgents.map((agent) => (
                            <option key={agent.client_user_id} value={agent.client_user_id}>{agent.client_user_name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dataSource.map((row) => (
                            <tr key={row.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={checkedItems.includes(row.id)}
                                        onChange={() => toggleCheckbox(row)}
                                        className="mr-2"
                                    />
                                    {row.counter}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{row.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                type="submit"
                disabled={!checkedItems.length}
                className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
                Assign
            </button>
        </form>
    );
};

export default AssignPermission;
