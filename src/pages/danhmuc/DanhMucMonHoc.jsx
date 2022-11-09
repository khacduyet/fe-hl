import React, { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { danhMucOpt, serviceOpt } from "../../services/const";
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
import { QuyTrinhService } from "../../services/quytrinh.service";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { useCallback } from "react";
export default function DanhMucChungPaging() {
  const { opt } = useParams();
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [item, setItem] = useState({});
  const [reset, setReset] = useState(false);
  const [listBoPhan, setListBoPhan] = useState([]);
  const [listBoPhanFull, setListBoPhanFull] = useState([]);
  const [filter, setFilter] = useState({
    KeyWord: "",
    IdKhoa: 0,
  });

  const getAllOptions = async () => {
    let $BoPhan = await QuyTrinhService.DanhMuc.BoPhan();
    if ($BoPhan) {
      setListBoPhan(
        $BoPhan.map((ele) => {
          return { value: ele.Id, label: ele.TenBoPhan };
        })
      );
      setListBoPhan((prev) => [{ value: 123, label: "Môn chung" }, ...prev]);
      setListBoPhanFull(
        $BoPhan.map((ele) => {
          return { value: ele.Id, label: ele.TenBoPhan };
        })
      );
    }
  };
  const getListDanhMuc = useCallback(async () => {
    let list = await DanhMucService["Mon"].GetList(filter);
    if (list) {
      list = list.filter((item) =>
        filter.listIdBoPhan && filter.listIdBoPhan.length > 0
          ? filter.listIdBoPhan.indexOf(filter.IdBoPhan) !== -1
          : true
      );
      list.forEach((item, index) => {
        item.STT = index + 1;
      });
      setListItem(list);
    }
  }, [filter]);

  useEffect(() => {
    getAllOptions();
  }, []);
  useEffect(() => {
    getListDanhMuc();
  }, [reset, filter]);

  const setFil = (e, key) => {
    let data = { ...filter };
    data[key] = e;
    setFilter({
      ...data,
    });
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
      let add = await DanhMucService["Mon"][item.Id === "" ? "Add" : "Update"](
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
      toast.error("Vui lòng điền đầy đủ các trường thông tin bắt buộc!");
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
        let $delete = await DanhMucService["Mon"].Delete(item);
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
      <h1 className="section-heading">Danh mục môn học</h1>
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
              value={filter.IdKhoa}
              options={listBoPhan}
              onChange={(e) => {
                setFilter({ ...filter, IdKhoa: e.value });
                // getListDanhMuc();
              }}
              filter
              showClear
              filterBy="label"
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
                    IdBoPhan: 0,
                  });
                  setReset(!reset);
                }}
              />
            </div>
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
            field="Ma"
            headerClassName="text-center"
            sortable
            bodyClassName="text-center"
            header="Mã"
          ></Column>
          <Column
            style={{ width: "20%" }}
            field="Ten"
            headerClassName="text-center"
            sortable
            bodyClassName=""
            header="Tên"
            bodyStyle={{ maxWidth: "0" }}
            body={(rowData) => {
              return (
                <div className="wrapper-small" title={rowData.Ten}>
                  {rowData.Ten}
                </div>
              );
            }}
          ></Column>
          <Column
            style={{ width: "20%" }}
            field="TenBoPhan"
            headerClassName="text-center"
            sortable
            bodyClassName=""
            header="Khoa"
            bodyStyle={{ maxWidth: "0" }}
            body={(rowData) => {
              return (
                <div className="wrapper-small" title={rowData.TenBoPhan}>
                  {rowData.TenBoPhan}
                </div>
              );
            }}
          ></Column>
          <Column
            style={{ width: "30%" }}
            field="GhiChu"
            headerClassName="text-center"
            sortable
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
          header={`${header} môn học`}
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
              <label>Khoa:</label>
              <MultiSelect
                className="p-inputtext-sm"
                placeholder="Chọn khoa"
                value={item.listIdBoPhan}
                options={listBoPhanFull}
                onChange={(e) => setForm(e.value, "listIdBoPhan")}
                filter
                filterTemplate={dropdownFilterTemplate}
                onShow={() => {
                  filterInputRef && filterInputRef.current.focus();
                }}
                // showClear
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
