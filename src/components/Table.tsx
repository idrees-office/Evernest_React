import React, { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { IRootState } from '../store';
import { useSelector } from 'react-redux';

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
  const PAGE_SIZES = [20, 30, 40, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [paginatedRecords, setPaginatedRecords] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'id',
    direction: 'desc',
  });
  
  // Filter and sort records based on search and sortStatus
  useEffect(() => {
    const filtered = rows.filter((row) =>
      columns.some((col) =>
        String(row[col.accessor] || '').toLowerCase().includes(search.toLowerCase())
      )
    );
    const sorted = sortBy(filtered, sortStatus.columnAccessor);
    setFilteredRecords(
      sortStatus.direction === 'desc' ? sorted.reverse() : sorted
    );
  }, [rows, search, columns, sortStatus]);

  // Paginate the filtered and sorted records
  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setPaginatedRecords(filteredRecords.slice(from, to));
  }, [page, pageSize, filteredRecords]);

  return (
    <div>
      <div className="panel">
        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
          <h5 className="font-semibold text-lg dark:text-white-light">
            {title}
          </h5>
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
        <div className="datatables">
          <DataTable
            className="whitespace-nowrap table-hover"
            records={paginatedRecords}
            columns={columns}
            highlightOnHover
            totalRecords={filteredRecords.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            minHeight={150}
            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries` }
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
