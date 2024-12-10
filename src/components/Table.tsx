
import React, { useState, useEffect } from 'react';
import { sortBy } from 'lodash';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';


interface Column {
    accessor: string;
    title: string;
    sortable?: boolean;
    render?: (record: any) => JSX.Element;
}

interface TableProps {
    columns: Column[];
    rows: any[];
    title: string;
}

const Table: React.FC<TableProps> = ({ columns, rows, title }) => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    useEffect(() => {
        const filtered = rows.filter((row) =>
            columns.some((col) =>
                String(row[col.accessor] || '').toLowerCase().includes(search.toLowerCase())
            )
        );
        const sortedData = sortBy(filtered, sortStatus.columnAccessor);
        setFilteredRecords(sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData);
        setPage(1); 
    }, [rows, search, columns, sortStatus]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(filteredRecords.slice(from, to));
    }, [page, pageSize, filteredRecords]);

    const paginationSummary = `Showing ${Math.min((page - 1) * pageSize + 1, filteredRecords.length)} to ${Math.min(page * pageSize, filteredRecords.length)} of ${filteredRecords.length} entries`;
    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">{title}</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <DataTable
                    records={recordsData}
                    columns={columns}
                    totalRecords={filteredRecords.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                />
                {/* Custom Pagination Summary */}
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {paginationSummary}
                </div>
            </div>
        </div>
    );
};

export default Table;

// Remove recordsPerPageOptions to hide dropdown
// recordsPerPageOptions={[]}
// onRecordsPerPageChange={setPageSize}
// sortStatus={sortStatus}
// onSortStatusChange={setSortStatus}

