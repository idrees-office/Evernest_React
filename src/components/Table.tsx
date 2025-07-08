import React from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';

interface Column {
  accessor: string;
  // title: string;
  title: string | React.ReactNode;
  sortable?: boolean;
  render?: (record: any) => JSX.Element;
  width?: string | number;
}

interface TableProps {
  columns: Column[];
  rows: any[];
  title: string;
  totalRecords: number;
  currentPage: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (pageSize: number) => void;
  onSortChange?: (sortStatus: DataTableSortStatus) => void;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortStatus?: DataTableSortStatus;
  isLoading?: boolean;
  height?: string | number;
  minHeight?: string | number;
  searchValue?: string;
  noRecordsText :string
  idAccessor?: string;
}

const Table: React.FC<TableProps> = ({ 
  columns, 
  rows, 
  title, 
  totalRecords, 
  currentPage, 
  recordsPerPage, 
  onPageChange, 
  onRecordsPerPageChange,
  onSortChange,
  onSearchChange,
  sortStatus = { columnAccessor: 'id', direction: 'desc' },
  isLoading = false,
  height,
  minHeight = 200,
  noRecordsText = 'No records found',
  searchValue = '',
  idAccessor
}) => {
  const PAGE_SIZES = [10, 20, 30, 50, 100];

  return (
    <div className="panel">
      <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
        <h5 className="font-semibold text-lg dark:text-white-light">
          {title}
        </h5>
        {onSearchChange && (
          <div className="ltr:ml-auto rtl:mr-auto">
            <input 
              type="text" 
              className="form-input w-auto" 
              placeholder="Search..." 
              value={searchValue} 
              onChange={onSearchChange} 
            />
          </div>
        )}
      </div>
      <div className="datatables">
        <DataTable 
          className="whitespace-nowrap table-hover" 
          records={rows} 
          columns={columns} 
          highlightOnHover
          totalRecords={totalRecords}
          recordsPerPage={recordsPerPage}
          page={currentPage}
          onPageChange={onPageChange}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={onRecordsPerPageChange}
          sortStatus={sortStatus}
          onSortStatusChange={onSortChange}
          minHeight={minHeight}
          height={height}
          paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
          fetching={isLoading}
          loaderVariant="dots"
          noRecordsText={noRecordsText}
          idAccessor={idAccessor}
        />
      </div>
    </div>
  );
};

export default Table;
