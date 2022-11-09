import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { DanhMucService } from "../../services/danhmuc.service";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { validForm } from "../../services/helperfunction";
import { Ripple } from "primereact/ripple";
export default function DanhMucCaHoc() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [listCaHoc, setListCaHoc] = useState([]);
  const [filter, setFilter] = useState({});
  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [item, setItem] = useState({});
  useEffect(() => {
    getAllOptions();
  }, []);
  useEffect(() => {
    if (listCaHoc?.length) {
      getListDanhMuc();
    }
  }, [filter, listCaHoc]);
  const getAllOptions = async () => {
    let $CaHoc = await DanhMucService.CaHoc.GetList({});
    if ($CaHoc) {
      setListCaHoc($CaHoc);
    }
  };
  const getListDanhMuc = async () => {
    let list = await DanhMucService.CaHoc.GetList({});
    if (list) {
      list = list.filter((item) =>
        filter.IdCaHoc ? item.IdCaHoc === filter.IdCaHoc : true
      );
      list.forEach((item, index) => {
        item.STT = index + 1;
        item.TenCaHoc =
          listCaHoc.find((CaHoc) => CaHoc.Id === item.IdCaHoc)?.Ten || null;
      });
      setListItem(list);
    }
  };
  const handleAdd = () => {
    setHeader("Thêm mới");
    setItem({
      Id: "",
      Ma: "",
      Ten: "",
      GhiChu: "",
      SapXep: 0,
    });
    setVisible(true);
  };
  const confirmAdd = async () => {
    if (validate()) {
      let add = await DanhMucService.CaHoc[item.Id === "" ? "Add" : "Update"](
        item
      );
      if (add) {
        console.log(add);
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
        let $delete = await DanhMucService.CaHoc.Delete(item);
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
    let validVar = ["Ma", "Ten", "SapXep"];
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
      <h1 className="section-heading">Danh mục ca học</h1>
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
          header={`${header} ca học`}
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
                Mã<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                value={item.Ma}
                className="w-full"
                onChange={(e) => setForm(e.target.value, "Ma")}
              />
            </div>
            <div className="field col-12">
              <label>
                Tên<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={item.Ten}
                onChange={(e) => setForm(e.target.value, "Ten")}
              />
            </div>
            <div className="field col-12">
              <label>
                Sắp xếp<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                type="number"
                className="w-full"
                value={item.SapXep}
                onChange={(e) => setForm(e.target.value, "SapXep")}
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
          </div>
        </Dialog>
        <ConfirmDialog></ConfirmDialog>
      </div>
    </>
  );
}
