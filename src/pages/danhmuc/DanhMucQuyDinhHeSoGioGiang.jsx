import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DanhMucService } from "../../services/danhmuc.service";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { Dropdown } from "primereact/dropdown";
import { validForm } from "../../services/helperfunction";
import { QuyTrinhService } from "../../services/quytrinh.service";
import { Ripple } from "primereact/ripple";
export default function DanhMucHeSoGioGiang() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [listHeSoGioGiang, setListHeSoGioGiang] = useState([]);
  const [filter, setFilter] = useState({});
  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [item, setItem] = useState({});
  const [listBoPhan, setListBoPhan] = useState([]);
  const [listBoPhanFull, setListBoPhanFull] = useState([]);
  const [listLoaiTietHoc, setListLoaiTietHoc] = useState([]);
  const [listBoMonFull, setListBoMonFull] = useState([]);
  const [listBoMon, setListBoMon] = useState([]);
  useEffect(() => {
    getAllOptions();
    getAllBoPhan();
    getListLoaiTietHoc();
  }, []);
  const getAllBoPhan = async () => {
    let $BoPhan = await QuyTrinhService.DanhMuc.BoPhan();
    if ($BoPhan) {
      setListBoPhan(
        $BoPhan.map((ele) => {
          return { value: ele.Id, label: ele.TenBoPhan };
        })
      );
      setListBoPhanFull($BoPhan);
    }
  };
  const getListLoaiTietHoc = async () => {
    let list = await DanhMucService.LoaiTietHoc.GetList();
    if (list) {
      setListLoaiTietHoc(
        list.map((ele) => {
          return { value: ele.Id, label: ele.Ten };
        })
      );
    }
  };
  useEffect(() => {
    if (listHeSoGioGiang?.length) {
      getListDanhMuc();
    }
  }, [filter, listHeSoGioGiang]);
  const getAllOptions = async () => {
    let $HeSoGioGiang = await DanhMucService.HeSoGioGiang.GetList();
    let $BoMon = await DanhMucService.Mon.GetList({});
    if ($HeSoGioGiang) {
      setListHeSoGioGiang($HeSoGioGiang);
    }
    if ($BoMon) {
      setListBoMon(
        $BoMon.map((ele) => {
          return { value: ele.Id, label: ele.Ten };
        })
      );
      setListBoMonFull($BoMon);
    }
  };
  const getListDanhMuc = async () => {
    let list = await DanhMucService.HeSoGioGiang.GetList();
    if (list) {
      list.forEach((item, index) => {
        item.STT = index + 1;
        item.TenHeSoGioGiang =
          listHeSoGioGiang.find(
            (HeSoGioGiang) => HeSoGioGiang.Id === item.IdHeSoGioGiang
          )?.Ten || null;
      });
      setListItem(list);
    }
  };
  const handleAdd = () => {
    setHeader("Thêm mới");
    setItem({
      Id: "",
      IdHinhThuc: "",
      IdKhoa: "",
      IdMon: "",
      SiSo: 0,
      HeSo: 0,
    });
    setVisible(true);
  };
  const confirmAdd = async () => {
    if (validate()) {
      let add = await DanhMucService.HeSoGioGiang[
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
    handleChangeKhoa(item.IdKhoa)
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
        let $delete = await DanhMucService.HeSoGioGiang.Delete(item.Id);
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
    setListBoMon(
      listBoMonFull.map((ele) => {
        return { value: ele.Id, label: ele.Ten };
      })
    );
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
    let validVar = ["IdHinhThuc", "IdKhoa", "IdMon", "SiSo", "HeSo"];
    return validForm(validVar, item);
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
    setListBoMon(listNew);
  };

  return (
    <>
      <h1 className="section-heading">QUY ĐỊNH HỆ SỐ GIỜ GIẢNG</h1>
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
            field="TenHinhThuc"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Hình thức dạy"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="TenKhoa"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Khoa"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="TenMon"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Bộ môn"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="SiSo"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Sỹ số"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="HeSo"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Hệ số"
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
          header={`${header} quy định hệ số giờ giảng`}
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
                Hình thức dạy<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="p-dropdown-sm w-full"
                placeholder="Chọn hình thức"
                value={item.IdHinhThuc}
                options={listLoaiTietHoc}
                onChange={(e) => setForm(e.value, "IdHinhThuc")}
                filter
              />
            </div>
            <div className="field col-12">
              <label>
                Khoa<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="p-dropdown-sm w-full"
                placeholder="Chọn khoa"
                value={item.IdKhoa}
                options={listBoPhan}
                onChange={(e) => {
                  setForm(e.value, "IdKhoa");
                  handleChangeKhoa(e.value);
                }}
                filter
              />
            </div>
            <div className="field col-12">
              <label>
                Bộ môn<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="p-dropdown-sm w-full"
                placeholder="Chọn bộ môn"
                value={item.IdMon}
                options={listBoMon}
                onChange={(e) => setForm(e.value, "IdMon")}
                filter
              />
            </div>

            <div className="field col-12">
              <label>
                Sỹ số<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                keyfilter={/^[0-9]*$/}
                type="number"
                className="w-full"
                value={item.SiSo}
                onChange={(e) => setForm(e.target.value, "SiSo")}
              />
            </div>
            <div className="field col-12">
              <label>
                Hệ số<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                type="number"
                className="w-full"
                value={item.HeSo}
                onChange={(e) => setForm(e.target.value, "HeSo")}
              />
            </div>
          </div>
        </Dialog>
        <ConfirmDialog></ConfirmDialog>
      </div>
    </>
  );
}
