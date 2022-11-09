import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { QuyTrinhService } from "../../services/quytrinh.service";
import { DanhMucService } from "../../services/danhmuc.service";
import { DataTable } from "primereact/datatable";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import DialogKhaiBaoDayBu from "./DialogKhaiBaoDayBu";
import { vnCalendar } from "../../services/const";
// import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method

const eAction = "QUYTRINHDAYBU";

function TableKhaiBaoDayDu({
  quyTrinh,
  setQuyTrinh,
  isOpenButton,
  setIsHasChild,
}) {
  const [tabTrangThai, setTabTrangThai] = useState({});
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [stateButton, setStateButton] = useState(false); // false is Add , true is Edit
  const [dataEdit, setDataEdit] = useState({});
  const [listDayOfWeek, setListDayOfWeek] = useState([]);
  const [listResult, setListResult] = useState([]);
  const [listAllFull, setListAllFull] = useState({
    listPhongHocFull: [],
    listLopFull: [],
    listMonFull: [],
  });

  const [paging, setPaging] = useState({
    CurrentPage: 1,
    TotalItem: 0,
    TotalPage: 0,
  });

  useEffect(() => {
    getAllOptions();
    if (quyTrinh.ListChiTiet) {
      let items = quyTrinh.ListChiTiet.slice(
        (paging.CurrentPage - 1) * 5,
        paging.CurrentPage * 5
      );
      setPaging({ ...paging, TotalItem: quyTrinh.ListChiTiet.length });
      setListResult(items);
    }
  }, [quyTrinh.ListChiTiet, paging.CurrentPage]);

  const getAllOptions = async () => {
    let $listLop = DanhMucService.Lop.GetList({});
    let $listMon = DanhMucService.Mon.GetList({});
    let $listPhongHoc = DanhMucService.PhongHoc.GetList({});
    let res = await Promise.all([$listLop, $listMon, $listPhongHoc]);
    await setListAllFull({
      listLopFull: res[0],
      listMonFull: res[1],
      listPhongHocFull: res[2],
    });
    setListDayOfWeek(
      vnCalendar.dayNamesShort.map((ele, index) => {
        return { value: index, label: ele };
      })
    );
    quyTrinh.ListChiTiet.map((ele) => {
      let cu = listDayOfWeek.filter((fil) => fil.value === ele.DayOfWeek_Cu)[0];
      let moi = listDayOfWeek.filter(
        (fil) => fil.value === ele.DayOfWeek_Moi
      )[0];
      ele.DayOfWeek_Name_Cu = cu.label;
      ele.DayOfWeek_Name_Moi = moi.label;
      return ele;
    });
  };

  const checkTrangThai = async () => {
    let trangThaiPromise = await QuyTrinhService.QuanTriQuyTrinh.KiemTraTab(
      eAction
    );
    if (trangThaiPromise) {
      setTabTrangThai({ ...trangThaiPromise });
    }
  };
  useEffect(() => {
    checkTrangThai();
  }, []);
  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="BÁO NGHỈ" colSpan={5} />
        <Column header="MÔN HỌC" rowSpan={2} />
        <Column header="LỚP" rowSpan={2} />
        <Column header="BÁO BÙ" colSpan={5} />
        <Column header="THAO TÁC" rowSpan={2} />
      </Row>
      <Row>
        <Column header="Tuần" />
        <Column header="Thứ" />
        <Column header="Ngày" />
        <Column header="Phòng" />
        <Column header="Số giờ" />
        <Column header="Tuần" />
        <Column header="Thứ" />
        <Column header="Ngày" />
        <Column header="Phòng" />
        <Column header="Số giờ" />
      </Row>
    </ColumnGroup>
  );

  const showDialog = () => {
    setShow(!show);
  };

  const handleAdd = () => {
    setStateButton(false);
    setHeader("Thêm mới");
    showDialog();
  };

  const handleEdit = (rowData) => {
    setStateButton(true);
    setDataEdit(rowData);
    setHeader("Chỉnh sửa");
    showDialog();
  };
  const handleDelete = (rowData) => {
    setQuyTrinh({
      ...quyTrinh,
      ListChiTiet: quyTrinh.ListChiTiet.filter(function (chiTiet) {
        return chiTiet !== rowData;
      }),
    });
  };

  const confirm = (rowData) => {
    confirmDialog({
      message: "Bạn có chắc muốn xóa!",
      header: "Thông báo!",
      acceptLabel: "Đồng ý",
      rejectLabel: "Hủy bỏ",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleDelete(rowData),
      reject: () => {
        console.log("CANCEL");
      },
    });
  };

  function formatDate(date) {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return dd + "/" + mm + "/" + yyyy;
  }
  return (
    <>
      <div className="container-haha">
        <div className="flex flex-row justify-content-between mb-5">
          <b className="text-red-500 text-xl">Danh sách ngày nghỉ, báo bù:</b>
          {tabTrangThai.ThemMoi && (
            <Button
              disabled={isOpenButton}
              icon="pi pi-plus"
              label="Thêm mới"
              className="p-button-sm"
              onClick={handleAdd}
            />
          )}
        </div>
        <DataTable
          className="p-datatable-sm p-datatable-gridlines"
          headerColumnGroup={headerGroup}
          value={listResult}
        >
          <Column
            style={{ width: "5%" }}
            bodyClassName="text-center"
            field="Tuan_Cu"
            headerClassName="text-center"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="DayOfWeek_Name_Cu"
            headerClassName="text-center"
            bodyClassName="text-center"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="Ngay_Cu"
            body={(rowData) => {
              return formatDate(rowData.Ngay_Cu);
            }}
            headerClassName="text-center"
            bodyClassName="text-center"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="TendmPhongHoc_Cu"
            headerClassName="text-center"
            bodyClassName="text-center"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="TongSoGio_Cu"
            headerClassName="text-center"
            bodyClassName="text-center"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="TendmMon"
            headerClassName="text-center"
            bodyClassName="text-center"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="TendmLop"
            headerClassName="text-center"
            bodyClassName="text-center"
          ></Column>
          <Column
            style={{ width: "5%" }}
            bodyClassName="text-center"
            field="Tuan_Moi"
            headerClassName="text-center"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="DayOfWeek_Name_Moi"
            headerClassName="text-center"
            bodyClassName="text-center"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="Ngay_Moi"
            body={(rowData) => {
              return formatDate(rowData.Ngay_Moi);
            }}
            headerClassName="text-center"
            bodyClassName="text-center"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="TendmPhongHoc_Moi"
            headerClassName="text-center"
            bodyClassName="text-center"
          ></Column>
          <Column
            style={{ width: "5%" }}
            field="TongSoGio_Moi"
            headerClassName="text-center"
            bodyClassName="text-center"
          ></Column>

          <Column
            bodyClassName="text-center"
            style={{ width: "10%" }}
            body={(rowData) => (
              <>
                <Button
                  className="p-button-rounded p-button-sm p-button-success mr-2"
                  type="button"
                  icon="pi pi-pencil"
                  onClick={() => handleEdit(rowData)}
                ></Button>
                <Button
                  icon="pi pi-trash"
                  type="button"
                  className="p-button-rounded p-button-sm p-button-danger"
                  onClick={() => confirm(rowData)}
                />
              </>
            )}
            header="Thao tác"
          ></Column>
        </DataTable>
        {show && (
          <DialogKhaiBaoDayBu
            opt={header}
            show={show}
            onclick={showDialog}
            quyTrinh={quyTrinh}
            setQuyTrinh={setQuyTrinh}
            listAllFull={listAllFull}
            stateButton={stateButton}
            dataEdit={dataEdit}
          />
        )}
        <div className="flex justify-content-between align-items-center">
          <div>Tổng số bản ghi {paging.TotalItem}</div>
          <div>
            <Paginator
              totalRecords={paging.TotalItem}
              first={(paging.CurrentPage - 1) * 5}
              rows={5}
              onPageChange={(e) => {
                setPaging({ ...paging, CurrentPage: e.page + 1 });
              }}
            ></Paginator>
          </div>
        </div>
      </div>
    </>
  );
}

export default TableKhaiBaoDayDu;
