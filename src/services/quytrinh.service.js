import axiosClient from "./axiosClient.setup";
const { get, post } = axiosClient;

const kbgg = "KBGG/KhaiBaoGioGiang/";

export const QuyTrinhService = {
  KhaiBaoGioGiang: {
    GetList: (data) => {
      return post(kbgg + "GetListQuyTrinhKhaiBaoGioGiang", data);
    },
    TaoNhanh: (data) => {
      return post(kbgg + "TaoNhanhKhaiBaoGioGiang", data);
    },
    Set: (data) => {
      return post(kbgg + "SetQuyTrinhKhaiBaoGioGiang", data);
    },
    Get: (id) => {
      return get(kbgg + `GetQuyTrinhKhaiBaoGioGiang?IdQuyTrinh=${id}`);
    },
    GetNextSo: () => {
      return get(kbgg + `GetNextSoQuyTrinhKhaiBaoGioGiang`);
    },
    ChuyenTiep: (data) => {
      return post(kbgg + "ChuyenTiepQuyTrinhKhaiBaoGioGiang", data);
    },
    Huy: (data) => {
      return post(kbgg + "HuyQuyTrinhKhaiBaoGioGiang", data);
    },
    KhongDuyet: (data) => {
      return post(kbgg + "KhongDuyetQuyTrinhKhaiBaoGioGiang", data);
    },
    Delete: (id) => {
      return get(kbgg + `DeleteQuyTrinhKhaiBaoGioGiang?IdQuyTrinh=${id}`);
    },
  }
};
