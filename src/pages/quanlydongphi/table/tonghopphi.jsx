import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { DataTable } from "primereact/datatable";
import { Row } from "primereact/row";
import { useState } from "react";

export default function TableTongHop({ result }) {
  const [tongTien, setTongTien] = useState(0);

  let footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Tổng tiền:"
          colSpan={5}
          footerStyle={{ textAlign: "right" }}
        />
        <Column footer={tongTien} />
      </Row>
    </ColumnGroup>
  );

  return (
    <>
      <DataTable
        className="p-datatable p-component p-datatable-selectable p-datatable-responsive-stack"
        style={{ width: "500px" }}
        value={result}
        footerColumnGroup={footerGroup}
      >
        <Column
          style={{ width: "8%" }}
          field="TenPhuongTien"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Phương tiện"
        ></Column>
        <Column
          style={{ width: "8%" }}
          field="TenLoaiXe"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Loại xe"
        ></Column>
        <Column
          style={{ width: "10%" }}
          field="BienKiemSoat"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Biển kiểm soát"
        ></Column>
        <Column
          style={{ width: "10%" }}
          //   field="BienKiemSoat"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Số lượng"
        ></Column>
        <Column
          style={{ width: "10%" }}
          field="Gia"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Giá"
        ></Column>
        <Column
          style={{ width: "10%" }}
          field="Thành tiền"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Thành tiền"
        ></Column>
      </DataTable>
    </>
  );
}
