import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { QuyTrinhService } from "../services/quytrinh.service";
import { DateToUnix, validForm } from "../services/helperfunction";
import { InputNumber } from 'primereact/inputnumber';
export default function ChiTietQuyTrinhCongVanDi() {
  const { toast } = useOutletContext();
  const { opt, id } = useParams();
  const navigate = useNavigate();
  const [quyTrinh, setQuyTrinh] = useState({
    SoCongVan: "",
    IdQuyTrinh: "",
    TrangThai: "",
  });
  const [checkButton, setCheckButton] = useState({});
  const [listBoPhan, setListBoPhan] = useState([]);
  const [listNguoiDat, setListNguoiDat] = useState([]);
  const [listLoaiVanBan, setListLoaiVanBan] = useState([]);
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
    let data = await QuyTrinhService.DatSoCongVanDi.GetNextSo();
    if (data) {
      await setForm(data.SoPhieu, "SoPhieu");
    }
  }
  async function getQuyTrinh(id) {
    let data = await QuyTrinhService.DatSoCongVanDi.Get(id);
    if (data) {
      setQuyTrinh({
        ...data,
        NgaySuDung:new Date(data.NgaySuDung),
        GhiChu: data.GhiChu || "",
      });
    }
  }
  useEffect(() => {
    KiemTraButton();
  }, [quyTrinh.IdTrangThai, quyTrinh.IdQuyTrinh]);
  const KiemTraButton = useCallback(async () => {
    console.log(quyTrinh);
    let data = await QuyTrinhService.QuanTriQuyTrinh.KiemTraButton(
      quyTrinh.IdTrangThai || "",
      quyTrinh.IdQuyTrinh
    );
    if (data) {
      setCheckButton({ ...data });
    }
  }, [quyTrinh]);
  async function getAllOptions() {
    let $BoPhan = QuyTrinhService.DanhMuc.BoPhan();
    let $NguoiDat = QuyTrinhService.DanhMuc.NguoiDung();
    let $LoaiVanBan = QuyTrinhService.DanhMuc.LoaiSo();
    let $CurrentUser = QuyTrinhService.User.GetCurrent();
    let res = await Promise.all([
      $BoPhan,
      $NguoiDat,
      $LoaiVanBan,
      $CurrentUser,
    ]);
    setListBoPhan(res[0]);
    setListNguoiDat(res[1].items);
    setListLoaiVanBan(res[2]);
    if (quyTrinh.idNguoiDat === 0) {
      setForm(undefined, "idNguoiDat");
    }
    if (quyTrinh.idNguoiDat === null || quyTrinh.idNguoiDat === undefined) {
      setForm(res[3].idNhanSu, "idNguoiDat");
    }
  }
  const handleBack = () => {
    navigate(-1);
  };
  const handleAdd = async () => {
    console.log(validate());
    if (validate()) {
      let res = await QuyTrinhService.DatSoCongVanDi.Set(quyTrinh);
      if (res && res.Error === 4) {
        console.log(res);
        toast.success(res.Detail);
        navigate(`/datso/update/${res.Value}`, { replace: true });
      } else {
        toast.error(res.Detail);
      }
    } else {
      toast.warn("Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc!");
    }
  };
  const handleApprove = () => {};
  const handleReject = () => {};
  const handleDelete = () => {};

  const setForm = (e, key) => {
    if (e!==null && e!==undefined) {
      setQuyTrinh((prev) => ({
        ...prev,
        [key]: e,
      }));
    }else{
      delete quyTrinh[key]
      setQuyTrinh({...quyTrinh});
    }
  };
  const validate = () => {
    console.log(quyTrinh);
    let validVar = ["idBoPhan", "idNguoiDat", "idLoaiSo", "SoCongVan"];
    return validForm(validVar, quyTrinh);
  };
  return (
    <>
      <h1 className="section-heading">
        {opt === "add" ? "Thêm mới" : "Cập nhật"} đặt trước số công văn đi
      </h1>
      <div className="container-haha">
        <div className="flex flex-row justify-content-between">
          <div className="flex flex-row gap-2">
            <Button
              label="Quay lại"
              className="p-button-sm"
              onClick={handleBack}
            />
            {checkButton.Ghi && (
              <Button
                label="Ghi lại"
                className="p-button-sm"
                onClick={handleAdd}
              />
            )}
            {checkButton.ChuyenTiep && (
              <Button
                label="Chuyển duyệt"
                className="p-button-sm"
                onClick={handleApprove}
              />
            )}
            {checkButton.KhongDuyet && (
              <Button
                label="Không duyệt"
                className="p-button-sm"
                onClick={handleReject}
              />
            )}
            {checkButton.Xoa && (
              <Button
                label="Xóa"
                className="p-button-sm"
                onClick={handleDelete}
              />
            )}
          </div>
          <div className="flex flex-row gap-3 text-sm align-items-center">
            <div>
              <b>Số phiếu:</b> {quyTrinh.SoPhieu}
            </div>
            <div>
              <b>Thời gian tạo:</b>
              {quyTrinh.Created}
            </div>
            <div>
              <b>Thời gian duyệt:</b>
              {quyTrinh.Modified}
            </div>
          </div>
        </div>
        <hr />
        <div className="p-3">
          <div className="formgrid grid">
            <div className="field col-12 md:col-6 lg:col-4">
              <label>
                Bộ phận<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={quyTrinh.idBoPhan}
                options={listBoPhan}
                optionValue="Id"
                optionLabel="TenBoPhan"
                onChange={(e) => setForm(e.value, "idBoPhan")}
                filter
                showClear
                placeholder="Chọn bộ phận"
              />
            </div>
            <div className="field col col-12 md:col-6 lg:col-4">
              <label>
                Người đặt<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={quyTrinh.idNguoiDat}
                options={listNguoiDat}
                optionValue="idNhanVien"
                optionLabel="TenNhanVien"
                onChange={(e) => setForm(e.value, "idNguoiDat")}
                filter
                showClear
                placeholder="Chọn người đặt"
              />
            </div>
            <div className="field col col-12 md:col-6 lg:col-4">
              <label>
                Loại sổ<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                className="w-full p-inputtext-sm"
                value={quyTrinh.idLoaiSo}
                options={listLoaiVanBan}
                optionValue="Id"
                optionLabel="Ten"
                onChange={(e) => setForm(e.value, "idLoaiSo")}
                filter
                showClear
                placeholder="Loại sổ"
              />
            </div>
            <div className="field col col-12 md:col-6 lg:col-4">
              <label>
                Số đặt trước<span className="text-red-500">(*)</span>:
              </label>
              {/* <InputText
                className="w-full p-inputtext-sm"
                value={quyTrinh.SoCongVan}
                onInput={(e) => setForm(e.target.value, "SoCongVan")}
              /> */}
              <InputNumber className="w-full p-inputtext-sm" inputId="withoutgrouping" value={quyTrinh.SoCongVan} onValueChange={(e) => setForm(e.target.value, "SoCongVan")} mode="decimal" useGrouping={false} />
            </div>
            <div className="field col col-12 md:col-6 lg:col-4">
              <label>Ngày sử dụng dự kiến:</label>
              <Calendar
                className="w-full"
                id="icon"
                locale="vn"
                placeholder="Ngày sử dụng dự kiến"
                inputClassName="p-inputtext-sm p-button-sm"
                value={quyTrinh.NgaySuDung}
                onChange={(e) => {
                  setForm(e.value, "NgaySuDung");
                  setForm(DateToUnix(e.value), "NgaySuDungUnix");
                }}
                showIcon
              />
            </div>
            <div className="field col col-12">
              <label>Ghi chú:</label>
              <InputTextarea
                className="w-full"
                rows={2}
                cols={30}
                value={quyTrinh.GhiChu}
                onChange={(e) => setForm(e.target.value, "GhiChu")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
