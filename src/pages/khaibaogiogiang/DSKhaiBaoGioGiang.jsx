/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useEffect, useState, useCallback, useRef } from "react";
import { QuyTrinhService } from "../../services/quytrinh.service";
import { DateToUnix, formatDateStringGMT } from "../../services/helperfunction";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
const eAction = "QUYTRINHKHAIBAOGIOGIANG";
function DSKhaiBaoGioGiang() {
  const navigate = useNavigate();
  const [listQuyTrinh, setListQuyTrinh] = useState([]);
  const [listBoPhan, setListBoPhan] = useState([]);
  const [tabTrangThai, setTabTrangThai] = useState({});
  const [reset, setReset] = useState(false);
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
      NumPerPage: 20,
    };

    try {
      let list = await QuyTrinhService.KhaiBaoGioGiang.GetList(data);
      let $BoPhan = QuyTrinhService.DanhMuc.BoPhan();
      let res = await Promise.all([$BoPhan]);
      setListBoPhan(res[0]);
      if (list) {
        setPaging({
          ...paging,
          TotalItem: list.length,
        });
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
    navigate(`/quytrinh/khaibaogiogiang/add/0`);
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
      {/* <h1 className="section-heading">Quy trình khai báo giờ giảng</h1>
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
        <div style={{ overflowX: "auto" }}>
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
              style={{ width: "10%" }}
              field="SoPhieu"
              sortable
              headerClassName="text-center"
              bodyClassName="text-center"
              header="Số phiếu"
            ></Column>
            <Column
              style={{ width: "10%" }}
              field="Created"
              headerClassName="text-center"
              sortable
              bodyClassName="text-center"
              body={(rowData) => {
                return formatDateStringGMT(rowData.Created);
              }}
              header="Thời gian tạo"
            ></Column>
            <Column
              style={{ width: "10%" }}
              field="NoiDung"
              headerClassName="text-center"
              sortable
              header="Nội dung"
              bodyStyle={{ maxWidth: "0" }}
              body={(rowData) => {
                return (
                  <div className="wrapper-small" title={rowData.NoiDung}>
                    {rowData.NoiDung}
                  </div>
                );
              }}
            ></Column>
            <Column
              style={{ width: "10%" }}
              sortable
              field="TenGiaoVien"
              headerClassName="text-center"
              header="Giáo viên thực giảng"
            ></Column>
            <Column
              style={{ width: "10%" }}
              sortable
              field="CreatedByName"
              headerClassName="text-center"
              header="Người tạo"
            ></Column>
            <Column
              style={{ width: "20%" }}
              sortable
              field="TenBoPhan"
              headerClassName="text-center"
              header="Khoa"
              bodyStyle={{ maxWidth: "0" }}
              body={(rowData) => {
                return (
                  <div className="wrapper-small" title={rowData.TenBoPhan}>
                    {rowData.TenBoPhan}
                  </div>
                );
              }}
            ></Column>
            <Column
              style={{ width: "10%" }}
              bodyClassName="text-center"
              sortable
              field="Tuan"
              headerClassName="text-center"
              body={(rowData) => {
                return `Tuần ${rowData.TuTuan} - Tuần ${rowData.ToiTuan}`;
              }}
              header="Tuần"
            ></Column>
            <Column
              style={{ width: "15%" }}
              sortable
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
                    navigate(`update/${rowData.Id}`);
                  }}
                ></Button>
              )}
              header="Thao tác"
            ></Column>
          </DataTable>
        </div>

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
      </div> */}
    </>
  );
}

export default DSKhaiBaoGioGiang;
