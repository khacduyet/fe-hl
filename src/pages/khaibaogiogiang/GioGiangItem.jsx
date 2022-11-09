// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { Calendar } from "primereact/calendar";
// import { Dropdown } from "primereact/dropdown";
// import { MultiSelect } from "primereact/multiselect";
// import { InputNumber } from "primereact/inputnumber";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { DateToUnix } from "../../services/helperfunction";
// import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
// import ChonTietItem from "../khaibaodaybu/ChonTietItem";
// import { thoigianLTTHpr } from "../../services/const";
// import {
//   dropdownOptionTemplate,
//   // dropdownFilterTemplate,
// } from "../common/templateDropdown";
// import { Confirm } from "../common/common";

// const dates = [
//   "Chủ nhật",
//   "Thứ 2",
//   "Thứ 3",
//   "Thứ 4",
//   "Thứ 5",
//   "Thứ 6",
//   "Thứ 7",
// ];
// function GioGiangItem({
//   listKhoa,
//   listLopFull,
//   listMonFull,
//   giogiang,
//   index,
//   onChange,
//   onDelete,
//   listPhongHoc,
//   listdmTiet,
//   listdmCa,
// }) {
//   const { opt, id } = useParams();
//   const [item, setItem] = useState(giogiang);
//   let [listLop, setListLop] = useState([]);
//   let [listMon, setListMon] = useState([]);
//   const [visible, setVisible] = useState(false);
//   const setForm = (e, key) => {
//     if (e !== null && e !== undefined) {
//       setItem((prev) => ({
//         ...prev,
//         [key]: e,
//       }));
//     } else {
//       delete item[key];
//       setItem({ ...item });
//     }
//   };
//   const onChangeTiet = (value) => {
//     value.forEach((element) => {
//       element.ThoiGianTuUnix =
//         element[thoigianLTTHpr["BatDau"][element.LoaiTiet]];
//       element.ThoiGianDenUnix =
//         element[thoigianLTTHpr["KetThuc"][element.LoaiTiet]];
//     });
//     setForm([...value], "listChiTiet_TietHoc");
//     let LyThuyet = value.filter((e) => e.LoaiTiet === "LyThuyet").length;
//     let ThucHanh = value.filter((e) => e.LoaiTiet === "ThucHanh").length;
//     setForm(LyThuyet, "TongSoGio_LyThuyet");
//     setForm(ThucHanh, "TongSoGio_ThucHanh");
//     item.TongSoGio = item.TongSoGio_LyThuyet + item.TongSoGio_ThucHanh;
//   };
//   const setOptionTheoKhoa = () => {
//     let listLop1 = listLopFull
//       .filter((lop) => lop.IdBoPhan === item.IdBoPhan)
//       ?.map((ele) => {
//         return { value: ele.Id, label: ele.Ten };
//       });
//     setListLop(listLop1);
//     getMonByKhoa(item.IdBoPhan);
//   };
//   const setValueLopMon = (idbophan) => {
//     item.IdBoPhan = idbophan;
//     let listLop1 = listLopFull
//       .filter((lop) => lop.IdBoPhan === item.IdBoPhan)
//       ?.map((ele) => {
//         return { value: ele.Id, label: ele.Ten };
//       });
//     let listMon1 = listMonFull
//       .filter(
//         (mon) => mon.listIdBoPhan?.indexOf(item.IdBoPhan) >= 0 || mon.isMonChung
//       )
//       ?.map((ele) => {
//         return { value: ele.Id, label: ele.Ten };
//       });
//     setForm(idbophan, "IdBoPhan");
//     onChange(item);
//     if (
//       item.IddmMon &&
//       listMon1
//         .map((ele) => {
//           return ele.value;
//         })
//         .indexOf(item.IddmMon) === -1
//     ) {
//       setForm(null, "IddmMon");
//       onChange(item);
//     }
//     if (item.listIddmLop && item.listIddmLop.length > 0) {
//       let listIddmLop2 = listLop1.filter(
//         (lop) => item.listIddmLop.indexOf(lop.value) !== -1
//       );
//       setForm(listIddmLop2, "listIddmLop");
//     }
//     onChange(item);
//   };
//   useEffect(() => {
//     if (!item.TongSoGio_LyThuyet) {
//       item.TongSoGio_LyThuyet = 0;
//     }
//     if (!item.TongSoGio_ThucHanh) {
//       item.TongSoGio_ThucHanh = 0;
//     }
//     item.TongSoGio = item.TongSoGio_LyThuyet + item.TongSoGio_ThucHanh;
//     onChange(item);
//     setOptionTheoKhoa();
//   }, [item]);
//   useEffect(() => {
//     setOptionTheoKhoa();
//   }, [opt, id, listLopFull, listMonFull, item.IdBoPhan]);
//   const getDayFromDate = useMemo(() => {
//     return !!item?.Ngay ? dates[new Date(item.Ngay).getDay()] : "";
//   }, [item.Ngay]);

//   const getMonByKhoa = async (value) => {
//     let arr = [];
//     let child = listKhoa.filter((ele) => ele.Id === value)[0];
//     if (child) {
//       arr.push(child.Id);
//       if (child.BoPhanChaPkid !== 0)
//         arr.push(
//           listKhoa.filter((ele) => ele.Id === child.BoPhanChaPkid)[0].Id
//         );
//     }
//     let listNew = [];
//     arr.map((ele) => {
//       let temp = listMonFull
//         .filter((x) => x.listIdBoPhan?.includes(ele) || x.isMonChung)
//         .map((x) => {
//           return { value: x.Id, label: x.Ten };
//         });
//       listNew = [...listNew, ...temp];
//       return 1;
//     });
//     let listResult = [];
//     listNew.map(x => {
//       var findItem = listResult.find((y) => y.value === x.value);
//       if (!findItem) listResult.push(x);
//     })
//     setListMon(listResult);
//   };

