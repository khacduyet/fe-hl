import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { QuyTrinhService } from "../../services/quytrinh.service";
import {
  UnixToDate,
  formatDateStringGMT,
  validForm,
} from "../../services/helperfunction";
import ThoiKhoaBieuItem from "./ThoiKhoaBieuItem";
import { DanhMucService } from "../../services/danhmuc.service";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import Loading from "../common/loading";
import { Confirm } from "../common/common";

export default function CTThoiKhoaBieu() {
  let tongSoNam = new Date().getFullYear() - 2020 + 1;
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
  const [visible, setVisible] = useState(false);
  const [visibleItem, setVisibleItem] = useState(false);
  const [index, setIndex] = useState(0);

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
    let data = await QuyTrinhService.ThoiKhoaBieu.GetNextSo();
    if (data) {
      await setForm(data.SoPhieu, "SoPhieu");
      setIsLoading(false);
    }
  }
  async function getQuyTrinh(id) {
    let data = await QuyTrinhService.ThoiKhoaBieu.Get(id);
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
    let res = await Promise.all([
      $BoPhan,
      $CurrentUser,
      $listLop,
      $listMon,
      $listPhongHoc,
      $listdmCa,
      $listdmTiet,
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
  }
  const handleBack = () => {
    navigate(-1);
  };
  const handleAdd = async () => {
    if (validate()) {
      let res = await QuyTrinhService.ThoiKhoaBieu.Set(quyTrinh);
      if (res && res.Error === 4) {
        toast.success(res.Detail);
        navigate(`/thoikhoabieu/update/${res.Value}`, {
          replace: true,
        });
      } else {
        toast.error(res.Detail);
      }
    }
  };
  const handleApprove = async () => {
    if (validate()) {
      let res = await QuyTrinhService.ThoiKhoaBieu.ChuyenTiep(quyTrinh);
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
      let res = await QuyTrinhService.ThoiKhoaBieu.KhongDuyet(quyTrinh);
      if (res && res.Error === 4) {
        toast.success(res.Detail);
        navigate(-1);
      } else {
        toast.error(res.Detail);
      }
    }
  };
  const handleDelete = async () => {
    let res = await QuyTrinhService.ThoiKhoaBieu.Delete(quyTrinh.Id);
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
    let validVar = ["Nam"];
    if (!validForm(validVar, quyTrinh)) {
      toast.warn("Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc!");
      return false;
    }
    let validVarChiTiet = [
      "IdBoPhan",
      "TuTuan",
      "ToiTuan",
      "listIddmLop",
      "IddmPhongHoc",
      "IddmMon",
      "listChiTiet_TietHoc",
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
      {visibleItem && (
        <Confirm
          visible={visibleItem}
          setVisible={setVisibleItem}
          func={() => HandleDeleteTableItem(index)}
          message="Bạn có chắc muốn xóa!"
          header="Thông báo!"
          acceptLabel="Đồng ý"
          rejectLabel="Hủy bỏ"
        />
      )}
      <h1 className="section-heading">
        {opt === "add" ? "Thêm mới" : "Cập nhật"} thời khóa biểu
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
                onClick={() => setVisible(true)}
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
            <div className="field col col-6 md:col-6">
              <label>Ghi chú:</label>
              <InputText
                className="w-full"
                rows={2}
                cols={30}
                value={quyTrinh.GhiChu}
                onChange={(e) => setForm(e.target.value, "GhiChu")}
              />
            </div>
            <div className="field col col-12 md:col-12">
              <label>Nội dung:</label>
              <InputTextarea
                className="w-full"
                rows={2}
                cols={30}
                value={quyTrinh.NoiDung}
                onChange={(e) => setForm(e.target.value, "NoiDung")}
              />
            </div>
            <div className="w-100 table-responsive">
              <table className="table table-bordered table-sm w-100">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th className="tc-w-120">Từ tuần</th>
                    <th className="tc-w-120">Đến tuần</th>
                    <th className="tc-w-120">Thứ</th>
                    <th>Khoa</th>
                    <th>Lớp</th>
                    <th>Phòng</th>
                    <th>Môn</th>
                    <th className="tc-w-120">Tiết học</th>
                    <th className="tc-w-80">Số giờ lý thuyết</th>
                    <th className="tc-w-80">Số giờ thực hành</th>
                    <th className="tc-w-80">Tổng số giờ</th>
                    <th className="tc-w-80">
                      <Button
                        icon="pi pi-plus"
                        className="p-button-rounded p-button-success p-button-sm"
                        onClick={() => {
                          setForm(
                            [
                              ...quyTrinh.listChiTiet,
                              { fakeKey: new Date().getTime() },
                            ],
                            "listChiTiet"
                          );
                        }}
                        aria-label="Search"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quyTrinh.listChiTiet?.map((ele, index) => {
                    return (
                      <tr key={ele.fakeKey ? ele.fakeKey : ele.Id}>
                        <ThoiKhoaBieuItem
                          listKhoa={listBoPhan}
                          listTuan={listTuan}
                          listLopFull={listLopFull}
                          listMonFull={listMonFull}
                          listPhongHoc={listPhongHoc}
                          giogiang={ele}
                          index={index}
                          listdmTiet={listdmTiet}
                          listdmCa={listdmCa}
                          onChange={(e) => HandleChangeTableItem(e, index)}
                          onDelete={() => {
                            setIndex(index);
                            setVisibleItem(true);
                          }}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog></ConfirmDialog>
    </>
  );
}
