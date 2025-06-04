import React, { useState, useEffect, useRef, Fragment } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Table from '../../components/Table';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import { Link } from 'react-router-dom';
import IconTrendingUp from '../../components/Icon/IconTrendingUp';
import { setPageTitle } from '../../slices/themeConfigSlice';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import IconClock from '../../components/Icon/IconClock';
import IconCircleCheck from '../../components/Icon/IconChecks';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';

const endpoints = {
    reportApi: `${getBaseUrl()}/subscriber/tracking-report`,
    userReadEmailApi: `${getBaseUrl()}/subscriber/check-read-email`,
};

const CampaignStatistics = () => {
    const dispatch = useDispatch<AppDispatch>();
    const combinedRef = useRef<any>({ fetched: false });
    const [campaignData, setCampaignData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({
        subscriber: 0,
        totalCampaigns: 0,
        totalEmails: 0,
        totalSendCampaigns : 0,
        PendingCampaign : 0,
        openRate: 0,
        hotLeads: 0
    });

    const [openModal, SetopenModal] = useState(false);
    const [hotLeadsDetail, setHotLeadsDetail] = useState([]);


    useEffect(() => {
        // if(!combinedRef.current.fetched){
          dispatch(setPageTitle('Create User'));
             fetchData();
             combinedRef.current.fetched = true;
        // }
    }, [ dispatch , page, pageSize, sortStatus]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(endpoints.reportApi, {
                params: {
                    page: page,
                    per_page: pageSize,
                    sort_field: sortStatus.columnAccessor,
                    sort_direction: sortStatus.direction
                }
            });
            
            setCampaignData(response.data.reports);
            setStats({subscriber: response.data.subscriber, totalCampaigns: response.data.totalCampaigns, totalEmails: response.data.totalEmails, totalSendCampaigns : response.data.totalSendCampaigns, PendingCampaign : response.data.PendingCampaign, openRate: response.data.openRate, hotLeads: response.data.hotLeads});
            setTotalRecords(response.data.totalCampaigns);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleHotLeadsClick = async () => {
         const response = await apiClient.get(endpoints.userReadEmailApi)
        if (response.data) {
            setHotLeadsDetail(response.data);
            SetopenModal(true);
        }
    }

    const closeModal = (value: boolean) => {
        SetopenModal(value);
    };


    const columns = [
        {
            accessor: 'id',
            title: 'Total',
            sortable: true,
            key : 'id',
        },
        {
            accessor: 'name',
            title: 'Campaign Name',
            sortable: true,
            key : 'name',
            render: (record: any) => (
                <div className="text-black dark:text-white">
                    <span className="whitespace-nowrap">{record.name}</span>
                </div>
            )
        },
        {
            accessor: 'type',
            title: 'Type',
            key : 'type',
            render: (record: any) => (
                record.type == 1 ? <span className="badge bg-success">Immidiate</span> :
                <span className="badge bg-warning">Scheduled</span>
            )
        },
        {
            accessor: 'total',
            title: 'Total',
            sortable: true,
            key : 'total',
        },
        {
            accessor: 'sent',
            title: 'Sent',
            sortable: true,
            key : 'send',

        },
        {
            accessor: 'read',
            title: 'Read',
            sortable: true,
            key : 'read',
        },
        {
            accessor: 'scheduled_at',
            title: 'Scheduled At | Send-Time',
            key : 'scheduled_at',
        },
        {
            accessor: 'created_at',
            title: 'Created At',
            key : 'created_at',
        },
        {
            accessor: 'status',
            title: 'Status',
            key : 'status',
            render: (record: any) => (
                record.status == 1 ? <IconClock className="text-success" /> : <IconCircleCheck className="text-info" />
            )
        }
    ];

    return (

        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline"> Dashboard </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Analytics</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
                    <div className="panel h-full sm:col-span-2 lg:col-span-1">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Campaign Summary</h5>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                            <div>
                                <div>Total Emails</div>
                                <div className="text-[#f8538d] text-md">{stats.totalEmails}</div>
                            </div>
                            <div>
                                <div>Total Campaigns</div>
                                <div className="text-[#f8538d] text-md">{stats.totalCampaigns}</div>
                            </div>
                        </div>
                    </div>
                    <div className="panel h-full sm:col-span-2 lg:col-span-1">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Campaign Performance</h5>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                            <div>
                                <div>Pending Campaigns</div>
                                <div className="text-[#f8538d] text-sm">{stats.PendingCampaign}</div>
                            </div>
                            <div>
                                <div>Send Campaigns</div>
                                <div className="text-[#f8538d] text-sm">{stats.totalSendCampaigns}</div>
                            </div>
                        </div>
                    </div>
                    {/* Email Performance */}
                    <div className="panel h-full sm:col-span-2 lg:col-span-1">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Email Performance</h5>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                            <div>
                                <div>Open Rate</div>
                                <div className="text-[#f8538d] text-sm">{stats.openRate}%</div>
                            </div>
                            <div style={{ cursor: 'pointer' }} onClick={handleHotLeadsClick}>
                                <div>Hot Leads</div>
                                <div className="text-[#f8538d] text-sm">{stats.hotLeads}</div>
                            </div>
                        </div>
                    </div>
                    {/* Subscribers */}
                    <div className="panel h-full">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Current | Total Subscribers</h5>
                        </div>
                        <div className=" text-[#e95f2b] text-3xl font-bold my-10">
                            <span>{stats.subscriber}</span>
                            <IconTrendingUp className="text-success inline ml-2" />
                        </div>
                    </div>

                </div>
            </div>
             <div className="pt-2">
            <div className="h-full w-full">
                <Table columns={columns} rows={campaignData} title="" totalRecords={totalRecords} currentPage={page} recordsPerPage={pageSize} onPageChange={setPage} onRecordsPerPageChange={setPageSize} onSortChange={setSortStatus} sortStatus={sortStatus} isLoading={isLoading} noRecordsText="No campaign data available" idAccessor="id"
                />
            </div>
        </div>
        <Transition appear show={openModal} as={Fragment}>
            <Dialog as="div" open={openModal} onClose={() => closeModal(false)}>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex items-start justify-center">
                        <Transition.Child enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-7xl my-8 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <div className="text-lg font-bold">Report</div>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => closeModal(false)}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    {hotLeadsDetail.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-100 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="border-b p-3 text-left">Subscriber</th>
                                                        <th className="border-b p-3 text-left">Campaign</th>
                                                        <th className="border-b p-3 text-left">Emails</th>
                                                        <th className="border-b p-3 text-left">Reads</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {hotLeadsDetail.map((lead: any, index: number) => (
                                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="border-b p-3">{lead.name}</td>
                                                            <td className="border-b p-3">{lead.campaign}</td>
                                                            <td className="border-b p-3">{lead.emails}</td>
                                                            <td className="border-b p-3">{lead.read}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div>No hot leads found.</div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </div>
    );
};

export default CampaignStatistics;
