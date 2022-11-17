import axiosClient from "./axiosClient.setup";
const { get, post } = axiosClient;

const dm = "QuanLyChiPhi/";

export const DanhMucService = {
    ChungCu: ServiceGeneratorKBGG('ChungCu'),
    LoaiDichVu: ServiceGeneratorKBGG('LoaiDichVu'),
    LoaiXe: ServiceGeneratorKBGG('LoaiXe'),
    PhuongTien: ServiceGeneratorKBGG('PhuongTien'),
    LoaiDongPhi: ServiceGeneratorKBGG('LoaiDongPhi'),
    CanHo: ServiceGeneratorKBGG('CanHo'),
    XeNgoai: ServiceGeneratorKBGG('XeNgoai'),
    QuanLyPhi: ServiceGeneratorKBGG('QuanLyPhi'),
};
function ServiceGeneratorKBGG(opt) {
    return {
        GetNextSo: () => {
            return get(dm + 'GetNextSoPhieu')
        },
        GetList: () => {
            return get(dm + 'GetList' + opt);
        },
        GetListFilter: (data) => {
            return post(dm + 'GetList' + opt, data);
        },
        Set: (data) => {
            return post(dm + 'Set' + opt, data)
        },
        Get: (id) => {
            return get(dm + 'Get' + opt + "?Id=" + id);
        },
        Delete: (id) => {
            return get(dm + 'Delete' + opt + "?Id=" + id)
        },
        TaoNhanhPhieu: (data) => {
            return post(dm + 'CreatePhieu', data);
        },
        Import: (filename, id) => {
            return get(dm + 'Import' + opt + "?FileName=" + filename + "&IdChungCu=" + id);
        },
        Export: (data) => {
            return post(dm + 'Export' + opt, data);
        }
    }
}
