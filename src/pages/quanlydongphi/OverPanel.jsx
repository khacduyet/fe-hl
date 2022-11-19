import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function OverPanel({ listData, isXeNgoai }) {
  return (
    <>
      <DataTable
        className="p-datatable p-component p-datatable-selectable p-datatable-responsive-stack"
        style={{ width: "500px" }}
        value={listData}
      >
        <Column
          bodyClassName="text-center"
          field="STT"
          headerClassName="text-center"
          style={{ width: "2%" }}
          header="STT"
        ></Column>
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
          field="ChuSoHuu"
          headerClassName="text-center"
          bodyClassName="text-center"
          header={() => {
            return isXeNgoai ? "Biển kiểm soát" : "Chủ sở hữu";
          }}
          body={(rowData) => {
            console.log(rowData);
            return isXeNgoai ? rowData.ChuSoHuu : rowData.BienKiemSoat;
          }}
        ></Column>
      </DataTable>
    </>
  );
}
