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
function App() {
  addLocale("vn", vnCalendar);
  const isLocal = () => {
    return window.location.origin.includes('localhost')
  }
  return (
    <>
      <div>
        {isLocal() && <Layout />}
        <Outlet context={{ toast }} />
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
          <Link style={_stl_item} to="/danhmuc/loaidongphi">Loại đóng phí</Link>
          <Link style={_stl_item} to="/danhmuc/loaidichvu">Loại dịch vụ</Link>
          <Link style={_stl_item} to="/danhmuc/loaixe">Loại xe</Link>
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