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
import { cLoaiPhuongTien, cLoaiXe } from "../common/apiservice";
import { outContext } from "../../App";
import { FileUpload } from "primereact/fileupload";
import { baseUrl } from "../../services/axiosClient.setup";

export default function QuanLyDanCu() {
  const { toast } = useOutletContext();
  const [listItem, setListItem] = useState([]);
  const [phuongTiens, setPhuongTiens] = useState([]);
  const [loaiXes, setLoaiXes] = useState([]);
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
  const [reset, setReset] = useState(false);

  useEffect(() => {
    getAllOptions();
  }, []);
  useEffect(() => {
    getList();
  }, [filter.IdChungCu, reset]);
  const getAllOptions = async () => {
    let $PhuongTien = await cLoaiPhuongTien();
    let $LoaiXe = await cLoaiXe();
    if ($PhuongTien) {
      setPhuongTiens($PhuongTien);
    }
    if ($LoaiXe) {
      setLoaiXes($LoaiXe);
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
    setHeader("Th??m m???i");
    setItem({
      Id: "",
      Ma: "",
      Ten: "",
      ChuSoHuu: "",
      SoDienThoai: "",
      DienTich: 0,
      GhiChu: "",
      IdChungCu: context.access_chungcu,
      TrangThai: true,
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
      toast.error("Vui l??ng nh???p ?????y ????? c??c tr?????ng th??ng tin b???t bu???c!");
    }
  };
  const handleEdit = async (item) => {
    let edit = await DanhMucService.CanHo.Get(item.Id);
    if (edit) {
      setHeader("C???p nh???t");
      setItem(edit.Data);
      setVisible(true);
    }
  };
  const handleDelete = (item) => {
    confirmDialog({
      message: "B???n ch???c ch???n mu???n x??a ch????",
      header: "Th??ng b??o",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ch???p nh???n",
      rejectLabel: "H???y",
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
    if (!validForm(validVar, item)) {
      toast.error("Vui l??ng nh???p ?????y ????? c??c tr?????ng d??? li???u b???t bu???c!");
      return false;
    }
    let validVarChiTiet = ["IdPhuongTien", "IdLoaiXe", "BienKiemSoat"];
    let checkChiTiet = true;
    item.PhuongTiens.forEach((chitiet) => {
      if (!validForm(validVarChiTiet, chitiet)) {
        checkChiTiet = false;
        return false;
      }
    });
    if (checkChiTiet === false) {
      toast.error("Vui l??ng nh???p ?????y ????? th??ng tin ph????ng ti???n!");
      return false;
    }
    return true;
  };

  const handleAddRow = () => {
    let temp = [
      ...item.PhuongTiens,
      {
        IdLoaiXe: "",
        IdPhuongTien: "",
        BienKiemSoat: "",
        TrangThai: true,
      },
    ];
    setForm(temp, "PhuongTiens");
  };

  const handleDeleteRow = (rowData, index) => {
    let temp = [...item.PhuongTiens];
    console.log("index", index);
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
  const handleImport = async (e) => {
    const formData = new FormData();
    formData.append("file", e.files[0]);
    console.log("formData", formData);
    let up = await DanhMucService.CanHo.UploadFile(formData);
    if (up) {
      let res = await DanhMucService.CanHo.Import(
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
    let res = await DanhMucService.CanHo.Export(_fil);
    if (res) {
      if (res.StatusCode === 200) {
        toast.success(res.Message);
        window.open(baseUrl + res.Data, '_blank').focus();
      } else {
        toast.error(res.Message);
      }
    }
  };
  const chooseOptions = {
    label: "Nh???p d??? li???u",
    className: "p-button-sm",
  };

  return (
    <>
      <h1 className="section-heading">Danh m???c c??n h???</h1>
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
              accept=".xls,.xlsx"
              url={baseUrl + `/FileUploader/Post`}
              auto
              chooseOptions={chooseOptions}
              className="p-button-sm ml-2 inline-block"
              onUpload={(e)=>{
                handleImport(e)
              }}
            />
            <Button
              label="Xu???t d??? li???u"
              className="p-button-sm ml-2"
              onClick={handleExport}
            />
          </div>
          <div className="flex flex-row gap-3">
            <div className="p-inputgroup">
              <InputText
                className="p-inputtext-sm"
                placeholder="T??m ki???m"
                style={{ width: "300px" }}
                value={filter.Keyword}
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
            style={{ width: "5%" }}
            header="#"
          ></Column>
          <Column
            style={{ width: "10%" }}
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
            style={{ width: "15%" }}
            field="ChuSoHuu"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Ch??? s??? h???u"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="SoDienThoai"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="S??T"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="DienTich"
            headerClassName="text-center"
            bodyClassName="text-center"
            header="Di???n t??ch"
          ></Column>
          <Column
            style={{ width: "10%" }}
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
              <label>Ch??? s??? h???u:</label>
              <InputText
                className="w-full"
                value={item.ChuSoHuu}
                onChange={(e) => setForm(e.target.value, "ChuSoHuu")}
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
                Di???n t??ch<span className="text-red-500">(*)</span>:
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
              <label>Ghi ch??:</label>
              <InputText
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
            <div className="col-12 mt-3">
              <label htmlFor="TrangThai" className="p-checkbox-label">
                Danh s??ch xe:
              </label>
              <DataTable
                className="p-datatable-sm p-datatable-gridlines pt-1"
                value={item.PhuongTiens}
                paginatorLeft={"T???ng s??? b???n ghi " + item.PhuongTiens?.length}
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
                  header="Ph????ng ti???n"
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
                        placeholder="Ch???n ph????ng ti???n"
                      />
                    );
                  }}
                ></Column>
                <Column
                  field="IdLoaiXe"
                  headerClassName="text-center"
                  style={{ width: "2%" }}
                  header="Lo???i xe"
                  body={(rowData, options) => {
                    return (
                      <Dropdown
                        className="w-full"
                        value={rowData.IdLoaiXe}
                        options={loaiXes.map((x) => {
                          return { label: x.Ten, value: x.Id };
                        })}
                        onChange={(e) => {
                          handleChangeItemTable(
                            rowData,
                            options.rowIndex,
                            e.target.value,
                            "IdLoaiXe"
                          );
                        }}
                        filter
                        showClear
                        filterBy="label"
                        placeholder="Ch???n lo???i xe"
                      />
                    );
                  }}
                ></Column>
                <Column
                  bodyClassName="text-center"
                  field="BienKiemSoat"
                  headerClassName="text-center"
                  style={{ width: "5%" }}
                  header="Bi???n ki???m so??t"
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
                  header="Ho???t ?????ng"
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
                  body={(rowData, options) => (
                    <>
                      <Button
                        className="p-button-sm p-button-danger p-button-rounded"
                        type="button"
                        icon="pi pi-trash"
                        onClick={() => {
                          handleDeleteRow(rowData, options.rowIndex);
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
