import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter, Routes, Route } from "react-router-dom";

import DanhMucChungCu from "./pages/danhmuc/DanhMucChungCu";
import DanhMucPhuongTien from "./pages/danhmuc/DanhMucPhuongTien";
import DanhMucLoaiDongPhi from "./pages/danhmuc/DanhMucLoaiDongPhi";
import DanhMucLoaiDichVu from "./pages/danhmuc/DanhMucLoaiDichVu";
import DanhMucLoaiXe from "./pages/danhmuc/DanhMucLoaiXe";
import QuanLyDanCu from "./pages/quanlydancu";
import XeNgoai from "./pages/quanlydancu/XeNgoai";
import QuanLyDongPhi from "./pages/quanlydongphi";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/danhmuc/chungcu" element={<DanhMucChungCu />} />
        <Route path="/danhmuc/phuongtien" element={<DanhMucPhuongTien />} />
        <Route path="/danhmuc/loaidongphi" element={<DanhMucLoaiDongPhi />} />

        <Route path="/danhmuc/loaidichvu" element={<DanhMucLoaiDichVu />} />
        <Route path="/danhmuc/loaixe" element={<DanhMucLoaiXe />} />
        <Route path="/danhmuc/canho" element={<QuanLyDanCu />} />
        <Route path="/danhmuc/xengoai" element={<XeNgoai />} />
        <Route path="/quanlydongphi" element={<QuanLyDongPhi />} />

        {/* <Route path="/quytrinh/khaibaogiogiang" element={<DSKhaiBaoGioGiang />} />
        <Route path="/quytrinh/khaibaogiogiang/:opt/:id" element={<CTKhaiBaoGioGiang />} /> */}
      </Route>
    </Routes>
  </HashRouter>
  // </React.StrictMode>
);
