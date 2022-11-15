import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DanhMucService } from "../../services/danhmuc.service";
import { validForm } from "../../services/helperfunction";
import { Dropdown } from "primereact/dropdown";
import { cLoaiPhuongTien } from "../common/apiservice";
import { outContext } from "../../App";

export default function QuanLyDanCu() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [phuongTiens, setPhuongTiens] = useState([]);
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
    getAllOptions();
  }, []);
  useEffect(() => {
    getList();
  }, [filter]);
  const getAllOptions = async () => {
    let $PhuongTien = await cLoaiPhuongTien();
    if ($PhuongTien) {
      setPhuongTiens($PhuongTien);
    }
  };
  const getList = async () => {
    let _fil = {
      ...filter,
    };
    let list = await DanhMucService.CanHo.GetListFilter(_fil);
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
      ChuSoHuu: "",
      SoDienThoai: "",
      DienTich: 0,
      GhiChu: "",
      TrangThai: false,
      PhuongTiens: [],
    });
    setVisible(true);
  };
  const confirmAdd = async () => {
    if (validate()) {
      let add = await DanhMucService.CanHo.Set(item);
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
    let edit = await DanhMucService.CanHo.Get(item.Id);
    if (edit) {
      console.log("edit", edit);
      setHeader("Cập nhật");
      setItem(edit.Data);
      setVisible(true);
    }
  };
  const handleDelete = (item) => {
    confirmDialog({
      message: "Bạn chắc chắn muốn xóa chứ?",
      header: "Thông báo",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Chấp nhận",
      rejectLabel: "Hủy",
      accept: async () => {
        let $delete = await DanhMucService.CanHo.Delete(item.Id);
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
    let validVar = ["Ma", "Ten", "SoDienThoai", "DienTich"];
    return validForm(validVar, item);
  };

  const handleAddRow = () => {
    let temp = [
      ...item.PhuongTiens,
      {
        IdPhuongTien: "",
        BienKiemSoat: "",
        TrangThai: false,
      },
    ];
    setForm(temp, "PhuongTiens");
  };

  const handleDeleteRow = (rowData, index) => {
    let temp = [...item.PhuongTiens];
    temp.splice(index, 1);
    setForm(temp, "PhuongTiens");
  };

  const handleChangeItemTable = (rowData, index, value, prop) => {
    let temp = item.PhuongTiens;
    temp[index] = {
      ...temp[index],
      [prop]: value,
    };
    setForm(temp, "PhuongTiens");
  };

  return (
    <>
      <h1 className="section-heading">Danh mục căn hộ</h1>
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
            style={{ width: "5%" }}
            header="#"
          ></Column>
          <Column
            style={{ width: "10%" }}
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
            style={{ width: "15%" }}
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
            header="SĐT"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="DienTich"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Diện tích"
          ></Column>
          <Column
            style={{ width: "10%" }}
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
            field="GhiChu"
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
              <label>Chủ sở hữu:</label>
              <InputText
                className="w-full"
                value={item.ChuSoHuu}
                onChange={(e) => setForm(e.target.value, "ChuSoHuu")}
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
                Diện tích<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                keyfilter={/\(?[\d.]+\)?/}
                className="w-full"
                value={item.DienTich}
                onChange={(e) =>
                  setForm(parseFloat(e.target.value), "DienTich")
                }
              />
            </div>
            <div className="field col-6">
              <label>Ghi chú:</label>
              <InputText
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
            <div className="col-12 mt-3">
              <label htmlFor="TrangThai" className="p-checkbox-label">
                Danh sách xe:
              </label>
              <DataTable
                className="p-datatable-sm p-datatable-gridlines pt-5"
                value={item.PhuongTiens}
                paginatorLeft={"Tổng số bản ghi " + item.PhuongTiens?.length}
                paginatorClassName="justify-content-end"
                paginator
                first={0}
                rows={5}
              >
                <Column
                  bodyClassName="text-center"
                  field="STT"
                  headerClassName="text-center"
                  style={{ width: "1%" }}
                  header="#"
                  body={(rowData, options) => {
                    return options.rowIndex + 1;
                  }}
                ></Column>
                <Column
                  field="IdPhuongTien"
                  headerClassName="text-center"
                  style={{ width: "2%" }}
                  header="Phương tiện"
                  body={(rowData, options) => {
                    return (
                      <Dropdown
                        className="w-full"
                        value={rowData.IdPhuongTien}
                        options={phuongTiens.map((x) => {
                          return { label: x.Ten, value: x.Id };
                        })}
                        onChange={(e) => {
                          handleChangeItemTable(
                            rowData,
                            options.rowIndex,
                            e.target.value,
                            "IdPhuongTien"
                          );
                        }}
                        filter
                        showClear
                        filterBy="label"
                        placeholder="Chọn phương tiện"
                      />
                    );
                  }}
                ></Column>
                <Column
                  bodyClassName="text-center"
                  field="BienKiemSoat"
                  headerClassName="text-center"
                  style={{ width: "5%" }}
                  header="Biển kiểm soát"
                  body={(rowData, options) => {
                    return (
                      <InputText
                        className="w-full"
                        value={rowData.BienKiemSoat}
                        onChange={(e) => {
                          handleChangeItemTable(
                            rowData,
                            options.rowIndex,
                            e.target.value,
                            "BienKiemSoat"
                          );
                        }}
                      />
                    );
                  }}
                ></Column>
                <Column
                  bodyClassName="text-center"
                  field="TrangThai"
                  headerClassName="text-center"
                  style={{ width: "1%" }}
                  header="Hoạt động"
                  body={(rowData, options) => {
                    return (
                      <Checkbox
                        value={true}
                        onChange={(e) => {
                          handleChangeItemTable(
                            rowData,
                            options.rowIndex,
                            !rowData.TrangThai,
                            "TrangThai"
                          );
                        }}
                        checked={rowData.TrangThai}
                      ></Checkbox>
                    );
                  }}
                ></Column>
                <Column
                  bodyClassName="text-center"
                  style={{ width: "1%" }}
                  body={(rowData, index) => (
                    <>
                      <Button
                        className="p-button-sm p-button-danger p-button-rounded"
                        type="button"
                        icon="pi pi-trash"
                        onClick={() => {
                          handleDeleteRow(rowData, index);
                        }}
                      ></Button>
                    </>
                  )}
                  headerClassName="text-center"
                  header={() => {
                    return (
                      <Button
                        className="p-button-sm mr-2 p-button-rounded"
                        type="button"
                        icon="pi pi-plus"
                        onClick={() => {
                          handleAddRow();
                        }}
                      ></Button>
                    );
                  }}
                ></Column>
              </DataTable>
            </div>
          </div>
        </Dialog>
        <ConfirmDialog></ConfirmDialog>
      </div>
    </>
  );
}
