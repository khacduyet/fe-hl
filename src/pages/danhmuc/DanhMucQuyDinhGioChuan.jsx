import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DanhMucService } from "../../services/danhmuc.service";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { Dropdown } from "primereact/dropdown";
import { validForm } from "../../services/helperfunction";
import { Ripple } from "primereact/ripple";
export default function DanhMucHeSoGioChuan() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [listHeSoGioChuan, setListHeSoGioChuan] = useState([]);
  const [filter, setFilter] = useState({});
  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [item, setItem] = useState({});
  const [listNganh, setListNganh] = useState([]);
  const [listCapGiangDay, setListCapGiangDay] = useState([]);
  useEffect(() => {
    getAllOptions();
  }, []);
  useEffect(() => {
    if (listHeSoGioChuan?.length) {
      getListDanhMuc();
    }
  }, [filter, listHeSoGioChuan]);
  const getAllOptions = async () => {
    let $Nganh = await DanhMucService.Nganh.GetList();
    let $CapGiangDay = await DanhMucService.CapGiangDay.GetList();
    let $HeSoGioChuan = await DanhMucService.HeSoGioChuan.GetList();
    if ($HeSoGioChuan) {
      setListHeSoGioChuan($HeSoGioChuan);
    }
    if ($Nganh) {
      setListNganh(
        $Nganh.map((ele) => {
          return { value: ele.Id, label: ele.Ten };
        })
      );
    }
    if ($CapGiangDay) {
      setListCapGiangDay(
        $CapGiangDay.map((ele) => {
          return { value: ele.Id, label: ele.Ten };
        })
      );
    }
  };
  const getListDanhMuc = async () => {
    let list = await DanhMucService.HeSoGioChuan.GetList();
    if (list) {
      list.forEach((item, index) => {
        item.STT = index + 1;
        item.TenHeSoGioChuan =
          listHeSoGioChuan.find(
            (HeSoGioChuan) => HeSoGioChuan.Id === item.IdHeSoGioChuan
          )?.Ten || null;
      });
      setListItem(list);
    }
  };
  const handleAdd = () => {
    setHeader("Thêm mới");
    setItem({
      Id: "",
      IdNganh: "",
      IdCapGiangDay: "",
      GioTieuChuan: 0,
    });
    setVisible(true);
  };
  const confirmAdd = async () => {
    if (validate()) {
      let add = await DanhMucService.HeSoGioChuan[
        item.Id === "" ? "Add" : "Update"
      ](item);
      if (add) {
        if (add.Error === 4) {
          toast.success(add.Detail);
          onHide();
        } else {
          toast.error(add.Detail);
        }
      }
    } else {
      toast.error("Vui lòng nhập đầy đủ các trường thông tin bắt buộc!");
    }
  };
  const handleEdit = (item) => {
    setHeader("Cập nhật");
    setItem(item);
    setVisible(true);
  };
  const handleDelete = (item) => {
    confirmDialog({
      message: "Bạn chắc chắn muốn xóa chứ?",
      header: "Thông báo",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Chấp nhận",
      rejectLabel: "Hủy",
      accept: async () => {
        let $delete = await DanhMucService.HeSoGioChuan.Delete(item.Id);
        if ($delete) {
          if ($delete.Error === 4) {
            toast.success($delete.Detail);
          } else {
            toast.error($delete.Detail);
          }
          getListDanhMuc();
        }
      },
      reject: () => getListDanhMuc(),
    });
  };
  const onHide = () => {
    setVisible(false);
    setItem({});
    getListDanhMuc();
  };
  const setForm = (e, key) => {
    if (e !== null && e !== undefined) {
      setItem((prev) => ({
        ...prev,
        [key]: e,
      }));
    } else {
      delete item[key];
      setItem({ ...item });
    }
  };
  const validate = () => {
    let validVar = ["IdNganh", "IdCapGiangDay", "GioTieuChuan"];
    return validForm(validVar, item);
  };
  const template1 = {
    layout: "PrevPageLink PageLinks NextPageLink",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Trước</span>
          <Ripple />
        </button>
      );
    },
    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Sau</span>
          <Ripple />
        </button>
      );
    },
  };

  return (
    <>
      <h1 className="section-heading">QUY ĐỊNH GIỜ CHUẨN</h1>
      <div className="container-haha">
        <div className="flex flex-row justify-content-between">
          <div>
            <Button
              label="Thêm mới"
              className="p-button-sm"
              onClick={handleAdd}
            />
          </div>
        </div>
        {/* <div>{JSON.stringify(listQuyTrinh)}</div> */}
        <DataTable
          className="p-datatable-sm p-datatable-gridlines pt-5"
          value={listItem}
          paginatorLeft={"Tổng số bản ghi " + listItem?.length}
          paginatorClassName="justify-content-end"
          paginator
          first={0}
          rows={10}
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
            field="TenNganh"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Ngành"
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="TenCapGiangDay"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Cấp giảng dạy"
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="GioTieuChuan"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Giờ tiêu chuẩn"
          ></Column>
          <Column
            bodyClassName="text-center"
            field="Handles"            
            style={{ width: '10%' }}
            body={(rowData) => (
              <>
                <Button
                  className="p-button-sm mr-2"
                  type="button"
                  icon="pi pi-pencil"
                  onClick={() => {
                    handleEdit(rowData);
                  }}
                ></Button>
                <Button
                  className="p-button-sm p-button-danger"
                  type="button"
                  icon="pi pi-trash"
                  onClick={() => {
                    handleDelete(rowData);
                  }}
                ></Button>
              </>
            )}
            headerClassName="text-center"
            header="Thao tác"
          ></Column>
        </DataTable>
        <Dialog
          header={`${header} quy định giờ chuẩn`}
          visible={visible}
          onHide={onHide}
          breakpoints={{ "960px": "40vw", "640px": "100vw" }}
          style={{ width: "30vw" }}
        >
          <div className="flex flex-row gap-2">
            <Button label="Quay lại" className="p-button-sm" onClick={onHide} />
            <Button
              label="Ghi lại"
              className="p-button-sm"
              onClick={confirmAdd}
            />
          </div>
          {/* <div>{JSON.stringify(item)}</div> */}
          <div className="formgrid grid pt-3">
            <div className="field col-12">
              <label>
                Hình thức dạy<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="p-dropdown-sm w-full"
                placeholder="Chọn ngành"
                value={item.IdNganh}
                options={listNganh}
                onChange={(e) => setForm(e.value, "IdNganh")}
                filter
              />
            </div>
            <div className="field col-12">
              <label>
                Cấp giảng dạy<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="p-dropdown-sm w-full"
                placeholder="Chọn cấp giảng dạy"
                value={item.IdCapGiangDay}
                options={listCapGiangDay}
                onChange={(e) => setForm(e.value, "IdCapGiangDay")}
                filter
              />
            </div>
            <div className="field col-12">
              <label>
                Giờ tiêu chuẩn (Giờ/năm)
                <span className="text-red-500">(*)</span>:
              </label>
              <InputText
                type="number"
                className="w-full"
                value={item.GioTieuChuan}
                onChange={(e) => setForm(e.target.value, "GioTieuChuan")}
              />
            </div>
          </div>
        </Dialog>
        <ConfirmDialog></ConfirmDialog>
      </div>
    </>
  );
}
