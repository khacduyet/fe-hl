import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { DanhMucService } from "../../services/danhmuc.service";
import { DateToUnix, formatDateStringGMT, validForm } from "../../services/helperfunction";
import { cLoaiPhuongTien, cLoaiXe } from "../common/apiservice";
import { TabView, TabPanel } from 'primereact/tabview';
import { Calendar } from 'primereact/calendar';
import { LOAINGUOIDUNG, vnCalendar } from "../../services/const";
import { toast } from "react-toastify";
import { outContext } from "../../App";
import { Confirm } from "../common/common";
import { ConfirmDialog } from "primereact/confirmdialog";

export default function QuanLyDongPhi() {
    const navigate = useNavigate();
    const [listQuyTrinh, setListQuyTrinh] = useState([]);
    const [listLoaiXe, setListLoaiXe] = useState([]);
    const [tabTrangThai, setTabTrangThai] = useState({});
    const [visible, setVisible] = useState(false)
    const [reset, setReset] = useState(false);
    const listThang = vnCalendar.monthNames.map((x, index) => {
        return { label: x, value: index + 1 }
    })
    const listLoaiNguoiDung = LOAINGUOIDUNG.map((x, index) => {
        return { label: x, value: index + 1 }
    })
    const [paging, setPaging] = useState({
        CurrentPage: 1,
        TotalItem: 0,
        TotalPage: 0,
    });
    const context = useContext(outContext);
    const [filter, setFilter] = useState({
        LoaiNguoiDung: 1,
        Thang: 0,
        Keyword: "",
        IdChungCu: context.access_chungcu,
        DaDongPhi: 0,
    });
    useEffect(() => {
        setFil(context.access_chungcu, "IdChungCu");
    }, [context.access_chungcu]);

    const getList = useCallback(async () => {
        let data = {
            ...filter,
            CurrentPage: paging.CurrentPage,
        };
        try {
            let _list = await DanhMucService.QuanLyPhi.GetListFilter(data);
            if (_list) {
                let list = _list.Data;
                setPaging({
                    ...paging,
                    TotalItem: list.length,
                });
                let tableData = list.map((ele, index) => {
                    return {
                        ...ele,
                        STT: paging.CurrentPage - (paging.CurrentPage - 1) + index,
                    };
                });
                let items = tableData.slice(
                    (paging.CurrentPage - 1) * 10,
                    paging.CurrentPage * 10
                );
                setListQuyTrinh(items);
            }
        } catch (er) {
            console.log(er);
        }
    }, [filter, paging.CurrentPage]);

    const getAllOptions = async () => {
        let $cLoaiXe = cLoaiXe();

        let res = await Promise.all([$cLoaiXe]);
        if (res[0]) {
            setListLoaiXe(res[0]);
        }
    }

    useEffect(() => {
        getAllOptions();
        getList();
    }, [reset, filter.DaDongPhi, paging.CurrentPage, filter.Thang, filter.LoaiNguoiDung, filter.IdLoaiXe]);

    const handleAdd = () => {
        navigate(`/quanlydongphi/add/0`);
    };
    const setFil = (e, key) => {
        let data = { ...filter };
        data[key] = e;
        setFilter({
            ...data,
        });
    };

    const handleCreatePhieu = async () => {
        let fil = {
            ...filter
        }
        let rs = await DanhMucService.QuanLyPhi.TaoNhanhPhieu(fil);
        if (rs) {
            if (rs.StatusCode === 200) {
                toast.success(rs.Message);
                getList();
            } else {
                toast.error(rs.Message);
            }
        }
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    return (
        <>
            {visible && (
                <Confirm
                    visible={visible}
                    setVisible={setVisible}
                    func={handleCreatePhieu}
                    message="Bạn có chắc muốn tạo nhanh phiếu?"
                    header="Thông báo!"
                    acceptLabel="Đồng ý"
                    rejectLabel="Hủy bỏ"
                />
            )}
            <h1 className="section-heading">Quản lý đóng phí</h1>
            <div className="container-haha">
                <div className="flex flex-row justify-content-between">
                    <div>
                        <Button
                            label="Thêm mới"
                            className="p-button-sm"
                            onClick={handleAdd}
                        />
                        <Button
                            label="Tạo nhanh phiếu tháng"
                            className="p-button-sm ml-2"
                            onClick={() => setVisible(true)}
                        />
                    </div>
                    <div className="flex flex-row gap-3">
                        <Dropdown
                            resetFilterOnHide={true}
                            style={{ width: "300px" }}
                            className="p-inputtext-sm"
                            value={filter.LoaiNguoiDung}
                            options={listLoaiNguoiDung}
                            onChange={(e) => {
                                setFil(e.value, "LoaiNguoiDung");
                            }}
                            filter
                            filterBy="label"
                            placeholder="Cư dân/ xe ngoài"
                        />
                        <Dropdown
                            resetFilterOnHide={true}
                            style={{ width: "150px" }}
                            className="p-inputtext-sm"
                            value={filter.Thang}
                            options={listThang}
                            onChange={(e) => {
                                setFil(e.value, "Thang");
                            }}
                            filter
                            filterBy="label"
                            placeholder="Chọn tháng"
                        />
                        <Dropdown
                            resetFilterOnHide={true}
                            style={{ width: "300px" }}
                            className="p-inputtext-sm"
                            value={filter.IdLoaiXe}
                            options={listLoaiXe.map((ele) => {
                                return { value: ele.Id, label: ele.Ten };
                            })}
                            onChange={(e) => {
                                setFil(e.value, "IdLoaiXe");
                            }}
                            filter
                            filterBy="label"
                            placeholder="Chọn loại xe"
                        />
                        <div className="p-inputgroup">
                            <InputText
                                className="p-inputtext-sm"
                                placeholder="Tìm kiếm" style={{ width: "300px" }}
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
                                    setPaging({ ...paging, CurrentPage: 1 });
                                    getList();
                                }}
                            />
                            <Button
                                icon="pi pi-refresh"
                                className="p-button-primary"
                                onClick={() => {
                                    setPaging({ ...paging, CurrentPage: 1 });
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
                <TabView
                    className="pt-3 no-content"
                    activeIndex={filter.DaDongPhi}
                    onTabChange={(e) => {
                        setFil(e.index, "DaDongPhi");
                        setPaging({ ...paging, CurrentPage: 1 });
                    }}
                >
                    <TabPanel
                        header="Chưa đóng phí"
                    ></TabPanel>
                    <TabPanel
                        header="Đã đóng phí"
                    ></TabPanel>
                    <TabPanel
                        header="Tổng hợp"
                    ></TabPanel>
                </TabView>

                <div style={{ overflowX: "auto" }}>
                    <DataTable
                        className="p-datatable-sm p-datatable-gridlines"
                        value={listQuyTrinh}
                    >
                        <Column
                            bodyClassName="text-center"
                            field="STT"
                            headerClassName="text-center"
                            style={{ width: "2%" }}
                            header="STT"
                        ></Column>
                        <Column
                            style={{ width: "8%" }}
                            field="SoPhieu"
                            headerClassName="text-center"
                            bodyClassName="text-center"
                            header="Số phiếu"
                        ></Column>
                        <Column
                            style={{ width: "8%" }}
                            field="NguoiDongPhi"
                            headerClassName="text-center"
                            bodyClassName="text-center"
                            header="Người đóng"
                        ></Column>

                        <Column
                            style={{ width: "10%" }}
                            field="TongTien"
                            headerClassName="text-center"
                            bodyClassName="text-center"
                            header="Tổng tiền"
                            body={(rowData) => {
                                return <b>{formatCurrency(rowData.TongTien)}</b>;
                            }}
                        ></Column>
                        <Column
                            style={{ width: "20%" }}
                            field="GhiChu"
                            headerClassName="text-center"
                            header="Nội dung"
                        ></Column>
                        <Column
                            style={{ width: "10%" }}
                            field="Created"
                            headerClassName="text-center"
                            bodyClassName="text-center"
                            body={(rowData) => {
                                return formatDateStringGMT(rowData.Created);
                            }}
                            header="Thời gian tạo phiếu"
                        ></Column>
                        <Column
                            style={{ width: "10%" }}
                            field="TenTrangThai"
                            headerClassName="text-center"
                            bodyClassName="text-center"
                            header="Trạng thái"
                            body={(rowData) => {
                                return rowData.TrangThai ? <span style={{ color: "green" }}>Đã đóng phí</span> : <span style={{ color: "red" }}>Chưa đóng phí</span>
                            }}
                        ></Column>
                        <Column
                            bodyClassName="text-center"
                            style={{ width: "10%" }}
                            body={(rowData) => (
                                <Button
                                    className="p-button-sm"
                                    type="button"
                                    icon="pi pi-pencil"
                                    onClick={() => {
                                        navigate(`update/${rowData.Id}`);
                                    }}
                                ></Button>
                            )}
                            header="Thao tác"
                        ></Column>
                    </DataTable>
                </div>

                <div className="flex justify-content-between align-items-center">
                    <div>Tổng số bản ghi {paging.TotalItem}</div>
                    <div>
                        <Paginator
                            totalRecords={paging.TotalItem}
                            first={(paging.CurrentPage - 1) * 10}
                            rows={10}
                            onPageChange={(e) => {
                                setPaging({ ...paging, CurrentPage: e.page + 1 });
                            }}
                        ></Paginator>
                    </div>
                </div>
            </div>
            <ConfirmDialog></ConfirmDialog>
        </>
    );
}