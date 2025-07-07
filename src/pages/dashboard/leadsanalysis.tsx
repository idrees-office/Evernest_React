import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../slices/themeConfigSlice';
import IconUsersGroup from '../../components/Icon/IconUsersGroup';
import apiClient from '../../utils/apiClient';
import { topBarStatus } from '../../services/status';
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

interface LeadData {
    total_leads: number;
    percentages: Record<string, number>;
    status_counts: Record<string, number>;
    daily_counts?: Record<string, Record<string, number>>; // Add daily counts structure

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

const LeadsAnalysis = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [leadsData, setLeadsData] = useState<LeadData | null>(null);
    const [error, setError] = useState<any | null>(null);
    const STATUSES = topBarStatus();

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    
    useEffect(() => {
        dispatch(setPageTitle('Leads Analysis'));
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/leads/leads-analysis');
                if (response.status === 200) {
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
    }, []);

   const generateChartData = (statusName: string) => {
        if (!leadsData?.daily_counts) return [];
        const dailyData = leadsData.daily_counts[statusName] || {};
        const dataPoints = Object.entries(dailyData)
            .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
            .map(([date, count]) => ({ x: date, y: count }));

        return [{
            name: statusName,
            data: dataPoints.length > 0 ? dataPoints : [{ x: new Date().toISOString().split('T')[0], y: 0 }]
        }];
    };

    // Chart options
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
    ];

    // Get status info from STATUSES array
    const getStatusInfo = (statusName: string, index: number) => {
        const status = STATUSES.find(s => s.label === statusName);
        const color = statusColors[index % statusColors.length];
        
        return {
            icon: status?.icon || <IconUsersGroup className="w-5 h-5" />,
            bgColor: status ? `${status.bgColor}/10` : 'bg-primary/10',
            color: color
        };
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
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Analytics</span>
                    </li>
                </ul>
                <Link to="/pages/leads/dashboard" className="btn btn-success btn-sm flex items-center gap-2"> Lead Dashboard </Link>
            </div>
            <div className="pt-5">
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                    {Object.entries(leadsData.percentages).map(([statusName, percentage], index) => {
                        const statusInfo = getStatusInfo(statusName, index);
                        return (
                            <div key={statusName} className="panel h-full p-0 rounded-2xl shadow-md bg-white dark:bg-gray-900">
                                <div className="flex items-center p-5">
                                    <div 
                                        className={`flex items-center justify-center w-12 h-12 rounded-full ${statusInfo.bgColor}`}
                                        style={{ color: statusInfo.color }}
                                    >
                                        {statusInfo.icon}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{percentage}%</p>
                                        <span className="text-sm text-gray-500 dark:text-white-light">{statusName}</span>
                                        <p className="text-sm text-gray-500 dark:text-white-light mt-1">
                                            {leadsData.status_counts[statusName]} leads
                                        </p>
                                    </div>
                                </div>
                                <div className="relative h-40">
                                    <ReactApexChart
                                        series={generateChartData(statusName)}
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
                        <div className="flex items-start justify-between dark:text-white-light mb-5 p-5 border-b  border-white-light dark:border-[#1b2e4b]">
                            <h5 className="font-semibold text-lg ">Unique Visitors</h5>
                            {/* <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    btnClassName="hover:text-primary"
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View</button>
                                        </li>
                                        <li>
                                            <button type="button">Update</button>
                                        </li>
                                        <li>
                                            <button type="button">Delete</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div> */}
                        </div>
                        <ReactApexChart options={uniqueVisitorSeries.options} series={uniqueVisitorSeries.series} type="bar" height={360} className="overflow-hidden" />
                    </div>
                    <div className="panel h-full">
                        <div className="flex items-start justify-between dark:text-white-light mb-5 -mx-5 p-5 pt-0 border-b border-white-light dark:border-[#1b2e4b]">
                            <h5 className="font-semibold text-lg">Last Activities Report</h5>
                        </div>
                        <PerfectScrollbar className="perfect-scrollbar relative h-[360px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3">
                            <div className="space-y-7">
                                {leadsData.recent_comments?.map((comment, index) => (
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
                                                Responsible Agent: <span className="badge bg-success text-white">
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
        </div>
    );
};

export default LeadsAnalysis;