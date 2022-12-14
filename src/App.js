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
import { Dialog } from 'primereact/dialog';
import { Dropdown } from "primereact/dropdown";
import { cChungCu } from "./pages/common/apiservice";
import { useCookies } from 'react-cookie'
import { Button } from "primereact/button";

export const outContext = createContext();
function App() {
  const [cookies, setCookie] = useCookies(['access_chungcu'])
  const [chungCu, setChungCu] = useState([]);
  const [showNavBar, setShowNavBar] = useState(false)

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
  const onHide = () => {
    setShowNavBar(false)
  }

  useEffect(() => {
    getOptions();
  }, [])
  return (
    <>
      <div>
        <Dialog dismissableMask header="Menu" visible={showNavBar} position={"left"} modal style={{ width: '30vw', height: "100%" }} draggable={false} onHide={() => onHide()}
          resizable={false}>
          <Layout />
        </Dialog>
        <nav className="nav-bar d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center">
            <Button
              icon="pi pi-bars"
              className="p-button-sm"
              onClick={() => {
                setShowNavBar(true)
              }}
            />
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
                  placeholder="Ch???n chung c??"
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
        <nav  className="nav-bar-menu">
          <span className="nav-bar-span">Danh m???c</span>
          <Link className="nav-bar-menu-item" to="/danhmuc/chungcu">Chung c??</Link>
          <Link className="nav-bar-menu-item" to="/danhmuc/phuongtien">Ph????ng ti???n</Link>
          {/* <Link className="nav-bar-menu-item" to="/danhmuc/loaidongphi">Lo???i ????ng ph??</Link> */}
          <Link className="nav-bar-menu-item" to="/danhmuc/loaidichvu">Lo???i d???ch v???</Link>
          <Link className="nav-bar-menu-item" to="/danhmuc/loaixe">Lo???i xe</Link>
          <span className="nav-bar-span">Qu???n l?? c??n h???/xe ngo??i</span>
          <Link className="nav-bar-menu-item" to="/danhmuc/canho">C??n h???</Link>
          <Link className="nav-bar-menu-item" to="/danhmuc/xengoai">Xe ngo??i</Link>
          <span className="nav-bar-span">Qu???n l?? ????ng ph??</span>
          <Link className="nav-bar-menu-item" to="/quanlydongphi">Qu???n l?? ????ng ph??</Link>
          {/* <Link className="nav-bar-menu-item" to="/quytrinh/khaibaogiogiang">Khai b??o gi??? gi???ng</Link> */}
        </nav>
      </div>
    </>
  )
}

export const toastr = toast;
export default App;
