/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import ChonTietItem from "../khaibaodaybu/ChonTietItem";
import { thoigianLTTHpr, vnCalendar } from "../../services/const";
import { InputText } from "primereact/inputtext";
import { dropdownOptionTemplate } from "../common/templateDropdown";

function ThoiKhoaBieuItem({
  listKhoa,
  listTuan,
  listLopFull,
  listMonFull,
  listPhongHoc,
  giogiang,
  index,
  listdmTiet,
  listdmCa,
  onChange,
  onDelete,
}) {
  const { opt, id } = useParams();
  const [item, setItem] = useState(giogiang);
  const [listDayOfWeek, setListDayOfWeek] = useState([]);
  let [listLop, setListLop] = useState([]);
  let [listMon, setListMon] = useState([]);
  let [weekIsDisabled, setWeekIsDisabled] = useState(0);

  const setForm = (e, key) => {
    if (e !== null && e !== undefined) {
      setItem((prev) => ({
        ...prev,
        [key]: e,
      }));
    } else {
      delete item[key];
      setItem({ ...item });
    }
  };
  const onChangeTiet = (value) => {
    value.forEach((element) => {
      element.ThoiGianTuUnix =
        element[thoigianLTTHpr["BatDau"][element.LoaiTiet]];
      element.ThoiGianDenUnix =
        element[thoigianLTTHpr["KetThuc"][element.LoaiTiet]];
    });
    setForm([...value], "listChiTiet_TietHoc");
    let LyThuyet = value.filter((e) => e.LoaiTiet === "LyThuyet").length;
    let ThucHanh = value.filter((e) => e.LoaiTiet === "ThucHanh").length;
    setForm(LyThuyet, "TongSoGio_LyThuyet");
    setForm(ThucHanh, "TongSoGio_ThucHanh");
    item.TongSoGio = item.TongSoGio_LyThuyet + item.TongSoGio_ThucHanh;
  };
  useEffect(() => {
    setListDayOfWeek(
      vnCalendar.dayNamesShort.map((ele, index) => {
        return { value: index, label: ele };
      })
    );
    if (!item.TongSoGio_LyThuyet) {
      item.TongSoGio_LyThuyet = 0;
    }
    if (!item.TongSoGio_ThucHanh) {
      item.TongSoGio_ThucHanh = 0;
    }
    item.TongSoGio = item.TongSoGio_LyThuyet + item.TongSoGio_ThucHanh;
    onChange(item);
  }, [item]);
  const setOptionTheoKhoa = () => {
    let listLop1 = listLopFull
      .filter((lop) => lop.IdBoPhan === item.IdBoPhan)
      ?.map((ele) => {
        return { value: ele.Id, label: ele.Ten };
      });
    setListLop(listLop1);
  };
  const setValueLopMon = (idbophan) => {
    item.IdBoPhan = idbophan;
    let listLop1 = listLopFull
      .filter((lop) => lop.IdBoPhan === item.IdBoPhan)
      ?.map((ele) => {
        return { value: ele.Id, label: ele.Ten };
      });
    let listMon1 = listMonFull
      .filter(
        (mon) => mon.listIdBoPhan?.indexOf(item.IdBoPhan) >= 0 || mon.isMonChung
      )
      ?.map((ele) => {
        return { value: ele.Id, label: ele.Ten };
      });
    setForm(idbophan, "IdBoPhan");
    onChange(item);

    if (
      item.IddmMon &&
      listMon1
        .map((ele) => {
          return ele.value;
        })
        .indexOf(item.IddmMon) === -1
    ) {
      setForm(null, "IddmMon");
      onChange(item);
    }
    if (item.listIddmLop && item.listIddmLop.length > 0) {
      let listIddmLop2 = listLop1.filter(
        (lop) => item.listIddmLop.indexOf(lop.value) !== -1
      );
      console.log(listLop1);
      console.log(listIddmLop2);
      console.log(item.listIddmLop);
      setForm(listIddmLop2, "listIddmLop");
    }
    onChange(item);
  };
  useEffect(() => {
    setOptionTheoKhoa();
  }, [opt, id, listLopFull, listMonFull, item.IdBoPhan]);

  const getMonByKhoa = (value) => {
    let arr = [];
    let child = listKhoa.filter((ele) => ele.Id === value)[0];
    arr.push(child.Id);
    if (child.BoPhanChaPkid !== 0)
      arr.push(listKhoa.filter((ele) => ele.Id === child.BoPhanChaPkid)[0].Id);
    let listNew = [];
    arr.map((ele) => {
      let temp = listMonFull
        .filter((x) => x.listIdBoPhan?.includes(ele) || x.isMonChung)
        .map((x) => {
          return { value: x.Id, label: x.Ten };
        });
      listNew = [...listNew, ...temp];
      return 1;
    });
    setListMon(listNew);
  };

  // NEW FILTER
  const [filterValue, setFilterValue] = useState("");
  const filterInputRef = useRef();
  const dropdownFilterTemplate = (options) => {
    let { filterOptions } = options;
    return (
      <div className="p-multiselect-filter-container">
        <InputText
          className="p-inputtext p-component p-multiselect-filter"
          value={filterValue}
          ref={filterInputRef}
          onChange={(e) => {
            myFilterFunction(e, filterOptions);
          }}
        />
      </div>
    );
  };

  const myFilterFunction = (event, options) => {
    let _filterValue = event.target.value;
    setFilterValue(_filterValue);
    options.filter(event);
  };
  // END FILTER

  return (
    <>
      <td className="text-center">{index + 1}</td>
      <td className="text-center">
        <Dropdown
          className="w-full p-inputtext-sm"
          value={item.TuTuan}
          options={listTuan}
          optionValue="value"
          optionLabel="label"
          onChange={(e) => {
            setForm(null, "ToiTuan");
            setWeekIsDisabled(e.value);
            setForm(e.value, "TuTuan");
          }}
          filter
          filterBy="value"
          placeholder="Chọn tuần"
        />
      </td>
      <td className="text-center">
        <Dropdown
          className="w-full p-inputtext-sm"
          value={item.ToiTuan}
          options={listTuan}
          optionValue="value"
          optionLabel="label"
          optionDisabled={(opt) => {
            return opt.value < weekIsDisabled;
          }}
          onChange={(e) => setForm(e.value, "ToiTuan")}
          filter
          filterBy="value"
          placeholder="Chọn tuần"
        />
      </td>
      <td className="text-center">
        <Dropdown
          className="w-full p-inputtext-sm"
          value={item.Thu}
          options={listDayOfWeek}
          optionValue="value"
          optionLabel="label"
          onChange={(e) => {
            setForm(e.value, "Thu");
          }}
          filter
          filterBy="value"
          placeholder="Chọn thứ"
        />
      </td>
      <td>
        <Dropdown
          className="w-full p-inputtext-sm"
          value={item.IdBoPhan}
          options={listKhoa.map((ele) => {
            return { value: ele.Id, label: ele.TenBoPhan };
          })}
          itemTemplate={dropdownOptionTemplate}
          onChange={(e) => {
            setValueLopMon(e.value);
            getMonByKhoa(e.value);
          }}
          filter
          showClear
          filterBy="TenBoPhan"
          placeholder="Chọn Khoa"
        />
      </td>
      <td>
        <MultiSelect
          className="p-inputtext-sm"
          placeholder="Chọn lớp"
          value={item.listIddmLop}
          itemTemplate={dropdownOptionTemplate}
          options={listLop}
          onChange={(e) => setForm(e.value, "listIddmLop")}
          filterTemplate={dropdownFilterTemplate}
          onShow={() => {
            filterInputRef && filterInputRef.current.focus();
          }}
          filter
          // showClear
        />
      </td>
      <td>
        <Dropdown
          className="w-full p-inputtext-sm"
          value={item.IddmPhongHoc}
          options={listPhongHoc}
          itemTemplate={dropdownOptionTemplate}
          onChange={(e) => setForm(e.value, "IddmPhongHoc")}
          filter
          showClear
          placeholder="Chọn phòng học"
        />
      </td>
      <td>
        <Dropdown
          className="w-full p-inputtext-sm"
          value={item.IddmMon}
          options={listMon}
          itemTemplate={dropdownOptionTemplate}
          onChange={(e) => setForm(e.value, "IddmMon")}
          filter
          showClear
          placeholder="Chọn môn"
        />
      </td>
      <td className="tc-w-120">
        <ChonTietItem
          listTietEdit={item.listChiTiet_TietHoc}
          listdmCa={listdmCa}
          listdmTiet={listdmTiet}
          onChange={(e) => onChangeTiet(e)}
        />
      </td>
      <td className="tc-w-80 text-right">{item.TongSoGio_LyThuyet}</td>
      <td className="tc-w-80 text-right">{item.TongSoGio_ThucHanh}</td>
      <td className="tc-w-80 text-right">{item.TongSoGio}</td>
      <td className="text-center">
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => {
            onDelete();
          }}
          aria-label="Search"
        />
      </td>

      <ConfirmDialog></ConfirmDialog>
    </>
  );
}

ThoiKhoaBieuItem.propTypes = {};

export default ThoiKhoaBieuItem;
