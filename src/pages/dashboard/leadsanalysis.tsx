import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../slices/themeConfigSlice';
import IconUsersGroup from '../../components/Icon/IconUsersGroup';
import apiClient from '../../utils/apiClient';
import { topBarStatus, statues } from '../../services/status';
import IconServer from '../../components/Icon/IconServer';
import PerfectScrollbar from 'react-perfect-scrollbar';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import Dropdown from '../../components/Dropdown';
import { IRootState } from '../../store';
import IconChecks from '../../components/Icon/IconChecks';
import IconMail from '../../components/Icon/IconMail';
import IconPlus from '../../components/Icon/IconPlus';
import IconFile from '../../components/Icon/IconFile';
import IconChatDots from '../../components/Icon/IconChatDots';
import CustomSideNav from '../../components/CustomSideNav';

interface LeadData {
    total_leads: number;
    overall_total: number;
    percentages: Record<string, number>;
    status_counts: Record<string, number>;
    daily_counts?: Record<string, Record<string, number>>;
    recent_comments?: Array<{
        lead: {
            lead_title: any;
            lead_id: any;
        };
        agents: any;
        lead_comment_id: number;
        lead_id: string;
        agent_id: string | null;
        lead_status: number;
        lead_comment: string;
        created_at: string;
        updated_at: string;
        user_id: number;
    }>;
}

interface FilterOptions {
    agents: string[];
    statuses: string[];
}

