import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function TableXeNgoai({ result }) {
  return (
    <>
      <DataTable
        className="p-datatable p-component p-datatable-selectable p-datatable-responsive-stack"
        style={{ width: "500px" }}
        value={result}
      >
        <Column
          style={{ width: "8%" }}
          field="Ma"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Mã"
        ></Column>
        <Column
          style={{ width: "8%" }}
          field="Ten"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Tên"
        ></Column>
        <Column
          style={{ width: "10%" }}
          field="SoDienThoai"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Số điện thoại"
        ></Column>
      </DataTable>
    </>
  );
}
