/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useEffect, useState, useCallback } from "react";
import { QuyTrinhService } from "../../services/quytrinh.service";
import { DateToUnix, formatDateStringGMT } from "../../services/helperfunction";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
const eAction = "QUYTRINHDAYBU";

function DSDayBu() {
  const navigate = useNavigate();
  const [listQuyTrinh, setListQuyTrinh] = useState([]);
  const [tabTrangThai, setTabTrangThai] = useState({});
  const [reset, setReset] = useState(false);
  const [listBoPhan, setListBoPhan] = useState([]);

  const [paging, setPaging] = useState({
    CurrentPage: 1,
    TotalItem: 0,
    TotalPage: 0,
  });
  const [filter, setFilter] = useState({
    TabTrangThai: 0,
    TuNgayDate: null,
    DenNgayDate: null,
    KeyWord: "",
    IdBoPhan: 0,
  });
  const getList = useCallback(async () => {
    let data = {
      ...filter,
      TabTrangThai: filter.TabTrangThai + 1,
      CurrentPage: paging.CurrentPage,
      TuNgay: DateToUnix(filter.TuNgayDate) ?? 0,
      DenNgay: DateToUnix(filter.DenNgayDate) ?? 0,
    };
    try {
      let list = await QuyTrinhService.DayBu.GetList(data);
      let $BoPhan = QuyTrinhService.DanhMuc.BoPhan();
      let res = await Promise.all([$BoPhan]);
      setListBoPhan(res[0]);
      if (list) {
        let tableData = list.map((ele, index) => {
          return {
            ...ele,
            STT: paging.CurrentPage - (paging.CurrentPage - 1) + index,
          };
        });
        let items = tableData.slice(
          (paging.CurrentPage - 1) * 10,
          paging.CurrentPage * 10
        );
        setPaging({ ...paging, TotalItem: list.length });
        setListQuyTrinh(items);
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
      setTabTrangThai({ ...trangThaiPromise });
    }
  };
  useEffect(() => {
    checkTrangThai();
  }, []);
  useEffect(() => {
    getList();
  }, [reset, filter.TabTrangThai, paging.CurrentPage, filter]);
  const handleAdd = () => {
    navigate(`/quytrinh/khaibaodaybu/add/0`);
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
      <h1 className="section-heading">Quy trình khai báo dạy bù</h1>
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
            <Dropdown
              style={{ width: "300px" }}
              className="p-inputtext-sm"
              value={filter.IdBoPhan}
              options={listBoPhan}
              optionValue="Id"
              optionLabel="TenBoPhan"
              onChange={(e) => {
                setFil(e.value, "IdBoPhan");
              }}
              filter
              filterBy="TenBoPhan"
              placeholder="Chọn khoa"
            />
            <Calendar
              id="icon"
              locale="vn"
              placeholder="Từ ngày"
              inputClassName="p-inputtext-sm"
              value={filter.TuNgayDate}
              onChange={(e) => setFil(e.value, "TuNgayDate")}
              showIcon
            />
            <Calendar
              id="icon"
              locale="vn"
              placeholder="Đến ngày"
              inputClassName="p-inputtext-sm"
              value={filter.DenNgayDate}
              onChange={(e) => setFil(e.value, "DenNgayDate")}
              showIcon
            />
            <div className="p-inputgroup">
              <InputText
                className="p-inputtext-sm"
                placeholder="Tìm kiếm"
                value={filter.KeyWord}
                onKeyDown={(e) => {
                  if (e.key === "Enter") return getList();
                }}
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
                      KeyWord: "",
                      IdBoPhan: 0,
                    },
                  });
                  setReset(!reset);
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
          <TabPanel
            header="Tổng hợp"
            disabled={!tabTrangThai.TongHop}
          ></TabPanel>
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
            style={{ width: '5%' }}
            header="#"
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="SoPhieu"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="Số phiếu"
          ></Column>
          <Column
            style={{ width: '20%' }} 
            field="TenBoPhan"
            headerClassName="text-center"
            sortable
            header="Khoa"
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="Created"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            body={(rowData) => {
              return formatDateStringGMT(rowData.Created);
            }}
            header="Ngày tạo phiếu"
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="TenGiaoVien"
            headerClassName="text-center"
            sortable
            header="Giảng Viên"
          ></Column>
          <Column
            style={{ width: '10%' }} 
            field="TongSoGio"
            headerClassName="text-center"
            className="text-center"
            sortable
            header="Tổng số giờ"
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="TenTrangThai"
            headerClassName="text-center"
            sortable
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
                  navigate(`update/${rowData.Id}`);
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
              first={(paging.CurrentPage - 1) * 10}
              rows={10}
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

export default DSDayBu;
