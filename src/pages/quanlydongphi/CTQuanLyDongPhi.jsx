import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DanhMucService } from "../../services/danhmuc.service";
import { formatDateStringGMT, validForm } from "../../services/helperfunction";
import { Confirm } from "../common/common";
import { ToggleButton } from "primereact/togglebutton";
import { OverlayPanel } from "primereact/overlaypanel";
import Loading from "../common/loading";
import OverPanel from "./OverPanel";
import { LOAIDONGPHI } from "../../services/const";

export default function CTQuanLyDongPhi() {
  const { toast } = useOutletContext();
  const { opt, id } = useParams();
  const navigate = useNavigate();
  const [quyTrinh, setQuyTrinh] = useState({
    Id: "",
    TrangThai: false,
    isXeNgoai: false,
  });
  const [thongTins, setThongTins] = useState([]);
  const [panels, setPanels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const [visible, setVisible] = useState(false);
  const op = useRef(null);

  useEffect(() => {
    if (opt === "add") {
      getNextSo();
    } else {
      getQuyTrinh(id);
    }
    getAllOptions();
  }, [opt, id]);

  async function getNextSo() {
    let data = await DanhMucService.QuanLyPhi.GetNextSo();
    if (data) {
      await setForm(data.Data, "SoPhieu");
      setIsLoading(false);
    }
  }
  async function getQuyTrinh(id) {
    let data = await DanhMucService.QuanLyPhi.Get(id);
    if (data) {
      setQuyTrinh({
        ...data,
        GhiChu: data.GhiChu || "",
      });
      await setIsLoading(false);
    }
  }
  async function getAllOptions() {}

  const getDataOverPanel = async () => {
    let data = {
      IdChungCu: quyTrinh.IdChungCu,
      isXeNgoai: quyTrinh.isXeNgoai,
    };
    let res = await DanhMucService.QuanLyPhi.GetListFilterCreated(data);
    if (res) {
      let temp = res.Data.map((x, index) => {
        return { ...x, STT: index + 1 };
      });
      setPanels(temp);
      await setIsChange(false);
    }
  };
  useEffect(() => {
    getDataOverPanel();
  }, [quyTrinh.isXeNgoai]);

  const handleBack = () => {
    navigate(-1);
  };
  const handleAdd = async () => {
    if (validate()) {
      let res = await DanhMucService.QuanLyPhi.Set(quyTrinh);
      if (res && res.StatusCode === 200) {
        toast.success(res.Message);
        navigate(`/quanlydongphi/update/${res.Data}`, {
          replace: true,
        });
      } else {
        toast.error(res.Message);
      }
    }
  };
  const handleDelete = async () => {
    let res = await DanhMucService.QuanLyPhi.Delete(quyTrinh.Id);
    if (res && res.StatusCode === 200) {
      toast.success(res.Message);
      navigate(-1);
    } else {
      toast.error(res.Message);
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
      toast.error("Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc!");
      return false;
    }
    if (quyTrinh.TuTuan > quyTrinh.ToiTuan) {
      toast.error("Vui lòng nhập lại từ tuần tới tuần!");
      return false;
    }
    let validVarChiTiet = ["NgayUnix"];

    if (quyTrinh.listChiTiet.length === 0) {
      toast.error("Vui lòng nhập đầy đủ thông tin giảng dạy!");
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
      toast.error("Vui lòng nhập đầy đủ thông tin thời gian giảng dạy!");
      return false;
    }
    return true;
  };

  const handleAddDetail = (x) => {
    console.log("data", x);
    if (quyTrinh.isXeNgoai) {
      let data = {
        ...quyTrinh,
        IdXeNgoai: x.Id,
        IdLoaiXe: x.IdLoaiXe,
        IdCanHo: "",
      };
      setQuyTrinh(data);
    } else {
      let data = {
        ...quyTrinh,
        IdXeNgoai: "",
        IdLoaiXe: "",
        IdCanHo: x.Id,
      };
      setQuyTrinh(data);
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
      <ConfirmDialog></ConfirmDialog>
      <h1 className="section-heading">
        {opt === "add" ? "Thêm mới" : "Cập nhật"} phiếu thu
      </h1>
      <div className="container-haha">
        <div className="main-navbar row">
          <div className=" col-xs-12 col-md-4 col-lg-4 col-xl-4">
            <div className="left-side-bar">
              <Button
                label="Quay lại"
                tooltip="Quay lại"
                className="p-button-sm  "
                onClick={handleBack}
              />
              {!quyTrinh.TrangThai && (
                <Button
                  label="Ghi lại"
                  tooltip="Ghi lại"
                  className="p-button-sm ml-2"
                  onClick={() => {
                    setIsLoading(false);
                    handleAdd();
                  }}
                />
              )}
              {!quyTrinh.TrangThai && opt === "edit" && (
                <Button
                  label="Xóa"
                  tooltip="Xóa"
                  className="p-button-sm p-button-danger ml-2"
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              )}
            </div>
          </div>
          <div className="col-xs-12 col-md-8 col-lg-8 col-xl-8">
            <div className="right-side-bar">
              <div className="ellipsis-span" data-title={quyTrinh.SoPhieu}>
                <b>Số phiếu:</b> {quyTrinh.SoPhieu}
              </div>
              <div className="ellipsis-span" data-title={quyTrinh.TenTrangThai}>
                <b>Trạng thái:</b> {quyTrinh.TenTrangThai}
              </div>
              <div
                className="ellipsis-span"
                data-title={
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
              <div className="ellipsis-span">
                <b>TG tạo: </b>
                {formatDateStringGMT(quyTrinh.Created)}
              </div>
              <div className="ellipsis-span">
                <b>TG đóng tiền: </b>
                {formatDateStringGMT(quyTrinh.Modified)}
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="p-3">
          <div className="formgrid grid">
            <div className="field col-12 md:col-6 lg:col-6">
              <label>
                Tên người đóng<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={quyTrinh.GhiChu}
                onChange={(e) => setForm(e.target.value, "GhiChu")}
              />
            </div>
            <div className="field col-12 md:col-6 lg:col-6">
              <label>
                Loại đóng phí<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                resetFilterOnHide={true}
                className="w-full p-inputtext-sm"
                value={quyTrinh.LoaiDongPhi}
                options={LOAIDONGPHI.map((x) => {
                  return { value: x, label: x };
                })}
                onChange={(e) => {
                  setForm(e.target.value, "LoaiDongPhi");
                }}
                filter
                filterBy="value"
                placeholder="Chọn loại đóng phí"
              />
            </div>
            <div className="field col col-12 md:col-12">
              <label>Nội dung:</label>
              <InputTextarea
                className="w-full"
                rows={5}
                cols={30}
                value={quyTrinh.NoiDung}
                onChange={(e) => setForm(e.target.value, "NoiDung")}
              />
            </div>
            <div className="field col col-12 md:col-2">
              <label>Cư dân/Xe Ngoài:</label>
              <ToggleButton
                onLabel="XE NGOÀI"
                offLabel="CƯ DÂN"
                onIcon="pi pi-car"
                offIcon="pi pi-home"
                className="w-full"
                checked={quyTrinh.isXeNgoai}
                onChange={(e) => {
                  setIsChange(true);
                  setForm(!quyTrinh.isXeNgoai, "isXeNgoai");
                }}
              />
            </div>
            <div className="field col col-12 md:col-5">
              <label>&nbsp;</label>
              <Button
                className="w-full"
                type="button"
                label="Chọn"
                onClick={(e) => op.current.toggle(e)}
                loading={isChange}
                loadingIcon="pi pi-spin pi-sun"
              />

              <OverlayPanel ref={op}>
                <OverPanel
                  listData={panels}
                  isXeNgoai={quyTrinh.isXeNgoai}
                  handleAddDetail={handleAddDetail}
                  quyTrinh={quyTrinh}
                />
              </OverlayPanel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
