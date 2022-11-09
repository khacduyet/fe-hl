import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useEffect, useState, useCallback } from "react";
import { QuyTrinhService } from "../services/quytrinh.service";
import { DateToUnix } from "../services/helperfunction";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
const eAction = "QUYTRINHCONGVANDI";
function formatDate(date) {
  const day = new Date(date);
  const yyyy = day.getFullYear();
  let mm = day.getMonth() + 1; // Months start at 0!
  let dd = day.getDate();
  console.log("date", date);
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return dd + "/" + mm + "/" + yyyy;
}
function DanhSachQuyTrinhCongVanDi() {
  const navigate = useNavigate();
  const [listQuyTrinh, setListQuyTrinh] = useState([]);
  const [tabTrangThai, setTabTrangThai] = useState({});
  const [filter, setFilter] = useState({
    TabTrangThai: 0,
    TuNgayDate: null,
    DenNgayDate: null,
    KeyWord: "",
  });
  const [paging, setPaging] = useState({
    CurrentPage: 1,
    TotalItem: 0,
    TotalPage: 0,
  });
  const getList = useCallback(async () => {
    let data = {
      ...filter,
      TabTrangThai: filter.TabTrangThai + 1,
      CurrentPage: paging.CurrentPage,
      TuNgay: DateToUnix(filter.TuNgayDate),
      DenNgay: DateToUnix(filter.DenNgayDate),
      NumPerPage: 20,
    };
    try {
      let list = await QuyTrinhService.QuyTrinhCongVanDi.GetList(data);
      if (list) {
        console.log(list);
        let tableData = list.items.map((ele, index) => {
          return {
            ...ele,
            STT: 25 * (paging.CurrentPage - 1) + index + 1,
          };
        });
        setPaging({ ...list.paging });
        setListQuyTrinh(tableData);
      }
    } catch (er) {
      console.log(er);
    }
  }, [filter, paging.CurrentPage]);
  const checkTrangThai = async () => {
    let trangThaiPromise = await QuyTrinhService.QuanTriQuyTrinh.KiemTraTab(
      eAction
    );
    if (trangThaiPromise) {
      console.log(trangThaiPromise);
      setTabTrangThai({ ...trangThaiPromise });
    }
  };
  useEffect(() => {
    getList();
  }, [getList, filter]);
  const handleAdd = () => {
    navigate(`add/0`);
  };
  const setFil = (e, key) => {
    let data = { ...filter };
    data[key] = e;
    setFilter({
      ...data,
    });
  };

  return (
    <>
      <h1 className="section-heading">Quy trình công văn đi</h1>
      <div className="container-haha">
        <div className="flex flex-row justify-content-between">
          <div>
            <Button
              label="Thêm mới"
              className="p-button-sm"
              onClick={handleAdd}
            />
          </div>
          <div className="flex flex-row gap-3">
            <Calendar
              id="icon"
              locale="vn"
              placeholder="Từ ngày"
              inputClassName="p-inputtext-sm"
              value={filter.TuNgayDate}
              onChange={(e) => setFil(DateToUnix(e.value), "TuNgay")}
              showIcon
            />
            <Calendar
              id="icon"
              locale="vn"
              placeholder="Đến ngày"
              inputClassName="p-inputtext-sm"
              value={filter.DenNgayDate}
              onChange={(e) => setFil(DateToUnix(e.value), "DenNgay")}
              showIcon
            />
            <div className="p-inputgroup" style={{ width: "200px" }}>
              <InputText className="p-inputtext-sm" placeholder="Tìm kiếm" />
              <Button icon="pi pi-search" className="p-button-primary" />
            </div>
          </div>
        </div>
        <TabView
          className="pt-3 no-content"
          activeIndex={filter.TabTrangThai}
          onTabChange={(e) => setFil(e.index, "TabTrangThai")}
        >
          <TabPanel header="Chưa xử lý"></TabPanel>
          <TabPanel header="Đã xử lý"></TabPanel>
        </TabView>
        {/* <div>{JSON.stringify(listQuyTrinh)}</div> */}
        <DataTable
          className="p-datatable-sm p-datatable-gridlines"
          value={listQuyTrinh}
        >
          <Column
            bodyClassName="text-center"
            field="STT"
            headerClassName="text-center"
            style={{ width: "5%" }}
            header="#"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="name"
            headerClassName="text-center"
            header="Người đặt"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="category"
            headerClassName="text-center"
            header="Phòng ban"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="quantity"
            headerClassName="text-center"
            header="Loại văn bản"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="SoCongVan"
            headerClassName="text-center"
            header="Số đặt trước"
          ></Column>
          <Column
            bodyClassName="text-center"
            field="Created"
            body={(rowData) => {
              return formatDate(rowData.Created);
            }}
            headerClassName="text-center"
            header="Ngày đặt"
          ></Column>
          <Column
            bodyClassName="text-center"
            field="NgaySuDung"
            body={(rowData) => {
              return formatDate(rowData.NgaySuDung);
            }}
            headerClassName="text-center"
            header="Ngày dự kiến sử dụng"
          ></Column>
          <Column
            style={{ width: "35%" }}
            field="GhiChu"
            headerClassName="text-center"
            header="Ghi chú"
            bodyStyle={{ maxWidth: "0" }}
            body={(rowData) => {
              return (
                <div className="wrapper-small" title={rowData.GhiChu}>
                  {rowData.GhiChu}
                </div>
              );
            }}
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="TenTrangThai"
            headerClassName="text-center"
            header="Trạng thái"
          ></Column>
          <Column
            bodyClassName="text-center"
            style={{ width: "10%" }}
            body={(rowData) => (
              <Button
                className="p-button-sm"
                type="button"
                icon="pi pi-pencil"
                onClick={() => {
                  navigate(`update/${rowData.IdQuyTrinh}`);
                }}
              ></Button>
            )}
            header="Thao tác"
          ></Column>
        </DataTable>
        <Paginator
          totalRecords={paging.TotalItem}
          first={paging.CurrentPage}
          rows={25}
          onPageChange={(e) => setPaging({ ...paging, CurrentPage: e.first })}
        ></Paginator>
      </div>
    </>
  );
}

export default DanhSachQuyTrinhCongVanDi;
