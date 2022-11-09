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
import { QuyTrinhService } from "../../services/quytrinh.service";
import { Dropdown } from "primereact/dropdown";
import { validForm } from "../../services/helperfunction";
import { dropdownOptionTemplate } from "../common/templateDropdown";

export default function DanhMucLopHoc() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [listBoPhan, setListBoPhan] = useState([]);
  const [listCapGiangDay, setListCapGiangDay] = useState([]);
  const [listKhoaHoc, setListKhoaHoc] = useState([]);
  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [item, setItem] = useState({});
  const [reset, setReset] = useState(false);
  const [filter, setFilter] = useState({
    KeyWord: "",
    IdBoPhan: "",
  });

  useEffect(() => {
    getAllOptions();
  }, []);
  useEffect(() => {
    getListDanhMuc();
  }, [reset]);
  const setFil = (e, key) => {
    let data = { ...filter };
    data[key] = e;
    setFilter({
      ...data,
    });
  };
  const getAllOptions = async () => {
    let $BoPhan = QuyTrinhService.DanhMuc.BoPhan();
    let $CapGiangDay = DanhMucService.CapGiangDay.GetList();
    let $listKhoaHoc = DanhMucService.KhoaHoc.GetList({});
    let res = await Promise.all([$BoPhan, $CapGiangDay, $listKhoaHoc]);
    if (res[0]) {
      setListBoPhan(
        res[0].map((ele) => {
          return { value: ele.Id, label: ele.TenBoPhan };
        })
      );
    }
    if (res[1]) {
      setListCapGiangDay(
        res[1].map((ele) => {
          return { value: ele.Id, label: ele.Ten };
        })
      );
    }
    if (res[2]) {
      setListKhoaHoc(
        res[2].map((ele) => {
          return { value: ele.Id, label: ele.Ten };
        })
      );
    }
  };
  const getListDanhMuc = async () => {
    let list = await DanhMucService.Lop.GetList(filter);
    if (list) {
      list = list.filter((item) =>
        filter.IdBoPhan ? item.IdBoPhan === filter.IdBoPhan : true
      );
      list.forEach((item, index) => {
        item.STT = index + 1;
        item.TenBoPhan =
          listBoPhan.find((bophan) => bophan.Id === item.IdBoPhan)?.TenBoPhan ||
          null;
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
    });
    setVisible(true);
  };
  const confirmAdd = async () => {
    if (validate()) {
      let add = await DanhMucService.Lop[item.Id === "" ? "Add" : "Update"](
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
        let $delete = await DanhMucService.Lop.Delete(item);
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
    let validVar = ["Ma", "Ten"];
    return validForm(validVar, item);
  };

  return (
    <>
      <h1 className="section-heading">Danh mục lớp học</h1>
      <div className="container-haha">
        <div className="flex flex-row justify-content-between">
          <div>
            <Button
              label="Thêm mới"
              className="p-button-sm"
              onClick={handleAdd}
            />
          </div>
          <div className="flex flex-row gap-3">
            <Dropdown
              className="w-150px p-inputtext-sm"
              value={filter.IdBoPhan}
              options={listBoPhan}
              onChange={(e) => setFilter({ ...filter, IdBoPhan: e.value })}
              itemTemplate={dropdownOptionTemplate}
              filter
              showClear
              filterBy="TenBoPhan"
              placeholder="Chọn khoa"
            />
            <div className="p-inputgroup">
              <InputText
                className="p-inputtext-sm"
                placeholder="Tìm kiếm"
                value={filter.KeyWord}
                onKeyDown={(e) => {
                  if (e.key === "Enter") return getListDanhMuc();
                }}
                onChange={(e) => {
                  setFil(e.target.value, "KeyWord");
                }}
              />
              <Button
                icon="pi pi-search"
                className="p-button-primary"
                onClick={() => {
                  getListDanhMuc();
                }}
              />
              <Button
                icon="pi pi-refresh"
                className="p-button-primary"
                onClick={() => {
                  setFilter({
                    KeyWord: "",
                    IdBoPhan: "",
                  });
                  setReset(!reset);
                }}
              />
            </div>
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
            style={{ width: "15%" }}
            field="Ma"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Mã"
          ></Column>
          <Column
            style={{ width: "20%" }}
            field="Ten"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Tên"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="TenBoPhan"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Khoa"
          ></Column>
          <Column
            style={{ width: "35%" }}
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
          header={`${header} lớp học`}
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
              <label>Khóa học:</label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={item.IdKhoa}
                options={listKhoaHoc}
                itemTemplate={dropdownOptionTemplate}
                onChange={(e) => setForm(e.value, "IdKhoa")}
                style={_stl}
                filter
                showClear
                filterBy="label"
                placeholder="Chọn khóa học"
              />
            </div>
            <div className="field col-12">
              <label>Khoa:</label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={item.IdBoPhan}
                options={listBoPhan}
                itemTemplate={dropdownOptionTemplate}
                onChange={(e) => setForm(e.value, "IdBoPhan")}
                style={_stl}
                filter
                showClear
                filterBy="label"
                placeholder="Chọn khoa"
              />
            </div>
            <div className="field col-12">
              <label>Cấp giảng dạy:</label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={item.IdCapGiangDay}
                options={listCapGiangDay}
                itemTemplate={dropdownOptionTemplate}
                onChange={(e) => setForm(e.value, "IdCapGiangDay")}
                style={_stl}
                filter
                showClear
                filterBy="TenBoPhan"
                placeholder="Chọn cấp giảng dạy"
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

const _stl = {
  width: "200px",
};
