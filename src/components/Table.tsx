import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';


interface Column {
    accessor: string;
    title: string;
    sortable?: boolean;
    render?: (record: any) => JSX.Element; 
}

interface TableProps {
    columns: Column[];
    fetchData: () => Promise<any[]>;
    title: string;
}

const Table: React.FC<TableProps> = ({ columns, fetchData, title }) => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<any[]>([]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });
    
    useEffect(() => {
        fetchData()
            .then((data) => {
                const sortedData = sortBy(data, 'id');
                setInitialRecords(sortedData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [fetchData]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const filtered = initialRecords.filter((item) => columns.some((col) => String(item[col.accessor]).toLowerCase().includes(search.toLowerCase())));
        setRecordsData(filtered.slice(0, pageSize));
    }, [search, initialRecords, pageSize, columns]);

    useEffect(() => {
        const sortedData = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData);
    }, [sortStatus, initialRecords]);

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">{title}</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <DataTable
                    records={recordsData}
                    columns={columns}
                    totalRecords={initialRecords.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                />
           </div>
        </div>
    );
};

export default Table;
