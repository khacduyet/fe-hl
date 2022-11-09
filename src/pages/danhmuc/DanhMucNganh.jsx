import React, { useEffect, useRef, useState } from "react";
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
import { MultiSelect } from "primereact/multiselect";
import { QuyTrinhService } from "../../services/quytrinh.service";
import { Dropdown } from "primereact/dropdown";
import { dropdownOptionTemplate } from "../common/templateDropdown";
export default function DanhMucNganh() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [listNganh, setListNganh] = useState([]);
  const [filter, setFilter] = useState({});
  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [Mon, setMon] = useState([]);
  const [listBoMonFull, setListBoMonFull] = useState([]);
  const [listBoPhanFull, setListBoPhanFull] = useState([]);
  const [item, setItem] = useState({});
  useEffect(() => {
    getAllOptions();
  }, []);
  useEffect(() => {
    if (listNganh?.length) {
      getListDanhMuc();
    }
  }, [filter, listNganh]);
  const getAllOptions = async () => {
    let $Nganh = await DanhMucService.Nganh.GetList();
    let $Mon = await DanhMucService.Mon.GetList({});
    let $BoPhan = await QuyTrinhService.DanhMuc.BoPhan();
    if ($Nganh) {
      setListNganh($Nganh);
    }
    if ($Mon) {
      setMon(
        $Mon.map((ele) => {
          return { value: ele.Id, label: ele.Ten };
        })
      );
      setListBoMonFull($Mon);
    }
    if ($BoPhan) {
      setListBoPhanFull($BoPhan);
    }
  };
  const getListDanhMuc = async () => {
    let list = await DanhMucService.Nganh.GetList();
    if (list) {
      list.forEach((item, index) => {
        item.STT = index + 1;
        item.TenNganh =
          listNganh.find((Nganh) => Nganh.Id === item.IdNganh)?.Ten || null;
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
      let add = await DanhMucService.Nganh[item.Id === "" ? "Add" : "Update"](
        item
      );
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
        let $delete = await DanhMucService.Nganh.Delete(item.Id);
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
    let validVar = ["Ma", "Ten", "IdBoPhan"];
    return validForm(validVar, item);
  };

  const handlePushToArray = (e) => {
    let arr = e.map((ele) => {
      return { IdMon: ele };
    });
    setForm(arr, "listMon");
  };

  const handleChangeKhoa = (value) => {
    let arr = [];
    let child = listBoPhanFull.filter((ele) => ele.Id === value)[0];
    arr.push(child.Id);
    if (child.BoPhanChaPkid !== 0)
      arr.push(
        listBoPhanFull.filter((ele) => ele.Id === child.BoPhanChaPkid)[0].Id
      );
    let listNew = [];
    arr.map((ele) => {
      let temp = listBoMonFull
        .filter((x) => x.listIdBoPhan?.includes(ele))
        .map((x) => {
          return { value: x.Id, label: x.Ten };
        });
      listNew = [...listNew, ...temp];
      return 1;
    });
    setMon(listNew);
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
      <h1 className="section-heading">Danh mục ngành</h1>
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
            header="Tên Ngành"
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
            field="Handles"
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
          header={`${header} ngành`}
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
                Khoa<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={item.IdBoPhan}
                options={listBoPhanFull.map((ele) => {
                  return { value: ele.Id, label: ele.TenBoPhan };
                })}
                itemTemplate={dropdownOptionTemplate}
                onChange={(e) => {
                  setForm(e.value, "IdBoPhan");
                  handleChangeKhoa(e.value);
                }}
                filter
                showClear
                filterBy="label"
                placeholder="Chọn khoa"
              />
            </div>
            <div className="field col-12">
              <label>
                Tên Ngành<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={item.Ten}
                onChange={(e) => setForm(e.target.value, "Ten")}
              />
            </div>
            <div className="field col-12">
              <label>
                Môn:
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
