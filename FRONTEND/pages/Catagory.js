import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/catogory.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/spareParts/get_products/${categoryId}`
        );
        if (Array.isArray(response.data)) {
          setCategory(response.data);
        } else {
          console.log("No data");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/categories/get_cname/${categoryId}`
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCategoryName(response.data[0].name);
        } else {
          console.log("No data");
        }
      } catch (error) {
        console.error("Error fetching category name:", error);
      }
    };

    if (categoryId) {
      fetchProducts();
      fetchCategoryName();
    }
  }, [categoryId]);

  const handleImageClick = () => {
    navigate("/details");
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid category-title">{categoryName}</div>
      <div className="container card-container">
        {category.map((item, index) => (
          <div key={index} className="card">
            <img
              src={`data:image/png;base64,${item.image}`}
              className="card-img-top clickable-image"
              alt={item.name}
              onClick={handleImageClick}
            />
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <h4 className="">RS.{item.price}</h4>
              <a className="nav-link" href={`/View_Cart_item/${item._id}`}>
                <button className="btn btn-primary">View Product</button>
              </a>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Category;
