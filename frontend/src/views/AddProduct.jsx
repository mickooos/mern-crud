import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ap from "../assets/css/AddProduct.module.css";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      await axios
        .get(`/v1/token`)
        .then((res) => {
          const token = res.data.accessToken;
          setAccessToken(token);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const list = [
    { id: 1, name: "Monitor" },
    { id: 2, name: "Keyboard" },
    { id: 3, name: "Mouse" },
    { id: 4, name: "Camera" },
    { id: 5, name: "Microphone" },
  ];

  const uploadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
  };

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
    return !!file;
  }, [file]);

  const formValid =
    name.trim() !== "" &&
    price.trim() !== "" &&
    categories !== "" &&
    description.trim() !== "" &&
    file !== "";

  const submitData = async (e) => {
    e.preventDefault();
    if (formValid) {
      const data = new FormData();
      data.append("name", name);
      data.append("price", price);
      data.append("categories", categories);
      data.append("desc", description);
      data.append("image", file);
      try {
        await axios
          .post(`/v1/products`, data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          })
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
    <section className={ap.addProduct}>
      <Link to="/product" className={ap.productRoute}>
        <i className="bi bi-arrow-left-circle"></i>
      </Link>
      <div className={ap.container}>
        <h1>
          add<span className={ap.titleSpan}>Product.</span>
        </h1>
        <p>Tambah Data Produk</p>
        <form onSubmit={submitData}>
          <div className={ap.row}>
            <div className={ap.column}>
              <label>Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {!nameValid && <p className={ap.errMsg}>*Name is required!</p>}
            </div>
            <div className={ap.column}>
              <label>Price</label>
              <input
                type="text"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {!priceValid && <p className={ap.errMsg}>*Price is required!</p>}
            </div>
          </div>
          <div className={ap.row}>
            <div className={ap.column}>
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
              {!catValid && <p className={ap.errMsg}>*Select Categories!</p>}
            </div>
          </div>
          <div className={ap.row}>
            <div className={ap.column}>
              <label>Image</label>
              <input type="file" id="image" onChange={uploadImage} />
              {!imgValid && <p className={ap.errMsg}>*Image is required!</p>}
            </div>
          </div>
          <div className={ap.row}>
            <div className={ap.column}>
              <label>Description</label>
              <textarea
                placeholder="Deskripsi Produk"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {!descValid && (
                <p className={ap.errMsg}>*Description is required!</p>
              )}
            </div>
          </div>
          <div className={ap.submit}>
            <button className={ap.btn} disabled={!formValid}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddProduct;
