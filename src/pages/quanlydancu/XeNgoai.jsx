import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { outContext } from "../../App";
import { DanhMucService } from "../../services/danhmuc.service";
import { validForm } from "../../services/helperfunction";
import { cLoaiPhuongTien, cLoaiXe } from "../common/apiservice";

export default function XeNgoai() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [phuongTiens, setPhuongTiens] = useState([]);
  const [loaiXes, setLoaiXes] = useState([]);
  const [filter, setFilter] = useState({
    Keyword: "",
    IdPhuongTien: "",
    IdLoaiXe: "",
    IdChungCu: "",
  });
  const context = useContext(outContext);
  useEffect(() => {
    setFil(context.access_chungcu, "IdChungCu");
  }, [context.access_chungcu]);

  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [item, setItem] = useState({});
  useEffect(() => {
    getList();
    getAllOptions();
  }, [filter]);
  const getAllOptions = async () => {
    let $cLoaiPhuongTien = cLoaiPhuongTien();
    let $cLoaiXe = cLoaiXe();
    let res = await Promise.all([$cLoaiPhuongTien, $cLoaiXe]);
    if (res[0]) {
      setPhuongTiens(res[0]);
    }
    if (res[1]) {
      setLoaiXes(res[1]);
    }
  };
  const getList = async () => {
    let _fil = {
      ...filter,
    };
    let list = await DanhMucService.XeNgoai.GetListFilter(_fil);
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
      BienKiemSoat: "",
      SoDienThoai: "",
      GhiChu: "",
      TrangThai: false,
    });
    setVisible(true);
  };
  const confirmAdd = async () => {
    if (validate()) {
      let add = await DanhMucService.XeNgoai.Set(item);
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
  const handleEdit = async (item) => {
    // let edit = await DanhMucService.XeNgoai.Get(item.Id);
    // if (edit) {
    setHeader("Cập nhật");
    setItem(item);
    setVisible(true);
    // }
  };
  const handleDelete = (item) => {
    confirmDialog({
      message: "Bạn chắc chắn muốn xóa chứ?",
      header: "Thông báo",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Chấp nhận",
      rejectLabel: "Hủy",
      accept: async () => {
        let $delete = await DanhMucService.XeNgoai.Delete(item.Id);
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
  const setFil = (e, key) => {
    if (e !== null && e !== undefined && e !== "null") {
      setFilter((prev) => ({
        ...prev,
        [key]: e,
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [key]: null,
      }));
    }
  };
  const validate = () => {
    let validVar = [
      "Ma",
      "Ten",
      "SoDienThoai",
      "BienKiemSoat",
      "IdPhuongTien",
      "IdLoaiXe",
    ];
    return validForm(validVar, item);
  };

  return (
    <>
      <h1 className="section-heading">Danh mục xe ngoài</h1>
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
            style={{ width: "2%" }}
            header="#"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="Ma"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Mã"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="Ten"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Tên"
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
            field="SoDienThoai"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="SĐT"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="TenPhuongTien"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Phương tiện"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="TenLoaiXe"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Loại xe"
          ></Column>
          <Column
            style={{ width: "5%" }}
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
            style={{ width: "7%" }}
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Hoạt động"
            body={(rowData) => {
              return (
                <Checkbox
                  disabled={true}
                  checked={rowData.TrangThai}
                ></Checkbox>
              );
            }}
          ></Column>
          <Column
            bodyClassName="text-center"
            field="Handle"
            style={{ width: "10%" }}
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
          header={`${header} căn hộ`}
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
                Biển kiểm soát<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={item.BienKiemSoat}
                onChange={(e) => setForm(e.target.value, "BienKiemSoat")}
              />
            </div>
            <div className="field col-6">
              <label>
                Số điện thoại<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={item.SoDienThoai}
                onChange={(e) => setForm(e.target.value, "SoDienThoai")}
              />
            </div>

            <div className="field col-6">
              <label>
                Phương tiện<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="w-full"
                value={item.IdPhuongTien}
                options={phuongTiens?.map((x) => {
                  return { label: x.Ten, value: x.Id };
                })}
                onChange={(e) => setForm(e.target.value, "IdPhuongTien")}
                filter
                showClear
                filterBy="label"
                placeholder="Chọn phương tiện"
              />
            </div>
            <div className="field col-6">
              <label>
                Loại xe<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="w-full"
                value={item.IdLoaiXe}
                options={loaiXes?.map((x) => {
                  return { label: x.Ten, value: x.Id };
                })}
                onChange={(e) => setForm(e.target.value, "IdLoaiXe")}
                filter
                showClear
                filterBy="label"
                placeholder="Chọn loại xe"
              />
            </div>

            <div className="field col-12">
              <label>Ghi chú:</label>
              <InputTextarea
                rows={2}
                cols={30}
                className="w-full"
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