const LeadsAnalysis = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [leadsData, setLeadsData] = useState<LeadData | null>(null);
    const [error, setError] = useState<any | null>(null);
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        agents: [],
        statuses: []
    });
    const loginuser       = useSelector((state: IRootState) => state.auth.user || {});
    useEffect(() => {
        dispatch(setPageTitle('Leads Analysis'));
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (filters.agents.length > 0) {
                    params.append('agents', filters.agents.join(','));
                }

                if (filters.statuses.length > 0) {
                    params.append('statuses', filters.statuses.join(','));
                }
                
                const response = await apiClient.get(`/leads/leads-analysis?${params.toString()}`);
                if (response.status === 200) {
                    console.log(response.data.data);
                    setLeadsData(response.data.data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters]);

        const generateChartData = (statusNumber: number) => {
            if (!leadsData?.daily_counts) return [];
            const dailyData = leadsData.daily_counts[statusNumber] || {};
            const dataPoints = Object.entries(dailyData)
                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                .map(([date, count]) => ({ x: date, y: count }));

            const status = statues().find(s => s.value == statusNumber);
            return [{
                name: status?.label || `Status ${statusNumber}`, // Fallback if status not found
                data: dataPoints.length > 0 ? dataPoints : [{ x: new Date().toISOString().split('T')[0], y: 0 }]
            }];
        };
            const getChartOptions = (color: string) => ({
        chart: {
            height: 160,
            type: 'area' as const,
            fontFamily: 'Nunito, sans-serif',
            sparkline: {
                enabled: true,
            },
        },
        stroke: {
            curve: 'smooth' as const,
            width: 2,
        },
        colors: [color],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        grid: {
            padding: {
                top: 5,
            },
        },
        yaxis: {
            show: false,
        },
        tooltip: {
            x: {
                show: true,
                format: 'dd MMM yyyy',
            },
            y: {
                title: {
                    formatter: () => '',
                },
            },
        },
    });

    const statusColors = [
        '#4361ee', // Primary blue
        '#805dca', // Purple
        '#00ab55', // Green
        '#e7515a', // Red
        '#ffbb44', // Orange
        '#2196f3', // Blue
        '#3b3f5c', // Dark
    ];

    const getStatusInfo = (statusLabel: string, index: number) => {
        const status = statues().find(s => s.label === statusLabel);
        const color = statusColors[index % statusColors.length];
        
        return {
            icon: status?.icon || <IconUsersGroup className="w-5 h-5" />,
            bgColor: status ? `${status.bgColor}/10` : 'bg-primary/10',
            color: color
        };
    };

    const handleFilterUpdate = (newFilters: FilterOptions) => {
        setFilters(newFilters);
        setIsCustomizerOpen(false);
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-danger">Error: {error.message}</div>;
    }

    if (!leadsData) {
        return <div className="text-center py-10">No data available</div>;
    }

    const uniqueVisitorSeries: any = {
        series: [
            {
                name: 'Direct',
                data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
            },
            {
                name: 'Organic',
                data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#5c1ac3', '#ffbb44'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 8,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li><Link to="/" className="text-primary hover:underline"> Dashboard </Link> </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2"><span>Analytics</span></li>
                </ul>

                <div className="flex space-x-2 rtl:space-x-reverse">
                    <span className="badge bg-dark text-white">
                        Overall Leads: {leadsData.total_leads}
                    </span>
                    <span className="badge bg-info text-white">
                        Filtered Leads: {Object.values(leadsData.status_counts).reduce((sum, count) => sum + count, 0)} leads
                    </span>
                </div>

                <div className="flex items-center">
                    <Link to="/pages/leads/dashboard" className="btn btn-success btn-sm"> Lead Dashboard </Link> &nbsp; &nbsp;
                     {loginuser?.roles[0].name === 'super admin' && (
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsCustomizerOpen(true)}> Update Filter </button>
                    )}
                </div>
            </div>
            <div className="pt-5">
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                    {Object.entries(leadsData.percentages).map(([statusNumber, percentage], index) => {
                        const statusNum = Number(statusNumber);
                        const status = statues().find(s => s.value == statusNum);
                        const statusInfo = getStatusInfo(status?.label || '', index);
                        return (
                            <div key={statusNumber} className="panel h-full p-0 rounded-2xl shadow-md bg-white dark:bg-gray-900">
                                <div className="flex items-center p-5">
                                    <div 
                                        className={`flex items-center justify-center w-12 h-12 rounded-full ${statusInfo.bgColor}`}
                                        style={{ color: statusInfo.color }}
                                    >
                                        {status?.icon || <IconUsersGroup className="w-5 h-5" />}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{percentage}%</p>
                                        <span className="text-sm text-gray-500 dark:text-white-light">
                                            {status?.label || `Status ${statusNumber}`}
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-white-light mt-1">
                                            {leadsData.status_counts[statusNumber]} leads
                                        </p>
                                    </div>
                                </div>
                                <div className="relative h-40">
                                    <ReactApexChart
                                        series={generateChartData(statusNum)}
                                        options={getChartOptions(statusInfo.color)}
                                        type="area"
                                        height={160}
                                        className="absolute bottom-0 w-full overflow-hidden"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full p-0 lg:col-span-2">
                        <div className="flex items-start justify-between dark:text-white-light mb-5 p-5 border-b border-white-light dark:border-[#1b2e4b]">
                            <h5 className="font-semibold text-lg">Unique Visitors</h5>
                        </div>
                        <ReactApexChart options={uniqueVisitorSeries.options} series={uniqueVisitorSeries.series} type="bar" height={360} className="overflow-hidden" />
                    </div>
                    <div className="panel h-full">
                        <div className="flex items-start justify-between dark:text-white-light mb-5 -mx-5 p-5 pt-0 border-b border-white-light dark:border-[#1b2e4b]">
                            <h5 className="font-semibold text-lg">Last Activities Report</h5>
                        </div>
                        <PerfectScrollbar className="perfect-scrollbar relative h-[360px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3">
                            <div className="space-y-7">
                                {leadsData.recent_comments?.map((comment) => (
                                    <div key={comment.lead_comment_id} className="flex">
                                        <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                            <div className="bg-primary shadow-primary w-8 h-8 rounded-full flex items-center justify-center text-white">
                                                <IconChatDots className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold dark:text-white-light"> {comment.lead_comment} </h5>
                                            <p className="text-white-dark text-xs">
                                                Lead : {comment.lead.lead_title} | {comment.created_at}
                                            </p>
                                            <span className="badge bg-success text-white">
                                                {comment.agent_id ? (
                                                    <> {comment?.agents?.client_user_name || 'Null'} </>
                                                ) : (
                                                    <span className="badge bg-success text-white">No Agent Assigned</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>
            </div>
            <CustomSideNav isOpen={isCustomizerOpen} onClose={() => setIsCustomizerOpen(false)} onFilterUpdate={handleFilterUpdate} initialFilters={filters} leadId={null} onSuccess={() => {}} />
        </div>
    );
};

export default LeadsAnalysis;