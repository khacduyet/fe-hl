import { Button } from "primereact/button";
import GioGiangItem from "./GioGiangItem";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method

export default function TableKhaiBaoGioGiang({
  listBoPhan,
  listLopFull,
  listMonFull,
  listPhongHoc,
  listdmTiet,
  listdmCa,
  quyTrinh,
  setForm,
  HandleChangeTableItem,
  HandleDeleteTableItem,
}) {
  return (
    <>
      <div className="w-100 table-responsive">
        <table className="table table-bordered table-sm w-100">
          <thead>
            <tr>
              <th>STT</th>
              <th className="tc-w-150">Ngày</th>
              <th>Thứ</th>
              <th>Khoa</th>
              <th>Lớp</th>
              <th>Phòng</th>
              <th>Môn</th>
              <th>Sỹ số trước</th>
              <th>Sỹ số sau</th>
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
                  <GioGiangItem
                    listKhoa={listBoPhan}
                    listLopFull={listLopFull}
                    listMonFull={listMonFull}
                    listPhongHoc={listPhongHoc}
                    giogiang={ele}
                    index={index}
                    listdmTiet={listdmTiet}
                    listdmCa={listdmCa}
                    onChange={(e) => HandleChangeTableItem(e, index)}
                    onDelete={() => HandleDeleteTableItem(index)}
                  />
                </tr>
              );
            })}
          </tbody>
          <ConfirmDialog />
        </table>
      </div>
    </>
  );
}
