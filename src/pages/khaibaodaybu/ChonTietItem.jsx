/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { range } from "../../services/helperfunction";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { InputText } from "primereact/inputtext";

const options = [
  { label: "Off", value: "Off" },
  { label: "LT", value: "LT" },
  { label: "TH", value: "TH" },
];
const loaitiets = {
  Off: "Off",
  LyThuyet: "LT",
  ThucHanh: "TH",
  LT: "LyThuyet",
  TH: "ThucHanh",
};
function ChonTietItem({ listTietEdit, listdmCa, listdmTiet, onChange }) {
  const { id } = useParams();
  const [listTietHoc, setListTiet] = useState(listTietEdit);
  let [listdmTietHoc, setListdmTiet] = useState([]);
  const [listdmCaHoc, setListdmCa] = useState(listdmCa);
  const [visible, setVisible] = useState(false);
  const [maxrow, setMaxRow] = useState(3);
  const onHide = () => {
    setVisible(false);
    setListTiet([]);
    setListdmTiet([]);
    setListdmCa([]);
  };

  const confirmAdd = async () => {
    let listTietTemp = listdmTietHoc
      .filter((tiet) => tiet.Loai !== "Off")
      .map((tiet) => ({
        ...tiet,
        LoaiTiet: loaitiets[tiet.Loai],
        IddmTietHoc: tiet.Id,
        IdQuyTrinh: id,
      }));
    setListTiet(listTietTemp);
    onChange(listTietTemp);
    onHide();
  };
  const handleEdit = async () => {
    if (!listTietEdit) {
      listTietEdit = [];
    }
    let listdmTietEdit = listdmTiet?.map((e) => {
      let tietitem = listTietEdit.filter(
        (tiet) => tiet.IddmTietHoc === e.Id && loaitiets[tiet.LoaiTiet]
      );
      return {
        ...e,
        Loai: tietitem.length > 0 ? loaitiets[tietitem[0].LoaiTiet] : "Off",
      };
    });
    setVisible(true);
    setListTiet([...listTietEdit]);
    setListdmTiet([...listdmTietEdit]);
    setListdmCa(listdmCa);
    let maxRow = 0;
    listdmCa.forEach((item, index) => {
      let count = listdmTietEdit.filter(
        (tiet) => tiet.IddmCaHoc === item.Id
      ).length;
      if (count > maxRow) maxRow = count;
    });
    setMaxRow(maxRow);
  };

  const bodyItem = () => {
    return (
      <div className="p-inputgroup p-inputtext-sm">
        <InputText placeholder="Chọn tiết" disabled />
        <Button
          icon="pi pi-list"
          className="p-button-warning p-button-sm"
          onClick={handleEdit}
        />
      </div>
    );
  };

  return (
    <>
      {bodyItem()}
      <Dialog
        className="p-inputtext-sm"
        header={`Chọn tiết`}
        visible={visible}
        onHide={onHide}
        breakpoints={{ "960px": "70vw", "640px": "100vw" }}
        style={{ width: "60vw" }}
      >
        <div className="flex flex-row gap-2">
          <Button label="Quay lại" className="p-button-sm" onClick={onHide} />
          <Button
            label="Ghi lại"
            className="p-button-sm"
            onClick={confirmAdd}
          />
        </div>
        <div className="formgrid grid pt-3">
          <table className="table table-bordered table-sm w-100">
            <thead>
              <tr>
                {listdmCaHoc?.map((ele, index) => {
                  return (
                    <td
                      key={ele.fakeKey ? ele.fakeKey : ele.Id}
                      className=""
                      colSpan={2}
                    >
                      {ele.Ten}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {range(0, maxrow).map((ele, index) => {
                return (
                  <>
                    <tr key={ele}>
                      {listdmCaHoc?.map((ele2, index2) => {
                        return (
                          <>
                            <td>
                              {listdmTietHoc.filter(
                                (tiet) => tiet.IddmCaHoc === ele2.Id
                              ).length > index && (
                                <>
                                  {
                                    listdmTietHoc.filter(
                                      (tiet) => tiet.IddmCaHoc === ele2.Id
                                    )[index].Ten
                                  }
                                </>
                              )}
                            </td>

                            <td>
                              {listdmTietHoc.filter(
                                (tiet) => tiet.IddmCaHoc === ele2.Id
                              ).length > index && (
                                <>
                                  <SelectButton
                                    className="blue"
                                    value={
                                      listdmTietHoc.filter(
                                        (tiet) => tiet.IddmCaHoc === ele2.Id
                                      )[index].Loai
                                    }
                                    optionDisabled={(option) => {
                                      let ss = listdmTietHoc.filter(
                                        (tiet) => tiet.IddmCaHoc === ele2.Id
                                      )[index];
                                      if (
                                        ss.ThoiGianBatDau_ThucHanh === null ||
                                        ss.ThoiGianKetThuc_ThucHanh === null
                                      ) {
                                        return option.label === "TH";
                                      }
                                    }}
                                    options={options}
                                    onChange={(e) => {
                                      listdmTietHoc.filter(
                                        (tiet) => tiet.IddmCaHoc === ele2.Id
                                      )[index].Loai = e.value;
                                      setListdmTiet([...listdmTietHoc]);
                                    }}
                                  />
                                </>
                              )}
                            </td>
                          </>
                        );
                      })}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </Dialog>
      <ConfirmDialog></ConfirmDialog>
    </>
  );
}

ChonTietItem.propTypes = {};

export default ChonTietItem;
