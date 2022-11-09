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
import Moment from "moment";
import {
  DateStringToDate,
  UnixToDate,
  DateToUnix,
  formatDateString,
  validForm,
} from "../../services/helperfunction";
import { Ripple } from "primereact/ripple";
import { Calendar } from "primereact/calendar";
import { toNumber } from "lodash";

export default function DanhMucNgayBatDauNamHoc() {
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
    getListDanhMuc();
  }, [filter]);
  const getAllOptions = async () => {
    //
  };
  const getListDanhMuc = async () => {
    let list = await DanhMucService.NgayBatDauNamHoc.GetList();
    if (list) {
      list = list.filter((item) =>
        filter.IdCaHoc ? item.IdCaHoc === filter.IdCaHoc : true
      );
      list.forEach((item, index) => {
        item.STT = index + 1;
      });
      setListItem(list);
    }
  };
  const handleAdd = () => {
    setHeader("Thêm mới");
    setItem({
      Id: "",
      Nam: null,
      NgayBatDauKi1: new Date(),
      NgayBatDauKi1Unix: DateToUnix(new Date()),
      NgayBatDauKi2: new Date(),
      NgayBatDauKi2Unix: DateToUnix(new Date()),
      NgayKetThucKi2: new Date(),
      NgayKetThucKi2Unix: DateToUnix(new Date()),
    });
    setVisible(true);
  };
  const confirmAdd = async () => {
    if (validate()) {
      let add = await DanhMucService.NgayBatDauNamHoc[
        item.Id === "" ? "Add" : "Update"
      ](item);
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
  const handleEdit = (data) => {
    setHeader("Cập nhật");
    data = {
      ...data,
      NgayBatDauKi1: new Date(data.NgayBatDauKi1),
      NgayBatDauKi2: new Date(data.NgayBatDauKi2),
      NgayKetThucKi2: new Date(data.NgayKetThucKi2),
    };
    setItem(data);
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
        let $delete = await DanhMucService.NgayBatDauNamHoc.Delete(item);
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
    let validVar = [
      "Nam",
      "NgayBatDauKi1Unix",
      "NgayBatDauKi2Unix",
      "NgayKetThucKi2Unix",
    ];
    return validForm(validVar, item);
  };

  return (
    <>
      <h1 className="section-heading">Ngày bắt đầu năm học</h1>
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
            style={{ width: "5%" }}
            header="#"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="Nam"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Năm học"
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
          header={`${header} ngày bắt đầu năm học`}
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
            <div className="field col-12">
              <label>
                Năm học<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                value={item.Nam}
                className="w-full"
                keyfilter={/^[0-9]*$/}
                type="text"
                onChange={(e) => setForm(e.target.value, "Nam")}
              />
            </div>
            <div className="field col-12">
              <h5 style={{ color: "red", textDecoration: "underline" }}>
                Kỳ I
              </h5>
            </div>
            <div className="field col-6">
              <label>
                Ngày bắt đầu<span className="text-red-500">(*)</span>:
              </label>
              <Calendar
                id="icon"
                locale="vn"
                placeholder="Chọn ngày"
                inputClassName="p-inputtext-sm"
                className="w-100"
                value={item.NgayBatDauKi1}
                onChange={(e) => {
                  if (item.NgayBatDauKi2 < e.value) {
                    setForm(e.value, "NgayBatDauKi2");
                    setForm(DateToUnix(e.value), "NgayBatDauKi2Unix");
                    if (item.NgayKetThucKi2 < e.value) {
                      setForm(e.value, "NgayKetThucKi2");
                      setForm(DateToUnix(e.value), "NgayKetThucKi2Unix");
                    }
                  }
                  setForm(e.value, "NgayBatDauKi1");
                  setForm(DateToUnix(e.value), "NgayBatDauKi1Unix");
                }}
                showIcon
              />
            </div>
            <div className="field col-12">
              <h5 style={{ color: "red", textDecoration: "underline" }}>
                Kỳ II
              </h5>
            </div>
            <div className="field col-6">
              <label>
                Ngày bắt đầu <span className="text-red-500">(*)</span>:
              </label>
              <Calendar
                id="icon"
                locale="vn"
                placeholder="Chọn ngày"
                inputClassName="p-inputtext-sm"
                className="w-100"
                minDate={new Date(item.NgayBatDauKi1)}
                value={item.NgayBatDauKi2}
                onChange={(e) => {
                  if (item.NgayKetThucKi2 < e.value) {
                    setForm(e.value, "NgayKetThucKi2");
                    setForm(DateToUnix(e.value), "NgayKetThucKi2Unix");
                  }
                  setForm(e.value, "NgayBatDauKi2");
                  setForm(DateToUnix(e.value), "NgayBatDauKi2Unix");
                }}
                showIcon
              />
            </div>
            <div className="field col-6">
              <label>
                Ngày kết thúc<span className="text-red-500">(*)</span>:
              </label>
              <Calendar
                id="icon"
                locale="vn"
                placeholder="Chọn ngày"
                inputClassName="p-inputtext-sm"
                className="w-100"
                minDate={new Date(item.NgayBatDauKi2)}
                value={item.NgayKetThucKi2}
                onChange={(e) => {
                  setForm(e.value, "NgayKetThucKi2");
                  setForm(DateToUnix(e.value), "NgayKetThucKi2Unix");
                }}
                showIcon
              />
            </div>
          </div>
        </Dialog>
        <ConfirmDialog></ConfirmDialog>
      </div>
    </>
  );
}
