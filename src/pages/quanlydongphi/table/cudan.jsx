import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function TableCuDan({ result }) {
  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-center" header="Mã" rowSpan={2} />
        <Column className="text-center" header="Tên" rowSpan={2} />
        <Column className="text-center" header="Chủ sở hữu" rowSpan={2} />
        <Column className="text-center" header="Số điện thoại" rowSpan={2} />
        <Column className="text-center" header="Diện tích" rowSpan={2} />
        <Column className="text-center" header="Phương tiện" colSpan={4} />
      </Row>
      <Row>
        <Column className="text-center" header="Phương tiện" />
        <Column className="text-center" header="Loại xe" />
        <Column className="text-center" header="Biển kiểm soát" />
        <Column className="text-center" header="Trạng thái" />
      </Row>
    </ColumnGroup>
  );
  return (
    <>
      <DataTable
        className="p-datatable p-component p-datatable-selectable p-datatable-responsive-stack"
        style={{ width: "500px" }}
        value={result}
        // headerColumnGroup={headerGroup}
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
          field="ChuSoHuu"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Chủ sở hữu"
        ></Column>
        <Column
          style={{ width: "10%" }}
          field="SoDienThoai"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Số điện thoại"
        ></Column>
        <Column
          style={{ width: "10%" }}
          field="DienTich"
          headerClassName="text-center"
          bodyClassName="text-center"
          header="Diện tích"
        ></Column>
      </DataTable>
    </>
  );
}
