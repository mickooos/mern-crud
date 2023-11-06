import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RequireAuth from './RequireAuth'
import PreventAuth from './PreventAuth'
import SignIn from '../views/auth/SignIn'
import SignUp from '../views/auth/SignUp'
import ProductList from '../views/ProductList'
import AddProduct from '../views/AddProduct'
import EditProduct from '../views/EditProduct'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Router() {
  return (
    <div className="mern">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PreventAuth>
                <SignIn />
              </PreventAuth>
            }
          />
          <Route
            path="/signup"
            element={
              <PreventAuth>
                <SignUp />
              </PreventAuth>
            }
          />
          <Route
            path="/product"
            element={
              <>
                <RequireAuth>
                  <Navbar />
                  <ProductList />
                  <Footer />
                </RequireAuth>
              </>
            }
          />
          <Route
            path="/add"
            element={
              <RequireAuth>
                <AddProduct />
              </RequireAuth>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <RequireAuth>
                <EditProduct />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Router
