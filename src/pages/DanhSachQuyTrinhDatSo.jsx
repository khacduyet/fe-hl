/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useEffect, useState, useCallback, useRef } from "react";
import { QuyTrinhService } from "../services/quytrinh.service";
import { DateToUnix } from "../services/helperfunction";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
const eAction = "QUYTRINHDATSOCONGVANDI";
function formatDate(date) {
  const day = new Date(date);
  const yyyy = day.getFullYear();
  let mm = day.getMonth() + 1; // Months start at 0!
  let dd = day.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return dd + "/" + mm + "/" + yyyy;
}
function DanhSachQuyTrinhDatSo() {
  const navigate = useNavigate();
  const [listQuyTrinh, setListQuyTrinh] = useState([]);
  const [tabTrangThai, setTabTrangThai] = useState({});
  const [reset, setReset] = useState(false);
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
  const getList = async () => {
    let data = {
      ...filter,
      TabTrangThai: filter.TabTrangThai + 1,
      CurrentPage: paging.CurrentPage,
      // TuNgay: DateToUnix(filter.TuNgayDate),
      // DenNgay: DateToUnix(filter.DenNgayDate),
      NumPerPage: 20,
    };
    try {
      let list = await QuyTrinhService.DatSoCongVanDi.GetList(data);
      if (list) {
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
  };
  const checkTrangThai = async () => {
    let trangThaiPromise = await QuyTrinhService.QuanTriQuyTrinh.KiemTraTab(
      eAction
    );
    if (trangThaiPromise) {
      setTabTrangThai({ ...trangThaiPromise });
    }
  };
  useEffect(() => {
    checkTrangThai();
  }, []);
  useEffect(() => {
    getList();
  }, [
    reset,
    filter,
    paging.CurrentPage,
  ]);
  const handleAdd = () => {
    navigate(`/datso/add/0`);
  };
  const setFil = (e, key) => {
    let data = { ...filter };
    data[key] = e;
    setFilter((prev) => ({
      ...data
    }));
  };
  // const setFil = (e, key) => {
  //   if (e!==null && e!==undefined) {
  //     setFilter((prev) => ({
  //       ...prev,
  //       [key]: e,
  //     }));
  //   }else{
  //     delete filter[key]
  //     setFilter({...filter});
  //   }
  // };
  return (
    <>
      <h1 className="section-heading">Quy trình đặt số công văn đi</h1>
      <div className="container-haha">
        <div className="flex flex-row justify-content-between">
          <div>
            {tabTrangThai.ThemMoi && (
              <Button
                label="Thêm mới"
                className="p-button-sm"
                onClick={handleAdd}
              />
            )}
          </div>
          <div className="flex flex-row gap-3">
            <Calendar
              id="tungay"
              locale="vn"
              placeholder="Từ ngày"
              inputClassName="p-inputtext-sm"
              value={filter.TuNgayDate}
              onChange={(e) => {
                setFil(e.value, "TuNgayDate");
                setFil(DateToUnix(e.value), "TuNgay");
              }}
              showIcon
            />
            <Calendar
              id="denngay"
              locale="vn"
              placeholder="Đến ngày"
              inputClassName="p-inputtext-sm"
              value={filter.DenNgayDate}
              onChange={(e) => {
                setFil(e.value, "DenNgayDate");
                setFil(DateToUnix(e.value), "DenNgay");
              }}
              showIcon
            />
            <div className="p-inputgroup">
              <InputText
                className="p-inputtext-sm"
                placeholder="Tìm kiếm"
                value={filter.KeyWord}
                onChange={(e) => {
                  setFil(e.target.value, "KeyWord");
                }}
              />
              <Button
                icon="pi pi-search"
                className="p-button-primary"
                onClick={() => {
                  setPaging({ ...paging, CurrentPage: 1 });
                  getList();
                }}
              />
              <Button
                icon="pi pi-refresh"
                className="p-button-primary"
                onClick={() => {
                  setPaging({ ...paging, CurrentPage: 1 });
                  setFilter({
                    ...{
                      TabTrangThai: 0,
                      TuNgayDate: null,
                      DenNgayDate: null,
                      TuNgay:0,
                      DenNgay:0,
                      KeyWord: "",
                    },
                  });
                  // console.log(filter);
                  setReset(!reset);
                  getList();
                }}
              />
            </div>
          </div>
        </div>
        <TabView
          className="pt-3 no-content"
          activeIndex={filter.TabTrangThai}
          onTabChange={(e) => {
            setFil(e.index, "TabTrangThai");
            setPaging({ ...paging, CurrentPage: 1 });
          }}
        >
          <TabPanel
            header="Chưa xử lý"
            disabled={!tabTrangThai.ChuaXuLy}
          ></TabPanel>
          <TabPanel
            header="Đã xử lý"
            disabled={!tabTrangThai.DaXyLy}
          ></TabPanel>
        </TabView>
        {/* <div>{JSON.stringify(listQuyTrinh)}</div> */}
        <DataTable className="p-datatable-sm" value={listQuyTrinh}>
          <Column
            bodyClassName="text-center"
            field="STT"
            headerClassName="text-center"
            style={{ width: '5%' }}
            header="#"
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="TenNguoiDat"
            headerClassName="text-center"
            header="Người đặt"
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="TenBoPhan"
            headerClassName="text-center"
            header="Phòng ban"
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="TenLoaiSo"
            headerClassName="text-center"
            header="Loại văn bản"
          ></Column>
          <Column
            style={{ width: '15%' }} 
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
              return rowData.NgaySuDungUnix > 0
                ? formatDate(rowData.NgaySuDung)
                : "";
            }}
            headerClassName="text-center"
            header="Ngày dự kiến sử dụng"
          ></Column>
          <Column
            style={{ width: '35%' }} 
            field="GhiChu"
            headerClassName="text-center"
            header="Ghi chú"
            bodyStyle={{maxWidth: "0"}}
            body={(rowData)=>{
              return <div className="wrapper-small" title={rowData.GhiChu}>{rowData.GhiChu}</div>
            }}
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="TenTrangThai"
            headerClassName="text-center"
            header="Trạng thái"
          ></Column>
          <Column
            bodyClassName="text-center"
            style={{ width: '10%' }} 
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
        <div className="flex justify-content-between align-items-center">
          <div>Tổng số bản ghi {paging.TotalItem}</div>
          <div>
            <Paginator
              totalRecords={paging.TotalItem}
              first={(paging.CurrentPage - 1) * 25}
              rows={25}
              onPageChange={(e) => {
                setPaging({ ...paging, CurrentPage: e.page + 1 });
              }}
            ></Paginator>
          </div>
        </div>
      </div>
    </>
  );
}

export default DanhSachQuyTrinhDatSo;
