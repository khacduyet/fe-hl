import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";

export default function OverPanel({ listData, isXeNgoai }) {
  const [selected, setSelected] = useState(null);

  const handleAdd = () => {
    console.log("selected", selected);
  };

  return (
    <>
      <div className="flex flex-row justify-content-between">
        <div>
          <Button label="Chọn" className="p-button-sm" onClick={handleAdd} />
        </div>
      </div>
      <DataTable
        className="p-datatable p-component p-datatable-selectable p-datatable-responsive-stack"
        style={{ width: "500px" }}
        value={listData}
        selectionMode="radiobutton"
        selection={selected}
        onSelectionChange={(e) => setSelected(e.value)}
        dataKey="Ma"
        responsiveLayout="scroll"
        paginatorLeft={"Tổng số bản ghi " + listData?.length}
        paginatorClassName="justify-content-end"
        paginator
        first={0}
        rows={5}
      >
        <Column selectionMode="single" headerStyle={{ width: "1%" }}></Column>
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
