import { useOutletContext } from "react-router-dom";
import { Button } from "primereact/button";
import React, { useEffect, useState, useCallback } from "react";
import { QuyTrinhService } from "../../services/quytrinh.service";
import { Toolbar } from "primereact/toolbar";
import { Dropdown } from "primereact/dropdown";
import TableThucGiangGiaoVien from "./TableThucGiangGiaoVien";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method

import { ScrollPanel } from "primereact/scrollpanel";

const _KI = ["Ki_I", "Ki_II"];
export default function DSThucGiangGiaoVien() {
  let tongSoNam = new Date().getFullYear() - 2020 + 1;
  const listNam = new Array(tongSoNam).fill("").map((_, index) => {
    return {
      value: 2020 + index,
      label: 2020 + index,
    };
  });
  const listKy = _KI.map((ele, index) => {
    return {
      value: ele,
      label: "Kỳ " + (index + 1),
    };
  });
  const [paging, setPaging] = useState({
    CurrentPage: 1,
    TotalItem: 0,
    TotalPage: 0,
  });
  const [filter, setFilter] = useState({
    Nam: 2022,
    Ki: "Ki_I",
    IdUserGiaoVien: "",
    IdKhoa: 0,
  });
  const { toast } = useOutletContext();
  const [listGiaoVien, setListGiaoVien] = useState([]);
  const [listBaoCao, setListBaoCao] = useState([]);
  const [listBoPhan, setListBoPhan] = useState([]);
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  async function getAllOptions() {
    let $BoPhan = QuyTrinhService.DanhMuc.BoPhan();
    let $NguoiDat = QuyTrinhService.DanhMuc.NguoiDung();
    let $CurrentUser = QuyTrinhService.User.GetCurrent();
    let res = await Promise.all([$BoPhan, $NguoiDat, $CurrentUser]);
    setListBoPhan(res[0]);
    setListGiaoVien(
      res[1].items.map((ele) => {
        return {
          value: ele.Id,
          label: ele.TenNhanVien,
        };
      })
    );
  }

  const getList = useCallback(async () => {
    let item = {
      ...filter,
    };
    try {
      let data = await QuyTrinhService.BaoCao.GetBaoCao(item);
      // if (data.Error === 7) {
      //   toast.success(data.Detail);
      // } else {
      //   toast.error(data.Detail);
      // }
      if (data.Value) {
        setPaging({
          ...paging,
          TotalItem: data.Value.length,
        });
        data.Value.map((ele, index) => {
          ele.STT = index + 1;
          return ele;
        });
        let items = data.Value.slice(
          (paging.CurrentPage - 1) * 25,
          paging.CurrentPage * 25
        );
        setListBaoCao(items);
      } else {
        setListBaoCao([]);
      }
    } catch (er) {
      console.log(er);
    }
  }, [filter]);

  const handleExport = async () => {
    let res = await QuyTrinhService.BaoCao.Export(filter);
    if (res && res.Error === 7) {
      toast.success(res.Detail);
      let url = window.location.origin;
      // navigate(`a`);
      window.location.replace(url + res.Value);
    } else {
      toast.error(res.Detail);
    }
  };

  const setFil = (e, key) => {
    let data = { ...filter };
    data[key] = e;
    setFilter({
      ...data,
    });
  };

  useEffect(() => {
    getList();
    getAllOptions();
  }, [filter]);

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Dropdown
          style={{ width: "250px" }}
          className="p-inputtext-sm mr-5"
          value={filter.IdKhoa}
          options={listBoPhan}
          optionValue="Id"
          optionLabel="TenBoPhan"
          onChange={(e) => {
            setFil(e.value, "IdKhoa");
          }}
          filter
          filterBy="TenBoPhan"
          placeholder="Chọn khoa"
        />
        <Dropdown
          style={{ width: "250px" }}
          className="p-inputtext-sm mr-5"
          value={filter.Nam}
          options={listNam}
          onChange={(e) => {
            setFil(e.value, "Nam");
          }}
          placeholder="Chọn năm"
        />
        <Dropdown
          style={{ width: "250px" }}
          className="p-inputtext-sm mr-5"
          value={filter.Ki}
          options={listKy}
          onChange={(e) => {
            setFil(e.value, "Ki");
          }}
          placeholder="Chọn kỳ"
        />
        {/* <Dropdown
          style={{ width: "250px" }}
          className="p-inputtext-sm mr-5"
          value={filter.IdUserGiaoVien}
          options={listGiaoVien}
          onKeyDown={(e) => {
            if (e.key === "Enter") return getList();
          }}
          onChange={(e) => {
            setFil(e.value, "IdUserGiaoVien");
          }}
          filter
          filterBy="label"
          placeholder="Chọn giáo viên"
        /> */}
        <Button
          icon="pi pi-search"
          className="p-button-primary mr-1"
          onClick={() => {
            //   setPaging({ ...paging, CurrentPage: 1 });
            getList();
          }}
        />
        <Button
          icon="pi pi-refresh"
          className="p-button-primary"
          onClick={() => {
            //   setPaging({ ...paging, CurrentPage: 1 });
            setFilter({
              Nam: 0,
              Ki: "",
              IdUserGiaoVien: "",
            });
          }}
        />
      </React.Fragment>
    );
  };
  const leftToolbar = () => {
    return (
      <>
        <Button
          label="Xuất dữ liệu"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={handleExport}
        />
      </>
    );
  };

  const onHide = () => {
    setShow(false);
    setItem([]);
    getList();
    setFilter({ ...filter, IdUserGiaoVien: "" });
  };
  return (
    <>
      <h1 className="section-heading">THỰC GIẢNG GIÁO VIÊN</h1>
      <hr />
      <Toolbar
        className="mb-4"
        left={leftToolbar}
        right={rightToolbarTemplate}
      ></Toolbar>
      <ScrollPanel style={{ width: "100%", height: "550px" }}>
        <DataTable
          className="p-datatable-sm p-datatable-gridlines"
          value={listBaoCao}
        >
          <Column
            bodyClassName="text-center"
            field="STT"
            headerClassName="text-center"
            style={{ width: "5%" }}
            header="#"
          ></Column>
          <Column
            style={{ width: "15%" }}
            field="TenGiaoVien"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="Họ và tên"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="ChucDanh"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="Chức danh"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="HocVi"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="Học vị"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="LyThuyet"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="LT"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="ThucHanh"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="TH"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="QuyDoiGioGiang"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="Kiêm nhiệm quy đổi"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="TongSoGioGiang"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="Tổng giờ giảng"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="GioTieuChuan"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="Giờ chuẩn"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="GioCoVan"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="Giờ cố vấn HT"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="GioThieu"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="Giờ thiếu"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="GioVuot"
            headerClassName="text-center"
            bodyClassName="text-center"
            sortable
            header="Giờ vượt"
          ></Column>
          <Column
            bodyClassName="text-center"
            style={{ width: "5%" }}
            body={(rowData) => (
              <Button
                className="p-button-sm"
                type="button"
                icon="pi pi-eye"
                onClick={() => {
                  console.log("rowData", rowData);
                  setItem(rowData.ListMon);
                  setFilter({
                    ...filter,
                    IdUserGiaoVien: rowData.IdUserGiaoVien,
                  });
                  setShow(true);
                }}
              ></Button>
            )}
            header="Thao tác"
          ></Column>
        </DataTable>
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
        <Dialog
          header={`Chi tiết thực giảng giáo viên`}
          visible={show}
          onHide={onHide}
          breakpoints={{ "960px": "40vw", "640px": "100vw" }}
          style={{ width: "100vw" }}
        >
          <div className="flex flex-row gap-2 mb-3">
            <Button
              label="Quay lại"
              icon="pi pi-angle-double-left"
              className="p-button-sm p-button-warning"
              onClick={onHide}
            />
            <Button
              label="Xuất dữ liệu"
              icon="pi pi-upload"
              className="p-button-help"
              onClick={handleExport}
            />
          </div>
          <TableThucGiangGiaoVien listBaoCao={item} />
        </Dialog>
        <ConfirmDialog></ConfirmDialog>
      </ScrollPanel>
    </>
  );
}
