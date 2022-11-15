import { DanhMucService } from "../../services/danhmuc.service"


export const cLoaiPhuongTien = async () => {
    let data = await DanhMucService.PhuongTien.GetList();
    return data.Data.filter(x => x.TrangThai);
}

export const cLoaiXe = async () => {
    let data = await DanhMucService.LoaiXe.GetList();
    return data.Data.filter(x => x.TrangThai);
}

export const cChungCu = async () => {
    let data = await DanhMucService.ChungCu.GetList();
    return data.Data.filter(x => x.TrangThai);
}