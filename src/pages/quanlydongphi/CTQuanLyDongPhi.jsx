import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DanhMucService } from "../../services/danhmuc.service";
import { formatDateStringGMT, validForm } from "../../services/helperfunction";
import { Confirm } from "../common/common";
import Loading from "../common/loading";

export default function CTQuanLyDongPhi() {
    const { toast } = useOutletContext();
    const { opt, id } = useParams();
    const navigate = useNavigate();
    const [quyTrinh, setQuyTrinh] = useState({
        Id: "",
        TrangThai: "",
    });
    const [listBoPhan, setListBoPhan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let [weekIsDisabled, setWeekIsDisabled] = useState(0);
    const [enableBtn, setEnableBtn] = useState(opt === "add" ? true : false);
    const [visible, setVisible] = useState(false);
    const [visibleRemove, setVisibleRemove] = useState(false);
    const [tempData, setTempData] = useState({
        Nam: new Date().getFullYear(),
        TuTuan: 1,
        ToiTuan: 1,
    });
    const [giaoVien, setGiaoVien] = useState([]);
    const [namHoc, setNamHoc] = useState([]);
    useEffect(() => {
        if (opt === "add") {
            getNextSo();
        } else {
            getQuyTrinh(id);
        }
        getAllOptions();
    }, [opt, id]);
    async function getNextSo() {
        let data = await DanhMucService.KhaiBaoGioGiang.GetNextSo();
        if (data) {
            await setForm(data.SoPhieu, "SoPhieu");
            setIsLoading(false);
        }
    }
    async function getQuyTrinh(id) {
        let data = await DanhMucService.KhaiBaoGioGiang.Get(id);
        if (data) {
            setQuyTrinh({
                ...data,
                NgaySuDung: new Date(data.NgaySuDung),
                GhiChu: data.GhiChu || "",
            });
            await setIsLoading(false);
        }
    }
    async function getAllOptions() {

    }

    const handleBack = () => {
        navigate(-1);
    };
    const handleAdd = async () => {
        if (validate()) {
            let res = await DanhMucService.KhaiBaoGioGiang.Set(quyTrinh);
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
    const handleDelete = async () => {
        let res = await DanhMucService.KhaiBaoGioGiang.Delete(quyTrinh.Id);
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
        let validVar = ["Nam", "TuTuan", "ToiTuan", "IdBoPhan"];
        if (!validForm(validVar, quyTrinh)) {
            toast.error("Vui lòng nhập đầy đủ các trường dữ liệu bắt buộc!");
            return false;
        }
        if (quyTrinh.TuTuan > quyTrinh.ToiTuan) {
            toast.error("Vui lòng nhập lại từ tuần tới tuần!");
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
            <h1 className="section-heading">
                {opt === "add" ? "Thêm mới" : "Cập nhật"} khai báo giờ giảng
            </h1>
            <div className="container-haha">
                <div className="main-navbar row">
                    <div className=" col-xs-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="left-side-bar">
                            <Button
                                label="Quay lại"
                                tooltip="Quay lại"
                                className="MyBtn p-button-sm "
                                onClick={handleBack}
                            />
                            <Button
                                label="Ghi lại"
                                tooltip="Ghi lại"
                                className="MyBtn p-button-sm "
                                onClick={() => {
                                    setIsLoading(false);
                                    handleAdd();
                                }}
                            />
                            <Button
                                label="Xóa"
                                tooltip="Xóa"
                                className="MyBtn p-button-sm p-button-danger"
                                onClick={() => {
                                    setVisible(true);
                                }}
                            />
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
                                {
                                    quyTrinh.CreatedByName
                                        ? quyTrinh.CreatedByName
                                        : quyTrinh.TenGiaoVien
                                }
                            </div>
                            <div
                                className="ellipsis-span"
                                data-title={formatDateStringGMT(quyTrinh.Created)}
                            >
                                <b>TG tạo: </b>
                                {formatDateStringGMT(quyTrinh.Created)}
                            </div>
                            <div
                                className="ellipsis-span"
                                data-title={formatDateStringGMT(quyTrinh.Modified)}
                            >
                                <b>TG duyệt: </b>
                                {quyTrinh.isKetThuc &&
                                    formatDateStringGMT(quyTrinh.Modified)}
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
                                resetFilterOnHide={true}
                                className="p-inputtext-sm w-full"
                                placeholder="Chọn giáo viên"
                                value={quyTrinh.IdUserGiaoVien}
                                options={giaoVien.map((ele) => {
                                    return { value: ele.Id, label: ele.TenNhanVien };
                                })}
                                onChange={(e) => {
                                    setForm(e.value, "IdUserGiaoVien");
                                }}
                                filter
                            />
                        </div>
                        <div className="field col-12 md:col-3 lg:col-2">
                            <label>
                                Bộ phận/Khoa<span className="text-red-500">(*)</span>:
                            </label>
                            <Dropdown
                                resetFilterOnHide={true}
                                className="w-full p-inputtext-sm"
                                value={quyTrinh.IdBoPhan}
                                options={listBoPhan.map((ele) => {
                                    return { label: ele.TenBoPhan, value: ele.Id };
                                })}
                                onChange={(e) => {
                                    setForm(e.value, "IdBoPhan");
                                }}
                                filter
                                filterBy="label"
                                placeholder="Chọn bộ phận/Khoa"
                            />
                        </div>
                        <div className="field col-12 md:col-3 lg:col-2">
                            <label>
                                Năm<span className="text-red-500">(*)</span>:
                            </label>
                            <Dropdown
                                resetFilterOnHide={true}
                                className="w-full p-inputtext-sm"
                                value={quyTrinh.Nam}
                                options={namHoc.map((ele) => {
                                    return { label: ele.Nam, value: ele.Nam };
                                })}
                                onChange={(e) => {
                                    if (quyTrinh.listChiTiet.length > 0) {
                                        setVisibleRemove(true);
                                        setTempData({
                                            ...tempData,
                                            Nam: e.value,
                                            ToiTuan: 1,
                                            TuTuan: 1,
                                        });
                                    } else setForm(e.value, "Nam");
                                }}
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
                                resetFilterOnHide={true}
                                className="w-full p-inputtext-sm"
                                value={quyTrinh.TuTuan}
                                // options={listTuan}
                                // itemTemplate={dropdownOptionTemplate}
                                onChange={(e) => {
                                    if (quyTrinh.listChiTiet.length > 0) {
                                        setVisibleRemove(true);
                                        setTempData({
                                            ...tempData,
                                            ToiTuan: null,
                                            TuTuan: e.value,
                                        });
                                    } else {
                                        setForm(null, "ToiTuan");
                                        setWeekIsDisabled(e.value);
                                        setForm(e.value, "TuTuan");
                                        setEnableBtn(true);
                                    }
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
                                resetFilterOnHide={true}
                                className="w-full p-inputtext-sm"
                                value={quyTrinh.ToiTuan}
                                // options={listTuan}
                                optionDisabled={(opt) => {
                                    return opt.value < weekIsDisabled;
                                }}
                                onChange={(e) => {
                                    if (quyTrinh.listChiTiet.length > 0) {
                                        setVisibleRemove(true);
                                        setTempData({ ...tempData, ToiTuan: e.value });
                                    } else {
                                        setForm(e.value, "ToiTuan");
                                        setEnableBtn(false);
                                    }
                                }}
                                filter
                                filterBy="value"
                                placeholder="Chọn tuần"
                            />
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
                    </div>
                </div>
            </div>
        </>)
}