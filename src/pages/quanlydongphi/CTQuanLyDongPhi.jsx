import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DanhMucService } from "../../services/danhmuc.service";
import { formatDateStringGMT, validForm } from "../../services/helperfunction";
import { capitalizeFirstLowercaseRest, Confirm } from "../common/common";
import { ToggleButton } from "primereact/togglebutton";
import { OverlayPanel } from "primereact/overlaypanel";
import Loading from "../common/loading";
import OverPanel from "./OverPanel";
import { LOAIDONGPHI, PAY } from "../../services/const";
import Table from "./Table";
import { createContext } from "react";
import { outContext } from "../../App";

export const PhiContext = createContext();

export default function CTQuanLyDongPhi() {
  const context = useContext(outContext);
  const { toast } = useOutletContext();
  const { opt, id } = useParams();
  const navigate = useNavigate();
  const [quyTrinh, setQuyTrinh] = useState({
    Id: "",
    TrangThai: false,
    isXeNgoai: false,
    ListPhi: [],
    IdChungCu: context.access_chungcu,
  });
  useEffect(() => {
    setForm(context.access_chungcu, "IdChungCu");
  }, [context.access_chungcu]);
  const [panels, setPanels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const [visible, setVisible] = useState(false);
  const [accept, setAccept] = useState(false);
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
        ...data.Data,
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

  const handleAccept = async () => {
    let res = await DanhMucService.QuanLyPhi.SetDongPhi(quyTrinh.Id);
    if (res && res.StatusCode === 200) {
      toast.success(res.Message);
      navigate(-1);
    } else {
      toast.error(res.Message);
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
    let validVar = ["NguoiDongPhi", "SoDienThoai", "LoaiDongPhi", "Pay"];
    if (!validForm(validVar, quyTrinh)) {
      toast.error("Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc!");
      return false;
    }
    return true;
  };

  const handleAddDetail = async (x) => {
    if (quyTrinh.isXeNgoai) {
      let data = {
        ...quyTrinh,
        NguoiDongPhi: x.Ten,
        SoDienThoai: x.SoDienThoai,
        IdXeNgoai: x.Id,
        IdLoaiXe: x.IdLoaiXe,
        IdCanHo: "",
      };
      setQuyTrinh(data);
      getData(data);
    } else {
      let data = {
        ...quyTrinh,
        NguoiDongPhi: x.ChuSoHuu,
        SoDienThoai: x.SoDienThoai,
        IdXeNgoai: "",
        IdLoaiXe: "",
        IdCanHo: x.Id,
      };
      setQuyTrinh(data);
      getData(data);
    }
  };

  const getData = async (data) => {
    let temp = {
      id: quyTrinh.isXeNgoai ? data.IdXeNgoai : data.IdCanHo,
      isXeNgoai: quyTrinh.isXeNgoai,
    };
    let res = await DanhMucService.XeNgoai.GetPhieuThu(temp);
    if (res) {
      let str = "";
      str += res.Data.map((x, index) => {
        return (
          (index !== 0 ? " " : "") +
          x.TenDichVu.toLowerCase() +
          (x.BienKiemSoat === "-" ? "" : " " + x.BienKiemSoat)
        );
      });
      let currentDate = new Date();
      str +=
        " tháng " + currentDate.getMonth() + "/" + currentDate.getFullYear();
      setQuyTrinh({
        ...quyTrinh,
        ...data,
        ListPhi: res.Data,
        GhiChu: capitalizeFirstLowercaseRest(str),
        LoaiDongPhi: LOAIDONGPHI[0],
        Pay: PAY[0].value,
      });
    }
  };

  let ctx = {
    setForm: setForm,
    quyTrinh: quyTrinh,
    isChange: isChange,
  };

  useEffect(() => {
    let temp = {
      ...quyTrinh,
      ListPhi: [],
      NguoiDongPhi: "",
      SoDienThoai: "",
      GhiChu: "",
    };
    setQuyTrinh(temp);
  }, [quyTrinh.isXeNgoai]);

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
      {accept && (
        <Confirm
          visible={accept}
          setVisible={setAccept}
          func={handleAccept}
          message="Bạn có chắc phiếu này đã đóng tiền!"
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
              {!quyTrinh.TrangThai && opt === "update" && (
                <Button
                  label="Xóa"
                  tooltip="Xóa"
                  className="p-button-sm p-button-danger ml-2"
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              )}
              <Button
                  label="Xóa"
                  tooltip="Xóa"
                  className="p-button-sm p-button-danger ml-2"
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              {!quyTrinh.TrangThai && opt === "update" && (
                <Button
                  label="Xác nhận đóng phí"
                  tooltip="Xác nhận đóng phí"
                  className="p-button-sm p-button-success ml-2"
                  onClick={() => {
                    setAccept(true);
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
            <div className="field col-12 md:col-4 lg:col-5"></div>
            <div className="field col-12 md:col-4 lg:col-4">
              <label>
                Tên người đóng<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={quyTrinh.NguoiDongPhi}
                onChange={(e) => setForm(e.target.value, "NguoiDongPhi")}
              />
            </div>
            <div className="field col-12 md:col-4 lg:col-4">
              <label>
                Số điện thoại<span className="text-red-500">(*)</span>:
              </label>
              <InputText
                className="w-full"
                value={quyTrinh.SoDienThoai}
                onChange={(e) => setForm(e.target.value, "SoDienThoai")}
              />
            </div>
            <div className="field col-12 md:col-2 lg:col-2">
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
            <div className="field col-12 md:col-2 lg:col-2">
              <label>
                Loại đóng phí<span className="text-red-500">(*)</span>:
              </label>
              <Dropdown
                resetFilterOnHide={true}
                className="w-full p-inputtext-sm"
                value={quyTrinh.Pay}
                options={PAY}
                onChange={(e) => {
                  setForm(e.target.value, "Pay");
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
                rows={3}
                cols={30}
                value={quyTrinh.GhiChu}
                onChange={(e) => setForm(e.target.value, "GhiChu")}
              />
            </div>

            <div className="field col col-12 md:col-12">
              <PhiContext.Provider value={ctx}>
                <Table />
              </PhiContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
