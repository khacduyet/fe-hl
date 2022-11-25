import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { DanhMucService } from "../../services/danhmuc.service";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import {
  validForm,
} from "../../services/helperfunction";

export default function DanhMucLoaiDichVu() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [filter, setFilter] = useState({});
  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [item, setItem] = useState({});
  useEffect(() => {
    getAllOptions();
  }, []);
  useEffect(() => {
    getList();
  }, [filter]);
  const getAllOptions = async () => {
    // let $CaHoc = await DanhMucService.CaHoc.GetList({});
    // if ($CaHoc) {
    //   setListCaHoc($CaHoc);
    // }
  };
  const getList = async () => {
    let list = await DanhMucService.LoaiDichVu.GetList();
    if (list) {
      list.Data.forEach((item, index) => {
        item.STT = index + 1;
      });
      setListItem(list.Data);
    }
  };
  const handleAdd = () => {
    setHeader("Thêm mới");
    setItem({
      Id: "",
      Ma: "",
      Ten: "",
      GhiChu: "",
      TrangThai: true
    });
    setVisible(true);
  };
  const confirmAdd = async () => {
    if (validate()) {
      let add = await DanhMucService.LoaiDichVu.Set(item);
      if (add) {
        if (add.StatusCode === 200) {
          toast.success(add.Message);
          onHide();
        } else {
          toast.error(add.Message);
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
        let $delete = await DanhMucService.LoaiDichVu.Delete(item.Id);
        if ($delete) {
          if ($delete.statusCode === 200) {
            toast.success($delete.Message);
          } else {
            toast.error($delete.Message);
          }
          getList();
        }
      },
      reject: () => getList(),
    });
  };
  const onHide = () => {
    setVisible(false);
    setItem({});
    getList();
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
    let validVar = ["Ma", "Ten", "DonGia"];
    return validForm(validVar, item);
  };

  return (
    <>
      <h1 className="section-heading">Danh mục loại dịch vụ</h1>
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
            field="Ma"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Mã"
          ></Column>
          <Column
            style={{ width: '20%' }}
            field="Ten"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Tên"
          ></Column>
          <Column
            style={{ width: '20%' }}
            field="DonGia"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Đơn giá"
          ></Column>
          <Column
            style={{ width: '25%' }}
            field="GhiChu"
            headerClassName="text-center"
            header="Ghi chú"
            bodyStyle={{ maxWidth: "0" }}
            body={(rowData) => {
              return <div className="wrapper-small" title={rowData.GhiChu}>{rowData.GhiChu}</div>
            }}
          ></Column>
          <Column
            style={{ width: "7%" }}
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Hoạt động"
            body={(rowData) => {
              return (
                <Checkbox disabled={true} checked={rowData.TrangThai}></Checkbox>
              );
            }}
          ></Column>
          <Column
            bodyClassName="text-center"
            field="GhiChu"
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
          header={`${header} loại dịch vụ`}
          visible={visible}
          onHide={onHide}
          breakpoints={{ "960px": "40vw", "640px": "100vw" }}
          style={{ width: "60vw" }}
        >
          <div className="flex flex-row gap-2">
            <Button label="Quay lại" className="p-button-sm" onClick={onHide} />
            <Button
              label="Ghi lại"
              className="p-button-sm"
              onClick={confirmAdd}
            />
          </div>
          <div className="formgrid grid pt-3">
            <div className="field col-6">
              <label>
                Mã<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                value={item.Ma}
                className="w-full"
                onChange={(e) => setForm(e.target.value, "Ma")}
              />
            </div>
            <div className="field col-6">
              <label>
                Tên<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={item.Ten}
                onChange={(e) => setForm(e.target.value, "Ten")}
              />
            </div>
            <div className="field col-6">
              <label>
                Đơn giá<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                filterkey={/\(?[\d.]+\)?/}
                className="w-full"
                value={item.DonGia}
                onChange={(e) => setForm(e.target.value, "DonGia")}
              />
            </div>
            <div className="field col-12">
              <label>Ghi chú:</label>
              <InputTextarea
                className="w-full"
                rows={2}
                cols={30}
                value={item.GhiChu}
                onChange={(e) => setForm(e.target.value, "GhiChu")}
              />
            </div>
            <div className="col-12">
              <label htmlFor="TrangThai" className="p-checkbox-label">
                Hoạt động:
              </label>
              <Checkbox
                className="ml-3"
                inputId="TrangThai"
                value={true}
                onChange={() => {
                  setForm(!item.TrangThai, "TrangThai");
                }}
                checked={item.TrangThai}
              ></Checkbox>
            </div>
          </div>
        </Dialog>
        <ConfirmDialog></ConfirmDialog>
      </div>
    </>
  );
}
