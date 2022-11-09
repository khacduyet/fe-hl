import React, { useEffect, useRef, useState } from "react";
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
import { dropdownOptionTemplate } from "../common/templateDropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
export default function DanhMucLuongChucVu() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [listLuongChucVu, setListLuongChucVu] = useState([]);
  const [filter, setFilter] = useState({});
  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [item, setItem] = useState({});
  const [GiaoVien, setGiaoVien] = useState([]);
  const [Mon, setMon] = useState([]);
  const [ViTri, setViTri] = useState([]);

  useEffect(() => {
    getAllOptions();
  }, []);
  useEffect(() => {
    if (listLuongChucVu?.length) {
      getListDanhMuc();
    }
  }, [filter, listLuongChucVu]);
  const getAllOptions = async () => {
    let $GiaoVien = await DanhMucService.GetListUser.GetList();
    let $Mon = await DanhMucService.Mon.GetList({});
    let $ViTri = await DanhMucService.QuyDinhKiemNhiem.GetList();
    let $LuongChucVu = await DanhMucService.LuongChucVu.GetList();
    if ($LuongChucVu) {
      setListLuongChucVu($LuongChucVu);
    }
    if ($GiaoVien.items) {
      setGiaoVien(
        $GiaoVien.items.map((ele) => {
          return { value: ele.Id, label: ele.TenNhanVien };
        })
      );
    }
    if ($Mon) {
      setMon(
        $Mon.map((ele) => {
          return { value: ele.Id, label: ele.Ten };
        })
      );
    }
    if ($ViTri) {
      setViTri(
        $ViTri.map((ele) => {
          return {
            value: ele.Id,
            label: ele.Ten + " (" + ele.KiemNhiem + "%)",
          };
        })
      );
    }
  };
  const getListDanhMuc = async () => {
    let list = await DanhMucService.LuongChucVu.GetList();
    if (list) {
      list.forEach((item, index) => {
        item.STT = index + 1;
        item.TenLuongChucVu =
          listLuongChucVu.find(
            (LuongChucVu) => LuongChucVu.Id === item.IdLuongChucVu
          )?.Ten || null;
      });
      setListItem(list);
    }
  };
  const handleAdd = () => {
    setHeader("Thêm mới");
    setItem({
      Id: "",
      IdGiaoVien: "",
      listIdMon: [],
      listMon: [],
      IdViTriKiemNhiem: "",
      KiemNhiem: 0,
    });
    setVisible(true);
  };
  const confirmAdd = async () => {
    if (validate()) {
      let add = await DanhMucService.LuongChucVu[
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
        let $delete = await DanhMucService.LuongChucVu.Delete(item.Id);
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
    let validVar = ["IdGiaoVien", "listMon"];
    return validForm(validVar, item);
  };

  const handlePushToArray = (e) => {
    let arr = e.map((ele) => {
      return { IdMon: ele };
    });
    setForm(arr, "listMon");
  };

  // NEW FILTER
  const [filterValue, setFilterValue] = useState("");
  const filterInputRef = useRef();
  const dropdownFilterTemplate = (options) => {
    let { filterOptions } = options;
    return (
      <div className="p-multiselect-filter-container">
        <InputText
          className="p-inputtext p-component p-multiselect-filter"
          value={filterValue}
          ref={filterInputRef}
          onChange={(e) => {
            myFilterFunction(e, filterOptions);
          }}
        />
      </div>
    );
  };

  const myFilterFunction = (event, options) => {
    let _filterValue = event.target.value;
    setFilterValue(_filterValue);
    options.filter(event);
  };
  // END FILTER

  return (
    <>
      <h1 className="section-heading">QUY ĐỊNH % KIÊM NHIỆM</h1>
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
            style={{ width: "15%" }}
            field="TenGiaoVien"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Giáo viên"
          ></Column>
          <Column
            style={{ width: "20%" }}
            field="TenMon"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Môn"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="TenViTriKiemNhiem"
            headerClassName="text-center"
            // bodyClassName="text-center"
            className="w-5"
            header="Vị trí kiêm nhiệm"
            bodyStyle={{ maxWidth: "0" }}
            body={(rowData) => {
              return (
                <div
                  className="wrapper-small"
                  title={rowData.TenViTriKiemNhiem}
                >
                  {rowData.TenViTriKiemNhiem}
                </div>
              );
            }}
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="KiemNhiem"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="% kiêm nhiệm"
          ></Column>
          <Column
            bodyClassName="text-center"
            field="Handles"
            style={{ width: "15%" }}
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
          header={`${header} quy định % kiêm nhiệm`}
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
                value={item.IdGiaoVien}
                options={GiaoVien}
                onChange={(e) => setForm(e.value, "IdGiaoVien")}
                filter
              />
            </div>
            <div className="field col-12">
              <label>
                Môn<span className="text-red-500">(*)</span>:
              </label>
              <MultiSelect
                className="p-inputtext-sm"
                placeholder="Chọn môn"
                value={item.listIdMon}
                options={Mon}
                onChange={(e) => {
                  setForm(e.value, "listIdMon");
                  handlePushToArray(e.value);
                }}
                filter
                filterTemplate={dropdownFilterTemplate}
                onShow={() => {
                  filterInputRef && filterInputRef.current.focus();
                }}
                // showClear
              />
            </div>
            <div className="field col-12">
              <label>
                Vị trí kiêm nhiệm
                <span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="p-dropdown-sm w-full"
                placeholder="Chọn vị trí kiêm nhiệm"
                value={item.IdViTriKiemNhiem}
                options={ViTri}
                itemTemplate={dropdownOptionTemplate}
                onChange={(e) => setForm(e.value, "IdViTriKiemNhiem")}
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
