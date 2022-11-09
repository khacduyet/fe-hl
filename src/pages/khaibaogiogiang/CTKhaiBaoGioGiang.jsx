import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { QuyTrinhService } from "../../services/quytrinh.service";
import {
  DateStringToDate,
  UnixToDate,
  DateToUnix,
  formatDateStringGMT,
  validForm,
  dayofweektodate,
} from "../../services/helperfunction";
import { vnCalendar } from "../../services/const";
import { DanhMucService } from "../../services/danhmuc.service";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import Loading from "../common/loading";
import { Confirm } from "../common/common";
import TableKhaiBaoGioGiang from "./TableKhaiBaoGioGiang";
import { InputText } from "primereact/inputtext";

export default function CTKhaiBaoGioGiang() {
  let tongSoNam = new Date().getFullYear() - 2020 + 1;
  // if (tongSoNam < 10)
  //   tongSoNam = 10;
  const listNam = new Array(tongSoNam).fill("").map((_, index) => {
    return {
      // value: new Date().getFullYear() + (index - 2),
      // label: new Date().getFullYear() + (index - 2),
      value: 2020 + index,
      label: 2020 + index,
    };
  });
  const listTuan = new Array(100).fill("").map((_, index) => {
    return {
      value: index + 1,
      label: `Tuần ${index + 1}`,
    };
  });
  const { toast } = useOutletContext();
  const { opt, id } = useParams();
  const navigate = useNavigate();
  const [quyTrinh, setQuyTrinh] = useState({
    SoCongVan: "",
    Id: "",
    TrangThai: "",
    Nam: new Date().getFullYear(),
    listChiTiet: [],
    listTietEdit: [],
  });
  const [checkButton, setCheckButton] = useState({});
  const [listBoPhan, setListBoPhan] = useState([]);
  const [listPhongHoc, setListPhongHoc] = useState([]);
  const [listLopFull, setListLopFull] = useState([]);
  const [listMonFull, setListMonFull] = useState([]);
  const [listdmTiet, setListdmTiet] = useState([]);
  const [listdmCa, setListdmCa] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let [dayofyear, setNgayBatDau] = useState(new Date("2022.08.03"));
  let [weekIsDisabled, setWeekIsDisabled] = useState(0);
  const [enableBtn, setEnableBtn] = useState(opt === "add" ? true : false);
  const [visible, setVisible] = useState(false);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [giaoVien, setGiaoVien] = useState([]);
  useEffect(() => {
    if (opt === "add") {
      getNextSo();
      KiemTraButton();
    } else {
      getQuyTrinh(id);
    }
    getAllOptions();
  }, [opt, id]);
  async function getNextSo() {
    let data = await QuyTrinhService.KhaiBaoGioGiang.GetNextSo();
    if (data) {
      await setForm(data.SoPhieu, "SoPhieu");
      setIsLoading(false);
    }
  }
  async function getQuyTrinh(id) {
    let data = await QuyTrinhService.KhaiBaoGioGiang.Get(id);
    if (data) {
      data.listChiTiet.forEach((chitiet) => {
        chitiet.Ngay = UnixToDate(chitiet.NgayUnix);
        chitiet.ThoiGianDen = UnixToDate(chitiet.ThoiGianDenUnix);
        chitiet.ThoiGianTu = UnixToDate(chitiet.ThoiGianTuUnix);
      });
      setQuyTrinh({
        ...data,
        NgaySuDung: new Date(data.NgaySuDung),
        GhiChu: data.GhiChu || "",
      });
      await setIsLoading(false);
    }
  }
  useEffect(() => {
    KiemTraButton();
  }, [quyTrinh.IdTrangThai, quyTrinh.Id]);
  const KiemTraButton = async () => {
    // console.log(quyTrinh);
    let data = await QuyTrinhService.QuanTriQuyTrinh.KiemTraButton(
      quyTrinh.IdTrangThai || "",
      quyTrinh.Id
    );
    if (data) {
      setCheckButton({ ...data });
    }
  };
  async function getAllOptions() {
    let $BoPhan = QuyTrinhService.DanhMuc.BoPhan();
    let $CurrentUser = QuyTrinhService.User.GetCurrent();
    let $listLop = DanhMucService.Lop.GetList({});
    let $listMon = DanhMucService.Mon.GetList({});
    let $listPhongHoc = DanhMucService.PhongHoc.GetList({});
    let $listdmCa = DanhMucService.CaHoc.GetList({});
    let $listdmTiet = DanhMucService.TietHoc.GetList();
    let $NgayBatDauUnix = DanhMucService.GetNgayBatDauNamHoc.Get(
      new Date().getFullYear()
    );
    let $GiaoVien = await DanhMucService.GetListUser.GetList();
    let res = await Promise.all([
      $BoPhan,
      $CurrentUser,
      $listLop,
      $listMon,
      $listPhongHoc,
      $listdmCa,
      $listdmTiet,
      $NgayBatDauUnix,
      $GiaoVien,
    ]);
    setListBoPhan(res[0]);
    if (opt === "add") {
      setForm(res[1]?.Id, "IdUserGiaoVien");
      setForm(res[1]?.TenNhanVien, "TenGiaoVien");
    }
    setListLopFull(res[2]);
    setListMonFull(res[3]);
    setListPhongHoc(
      res[4]?.map((ele) => {
        return { value: ele.Id, label: ele.Ten };
      })
    );
    setListdmCa(res[5]);
    setListdmTiet(res[6]);
    setNgayBatDau(UnixToDate(res[7]));
    setGiaoVien(res[8].items);
  }

  const handleChangeYear = (e) => {
    let $NgayBatDauUnix = DanhMucService.GetNgayBatDauNamHoc.Get(
      new Date().getFullYear()
    );
  };

  const handleBack = () => {
    navigate(-1);
  };
  const handleAdd = async () => {
    if (validate()) {
      let res = await QuyTrinhService.KhaiBaoGioGiang.Set(quyTrinh);
      if (res && res.Error === 4) {
        opt === "add" ? setQuyTrinh({ ...quyTrinh, listChiTiet: [] }) : <></>;
        toast.success(res.Detail);
        navigate(`/quytrinh/khaibaogiogiang/update/${res.Value}`, {
          replace: true,
        });
      } else {
        toast.error(res.Detail);
      }
    }
  };
  const handleApprove = async () => {
    if (validate()) {
      let res = await QuyTrinhService.KhaiBaoGioGiang.ChuyenTiep(quyTrinh);
      if (res && res.Error === 4) {
        toast.success(res.Detail);
        navigate(-1);
      } else {
        toast.error(res.Detail);
      }
    }
  };
  const handleReject = async () => {
    if (validate()) {
      let res = await QuyTrinhService.KhaiBaoGioGiang.KhongDuyet(quyTrinh);
      if (res && res.Error === 4) {
        toast.success(res.Detail);
        navigate(-1);
      } else {
        toast.error(res.Detail);
      }
    }
  };
  const handleDelete = async () => {
    let res = await QuyTrinhService.KhaiBaoGioGiang.Delete(quyTrinh.Id);
    if (res && res.Error === 4) {
      toast.success(res.Detail);
      navigate(-1);
    } else {
      toast.error(res.Detail);
    }
  };
  const setForm = (e, key) => {
    if (e !== null && e !== undefined) {
      setQuyTrinh((prev) => ({
        ...prev,
        [key]: e,
      }));
    } else {
      delete quyTrinh[key];
      setQuyTrinh({ ...quyTrinh });
    }
  };
  const validate = () => {
    // console.log(quyTrinh);
    let validVar = ["Nam", "TuTuan", "ToiTuan"];
    if (!validForm(validVar, quyTrinh)) {
      toast.warn("Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc!");
      return false;
    }
    if (quyTrinh.TuTuan > quyTrinh.ToiTuan) {
      toast.warn("Vui lòng nhập lại từ tuần tới tuần!");
      return false;
    }
    let validVarChiTiet = [
      "NgayUnix",
      "IdBoPhan",
      "listIddmLop",
      "IddmPhongHoc",
      "IddmMon",
      "listChiTiet_TietHoc",
      "SoHocSinhCoMat_Truoc",
      "SoHocSinhCoMat_Sau",
    ];

    if (quyTrinh.listChiTiet.length === 0) {
      toast.warn("Bạn chưa nhập thời gian giảng dạy!");
      return false;
    }
    let checkChiTiet = true;
    quyTrinh.listChiTiet.forEach((chitiet) => {
      if (!validForm(validVarChiTiet, chitiet)) {
        checkChiTiet = false;
        return false;
      }
    });
    if (checkChiTiet === false) {
      toast.warn("Bạn chưa nhập đủ thông tin thời gian giảng dạy!");
      return false;
    }
    return true;
  };
  const HandleChangeTableItem = (e, index) => {
    quyTrinh.listChiTiet[index] = e;
    setForm(quyTrinh.listChiTiet, "listChiTiet");
  };

  const HandleDeleteTableItem = (index) => {
    let temp = [...quyTrinh.listChiTiet];
    temp.splice(index, 1);
    setForm([...temp], "listChiTiet");
  };

  const handleChangeTeacher = (value) => {
    let gv = giaoVien.filter((x) => x.Id === value)[0];
    if (gv) {
      let bophan = listBoPhan.filter((x) => x.Id === gv.idBoPhan)[0];
      if (bophan) setForm(bophan.TenBoPhan, "TenBoPhanGiaoVien");
    }
  };

  useEffect(() => {
    handleChangeTeacher(quyTrinh.IdUserGiaoVien);
  }, [quyTrinh.IdUserGiaoVien]);

  const handleCreate = async () => {
    let data = {
      ...quyTrinh,
    };
    let res = await QuyTrinhService.KhaiBaoGioGiang.TaoNhanh(data);
    if (res && res.Error === 2) {
      res.Value.map((ele) => {
        ele.Ngay = new Date(ele.Ngay);
        ele.NgayUnix = DateToUnix(ele.Ngay);
        ele.listIddmLop = ele.listChiTiet_Lop.map((x) => x.IddmLop);
        return ele;
      });
      res.Value = res.Value.map((ele, index) => {
        return { ...ele, fakeKey: new Date().getTime() + index };
      });
      setQuyTrinh({
        ...data,
        // listChiTiet: [...data.listChiTiet, ...res.Value],
        listChiTiet: [...res.Value],
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      {visible && (
        <Confirm
          visible={visible}
          setVisible={setVisible}
          func={handleDelete}
          message="Bạn có chắc muốn xóa phiếu này!"
          header="Thông báo!"
          acceptLabel="Đồng ý"
          rejectLabel="Hủy bỏ"
        />
      )}
      {visibleCreate && (
        <Confirm
          visible={visibleCreate}
          setVisible={setVisibleCreate}
          func={handleCreate}
          message="Hành động này sẽ xóa hết dữ liệu cũ và thêm dữ liệu mới!"
          header="Thông báo!"
          acceptLabel="Đồng ý"
          rejectLabel="Hủy bỏ"
        />
      )}
      <h1 className="section-heading">
        {opt === "add" ? "Thêm mới" : "Cập nhật"} khai báo giờ giảng
      </h1>
      <div className="container-haha">
        <div className="flex flex-row justify-content-between">
          <div className="flex flex-row gap-2">
            <Button
              label="Quay lại"
              icon="pi pi-angle-double-left"
              className="p-button-sm p-button-warning"
              onClick={handleBack}
            />
            {checkButton.Ghi && (
              <Button
                label="Ghi lại"
                icon="pi pi-check"
                className="p-button-sm p-button-success"
                onClick={() => {
                  setIsLoading(false);
                  handleAdd();
                }}
              />
            )}
            {checkButton.ChuyenTiep && (
              <Button
                label="Chuyển duyệt"
                icon="pi pi-reply"
                className="p-button-sm p-button-help"
                onClick={handleApprove}
              />
            )}
            {checkButton.KhongDuyet && (
              <Button
                label="Không duyệt"
                icon="pi pi-ban"
                className="p-button-sm p-button-secondary"
                onClick={handleReject}
              />
            )}
            {checkButton.Xoa && (
              <Button
                label="Xóa"
                icon="pi pi-trash"
                className="p-button-sm p-button-danger"
                onClick={() => {
                  setVisible(true);
                }}
              />
            )}
            {checkButton.NhapExcel && (
              <Button
                label="Nhập excel"
                className="p-button-sm"
                // onClick={handleDelete}
              />
            )}

            {checkButton.XuatExcel && (
              <Button
                label="Xuất excel"
                className="p-button-sm"
                // onClick={handleDelete}
              />
            )}
          </div>
          <div className="flex flex-row gap-3 text-sm align-items-center">
            <div className="row">
              <div className="ellipsis-span col-md-2" title={quyTrinh.SoPhieu}>
                <b>Số phiếu:</b> {quyTrinh.SoPhieu}
              </div>
              <div
                className="ellipsis-span col-md-2"
                title={quyTrinh.TenTrangThai}
              >
                <b>Trạng thái:</b> {quyTrinh.TenTrangThai}
              </div>
              <div
                className="ellipsis-span col-md-2"
                title={
                  quyTrinh.CreatedByName
                    ? quyTrinh.CreatedByName
                    : quyTrinh.TenGiaoVien
                }
              >
                <b>Nguời tạo:</b>{" "}
                {quyTrinh.CreatedByName
                  ? quyTrinh.CreatedByName
                  : quyTrinh.TenGiaoVien}
              </div>
              <div className="ellipsis-span col-md-2" title={formatDateStringGMT(quyTrinh.Created)}>
                <b>Thời gian tạo: </b>
                {formatDateStringGMT(quyTrinh.Created)}
              </div>
              <div className="ellipsis-span col-md-2" title={formatDateStringGMT(quyTrinh.Modified)}>
                <b>Thời gian duyệt: </b>
                {quyTrinh.isKetThuc && formatDateStringGMT(quyTrinh.Modified)}
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="p-3">
          <div className="formgrid grid">
            <div className="field col-12 md:col-3 lg:col-2">
              <label>Giáo viên:</label>
              <Dropdown
                className="p-dropdown-sm w-full"
                placeholder="Chọn giáo viên"
                value={quyTrinh.IdUserGiaoVien}
                options={giaoVien}
                optionLabel="TenNhanVien"
                optionValue="Id"
                onChange={(e) => {
                  setForm(e.value, "IdUserGiaoVien");
                }}
                filter
              />
            </div>
            <div className="field col-12 md:col-3 lg:col-2">
              <label>Bộ phận:</label>
              <InputText
                value={quyTrinh.TenBoPhanGiaoVien}
                className="w-full p-inputtext-sm"
                disabled
              />
            </div>
            <div className="field col-12 md:col-3 lg:col-2">
              <label>
                Năm<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={quyTrinh.Nam}
                options={listNam}
                optionValue="value"
                optionLabel="label"
                onChange={(e) => setForm(e.value, "Nam")}
                filter
                filterBy="label"
                placeholder="Chọn năm"
              />
            </div>
            <div className="field col-12 md:col-3 lg:col-2">
              <label>
                Từ tuần<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={quyTrinh.TuTuan}
                options={listTuan}
                optionValue="value"
                optionLabel="label"
                onChange={(e) => {
                  setForm(null, "ToiTuan");
                  setWeekIsDisabled(e.value);
                  setForm(e.value, "TuTuan");
                  setEnableBtn(true);
                }}
                filter
                filterBy="value"
                placeholder="Chọn tuần"
              />
            </div>
            <div className="field col-12 md:col-3 lg:col-2">
              <label>
                Đến tuần<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={quyTrinh.ToiTuan}
                options={listTuan}
                optionValue="value"
                optionLabel="label"
                optionDisabled={(opt) => {
                  return opt.value < weekIsDisabled;
                }}
                onChange={(e) => {
                  setForm(e.value, "ToiTuan");
                  setEnableBtn(false);
                }}
                filter
                filterBy="value"
                placeholder="Chọn tuần"
              />
            </div>
            <div className="field col-12 md:col-3 lg:col-2">
              <label>&nbsp;</label>
              <div className="w-full">
                <Button
                  disabled={enableBtn}
                  label="Tạo nhanh"
                  icon="pi pi-plus"
                  className="p-button-sm p-button-info"
                  onClick={() => setVisibleCreate(true)}
                />
              </div>
            </div>
            <div className="field col col-12 md:col-6">
              <label>Nội dung:</label>
              <InputTextarea
                className="w-full"
                rows={2}
                cols={30}
                value={quyTrinh.NoiDung}
                onChange={(e) => setForm(e.target.value, "NoiDung")}
              />
            </div>
            <div className="field col col-12 md:col-6">
              <label>Ghi chú:</label>
              <InputTextarea
                className="w-full"
                rows={2}
                cols={30}
                value={quyTrinh.GhiChu}
                onChange={(e) => setForm(e.target.value, "GhiChu")}
              />
            </div>
            <TableKhaiBaoGioGiang
              listBoPhan={listBoPhan}
              listLopFull={listLopFull}
              listMonFull={listMonFull}
              listPhongHoc={listPhongHoc}
              listdmTiet={listdmTiet}
              listdmCa={listdmCa}
              quyTrinh={quyTrinh}
              setForm={setForm}
              HandleChangeTableItem={HandleChangeTableItem}
              HandleDeleteTableItem={HandleDeleteTableItem}
            />
          </div>
        </div>
      </div>
    </>
  );
}
