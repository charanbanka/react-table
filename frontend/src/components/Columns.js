import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";

const columnHelper = createColumnHelper();

const EditablePrice = (info) => {
  // let initialValue = info.renderValue()
  // console.log("info",info)
  const [value, setValue] = useState(info.renderValue());
  const onChange = (e) => {
    setValue(e.target.value);
    info.table.options.updateMyData(info.row.index, info.row.id, e.target.value);
  };
  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    info.table.options.updateMyData(info.row.index, info.row.id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(info.renderValue());
  }, [info.renderValue()]);
  return <input type="number" value={value} onChange={onChange} />;
};

export const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <div className="d-flex flex-row ">
          <span className="fw-bolder">Name</span>
          <span>
            <ArrowUpDown
              className="ml-2 h-4 w-4 pointer arrow"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            />
          </span>
        </div>
      );
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("category", {
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => "Category",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("price", {
    header: ({ column }) => {
      return (
        <div className="d-flex flex-row ">
          <span className="fw-bolder">Price</span>
          <span>
            <ArrowUpDown
              className="ml-2 h-4 w-4 pointer arrow"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            />
          </span>
        </div>
      );
    },
    cell: EditablePrice,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("description", {
    header: () => "Description",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("label", {
    header: () => "Label",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("image", {
    header: () => "Image",
    cell: (info) => {return(
      <div>
        <img src={info.renderValue()} width="150px" height="100px" />
      </div>
    )},
    footer: (info) => info.column.id,
  }),
];
