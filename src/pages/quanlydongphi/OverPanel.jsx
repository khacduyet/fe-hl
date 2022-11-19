import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function OverPanel({ listData, isXeNgoai }) {
  return (
    <>
      <DataTable
        className="p-datatable p-component p-datatable-selectable p-datatable-responsive-stack"
        style={{ width: "500px" }}
        value={listData}
        paginatorLeft={"Tổng số bản ghi " + listData?.length}
        paginatorClassName="justify-content-end"
        paginator
        first={0}
        rows={5}
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
          filter
          filterPlaceholder="Search by name"
          style={{ width: "8%" }}
          field="Ten"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Tên"
        ></Column>
        {!isXeNgoai && (
          <Column
            style={{ width: "10%" }}
            field="ChuSoHuu"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Chủ sở hữu"
          ></Column>
        )}
        {isXeNgoai && (
          <Column
            style={{ width: "10%" }}
            field="BienKiemSoat"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Biển kiểm soát"
          ></Column>
        )}
      </DataTable>
    </>
  );
}
