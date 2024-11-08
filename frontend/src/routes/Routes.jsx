import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/slices/authSlice";
import SignIn from "../views/auth/SignIn";
import SignUp from "../views/auth/SignUp";
import ProductList from "../views/ProductList";
import AddProduct from "../views/AddProduct";
import EditProduct from "../views/EditProduct";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Router() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.authData.isAuthenticated
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <>
          <div className="flex">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/product" element={<ProductList />} />
                <Route path="/add" element={<AddProduct />} />
                <Route path="/edit/:id" element={<EditProduct />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default Router;
