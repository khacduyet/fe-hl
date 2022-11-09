import React from "react";
import "./thucgianggiaovien.css";
import Loading from "../common/loading"

export default function TableThucGiangGiaoVien({ listBaoCao }) {
  let tuan = 0;
  if (listBaoCao != null && listBaoCao.length > 0) {
    let _tuan = parseInt(listBaoCao[0].ListTuans.length);
    tuan = _tuan;
  }
  let headerGroup = () => {
    return (
      <>
        <tr className="_sTrHeader">
          <td rowSpan={2}>STT</td>
          <td rowSpan={2}>Môn học</td>
          <td rowSpan={2}>Lớp</td>
          <td rowSpan={2}>Sĩ số trước</td>
          <td rowSpan={2}>Sĩ số sau</td>
          <td rowSpan={2}>LT/TH</td>
          <td colSpan={tuan}>Tuần</td>
          <td rowSpan={2}>Số giờ giảng</td>
          <td rowSpan={2}>Lý thuyết</td>
          <td rowSpan={2}>Thực hành</td>
          <td rowSpan={2}>Quy đổi thành giờ giảng</td>
          <td rowSpan={2}>Tổng số giờ giảng trong học kỳ</td>
          <td rowSpan={2}>Giờ tiêu chuẩn trong học kỳ</td>
          <td rowSpan={2}>Giờ vượt</td>
          <td rowSpan={2}>Giờ thiếu</td>
        </tr>
        <tr className="_sTrHeader">
          {[...Array(tuan)].map((ele, index) => {
            return (
              <>
                <td style={_td}>{index + 1}</td>
              </>
            );
          })}
        </tr>
      </>
    );
  };

  let bodyGroup = (item, index) => {
    return (
      <>
        <tr className="_sTrBody">
          <td rowSpan={2} style={{ fontWeight: "bold" }}>
            {index + 1}
          </td>
          <td rowSpan={2}>{item.TenMon}</td>
          <td rowSpan={2}>{item.TenLop}</td>
          <td rowSpan={2}>{item.SiSoTruoc}</td>
          <td rowSpan={2}>{item.SiSoSau}</td>
          <td>LT</td>
          {item.ListTuans.map((ele, index) => {
            return (
              <>
                <td>{ele.LyThuyet === 0 ? "" : ele.LyThuyet}</td>
              </>
            );
          })}
          <td rowSpan={2}>{item.SoGioGiang}</td>
          <td>{item.LyThuyet}</td>
          <td></td>
          <td rowSpan={2}>{item.QuyDoiGioGiang}</td>
          <td rowSpan={2}>{item.TongSoGioGiang}</td>
          <td rowSpan={2}>{item.GioTieuChuan}</td>
          <td rowSpan={2}>{item.GioVuot}</td>
          <td rowSpan={2}>{item.GioThieu}</td>
        </tr>
        <tr className="_sTrBody">
          <td>TH</td>
          {item.ListTuans.map((ele, index) => {
            return (
              <>
                <td>{ele.ThucHanh === 0 ? "" : ele.ThucHanh}</td>
              </>
            );
          })}
          <td></td>
          <td>{item.ThucHanh}</td>
        </tr>
      </>
    );
  };

  if (listBaoCao.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <table className="table table-bordered border-primary" id="myTable">
        <thead>{headerGroup()}</thead>
        <tbody>
          {listBaoCao.map((ele, index) => {
            return bodyGroup(ele, index);
          })}
        </tbody>
      </table>
    </>
  );
}

const _td = {
  width: "35px",
};
