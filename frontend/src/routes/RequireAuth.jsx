/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireAuth = (props, { path }) => {
  const isLogin = useSelector((state) => state.authData.isAuthenticated);
  if (isLogin == false) return <Navigate to="/" replace={true} />;

  return <Fragment>{props.children}</Fragment>;
};

export default RequireAuth;
