import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import su from "../../assets/css/SignUp.module.css";
import authBg from "../../assets/img/auth-gradient.png";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPwd] = useState("");
  const [message, setErrMsg] = useState("");
  const navigate = useNavigate();

  const Register = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          `/v1/user/register`,
          {
            name: name,
            email: email,
            password: password,
            confPassword: confPassword,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          navigate("/");
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
      <section className={su.signUp}>
        <div className={su.contentBox}>
          <div className={su.formBox}>
            <h2>Sign Up</h2>
            <p className={su.errMsg}>{message}</p>
            <form onSubmit={Register}>
              <div className={su.inputBox}>
                <input
                  type="text"
                  placeholder="Name"
                  className={su.inputForm}
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={su.inputBox}>
                <input
                  type="email"
                  placeholder="Email"
                  className={su.inputForm}
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={su.inputBox}>
                <input
                  type="password"
                  placeholder="Password"
                  className={su.inputForm}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={su.inputBox}>
                <input
                  type="password"
                  placeholder="Password Confirmation"
                  className={su.inputForm}
                  value={confPassword}
                  onChange={(e) => setConfPwd(e.target.value)}
                />
              </div>
              <div className={su.signupBox}>
                <button type="submit" className={su.button}>
                  Daftar
                </button>
              </div>
              <div className={su.signinBox}>
                <p>Sudah Punya Akun ?</p>
                <Link to="/" className={su.signinLink}>
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div className={su.imageBox}>
          <img src={authBg} />
          <div className={su.overlayText}>
            <h1>mernCRUD.</h1>
            <p>Input semua Datamu!</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
