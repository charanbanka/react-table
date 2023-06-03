import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import {
  createColumnHelper,
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";

export default function ReactTable(props) {
  const [data, setData] = useState([]);
  // const [columns, setColumns] = useState([])
  const [editData, setEditData] = useState(null);
  const [sorting, setSorting] = useState([]);
  let columns = props.columns;

  const getData = () => {
    axios.get(`http://localhost:5000/table-data`).then((res) => {
      let newData = res.data.data.data;
      setData(newData);
      setEditData(newData);
    });
  };

  const saveData = async (is_update, data) => {
    axios
      .post(`http://localhost:5000/table-data`, { is_update, data })
      .then((res) => {
        // console.log(res.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    // setSkipPageReset(true);
    setEditData((old) =>
      old?.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            ["price"]: value,
          };
        }
        return row;
      })
    );
  };
  const onSave = (table) => {
    saveData(true, editData);
    setData(editData);
  };

  const onReset = () => {
    setData(props.data);
    saveData(false, props.data);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      // pagination: { pageIndex: 1, pageSize: 5 },
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
    },
    updateMyData,
  });

  return (
    <div className="m-5">
      <div className="rounded-md border">
        <table id="react-table">
          <thead>
            {table.getHeaderGroups()?.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column?.columnDef?.header,
                            header.getContext()
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel()?.rows?.length ? (
              table.getRowModel()?.rows?.map((row) => (
                <tr key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells()?.map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column?.columnDef?.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns?.length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end  py-2">
        <button
          className="btn btn-danger mr-3"
          size="sm"
          onClick={() => onReset()}
        >
          reset
        </button>
        <button
          className="btn btn-success"
          size="sm"
          onClick={() => onSave(table)}
        >
          save
        </button>
      </div>
      <div className="flex py-2">
        <button
          className="btn mr-3"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <button
          className="btn "
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}
