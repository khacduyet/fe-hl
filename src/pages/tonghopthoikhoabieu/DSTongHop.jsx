import { useOutletContext } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { QuyTrinhService } from "../../services/quytrinh.service";
import { vnCalendar } from "../../services/const";
import { Dropdown } from "primereact/dropdown";
import "./dstonghop.css";
import Loading from "../common/loading";
import { DanhMucService } from "../../services/danhmuc.service";
import { _KI } from "../../services/const";

function DSTongHop() {
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
  const { toast } = useOutletContext();
  const [listQuyTrinh, setListQuyTrinh] = useState([]);
  const [listBoPhan, setListBoPhan] = useState([]);
  const [listdmCa, setListdmCa] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [title, setTitle] = useState("");
  const [listTeacher, setListTeacher] = useState([]);
  const [filter, setFilter] = useState({
    IdKhoa: 0,
    Keyword: "",
    Ki: "Ki_I",
    Nam: 2022,
  });
  const getList = useCallback(async () => {
    try {
      let $BoPhan = QuyTrinhService.DanhMuc.BoPhan();
      let $Ca = DanhMucService.CaHoc.GetList({});
      let $CurrentUser = QuyTrinhService.User.GetCurrent();
      let res = await Promise.all([$BoPhan, $Ca, $CurrentUser]);
      setListBoPhan([{ Id: 0, TenBoPhan: "Tất cả" }, ...res[0]]);
      // filter.IdKhoa === 0 ? (
      //   setFilter({ ...filter, IdKhoa: res[2].idBoPhan })
      // ) : (
      //   <></>
      // );
      let data = {
        ...filter,
      };
      let list = await QuyTrinhService.TongHop.Get(data);
      if (list) {
        // if (list.Error === 7) {
        //   toast.success(list.Detail);
        // } else {
        //   toast.error(list.Detail);
        // }
        if (list.Value === null) {
          setTitle(list.Detail);
          setHasData(false);
        }
        if (list.Value.listLop.length > 0) {
          setListQuyTrinh(list.Value);
          setHasData(true);
        } else {
          setTitle("Không có lớp học..");
          setHasData(false);
        }
        setIsLoading(false);
      }
      setListdmCa(res[1]);
    } catch (er) {
      console.log(er);
    }
  }, [filter]);
  useEffect(() => {
    getList();
  }, [filter]);
  const setFil = (e, key) => {
    let data = { ...filter };
    data[key] = e;
    setFilter({
      ...data,
    });
  };

  const getTeacherByKhoa = async (e) => {
    let data = {
      ...filter,
      IdKhoa: e,
    };
    let $teacher = await QuyTrinhService.TongHop.GetTeacher(data);
    if ($teacher.Value)
      setListTeacher(
        $teacher.Value.map((ele) => {
          return { value: ele.Id, label: ele.TenNhanVien };
        })
      );
  };

  useEffect(() => {
    getTeacherByKhoa(filter.IdKhoa);
  }, [filter.IdKhoa]);

  const table = () => {
    let height = window.innerHeight
    return (
      <>
        {/* <div className="Container Flipped" style={{ maxWidth: height + "px" }}> */}
        <div style={{ overflowY: "auto" }}>
          <table className="table table-bordered table-tong-hop">
            <thead>{headerTbl()}</thead>
            <tbody className="body-danh-sach">{bodyTbl()}</tbody>
          </table>
        </div>
      </>
    );
  };

  let headerTbl = () => {
    return (
      <>
        <tr className="font-bold text-xl line-height-4 h-7rem">
          <td rowSpan={2} className="text-center col-thu">
            Thứ
          </td>
          <td rowSpan={2} className="crossed col-ca">
            <span className="topPos">Lớp</span>
            <span className="botPos">Buổi</span>
          </td>
          {listQuyTrinh.listLop.map((ele) => {
            return (
              <td rowSpan={2} className="text-center col-items">
                {ele.TenLop}
              </td>
            );
          })}
        </tr>
      </>
    );
  };
  let bodyTbl = () => {
    return vnCalendar.dayNamesMin.map((ele, index) => {
      if (index === 0) return <></>;
      let totalMax = 0;
      let listThu = listQuyTrinh.listChiTiet.filter((x) => x.Thu === index);
      listdmCa.map((xl) => {
        let max = 0;
        listQuyTrinh.listLop.map((ele) => {
          let tempMax = listThu.filter(
            (x) => x.IdLop === ele.IdLop && x.IdCa === xl.Id
          ).length;
          if (max < tempMax) max = tempMax;
          return max;
        });
        totalMax += parseInt(max > 1 ? max + 1 : 1);
        return 1;
      });

      return (
        <>
          <tr>
            <td
              rowSpan={totalMax + 1}
              className="text-center font-bold col-thu"
            >
              {" "}
              {ele}
            </td>
          </tr>
          {rowThu(listThu)}
        </>
      );
    });
  };

  let rowThu = (listThu) => {
    return (
      <>
        {listdmCa.map((ele) => {
          let max = 0;
          let listCa = listThu.filter((x) => x.IdCa === ele.Id);
          listQuyTrinh.listLop.map((ele) => {
            let listHasLop = listCa.filter((x) => x.IdLop === ele.IdLop);
            if (max < listHasLop.length) max = listHasLop.length;
            return 1;
          });
          return (
            <>
              <tr>
                {max <= 1 && (
                  <td className="text-center font-bold col-ca">{ele.Ten}</td>
                )}
                {max > 1 && (
                  <td
                    rowSpan={max + 1}
                    className="text-center font-bold col-ca"
                  >
                    {ele.Ten}
                  </td>
                )}
                {max === 0 &&
                  listQuyTrinh.listLop.map((ele, i) => {
                    return <td className="col-items"></td>;
                  })}
                {max === 1 &&
                  [...Array(max)].map((x, index) => {
                    return listQuyTrinh.listLop.map((ele, i) => {
                      let listHasLop = listCa.filter(
                        (x) => x.IdLop === ele.IdLop
                      );
                      return (
                        <>
                          {listHasLop[index] ? (
                            monItem(listHasLop[index])
                          ) : (
                            <td className="col-items"></td>
                          )}
                        </>
                      );
                    });
                  })}
              </tr>
              {max > 1 &&
                [...Array(max)].map((x, index) => {
                  return (
                    <tr>
                      {listQuyTrinh.listLop.map((ele, i) => {
                        let listHasLop = listCa.filter(
                          (x) => x.IdLop === ele.IdLop
                        );
                        return (
                          <>
                            {listHasLop[index] ? (
                              monItem(listHasLop[index])
                            ) : (
                              <td className="col-items"></td>
                            )}
                          </>
                        );
                      })}
                    </tr>
                  );
                })}
            </>
          );
        })}
      </>
    );
  };

  let monItem = (item) => {
    return (
      <>
        <td className="col-items">
          <p>
            <b>Môn: </b> {item.TenMon}
          </p>
          <p>
            <b>Thời gian: </b> {item.ThoiGian}
          </p>
          <p>
            <b>Xưởng: </b> {item.Phong}
          </p>
          <p>
            <b>Giáo viên: </b> {item.GiaoVien}
          </p>
        </td>
      </>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container-haha">
        <div className="flex flex-row justify-content-between">
          <h1 className="section-heading">THỜI KHÓA BIỂU</h1>
          <div></div>
          <div className="flex flex-row gap-3">
            <Dropdown
              style={{ width: "200px" }}
              className="p-inputtext-sm mr-5"
              value={filter.IdUserGiaoVien}
              options={listTeacher}
              onChange={(e) => {
                setFil(e.value, "IdUserGiaoVien");
              }}
              filter
              filterBy="TenNhanVien"
              placeholder="Chọn giáo viên"
            />
            <Dropdown
              style={{ width: "200px" }}
              className="p-inputtext-sm mr-5"
              value={filter.IdKhoa}
              options={listBoPhan}
              optionValue="Id"
              optionLabel="TenBoPhan"
              onChange={(e) => {
                setFil(e.value, "IdKhoa");
                getTeacherByKhoa(e.value);
              }}
              filter
              filterBy="TenBoPhan"
              placeholder="Chọn khoa"
            />
            <Dropdown
              style={{ width: "200px" }}
              className="p-inputtext-sm mr-5"
              value={filter.Nam}
              options={listNam}
              onChange={(e) => {
                setFil(e.value, "Nam");
              }}
              placeholder="Chọn năm"
            />
            <Dropdown
              style={{ width: "200px" }}
              className="p-inputtext-sm mr-5"
              value={filter.Ki}
              options={listKy}
              onChange={(e) => {
                setFil(e.value, "Ki");
              }}
              placeholder="Chọn kỳ"
            />
          </div>
        </div>
      </div>
      {hasData && table()}
      {!hasData && <Loading message={title} />}
    </>
  );
}

export default DSTongHop;
