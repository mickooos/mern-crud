import { useState } from "react";
import { useDispatch } from "react-redux";
import { logIn } from "../../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import si from "../../assets/css/SignIn.module.css";
import authBg from "../../assets/img/auth-gradient.png";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setErrMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const Login = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          `/v1/user/login`,
          { email: email, password: password },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          dispatch(logIn());
          navigate("/product");
          console.log(res.data.message);
        })
        .catch((err) => {
          setErrMsg(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <section className={si.signIn}>
        <div className={si.imageBox}>
          <img src={authBg} />
          <div className={si.overlayText}>
            <h1>mernCRUD.</h1>
            <p>Input semua Datamu!</p>
          </div>
        </div>
        <div className={si.contentBox}>
          <div className={si.formBox}>
            <h2>Sign In</h2>
            <p className={si.errMsg}>{message}</p>
            <form onSubmit={Login}>
              <div className={si.inputBox}>
                <input
                  type="email"
                  placeholder="Email"
                  className={si.inputForm}
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={si.inputBox}>
                <input
                  type="password"
                  placeholder="Password"
                  className={si.inputForm}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={si.signinBox}>
                <button type="submit" className="button">
                  masuk
                </button>
              </div>
              <div className={si.signupBox}>
                <p>Belum Punya Akun ?</p>
                <Link to="/signup" className={si.signupLink}>
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignIn;
