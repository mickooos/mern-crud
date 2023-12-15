import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import prod from "../assets/css/Product.module.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const axiosINT = axios.create();

  useEffect(() => {
    accessToken();
    getProducts();
  }, []);

  const accessToken = async () => {
    try {
      await axios
        .get(`/v1/token`)
        .then((res) => {
          const access_token = res.data.accessToken;
          const decoded = jwtDecode(access_token);
          setToken(access_token);
          setUser(decoded.name);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  axiosINT.interceptors.request.use(
    async (config) => {
      const response = await axios.get(`/v1/token`);
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUser(decoded.name);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getProducts = async () => {
    try {
      await axiosINT
        .get(`/v1/products`)
        .then((res) => {
          setProducts(res.data.products);
          setFilteredProducts(res.data.products);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getImage = (img) => {
    return new URL(`../uploads/${img}`, import.meta.url).href;
  };

  const handleQuery = (e) => {
    const search = e.target.value;
    setQuery(search);
    //  Filter Items
    const filterItems = products.filter((i) =>
      i.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filterItems);
  };

  const deleteProduct = async (id) => {
    try {
      await axiosINT
        .delete(`/v1/products/${id}`)
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
      getProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <section className={prod.product}>
        <h2>
          Product <span>List</span>
        </h2>
        <div className={prod.user}>
          <h5>Selamat Datang, {user}</h5>
        </div>
        <div>
          <input
            type="text"
            className={prod.searchBox}
            placeholder="Search"
            value={query}
            onChange={handleQuery}
          />
        </div>
        <Link to="/add" className={prod.addRoute}>
          Tambah Produk
        </Link>

        <div>
          {filteredProducts.length === 0 ? (
            <div>
              <p className={prod.dataNotFound}>Sorry, Data Not Found :(</p>
            </div>
          ) : (
            <div className={prod.wrapper}>
              <div className={prod.row}>
                {filteredProducts.map((p) => {
                  return (
                    <div className={prod.card} key={p.productId}>
                      <div className={prod.cardImg}>
                        <img src={getImage(p.image)} />
                      </div>
                      <div className={prod.cardContent}>
                        <div className={prod.cardText}>
                          <h3>{p.name}</h3>
                          <p>Rp. {p.price}</p>
                          <p>{p.categories}</p>
                        </div>
                        <div className={prod.cardDesc}>
                          <p>{p.desc}</p>
                        </div>
                      </div>
                      <Link
                        to={`/edit/${p.productId}`}
                        className={prod.editRoute}
                      >
                        Edit Produk
                      </Link>
                      <a
                        className={prod.delete}
                        onClick={() => deleteProduct(p.productId)}
                      >
                        Hapus Produk
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductList;
