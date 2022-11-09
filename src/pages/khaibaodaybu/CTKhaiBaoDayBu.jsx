import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { QuyTrinhService } from "../../services/quytrinh.service";
import {
  DateStringToDate,
  UnixToDate,
  DateToUnix,
  formatDateStringGMT,
  validForm,
  dayofweektodate,
  range,
} from "../../services/helperfunction";
import { DanhMucService } from "../../services/danhmuc.service";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import TableKhaiBaoDayDu from "./TableKhaiBaoDayBu";
import Loading from "../common/loading";
import { confirm } from "../common/common";
// import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
export default function CTDayBu() {
  let tongSoNam = new Date().getFullYear() - 2020 + 1;
  let [dayofyear, setNgayBatDau] = useState(new Date("2022.08.03"));
  const listNam = new Array(tongSoNam).fill("").map((_, index) => {
    return {
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
    Id: "",
    SoPhieu: "",
    TrangThai: "",
    Nam: new Date().getFullYear(),
    ListChiTiet: [],
  });
  const [checkButton, setCheckButton] = useState({});
  const [listBoPhan, setListBoPhan] = useState([]);
  const [listLopFull, setListLopFull] = useState([]);
  const [listMonFull, setListMonFull] = useState([]);
  const [isHasChild, setIsHasChild] = useState(false);
  const [isOpenButton, setIsOpenButton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (opt === "add") {
      getNextSo();
      KiemTraButton();
    } else {
      setIsOpenButton(false);
      getQuyTrinh(id);
    }
    getAllOptions();
  }, [opt, id]);
  async function getNextSo() {
    let data = await QuyTrinhService.DayBu.GetNextSo();
    if (data) {
      await setForm(data.SoPhieu, "SoPhieu");
      setIsLoading(false);
    }
  }
  async function getQuyTrinh(id) {
    let data = await QuyTrinhService.DayBu.Get(id);
    if (data) {
      if (data.ListChiTiet.length > 0) {
        data.ListChiTiet.map((ele) => {
          ele.Ngay_Cu = UnixToDate(ele.Ngay_CuUnix);
          ele.Ngay_Moi = UnixToDate(ele.Ngay_MoiUnix);
          return ele;
        });
      }
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

  useEffect(() => {
    onChangeNamHoc(quyTrinh.Nam);
  }, [quyTrinh.Nam]);
  const KiemTraButton = async () => {
    let data = await QuyTrinhService.QuanTriQuyTrinh.KiemTraButton(
      quyTrinh.IdTrangThai || "",
      quyTrinh.Id
    );
    if (data) {
      setCheckButton({ ...data });
    }
  };

  const setValueLopMon = (idbophan) => {
    quyTrinh.IdBoPhan = idbophan;
    let listLop1 = listLopFull
      .filter((lop) => lop.IdBoPhan === quyTrinh.IdBoPhan)
      ?.map((ele) => {
        return { value: ele.Id, label: ele.Ten };
      });
    let listMon1 = listMonFull
      .filter(
        (mon) =>
          mon.listIdBoPhan?.indexOf(quyTrinh.IdBoPhan) >= 0 || mon.isMonChung
      )
      ?.map((ele) => {
        return { value: ele.Id, label: ele.Ten };
      });
    setForm(idbophan, "IdBoPhan");

    if (
      quyTrinh.IddmMon &&
      listMon1
        .map((ele) => {
          return ele.value;
        })
        .indexOf(quyTrinh.IddmMon) === -1
    ) {
      setForm(null, "IddmMon");
    }
    if (quyTrinh.listIddmLop && quyTrinh.listIddmLop.length > 0) {
      let listIddmLop2 = listLop1.filter(
        (lop) => quyTrinh.listIddmLop.indexOf(lop.value) !== -1
      );
      setForm(listIddmLop2, "listIddmLop");
    }
  };

  async function getAllOptions() {
    let $BoPhan = QuyTrinhService.DanhMuc.BoPhan();
    let $NguoiDat = QuyTrinhService.DanhMuc.NguoiDung();
    let $CurrentUser = QuyTrinhService.User.GetCurrent();
    let $NgayBatDauUnix = DanhMucService.GetNgayBatDauNamHoc.Get(
      new Date().getFullYear()
    );
    let res = await Promise.all([
      $BoPhan,
      $NguoiDat,
      $CurrentUser,
      $NgayBatDauUnix,
    ]);
    setListBoPhan(res[0]);
    if (opt === "add") {
      setForm(res[2]?.Id, "IdUserGiaoVien");
      setForm(res[2]?.TenNhanVien, "TenGiaoVien");
    }
    setNgayBatDau(UnixToDate(res[3]));
  }

  const onChangeNamHoc = async (nam) => {
    let res = await DanhMucService.GetNgayBatDauNamHoc.Get(nam);
    dayofyear = UnixToDate(res);
    setNgayBatDau(UnixToDate(res));
    if (quyTrinh.Tuan_Cu && quyTrinh.DayOfWeek_Cu) {
      let ngay_cu = dayofweektodate(
        quyTrinh.Tuan_Cu,
        UnixToDate(res),
        quyTrinh.DayOfWeek_Cu
      );
      setForm(ngay_cu, "Ngay_Cu");
      setForm(DateToUnix(ngay_cu), "Ngay_CuUnix");
    }
    if (quyTrinh.Tuan_Moi && quyTrinh.DayOfWeek_Moi) {
      let ngay_Moi = dayofweektodate(
        quyTrinh.Tuan_Moi,
        dayofyear,
        quyTrinh.DayOfWeek_Moi
      );
      setForm(ngay_Moi, "Ngay_Moi");
      setForm(DateToUnix(ngay_Moi), "Ngay_MoiUnix");
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleAdd = async () => {
    // if (validate()) {
    let res = await QuyTrinhService.DayBu.Set(quyTrinh);
    if (res && res.Error === 4) {
      toast.success(res.Detail);
      navigate(`/quytrinh/khaibaodaybu/update/${res.Value}`, {
        replace: true,
      });
    } else {
      toast.error(res.Detail);
    }
    // }
  };
  const handleApprove = async () => {
    // if (validate()) {
    let res = await QuyTrinhService.DayBu.ChuyenTiep(quyTrinh);
    if (res && res.Error === 4) {
      toast.success(res.Detail);
      navigate(-1);
    } else {
      toast.error(res.Detail);
    }
    // }
  };
  const handleReject = async () => {
    // if (validate()) {
    let res = await QuyTrinhService.DayBu.KhongDuyet(quyTrinh);
    if (res && res.Error === 4) {
      toast.success(res.Detail);
      navigate(-1);
    } else {
      toast.error(res.Detail);
    }
    // }
  };
  const handleDelete = async () => {
    let res = await QuyTrinhService.DayBu.Delete(quyTrinh.Id);
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
    let validVar = [
      "Nam",
      "IdBoPhan",
      "IddmMon",
      "listIddmLop",
      "Tuan_Cu",
      "DayOfWeek_Cu",
      "Ngay_Cu",
      "IddmPhongHoc_Cu",
      "NoiDung",
      "Tuan_Moi",
      "DayOfWeek_Moi",
      "Ngay_Moi",
      "IddmPhongHoc_Moi",
      "SoHocSinhCoMat",
    ];
    if (!validForm(validVar, quyTrinh)) {
      toast.warn("Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc!");
      return false;
    }
    if (quyTrinh.TuTuan > quyTrinh.ToiTuan) {
      toast.warn("Vui lòng nhập lại từ tuần tới tuần!");
      return false;
    }
    return true;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <h1 className="section-heading">
        {opt === "add" ? "Thêm mới" : "Cập nhật"} khai báo dạy bù
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
                onClick={handleAdd}
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
                onClick={() =>
                  confirm(
                    handleDelete,
                    "Bạn có chắc muốn xóa phiếu này!",
                    "Thông báo!",
                    "Xóa",
                    "Hủy"
                  )
                }
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
            <div className="field col-12 md:col-6 lg:col-3">
              <label>Tên giáo viên:</label>
              <InputText
                value={quyTrinh.TenGiaoVien}
                className="w-full p-inputtext-sm"
                disabled
              />
            </div>

            <div className="field col-12 md:col-6 lg:col-3">
              <label>
                Khoa<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                disabled={isHasChild}
                className="w-full p-inputtext-sm"
                value={quyTrinh.IdBoPhan}
                options={listBoPhan}
                optionValue="Id"
                optionLabel="TenBoPhan"
                onChange={(e) => {
                  setIsOpenButton(false);
                  setValueLopMon(e.value);
                }}
                filter
                filterBy="TenBoPhan"
                placeholder="Chọn khoa"
              />
            </div>

            <div className="field col-12 md:col-6 lg:col-3">
              <label>
                Năm học<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={quyTrinh.Nam}
                options={listNam}
                onChange={(e) => {
                  setForm(e.value, "Nam");
                  onChangeNamHoc(e.value);
                }}
                placeholder="Chọn năm"
              />
            </div>
          </div>
          <div className="col-12"></div>
          <div className="grid">
            <div className="col-12">
              <hr />
              <div className="formgrid grid">
                <TableKhaiBaoDayDu
                  quyTrinh={quyTrinh}
                  setQuyTrinh={setQuyTrinh}
                  isOpenButton={isOpenButton}
                  setIsHasChild={setIsHasChild}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog></ConfirmDialog>
    </>
  );
}
