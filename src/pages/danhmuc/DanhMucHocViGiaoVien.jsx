import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DanhMucService } from "../../services/danhmuc.service";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { Dropdown } from "primereact/dropdown";
import { validForm } from "../../services/helperfunction";
export default function DanhMucLuongChucVu() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [filter, setFilter] = useState({});
  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [item, setItem] = useState({});
  const [GiaoVien, setGiaoVien] = useState([]);
  const [listHocHam, setListHocHam] = useState([]);

  useEffect(() => {
    getAllOptions();
  }, []);
  useEffect(() => {
    getListDanhMuc();
  }, [filter]);
  const getAllOptions = async () => {
    let $GiaoVien = await DanhMucService.GetListUser.GetList();
    let $HocHam = await DanhMucService.HocHam.GetList();
    if ($HocHam) {
      setListHocHam($HocHam);
    }
    if ($GiaoVien.items) {
      setGiaoVien(
        $GiaoVien.items.map((ele) => {
          return { value: ele.Id, label: ele.TenNhanVien };
        })
      );
    }
  };
  const getListDanhMuc = async () => {
    let list = await DanhMucService.HocViGiaoVien.GetList();
    if (list) {
      list.map((ele, index) => {
        ele.STT = index + 1;
        return ele;
      });
      setListItem(list);
    }
  };
  const handleAdd = () => {
    setHeader("Thêm mới");
    setItem({
      Id: "",
      IdUserGiaoVien: "",
      IdHocVi: "",
    });
    setVisible(true);
  };
  const confirmAdd = async () => {
    if (validate()) {
      let add = await DanhMucService.HocViGiaoVien[
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
        let $delete = await DanhMucService.HocViGiaoVien.Delete(item.Id);
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
    let validVar = ["IdUserGiaoVien", "IdHocVi"];
    return validForm(validVar, item);
  };

  return (
    <>
      <h1 className="section-heading">HỌC VỊ GIÁO VIÊN</h1>
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
            field="TenGiaoVien"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Giáo viên"
          ></Column>
          <Column
            style={{ width: '15%' }} 
            field="TenHocVi"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Học vị"
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
          header={`${header} học vị giáo viên`}
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
                Giáo viên<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="p-dropdown-sm w-full"
                placeholder="Chọn giáo viên"
                value={item.IdUserGiaoVien}
                options={GiaoVien}
                onChange={(e) => setForm(e.value, "IdUserGiaoVien")}
                filter
              />
            </div>
            <div className="field col-12">
              <label>
                Học hàm<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="p-dropdown-sm w-full"
                placeholder="Chọn học hàm"
                value={item.IdHocVi}
                optionValue="Id"
                optionLabel="Ten"
                options={listHocHam}
                onChange={(e) => setForm(e.value, "IdHocVi")}
                filter
              />
            </div>
          </div>
        </Dialog>
        <ConfirmDialog></ConfirmDialog>
      </div>
    </>
  );
}
