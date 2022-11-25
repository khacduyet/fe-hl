import "./App.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css"; //theme
import { Link } from "react-router-dom";
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import { addLocale } from "primereact/api";
import { ToastContainer, toast } from "react-toastify";
import { vnCalendar } from "./services/const";
import { createContext, useContext, useEffect, useState } from "react";
import { Menubar } from 'primereact/menubar';
import { Dropdown } from "primereact/dropdown";
import { cChungCu } from "./pages/common/apiservice";
import { useCookies } from 'react-cookie'

export const outContext = createContext();
function App() {
  const [cookies, setCookie] = useCookies(['access_chungcu'])
  const [chungCu, setChungCu] = useState([]);

  addLocale("vn", vnCalendar);
  const isLocal = () => {
    return window.location.origin.includes('localhost')
  }

  const getOptions = async () => {
    let $chungcu = await cChungCu();
    if ($chungcu) {
      setChungCu($chungcu.sort((a, b) => a.Ma > b.Ma ? 1 : -1));
      changeCC($chungcu[0].Id)
    }
  }

  const changeCC = (e) => {
    if (e === undefined) {
      let expires = new Date()
      expires.setTime(expires.getTime() + (300000 * 1000))
      setCookie('access_chungcu', null, { path: '/', expires })
    } else {
      let expires = new Date()
      expires.setTime(expires.getTime() + (300000 * 1000))
      setCookie('access_chungcu', e, { path: '/', expires })
    }
  }

  useEffect(() => {
    getOptions();
  }, [])
  return (
    <>
      <div>
        {isLocal() && <Layout />}
        <nav className="nav-bar d-flex justify-content-between align-items-center bg-white border-bottom shadow-sm">
          <div className="d-flex justify-content-between align-items-center">
            <button>ABC</button>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex justify-content-between align-items-center">
              <div className="">
                <Dropdown
                  className="w-full input-text"
                  value={cookies['access_chungcu']}
                  options={chungCu?.map((x) => {
                    return { label: x.Ten, value: x.Id };
                  })}
                  onChange={(e) => {
                    changeCC(e.target.value)
                  }}
                  style={{ minWidth: "200px" }}
                  filter
                  filterBy="label"
                  placeholder="Chọn chung cư"
                />
              </div>
            </div>
          </div>
        </nav>
        <outContext.Provider value={cookies}>
          <Outlet context={{ toast }} />
        </outContext.Provider>
      </div>
      <ToastContainer
        pauseOnFocusLoss={false}
        hideProgressBar="true"
        theme="colored"
      />
      <br></br>
    </>
  );
}


function Layout() {
  return (
    <>
      <div>
        <h1>Menu in localhost!</h1>
        <nav style={_stl}>
          <Link style={_stl_item} to="/danhmuc/chungcu">Chung cư</Link>
          <Link style={_stl_item} to="/danhmuc/phuongtien">Phương tiện</Link>
          {/* <Link style={_stl_item} to="/danhmuc/loaidongphi">Loại đóng phí</Link> */}
          <Link style={_stl_item} to="/danhmuc/loaidichvu">Loại dịch vụ</Link>
          <Link style={_stl_item} to="/danhmuc/loaixe">Loại xe</Link>
          <Link style={_stl_item} to="/danhmuc/canho">Căn hộ</Link>
          <Link style={_stl_item} to="/danhmuc/xengoai">Xe ngoài</Link>
          <Link style={_stl_item} to="/quanlydongphi">Quản lý đóng phí</Link>
          {/* <Link style={_stl_item} to="/quytrinh/khaibaogiogiang">Khai báo giờ giảng</Link> */}
        </nav>
      </div>
    </>
  )
}

export const toastr = toast;
export default App;

const _stl = {
  display: "flex",
}
const _stl_item = {
  border: "1px solid #000",
  backgroundColor: "#ccc",
  textAlign: "center",
  width: "12em"
}