import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { outContext } from "../../App";
import { DanhMucService } from "../../services/danhmuc.service";
import { validForm } from "../../services/helperfunction";
import { cLoaiPhuongTien, cLoaiXe } from "../common/apiservice";
import { baseUrl } from "../../services/axiosClient.setup";

export default function XeNgoai() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [phuongTiens, setPhuongTiens] = useState([]);
  const [loaiXes, setLoaiXes] = useState([]);
  const [reset, setReset] = useState(false);
  const context = useContext(outContext);
  const [filter, setFilter] = useState({
    Keyword: "",
    IdPhuongTien: "",
    IdLoaiXe: "",
    IdChungCu: context.access_chungcu,
  });
  useEffect(() => {
    setFil(context.access_chungcu, "IdChungCu");
  }, [context.access_chungcu]);

  const [visible, setVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [item, setItem] = useState({});
  useEffect(() => {
    getList();
    getAllOptions();
  }, [filter.IdLoaiXe, filter.IdPhuongTien, reset]);
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
    setHeader("Th??m m???i");
    setItem({
      Id: "",
      Ma: "",
      Ten: "",
      BienKiemSoat: "",
      SoDienThoai: "",
      GhiChu: "",
      IdChungCu: context.access_chungcu,
      TrangThai: true,
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
      toast.error("Vui l??ng nh???p ?????y ????? c??c tr?????ng th??ng tin b???t bu???c!");
    }
  };
  const handleEdit = async (item) => {
    // let edit = await DanhMucService.XeNgoai.Get(item.Id);
    // if (edit) {
    setHeader("C???p nh???t");
    setItem(item);
    setVisible(true);
    // }
  };
  const handleDelete = (item) => {
    confirmDialog({
      message: "B???n ch???c ch???n mu???n x??a ch????",
      header: "Th??ng b??o",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ch???p nh???n",
      rejectLabel: "H???y",
      accept: async () => {
        let $delete = await DanhMucService.XeNgoai.Delete(item.Id);
        if ($delete) {
          if ($delete.StatusCode === 200) {
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

  const handleImport = async (e) => {
    const formData = new FormData();
    formData.append("file", e.files[0]);
    let up = await DanhMucService.XeNgoai.UploadFile(formData);
    if (up) {
      let res = await DanhMucService.XeNgoai.Import(
        up.files[0].name,
        filter.IdChungCu
      );
      if (res && res.StatusCode === 200) {
        toast.success(res.Message);
        getList();
      } else {
        toast.error(res.Message);
      }
    }
  };

  const handleExport = async () => {
    let _fil = {
      ...filter,
    };
    let res = await DanhMucService.XeNgoai.Export(_fil);
    if (res) {
      if (res.StatusCode === 200) {
        toast.success(res.Message);
        window.open(baseUrl + res.Data, '_blank').focus();
      } else {
        toast.error(res.Message);
      }
    }
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
  const chooseOptions = {
    label: "Nh???p d??? li???u",
    className: "p-button-sm",
  };

  return (
    <>
      <h1 className="section-heading">Danh m???c xe ngo??i</h1>
      <div className="container-haha">
        <div className="flex flex-row justify-content-between">
          <div>
            <Button
              label="Th??m m???i"
              className="p-button-sm"
              onClick={handleAdd}
            />
            <FileUpload
              mode="basic"
              name="file"
              auto
              url={baseUrl + `/FileUploader/Post`}
              accept=".xls,.xlsx"
              chooseOptions={chooseOptions}
              className="p-button-sm ml-2 inline-block"
              onUpload={handleImport}
            />
            <Button
              label="Xu???t d??? li???u"
              className="p-button-sm ml-2"
              onClick={handleExport}
            />
          </div>
          <div className="flex flex-row gap-3">
            <Dropdown
              resetFilterOnHide={true}
              style={{ width: "150px" }}
              className="p-inputtext-sm"
              value={filter.IdPhuongTien}
              options={phuongTiens.map((ele) => {
                return { value: ele.Id, label: ele.Ten };
              })}
              onChange={(e) => {
                setFil(e.value, "IdPhuongTien");
              }}
              filter
              filterBy="label"
              placeholder="Ch???n ph????ng ti???n"
            />
            <Dropdown
              resetFilterOnHide={true}
              style={{ width: "300px" }}
              className="p-inputtext-sm"
              value={filter.IdLoaiXe}
              options={loaiXes.map((ele) => {
                return { value: ele.Id, label: ele.Ten };
              })}
              onChange={(e) => {
                setFil(e.value, "IdLoaiXe");
              }}
              filter
              filterBy="label"
              placeholder="Ch???n lo???i xe"
            />
            <div className="p-inputgroup">
              <InputText
                className="p-inputtext-sm"
                placeholder="T??m ki???m"
                style={{ width: "300px" }}
                value={filter.KeyWord}
                onKeyDown={(e) => {
                  if (e.key === "Enter") return getList();
                }}
                onChange={(e) => {
                  setFil(e.target.value, "Keyword");
                }}
              />
              <Button
                icon="pi pi-search"
                className="p-button-primary"
                onClick={() => {
                  getList();
                }}
              />
              <Button
                icon="pi pi-refresh"
                className="p-button-primary"
                onClick={() => {
                  setFilter({
                    ...{
                      LoaiNguoiDung: 1,
                      Thang: 1,
                      Keyword: "",
                    },
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
          paginatorLeft={"T???ng s??? b???n ghi " + listItem?.length}
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
            header="M??"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="Ten"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="T??n"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="BienKiemSoat"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Bi???n ki???m so??t"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="SoDienThoai"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="S??T"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="TenPhuongTien"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Ph????ng ti???n"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="TenLoaiXe"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Lo???i xe"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="GhiChu"
            headerClassName="text-center"
            header="Ghi ch??"
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
            header="Ho???t ?????ng"
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
            header="Thao t??c"
          ></Column>
        </DataTable>
        <Dialog
          header={`${header} c??n h???`}
          visible={visible}
          onHide={onHide}
          breakpoints={{ "960px": "40vw", "640px": "100vw" }}
          style={{ width: "60vw" }}
        >
          <div className="flex flex-row gap-2">
            <Button label="Quay l???i" className="p-button-sm" onClick={onHide} />
            <Button
              label="Ghi l???i"
              className="p-button-sm"
              onClick={confirmAdd}
            />
          </div>
          <div className="formgrid grid pt-3">
            <div className="field col-6">
              <label>
                M??<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                value={item.Ma}
                className="w-full"
                onChange={(e) => setForm(e.target.value, "Ma")}
              />
            </div>
            <div className="field col-6">
              <label>
                T??n<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={item.Ten}
                onChange={(e) => setForm(e.target.value, "Ten")}
              />
            </div>
            <div className="field col-6">
              <label>
                Bi???n ki???m so??t<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={item.BienKiemSoat}
                onChange={(e) => setForm(e.target.value, "BienKiemSoat")}
              />
            </div>
            <div className="field col-6">
              <label>
                S??? ??i???n tho???i<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={item.SoDienThoai}
                onChange={(e) => setForm(e.target.value, "SoDienThoai")}
              />
            </div>

            <div className="field col-6">
              <label>
                Ph????ng ti???n<span className="text-red-500">(*)</span>:
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
                placeholder="Ch???n ph????ng ti???n"
              />
            </div>
            <div className="field col-6">
              <label>
                Lo???i xe<span className="text-red-500">(*)</span>:
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
                placeholder="Ch???n lo???i xe"
              />
            </div>

            <div className="field col-12">
              <label>Ghi ch??:</label>
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
                Ho???t ?????ng:
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
