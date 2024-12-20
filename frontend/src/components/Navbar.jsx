import { useDispatch } from "react-redux";
import { logOut } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import nav from "../assets/css/Navbar.module.css";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = async () => {
    try {
      await axios
        .delete(`/v1/user/logout`)
        .then((res) => {
          dispatch(logOut());
          navigate("/");
          console.log(res.data.message);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <nav className={nav.navbar}>
        <a href="#" className={nav.navbarLogo}>
          mern<span>CRUD.</span>
        </a>
        <div className={nav.navbarNav}>
          <button className={nav.exitRoute} onClick={signOut}>
            <i className="bi bi-box-arrow-in-right" />
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
