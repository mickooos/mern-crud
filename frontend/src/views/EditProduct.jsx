import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import ep from "../assets/css/EditProduct.module.css";

function EditProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const { id } = useParams();
  const axiosINT = axios.create();
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getProductById();
  }, []);

  const refreshToken = async () => {
    try {
      await axios.get(`/v1/token`).catch((err) => {
        console.log(err.response.data.message);
      });
    } catch (error) {
      console.log(error);
    }
  };

  axiosINT.interceptors.request.use(
    async (config) => {
      const response = await axios.get(`/v1/token`);
      const token = response.data.accessToken;
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getProductById = async () => {
    try {
      const response = await axiosINT.get(`/v1/products/${id}`);
      setName(response.data.products.name);
      setPrice(response.data.products.price);
      setCategories(response.data.products.categories);
      setDescription(response.data.products.desc);
      setImage(response.data.products.image);
    } catch (error) {
      console.log(error);
    }
  };

  const getImage = (img) => {
    return new URL(`../uploads/${img}`, import.meta.url).href;
  };

  const uploadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
  };

  const list = [
    { id: 1, name: "Monitor" },
    { id: 2, name: "Keyboard" },
    { id: 3, name: "Mouse" },
    { id: 4, name: "Camera" },
    { id: 5, name: "Microphone" },
  ];

  const nameValid = useMemo(() => {
    return !!name;
  }, [name]);
  const priceValid = useMemo(() => {
    return !!price;
  }, [price]);
  const catValid = useMemo(() => {
    return !!categories;
  }, [categories]);
  const descValid = useMemo(() => {
    return !!description;
  }, [description]);
  const imgValid = useMemo(() => {
    return !!image;
  }, [image]);

  const formValid =
    name !== "" &&
    price !== "" &&
    categories !== "" &&
    description !== "" &&
    image !== "";

  const updateData = async (e) => {
    e.preventDefault();
    if (formValid) {
      const data = new FormData();
      data.append("name", name);
      data.append("price", price);
      data.append("categories", categories);
      data.append("desc", description);
      data.append("oldImage", image);
      data.append("image", file);
      try {
        await axiosINT
          .put(`/v1/products/${id}`, data)
          .then((res) => {
            navigate("/product");
            console.log(res.data.message);
          })
          .catch((err) => {
            console.log(err.response.data.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <section className={ep.editProduct}>
      <Link to="/product" className={ep.productRoute}>
        <i className="bi bi-arrow-left-circle"></i>
      </Link>
      <div className={ep.container}>
        <h1>
          edit<span className={ep.titleSpan}>Product.</span>
        </h1>
        <p>Ubah Data Produk</p>
        <form onSubmit={updateData}>
          <div className={ep.row}>
            <div className={ep.column}>
              <label>Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {!nameValid && <p className={ep.errMsg}>*Name is required!</p>}
            </div>
            <div className={ep.column}>
              <label>Price</label>
              <input
                type="text"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {!priceValid && <p className={ep.errMsg}>*Price is required!</p>}
            </div>
          </div>
          <div className={ep.row}>
            <div className={ep.column}>
              <label>Category</label>
              <select
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
              >
                <option disabled value="">
                  -- Pilih Kategori Produk --
                </option>
                {list.map((c) => {
                  return <option key={c.id}>{c.name}</option>;
                })}
              </select>
              {!catValid && <p className={ep.errMsg}>*Select Categories!</p>}
            </div>
          </div>
          <div className={ep.row}>
            <div className={ep.column}>
              <label>Description</label>
              <textarea
                placeholder="Deskripsi Produk"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {!descValid && (
                <p className={ep.errMsg}>*Description is required!</p>
              )}
            </div>
          </div>
          <div className={ep.row}>
            <div className={ep.column}>
              <label>Image</label>
              <div className={ep.image}>
                <img src={getImage(image)} alt="" className={ep.productImage} />
              </div>
              <input type="file" id="image" onChange={uploadImage} />
              {!imgValid && <p className={ep.errMsg}>*Image is required!</p>}
            </div>
          </div>
          <div>
            <button className={ep.btn}>Edit</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditProduct;
