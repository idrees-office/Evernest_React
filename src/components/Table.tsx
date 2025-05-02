// import React, { useEffect, useState } from 'react';
// import { DataTable, DataTableSortStatus } from 'mantine-datatable';

// interface Column {
//   accessor: string;
//   title: string;
//   sortable?: boolean;
//   render?: (record: any) => JSX.Element;
//   width?: string | number;
// }

// interface TableProps {
//   columns: Column[];
//   rows: any[];
//   title: string;
//   totalRecords: number;
//   currentPage: number;
//   recordsPerPage: number;
//   onPageChange: (page: number) => void;
//   onRecordsPerPageChange: (pageSize: number) => void;
//   onSortChange?: (sortStatus: DataTableSortStatus) => void;
//   onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   sortStatus?: DataTableSortStatus;
//   isLoading?: boolean;
//   height?: string | number;
//   minHeight?: string | number;
// }

// const Table: React.FC<TableProps> = ({ 
//   columns, 
//   rows, 
//   title, 
//   totalRecords, 
//   currentPage, 
//   recordsPerPage, 
//   onPageChange, 
//   onRecordsPerPageChange,
//   onSortChange,
//   onSearchChange,
//   sortStatus = { columnAccessor: 'id', direction: 'desc' },
//   isLoading = false,
//   height,
//   minHeight = 200
// }) => {
//   const PAGE_SIZES = [10, 20, 30, 50, 100];
//   const [search, setSearch] = useState('');

//   // If you want client-side search, you can filter records here
//   const [filteredRecords, setFilteredRecords] = useState<any[]>(rows);

//   useEffect(() => {
//     if (search) {
//       const filtered = rows.filter((row) =>
//         columns.some((col) =>
//           String(row[col.accessor] || '').toLowerCase().includes(search.toLowerCase())
//         )
//       );
//       setFilteredRecords(filtered);
//     } else {
//       setFilteredRecords(rows);
//     }
//   }, [search, rows, columns]);


  


//   return (
//     <div className="panel">
//       <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
//         <h5 className="font-semibold text-lg dark:text-white-light">
//           {title}
//         </h5>
//         <div className="ltr:ml-auto rtl:mr-auto">
//           {/* (e) => setSearch(e.target.value) */}
//           <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={onSearchChange} />
//         </div>
//       </div>
//       <div className="datatables">
//         <DataTable 
//           className="whitespace-nowrap table-hover" 
//           records={filteredRecords} 
//           columns={columns} 
//           highlightOnHover
//           totalRecords={totalRecords}
//           recordsPerPage={recordsPerPage}
//           page={currentPage}
//           onPageChange={onPageChange}
//           recordsPerPageOptions={PAGE_SIZES}
//           onRecordsPerPageChange={onRecordsPerPageChange}
//           sortStatus={sortStatus}
//           onSortStatusChange={onSortChange}
//           minHeight={minHeight}
//           height={height}
//           paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
//           fetching={isLoading}
//           loaderVariant="dots"
//         />
//       </div>
//     </div>
//   );
// };

// export default Table;



import React from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';

interface Column {
  accessor: string;
  title: string;
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
  searchValue = ''
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
        />
      </div>
    </div>
  );
};

export default Table;
