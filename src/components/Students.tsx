
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { studentsData } from '@/data/students';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'grade', headerName: 'Grade', type: 'number', width: 110 },
  { field: 'lastActivity', headerName: 'Last Activity', width: 160 },
];

const Students = () => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={studentsData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export default Students;
