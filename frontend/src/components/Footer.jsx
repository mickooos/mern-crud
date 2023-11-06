import React from "react";
import foo from "../assets/css/Footer.module.css";

function Footer() {
  return (
    <div className={foo.footer}>
      <footer>
        <div className={foo.content}>
          <p>
            Created With <i className="bi bi-peace-fill"></i> By
            <a href="https://www.instagram.com/mickoandrnn/"> Micko Andrian.</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
