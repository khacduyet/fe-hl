/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { DanhMucService } from "../../services/danhmuc.service";
import {
  DateToUnix,
  formatDateStringGMT,
  validForm,
} from "../../services/helperfunction";
import { cLoaiPhuongTien, cLoaiXe } from "../common/apiservice";
import { TabView, TabPanel } from "primereact/tabview";
import { Calendar } from "primereact/calendar";
import { LOAINGUOIDUNG, vnCalendar } from "../../services/const";
import { toast } from "react-toastify";
import { outContext } from "../../App";
import { Confirm } from "../common/common";
import { ConfirmDialog } from "primereact/confirmdialog";
import { baseUrl } from "../../services/axiosClient.setup";

export default function QuanLyDongPhi() {
  const navigate = useNavigate();
  const [listQuyTrinh, setListQuyTrinh] = useState([]);
  const [listLoaiXe, setListLoaiXe] = useState([]);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [reset, setReset] = useState(false);
  const [selected, setSelected] = useState(null);
  const listThang = vnCalendar.monthNames.map((x, index) => {
    return { label: x, value: index + 1 };
  });
  const listLoaiNguoiDung = LOAINGUOIDUNG.map((x, index) => {
    return { label: x, value: index + 1 };
  });
  const [paging, setPaging] = useState({
    CurrentPage: 1,
    TotalItem: 0,
    TotalPage: 0,
  });
  const context = useContext(outContext);
  const [filter, setFilter] = useState({
    LoaiNguoiDung: 1,
    Thang: new Date().getMonth() + 1,
    Keyword: "",
    IdChungCu: context.access_chungcu,
    DaDongPhi: 0,
  });
  useEffect(() => {
    setFil(context.access_chungcu, "IdChungCu");
  }, [context.access_chungcu]);

  const getList = useCallback(async () => {
    let data = {
      ...filter,
      CurrentPage: paging.CurrentPage,
    };
    try {
      let _list = await DanhMucService.QuanLyPhi.GetListFilter(data);
      if (_list) {
        let list = _list.Data;
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

  const getAllOptions = async () => {
    let $cLoaiXe = cLoaiXe();

    let res = await Promise.all([$cLoaiXe]);
    if (res[0]) {
      setListLoaiXe(res[0]);
    }
  };

  useEffect(() => {
    getAllOptions();
    getList();
  }, [
    reset,
    filter.DaDongPhi,
    paging.CurrentPage,
    filter.Thang,
    filter.LoaiNguoiDung,
    filter.IdLoaiXe,
    filter.IdChungCu,
  ]);

  const handleAdd = () => {
    navigate(`/quanlydongphi/add/0`);
  };
  const setFil = (e, key) => {
    let data = { ...filter };
    data[key] = e;
    setFilter({
      ...data,
    });
  };

  const handleCreatePhieu = async () => {
    let fil = {
      ...filter,
    };
    let rs = await DanhMucService.QuanLyPhi.TaoNhanhPhieu(fil);
    if (rs) {
      if (rs.StatusCode === 200) {
        toast.success(rs.Message);
        getList();
      } else {
        toast.error(rs.Message);
      }
    }
  };

  const handleAccept = async () => {
    let arr = selected.map((x) => {
      return x.Id;
    });
    let rs = await DanhMucService.QuanLyPhi.SetDongPhiMultiple(arr);
    if (rs) {
      if (rs.StatusCode === 200) {
        toast.success(rs.Message);
        getList();
      } else {
        toast.error(rs.Message);
      }
    }
  };

  const handleExport = async () => {
    let data = {
      ...filter,
      CurrentPage: paging.CurrentPage,
    };
    try {
      let rs = await DanhMucService.QuanLyPhi.ExportPhieuThu(data);
      if (rs) {
        if (rs.StatusCode === 200) {
          toast.success(rs.Message);
          window.open(baseUrl + rs.Data, '_blank').focus();
          getList();
        } else {
          toast.error(rs.Message);
        }
      }
    } catch (er) {
      console.log(er);
    }
  };
  const handleExportCreate = async () => {
    let data = {
      ...filter,
      CurrentPage: paging.CurrentPage,
    };
    try {
      let rs = await DanhMucService.QuanLyPhi.ExportPrintAllPhieuThu(data);
      if (rs) {
        if (rs.StatusCode === 200) {
          toast.success(rs.Message);
          window.open(baseUrl + rs.Data, '_blank').focus();
          getList();
        } else {
          toast.error(rs.Message);
        }
      }
    } catch (er) {
      console.log(er);
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <>
      {visible && (
        <Confirm
          visible={visible}
          setVisible={setVisible}
          func={handleCreatePhieu}
          message="B???n c?? ch???c mu???n t???o nhanh phi???u?"
          header="Th??ng b??o!"
          acceptLabel="?????ng ??"
          rejectLabel="H???y b???"
        />
      )}
      {show && (
        <Confirm
          visible={show}
          setVisible={setShow}
          func={handleAccept}
          message="B???n c?? ch???c c??c phi???u n??y ???? ????ng?"
          header="Th??ng b??o!"
          acceptLabel="?????ng ??"
          rejectLabel="H???y b???"
        />
      )}
      <h1 className="section-heading">Qu???n l?? ????ng ph??</h1>
      <div className="container-haha">
        <div className="flex flex-row justify-content-between">
          <div>
            <Button
              label="Th??m m???i"
              className="p-button-sm"
              onClick={handleAdd}
            />
            <Button
              label="T???o nhanh phi???u th??ng"
              className="p-button-sm ml-2"
              onClick={() => setVisible(true)}
            />
            <Button
              label="X??c nh???n ????ng ph??"
              className="p-button-sm p-button-success ml-2"
              onClick={() => {
                setShow(true);
              }}
            />
            <Button
              label="Xu???t d??? li???u"
              className="p-button-sm ml-2"
              onClick={handleExport}
            />
            <Button
              label="In nhanh"
              className="p-button-sm ml-2"
              onClick={handleExportCreate}
            />
          </div>
          <div className="flex flex-row gap-3">
            <Dropdown
              resetFilterOnHide={true}
              style={{ width: "300px" }}
              className="p-inputtext-sm"
              value={filter.LoaiNguoiDung}
              options={listLoaiNguoiDung}
              onChange={(e) => {
                setFil(e.value, "LoaiNguoiDung");
              }}
              filter
              filterBy="label"
              placeholder="C?? d??n/ xe ngo??i"
            />
            <Dropdown
              resetFilterOnHide={true}
              style={{ width: "150px" }}
              className="p-inputtext-sm"
              value={filter.Thang}
              options={listThang}
              onChange={(e) => {
                setFil(e.value, "Thang");
              }}
              filter
              filterBy="label"
              placeholder="Ch???n th??ng"
            />
            <Dropdown
              resetFilterOnHide={true}
              style={{ width: "150px" }}
              className="p-inputtext-sm"
              value={filter.IdLoaiXe}
              options={listLoaiXe.map((ele) => {
                return { value: ele.Id, label: ele.Ten };
              })}
              onChange={(e) => {
                setFil(e.value, "IdLoaiXe");
              }}
              filter
              filterBy="label"
              placeholder="Ch???n lo???i xe"
            />
            <div className="p-inputgroup">
              <InputText
                className="p-inputtext-sm"
                placeholder="T??m ki???m"
                style={{ width: "150px" }}
                value={filter.Keyword}
                onKeyDown={(e) => {
                  if (e.key === "Enter") return getList();
                }}
                onChange={(e) => {
                  setFil(e.target.value, "Keyword");
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
                      ...filter,
                      LoaiNguoiDung: 1,
                      Thang: 0,
                      Keyword: "",
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
          activeIndex={filter.DaDongPhi}
          onTabChange={(e) => {
            setFil(e.index, "DaDongPhi");
            setPaging({ ...paging, CurrentPage: 1 });
          }}
        >
          <TabPanel header="Ch??a ????ng ph??"></TabPanel>
          <TabPanel header="???? ????ng ph??"></TabPanel>
          <TabPanel header="T???ng h???p"></TabPanel>
        </TabView>

        <div style={{ overflowX: "auto" }}>
          <DataTable
            className="p-datatable-sm p-datatable-gridlines"
            value={listQuyTrinh}
            selection={selected}
            onSelectionChange={(e) => setSelected(e.value)}
            dataKey="Id"
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "2%" }}
            ></Column>
            <Column
              bodyClassName="text-center"
              field="STT"
              headerClassName="text-center"
              style={{ width: "2%" }}
              header="STT"
            ></Column>
            <Column
              style={{ width: "8%" }}
              field="SoPhieu"
              headerClassName="text-center"
              bodyClassName="text-center"
              header="S??? phi???u"
            ></Column>
            <Column
              style={{ width: "8%" }}
              field="NguoiDongPhi"
              headerClassName="text-center"
              bodyClassName="text-center"
              header="Ng?????i ????ng"
            ></Column>

            <Column
              style={{ width: "10%" }}
              field="TongTien"
              headerClassName="text-center"
              bodyClassName="text-center"
              header="T???ng ti???n"
              body={(rowData) => {
                return <b>{formatCurrency(rowData.TongTien ?? 0)}</b>;
              }}
            ></Column>
            <Column
              style={{ width: "20%" }}
              field="GhiChu"
              headerClassName="text-center"
              header="N???i dung"
            ></Column>
            <Column
              style={{ width: "10%" }}
              field="Created"
              headerClassName="text-center"
              bodyClassName="text-center"
              body={(rowData) => {
                return formatDateStringGMT(rowData.Created);
              }}
              header="Th???i gian t???o phi???u"
            ></Column>
            <Column
              style={{ width: "10%" }}
              field="CreatedByName"
              headerClassName="text-center"
              bodyClassName="text-center"
              header="Ng?????i t???o phi???u"
            ></Column>
            <Column
              style={{ width: "10%" }}
              field="TenTrangThai"
              headerClassName="text-center"
              bodyClassName="text-center"
              header="Tr???ng th??i"
              body={(rowData) => {
                return (
                  <span className={`product-badge status-${rowData.TrangThai}`}>
                    {rowData.TrangThai ? "???? ????ng ph??" : "Ch??a ????ng ph??"}
                  </span>
                );
              }}
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
              header="Thao t??c"
            ></Column>
          </DataTable>
        </div>

        <div className="flex justify-content-between align-items-center">
          <div>T???ng s??? b???n ghi {paging.TotalItem}</div>
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
      <ConfirmDialog></ConfirmDialog>
    </>
  );
}
