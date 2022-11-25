import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useEffect } from "react";
import { useState } from "react";

export default function OverPanel({
  listData,
  isXeNgoai,
  handleAddDetail,
  quyTrinh,
}) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState([]);
  const [reset, setReset] = useState(false);
  const [filter, setFilter] = useState({
    Keyword: "",
  });
  const setFil = (value, prop) => {
    if (value !== null && value !== undefined) {
      setFilter({
        ...filter,
        [prop]: value,
      });
    }
  };

  useEffect(() => {
    let data = listData.filter(
      (x) =>
        (x.Ma.toLowerCase()
          .trim()
          .includes(filter.Keyword.toLowerCase().trim()) ||
          x.Ten.toLowerCase()
            .trim()
            .includes(filter.Keyword.toLowerCase().trim()) ||
          (isXeNgoai &&
            x.BienKiemSoat.toLowerCase()
              .trim()
              .includes(filter.Keyword.toLowerCase().trim())) ||
          (!isXeNgoai &&
            x.ChuSoHuu.toLowerCase()
              .trim()
              .includes(filter.Keyword.toLowerCase().trim()))) &&
        ((isXeNgoai && x.Id !== quyTrinh.IdXeNgoai) ||
          (!isXeNgoai && x.Id !== quyTrinh.IdCanHo))
    );
    setResult(data);
  }, [filter.Keyword, reset, isXeNgoai]);

  const handleAdd = () => {
    console.log("selected", selected);
    handleAddDetail(selected);
    setReset(!reset);
  };

  return (
    <>
      <div className="flex flex-row justify-content-between mb-2">
        <div>
          <Button label="Chọn" className="p-button-sm" onClick={handleAdd} />
        </div>
        <div className="flex flex-row gap-3">
          <div className="p-inputgroup">
            <InputText
              className="p-inputtext-sm"
              placeholder="Tìm kiếm"
              style={{ width: "300px" }}
              value={filter.Keyword}
              onChange={(e) => {
                setFil(e.target.value, "Keyword");
              }}
            />
          </div>
        </div>
      </div>
      <DataTable
        className="p-datatable p-component p-datatable-selectable p-datatable-responsive-stack"
        style={{ width: "500px" }}
        value={result}
        selectionMode="radiobutton"
        selection={selected}
        onSelectionChange={(e) => setSelected(e.value)}
        dataKey="Ma"
        responsiveLayout="scroll"
        paginatorLeft={"Tổng số bản ghi " + result?.length}
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
