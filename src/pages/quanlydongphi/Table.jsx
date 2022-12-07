import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { DataTable } from "primereact/datatable";
import { Row } from "primereact/row";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { PhiContext } from "./CTQuanLyDongPhi";

export default function Table() {
  const context = useContext(PhiContext);
  const [tongTien, setTongTien] = useState(0);
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  let footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          className="font-bold"
          footer="TỔNG TIỀN:"
          colSpan={7}
          footerStyle={{ textAlign: "right" }}
        />
        <Column
          className="text-center"
          footer={() => {
            return <b>{formatCurrency(tongTien)}</b>;
          }}
        />
      </Row>
    </ColumnGroup>
  );

  useEffect(() => {
    let total = 0;
    // context?.quyTrinh.ListPhi.map((x) => {
    //   total += parseFloat(x.ThanhTien);
    // });
    // setTongTien(total);
    // context.setForm(total, "TongTien");
  });

  return (
    <>
      <DataTable
        className="p-datatable p-component p-datatable-selectable p-datatable-responsive-stack"
        value={context.quyTrinh.ListPhi}
        footerColumnGroup={footerGroup}
        emptyMessage="Không có dữ liệu"
      >
        <Column
          style={{ width: "2%" }}
          headerClassName="text-center"
          bodyClassName="text-center"
          header="STT"
          body={(rowData, options) => {
            return options.rowIndex + 1;
          }}
        ></Column>
        <Column
          style={{ width: "8%" }}
          field="TenDichVu"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Tên dịch vụ"
        ></Column>
        <Column
          style={{ width: "8%" }}
          field="PhuongTien"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Phương tiện"
        ></Column>
        <Column
          style={{ width: "8%" }}
          field="LoaiXe"
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
          field="SoLuong"
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
          body={(rowData) => {
            return formatCurrency(rowData.Gia);
          }}
        ></Column>
        <Column
          style={{ width: "10%" }}
          field="ThanhTien"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Thành tiền"
          body={(rowData) => {
            return <b>{formatCurrency(rowData.ThanhTien)}</b>;
          }}
        ></Column>
      </DataTable>
    </>
  );
}