//   // NEW FILTER
//   const [filterValue, setFilterValue] = useState("");
//   const filterInputRef = useRef();
//   const dropdownFilterTemplate = (options) => {
//     let { filterOptions } = options;
//     return (
//       <div className="p-multiselect-filter-container">
//         <InputText
//           className="p-inputtext p-component p-multiselect-filter"
//           value={filterValue}
//           ref={filterInputRef}
//           onChange={(e) => {
//             myFilterFunction(e, filterOptions);
//           }}
//         />
//       </div>
//     );
//   };

//   const myFilterFunction = (event, options) => {
//     let _filterValue = event.target.value;
//     setFilterValue(_filterValue);
//     options.filter(event);
//   };
//   // END FILTER

//   return (
//     <>
//       {visible && (
//         <Confirm
//           visible={visible}
//           setVisible={setVisible}
//           func={onDelete}
//           message="Bạn có chắc muốn xóa này!"
//           header="Thông báo!"
//           acceptLabel="Đồng ý"
//           rejectLabel="Hủy bỏ"
//         />
//       )}
//       <td className="text-center">{index + 1}</td>
//       <td className="tc-w-150">
//         <Calendar
//           id="icon"
//           locale="vn"
//           placeholder="Chọn ngày"
//           inputClassName="p-inputtext-sm"
//           className="w-100"
//           value={item.Ngay}
//           onChange={(e) => {
//             setForm(e.value, "Ngay");
//             setForm(DateToUnix(e.value), "NgayUnix");
//           }}
//           showIcon
//         // maxDate={new Date()}
//         />
//       </td>
//       <td className="text-center">{getDayFromDate}</td>
//       <td>
//         <Dropdown
//           className="w-full p-inputtext-sm"
//           value={item.IdBoPhan}
//           options={listKhoa.map((ele) => {
//             return { value: ele.Id, label: ele.TenBoPhan };
//           })}
//           onChange={(e) => {
//             setValueLopMon(e.value);
//             getMonByKhoa(e.value);
//           }}
//           itemTemplate={dropdownOptionTemplate}
//           filter
//           // showClear
//           filterBy="label"
//           placeholder="Chọn Khoa"
//         />
//       </td>
//       <td>
//         <MultiSelect
//           className="p-inputtext-sm"
//           placeholder="Chọn lớp"
//           value={item.listIddmLop}
//           itemTemplate={dropdownOptionTemplate}
//           options={listLop}
//           onChange={(e) => setForm(e.value, "listIddmLop")}
//           filter
//           filterTemplate={dropdownFilterTemplate}
//           onShow={() => {
//             filterInputRef && filterInputRef.current.focus();
//           }}
//         // showClear
//         />
//       </td>
//       <td>
//         <Dropdown
//           className="w-full p-inputtext-sm"
//           value={item.IddmPhongHoc}
//           options={listPhongHoc}
//           itemTemplate={dropdownOptionTemplate}
//           onChange={(e) => setForm(e.value, "IddmPhongHoc")}
//           filter
//           showClear
//           placeholder="Chọn phòng học"
//         />
//       </td>
//       <td>
//         <Dropdown
//           className="w-full p-inputtext-sm"
//           value={item.IddmMon}
//           options={listMon}
//           itemTemplate={dropdownOptionTemplate}
//           onChange={(e) => setForm(e.value, "IddmMon")}
//           filter
//           showClear
//           placeholder="Chọn môn"
//         />
//       </td>
//       <td className="tc-w-80">
//         <InputNumber
//           value={item.SoHocSinhCoMat_Truoc}
//           inputClassName="p-inputtext-sm"
//           onValueChange={(e) => setForm(e.value, "SoHocSinhCoMat_Truoc")}
//           mode="decimal"
//           minFractionDigits={0}
//         />
//       </td>
//       <td className="tc-w-80">
//         <InputNumber
//           value={item.SoHocSinhCoMat_Sau}
//           inputClassName="p-inputtext-sm"
//           onValueChange={(e) => setForm(e.value, "SoHocSinhCoMat_Sau")}
//           mode="decimal"
//           minFractionDigits={0}
//         />
//       </td>
//       <td className="tc-w-120">
//         {/* <ChonTietItem
//           listTietEdit={item.listChiTiet_TietHoc}
//           listdmCa={listdmCa}
//           listdmTiet={listdmTiet}
//           onChange={(e) => onChangeTiet(e)}
//         /> */}
//       </td>
//       <td className="tc-w-80 text-right">{item.TongSoGio_LyThuyet}</td>
//       <td className="tc-w-80 text-right">{item.TongSoGio_ThucHanh}</td>
//       <td className="tc-w-80 text-right">{item.TongSoGio}</td>
//       <td className="text-center">
//         <Button
//           icon="pi pi-trash"
//           className="p-button-rounded p-button-danger p-button-sm"
//           onClick={() => {
//             setVisible(true);
//           }}
//           aria-label="Search"
//         />
//       </td>
//       <ConfirmDialog></ConfirmDialog>
//     </>
//   );
// }

// GioGiangItem.propTypes = {};

// export default GioGiangItem;
