import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DanhMucService } from "../../services/danhmuc.service";
import { Dialog } from "primereact/dialog";
import { useOutletContext } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import _ from "lodash";
import {
  UnixToDate,
  DateToUnix,
  validForm,
  dayofweektodate,
} from "../../services/helperfunction";
import { InputNumber } from "primereact/inputnumber";
import { vnCalendar } from "../../services/const";
import ChonTietItem from "./ChonTietItem";

export default function DialogKhaiBaoDayBu({
  opt,
  show,
  onclick,
  quyTrinh,
  setQuyTrinh,
  listAllFull,
  stateButton,
  dataEdit,
}) {
  let [dayofyear, setNgayBatDau] = useState(new Date("2022.08.03"));
  const { toast } = useOutletContext();
  const [listdmCa, setListdmCa] = useState([]);
  const [listLop, setListLop] = useState([]);
  const [listdmTiet, setListdmTiet] = useState([]);
  const [listPhongHoc, setListPhongHoc] = useState([]);
  const [listMon, setListMon] = useState([]);
  const [listDayOfWeek, setListDayOfWeek] = useState([]);
  const [chiTiet, setChiTiet] = useState({
    IddmLop: "",
    TendmLop: "",
    IddmMon: "",
    TendmMon: "",
    Tuan_Cu: 1,
    DayOfWeek_Cu: 1,
    DayOfWeek_Name_Cu: "",
    Ngay_Cu: new Date(),
    TongSoGio_Cu: 0,
    SiSo_Cu: 0,
    IddmPhongHoc_Cu: "",
    TendmPhongHoc_Cu: "",
    Tuan_Moi: 1,
    DayOfWeek_Moi: 1,
    DayOfWeek_Name_Moi: "",
    Ngay_Moi: new Date(),
    TongSoGio_Moi: 0,
    SiSo_Moi: 0,
    IddmPhongHoc_Moi: "",
    TendmPhongHoc_Moi: "",
    Ngay_CuUnix: 0,
    Ngay_MoiUnix: 0,
    listChiTietTietHoc_Cu: [],
    listChiTietTietHoc_Moi: [],
  });

  useEffect(() => {
    getAllOptions();
  }, []);
  const getAllOptions = async () => {
    let $listdCa = DanhMucService.CaHoc.GetList({});
    let $listdmTiet = DanhMucService.TietHoc.GetList();
    let $NgayBatDauUnix = DanhMucService.GetNgayBatDauNamHoc.Get(
      new Date().getFullYear()
    );
    let res = await Promise.all([$listdCa, $listdmTiet, $NgayBatDauUnix]);
    setListPhongHoc(
      listAllFull.listPhongHocFull.map((ele) => {
        return { value: ele.Id, label: ele.Ten };
      })
    );
    setListLop(
      listAllFull.listLopFull
        .filter((lop) => lop.IdBoPhan === quyTrinh.IdBoPhan)
        ?.map((ele) => {
          return { value: ele.Id, label: ele.Ten };
        })
    );
    setListMon(
      listAllFull.listMonFull
        .filter(
          (mon) =>
            mon.listIdBoPhan?.indexOf(quyTrinh.IdBoPhan) >= 0 || mon.isMonChung
        )
        ?.map((ele) => {
          return { value: ele.Id, label: ele.Ten };
        })
    );
    setListdmCa(res[0]);
    setListdmTiet(res[1]);
    // const tietsort = [...res[8]].sort((a, b) => (a.Ma > b.Ma ? 1 : -1));
    // setListdmTiet(tietsort);
    setNgayBatDau(UnixToDate(res[2]));
    await setChiTiet({
      ...chiTiet,
      Ngay_Cu: dayofweektodate(1, UnixToDate(res[2]), 1),
      Ngay_CuUnix: DateToUnix(dayofweektodate(1, UnixToDate(res[2]), 1)),
      Ngay_Moi: dayofweektodate(1, UnixToDate(res[2]), 1),
      Ngay_MoiUnix: DateToUnix(dayofweektodate(1, UnixToDate(res[2]), 1)),
    });
    setListDayOfWeek(
      vnCalendar.dayNamesShort.map((ele, index) => {
        return { value: index, label: ele };
      })
    );
    if (stateButton) {
      setChiTiet(dataEdit);
    }
  };
  const setThu = (value, key) => {
    let thu = listDayOfWeek.filter((ele) => ele.value === value.value);
    if (thu) setForm(thu[0].label, key);
  };
  const setNameMon = (value) => {
    let mon = listAllFull.listMonFull.filter((ele) => ele.Id === value);
    if (mon) {
      setForm(mon[0].Ten, "TendmMon");
    }
  };
  const setNameLop = (value) => {
    let lop = listAllFull.listLopFull.filter((ele) => ele.Id === value);
    if (lop) {
      setForm(lop[0].Id, "IddmLop");
      setForm(lop[0].Ten, "TendmLop");
    }
  };
  const setNamePhong = (value, key) => {
    let phong = listAllFull.listPhongHocFull.filter((ele) => ele.Id === value);
    if (phong) {
      setForm(phong[0].Ten, key);
    }
  };

  const confirmAdd = async () => {
    if (validate()) {
      if (stateButton) {
        const newState = quyTrinh.ListChiTiet.map((obj) => {
          if (_.isEqual(obj, dataEdit)) {
            return { ...chiTiet };
          }
          return obj;
        });
        setQuyTrinh({
          ...quyTrinh,
          ListChiTiet: newState,
        });
      } else {
        setQuyTrinh({
          ...quyTrinh,
          ListChiTiet: [...quyTrinh.ListChiTiet, chiTiet],
        });
      }
      toast.success(opt + " thành công!");
      onHide();
    }
  };
  const onChangeTiet_Cu = (value) => {
    setChiTiet({
      ...chiTiet,
      listChiTietTietHoc_Cu: value,
    });
    setForm(value.length, "TongSoGio_Cu");
  };
  const onChangeTiet_Moi = (value) => {
    setChiTiet({
      ...chiTiet,
      listChiTietTietHoc_Moi: value,
    });
    setForm(value.length, "TongSoGio_Moi");
  };
  const onHide = () => {
    onclick();
    setChiTiet({});
  };
  const setForm = (e, key) => {
    if (e !== null && e !== undefined) {
      setChiTiet((prev) => ({
        ...prev,
        [key]: e,
      }));
    }
  };
  const validate = () => {
    let validVar = [
      "IddmLop",
      "IddmMon",
      "Tuan_Cu",
      "DayOfWeek_Cu",
      "Ngay_Cu",
      "IddmPhongHoc_Cu",
      "NoiDung",
      "Tuan_Moi",
      "DayOfWeek_Moi",
      "Ngay_Moi",
      "IddmPhongHoc_Moi",
    ];
    if (!validForm(validVar, chiTiet)) {
      toast.error("Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc!");
      return false;
    }
    return true;
  };

  return (
    <>
      <Dialog
        header={`${opt} chi tiết khai báo dạy bù`}
        visible={show}
        breakpoints={{ "960px": "40vw", "640px": "100vw" }}
        style={{ width: "80vw" }}
        onHide={onHide}
      >
        <div className="flex flex-row gap-2">
          <Button
            label="Quay lại"
            icon="pi pi-angle-double-left"
            className="p-button-sm p-button-warning"
            onClick={onHide}
          />
          <Button
            label="Ghi lại"
            icon="pi pi-check"
            className="p-button-sm p-button-success"
            onClick={confirmAdd}
          />
        </div>
        <div className="formgrid grid pt-3">
          <div className="container-haha">
            <hr />
            <div className="p-3">
              <div className="formgrid grid">
                <div className="field col-12 md:col-6 lg:col-3">
                  <label>
                    Môn học<span className="text-red-500">(*)</span>:
                  </label>
                  <Dropdown
                    className="w-full p-inputtext-sm"
                    value={chiTiet.IddmMon}
                    options={listMon}
                    onChange={(e) => {
                      setForm(e.value, "IddmMon");
                      setNameMon(e.value);
                    }}
                    filter
                    placeholder="Chọn môn"
                  />
                </div>
                <div className="field col-12 md:col-6 lg:col-3">
                  <label>
                    Lớp<span className="text-red-500">(*)</span>:
                  </label>
                  <Dropdown
                    className="w-full p-inputtext-sm"
                    placeholder="Chọn lớp"
                    value={chiTiet.IddmLop}
                    options={listLop}
                    onChange={(e) => {
                      setForm(e.value, "IddmLop");
                      setNameLop(e.value);
                    }}
                    filter
                    // showClear
                  />
                </div>
              </div>
              <div className="col-12"></div>
              <div className="grid">
                <div className="col-5">
                  <b className="text-red-500">Báo nghỉ:</b>
                  <hr />
                  <div className="formgrid grid">
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Tuần<span className="text-red-500">(*)</span>:
                      </label>
                      <InputNumber
                        value={chiTiet.Tuan_Cu}
                        inputClassName="p-inputtext-sm w-full"
                        className="w-full"
                        onValueChange={(e) => {
                          setForm(e.value, "Tuan_Cu");
                          let ngay_cu = dayofweektodate(
                            e.value,
                            dayofyear,
                            chiTiet.DayOfWeek_Cu
                          );
                          setForm(ngay_cu, "Ngay_Cu");
                          setForm(DateToUnix(ngay_cu), "Ngay_CuUnix");
                        }}
                        // mode="decimal"
                        minFractionDigits={0}
                      />
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Thứ<span className="text-red-500">(*)</span>:
                      </label>
                      <Dropdown
                        className="w-full p-inputtext-sm"
                        value={chiTiet.DayOfWeek_Cu}
                        options={listDayOfWeek}
                        onChange={(e) => {
                          setForm(e.value, "DayOfWeek_Cu");
                          let ngay_cu = dayofweektodate(
                            chiTiet.Tuan_Cu,
                            dayofyear,
                            e.value
                          );
                          setThu(e, "DayOfWeek_Name_Cu");
                          setForm(ngay_cu, "Ngay_Cu");
                          setForm(DateToUnix(ngay_cu), "Ngay_CuUnix");
                        }}
                        filter
                        // showClear
                        placeholder="Chọn thứ"
                      />
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Ngày<span className="text-red-500">(*)</span>:
                      </label>
                      <Calendar
                        id="icon"
                        locale="vn"
                        placeholder="Chọn ngày"
                        inputClassName="p-inputtext-sm"
                        className="w-100"
                        value={chiTiet.Ngay_Cu}
                        onChange={(e) => {
                          setForm(e.value, "Ngay_Cu");
                          setForm(DateToUnix(e.value), "Ngay_CuUnix");
                        }}
                        showIcon
                        showOnFocus={false}
                        disabled
                      />
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Tiết<span className="text-red-500">(*)</span>:
                      </label>
                      <ChonTietItem
                        listTietEdit={chiTiet.listChiTietTietHoc_Cu}
                        listdmCa={listdmCa}
                        listdmTiet={listdmTiet}
                        onChange={(e) => onChangeTiet_Cu(e)}
                      />
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Phòng học<span className="text-red-500">(*)</span>:
                      </label>
                      <Dropdown
                        className="w-full p-inputtext-sm"
                        value={chiTiet.IddmPhongHoc_Cu}
                        options={listPhongHoc}
                        onChange={(e) => {
                          setForm(e.value, "IddmPhongHoc_Cu");
                          setNamePhong(e.value, "TendmPhongHoc_Cu");
                        }}
                        filter
                        // showClear
                        placeholder="Chọn phòng học"
                      />
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Tổng số giờ<span className="text-red-500">(*)</span>:
                      </label>
                      <InputNumber
                        value={chiTiet.TongSoGio_Cu}
                        inputClassName="p-inputtext-sm w-full"
                        className="w-full"
                        mode="decimal"
                        minFractionDigits={1}
                        placeholder="Tổng số giờ"
                        disabled
                      />
                    </div>
                    <div className="field col col-12 md:col-12">
                      <label>
                        Nội dung<span className="text-red-500">(*)</span>:
                      </label>
                      <InputTextarea
                        className="w-full"
                        rows={2}
                        cols={30}
                        value={chiTiet.NoiDung}
                        onChange={(e) => setForm(e.target.value, "NoiDung")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <Divider layout="vertical"></Divider>
                </div>
                <div className="col-5">
                  <b className="text-red-500">Báo bù:</b>
                  <hr />
                  <div className="formgrid grid">
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Tuần<span className="text-red-500">(*)</span>:
                      </label>
                      <InputNumber
                        value={chiTiet.Tuan_Moi}
                        inputClassName="p-inputtext-sm w-full"
                        className="w-full"
                        onValueChange={(e) => {
                          setForm(e.value, "Tuan_Moi");
                          let ngay_moi = dayofweektodate(
                            e.value,
                            dayofyear,
                            chiTiet.DayOfWeek_Moi
                          );
                          setForm(ngay_moi, "Ngay_Moi");
                          setForm(DateToUnix(ngay_moi), "Ngay_MoiUnix");
                        }}
                        // mode="decimal"
                        minFractionDigits={0}
                      />
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Thứ<span className="text-red-500">(*)</span>:
                      </label>
                      <Dropdown
                        className="w-full p-inputtext-sm"
                        value={chiTiet.DayOfWeek_Moi}
                        options={listDayOfWeek}
                        onChange={(e) => {
                          setForm(e.value, "DayOfWeek_Moi");
                          let ngay_Moi = dayofweektodate(
                            chiTiet.Tuan_Moi,
                            dayofyear,
                            e.value
                          );
                          setThu(e, "DayOfWeek_Name_Moi");
                          setForm(ngay_Moi, "Ngay_Moi");
                          setForm(DateToUnix(ngay_Moi), "Ngay_MoiUnix");
                        }}
                        filter
                        // showClear
                        placeholder="Chọn thứ"
                      />
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Ngày<span className="text-red-500">(*)</span>:
                      </label>
                      <Calendar
                        id="icon"
                        locale="vn"
                        placeholder="Chọn ngày"
                        inputClassName="p-inputtext-sm"
                        className="w-100"
                        value={chiTiet.Ngay_Moi}
                        onChange={(e) => {
                          setForm(e.value, "Ngay_Moi");
                          setForm(DateToUnix(e.value), "Ngay_MoiUnix");
                        }}
                        showIcon
                        showOnFocus={false}
                        disabled
                      />
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Tiết<span className="text-red-500">(*)</span>:
                      </label>
                      <ChonTietItem
                        listTietEdit={chiTiet.listChiTietTietHoc_Moi}
                        listdmCa={listdmCa}
                        listdmTiet={listdmTiet}
                        onChange={(e) => onChangeTiet_Moi(e)}
                      />
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Phòng học<span className="text-red-500">(*)</span>:
                      </label>
                      <Dropdown
                        className="w-full p-inputtext-sm"
                        value={chiTiet.IddmPhongHoc_Moi}
                        options={listPhongHoc}
                        onChange={(e) => {
                          setForm(e.value, "IddmPhongHoc_Moi");
                          setNamePhong(e.value, "TendmPhongHoc_Moi");
                        }}
                        filter
                        // showClear
                        placeholder="Chọn phòng học"
                      />
                    </div>
                    <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Tổng số giờ<span className="text-red-500">(*)</span>:
                      </label>
                      <InputNumber
                        value={chiTiet.TongSoGio_Moi}
                        className="w-full"
                        inputClassName="p-inputtext-sm w-full"
                        mode="decimal"
                        minFractionDigits={1}
                        placeholder="Tổng số giờ"
                        disabled
                      />
                    </div>
                    {/* <div className="field col-12 md:col-6 lg:col-4">
                      <label>
                        Sỹ số<span className="text-red-500">(*)</span>:
                      </label>
                      <InputNumber
                        value={chiTiet.SiSo_Moi}
                        inputClassName="p-inputtext-sm w-full"
                        className="w-full"
                        onValueChange={(e) => {
                          setForm(e.value, "SiSo_Moi");
                        }}
                        // mode="decimal"
                        placeholder="Sỹ số"
                        minFractionDigits={0}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
