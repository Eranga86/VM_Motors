//FRONTEND/frontend/src/pages/Addtocart.js

import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { TailSpin } from "react-loader-spinner";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import "../styles/addtocart.css";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

const Addtocart = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [models, setModels] = useState([]);
  const [status, setStatus] = useState("");
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [selectedBusModel, setSelectedBusModel] = useState("");
  const { Id } = useParams();
  const { user } = useContext(UserContext);

  useEffect(() => {
    api
      .get(`/spareParts/${Id}`)
      .then((response) => {
        if (response.data) {
          setProduct(response.data);
          console.log("Product details:", response.data);
        } else {
          console.log("No data");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Id]);

  useEffect(() => {
    api
      .get(`/busModels/get`)
      .then((response) => {
        if (response.data) {
          setModels(response.data);
          console.log("Models:", response.data);
        } else {
          console.log("No data");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleCompatibilityCheck = () => {
    setShowCompatibilityModal(true);
  };

  const handleCloseCompatibilityModal = () => {
    setShowCompatibilityModal(false);
  };

  const handleBusModelChange = (event) => {
    setSelectedBusModel(event.target.value);
  };

  const getValues = (option) => {
    return option.split("|");
  };

  const addingToAddToCart = async () => {
    if (!product || !user) return;

    const { _id, name, description, price, image,categoryId
    } = product;

    const cartItem = {
      Id,
      userId: user.id,
      productId: _id,
      categoryId:categoryId,
      productImage: image,
      productName: name,
      productDescription: description,
      productPrice: price,
      quantity,
    };

    try {
      const response = await api.post("/addToCart/add", cartItem);
      console.log("Cart item added:", response.data);
      alert("Item added to cart successfully!");
    } catch (error) {
      if (error.response) {
        console.error("Error adding to cart:", error.response.data);
      } else if (error.request) {
        console.error(
          "Error adding to cart: No response received",
          error.request
        );
      } else {
        console.error("Error adding to cart:", error.message);
      }
    }
  };

  const handleCompatibilitySubmit = async () => {
    try {
      console.log("Product ID:", product._id);
      const response = await api.get(`/spareParts/${product._id}`);
      console.log("Compatibility response:", response.data);

      const compatibilityArray = response.data.compatibility.map(String); // Ensure IDs are strings
      const selectedValues = getValues(selectedBusModel);
      const selectedValue = selectedValues[1].toString(); // Ensure selected value is a string

      console.log("Compatibility array:", compatibilityArray);
      console.log("Selected value:", selectedValue);

      const newStatus = compatibilityArray.includes(selectedValue)
        ? "compatible"
        : "not compatible";

      setStatus(newStatus);
      alert(`Checking compatibility for ${selectedValues[0]}: ${newStatus}`);
      handleCloseCompatibilityModal();
    } catch (error) {
      if (error.response) {
        console.error("Error checking compatibility:", error.response.data);
      } else if (error.request) {
        console.error(
          "Error checking compatibility: No response received",
          error.request
        );
      } else {
        console.error("Error checking compatibility:", error.message);
      }
    }
  };

  return (
    <div>
      <div className="product-page">
        <section className="product-container">
          {product ? (
            <div key={product._id}>
              <div className="left-side">
                <img
                  src={`data:image/png;base64,${product.image}`}
                  style={{
                    width: "300px",        // Fixed width
                    height: "300px", }}
                  className="card-img-top clickable-image"
                  alt={product.name}
                />
              </div>
              <div className="right-side">
                <div className="spare-part-info">
                  <h3>{product.name}</h3>
                  <p>Price: Rs.{product.price}</p>
                  <p>{product.description}</p>
                </div>
                <hr />
                <div className="quantity-availability-section">
                  {quantity > 0 ? (
                    <div className="availability-icon">
                      <i className="fa fa-check-circle" aria-hidden="true"></i>{" "}
                      Available
                    </div>
                  ) : (
                    <div className="notavailability-icon">
                      <i
                        className="fa-solid fa-circle-xmark"
                        aria-hidden="true"
                      ></i>{" "}
                      Not Available
                    </div>
                  )}
                  <br />
                  <div className="quantity-selector">
                    <h6>Quantity:</h6>
                    <div className="quantity-box" onClick={decreaseQuantity}>
                      -
                    </div>
                    <div className="quantity-box middle-box">{quantity}</div>
                    <div className="quantity-box" onClick={increaseQuantity}>
                      +
                    </div>
                  </div>
                </div>
                <hr className="divider" />
                <div className="actions">
                  <button
                    className="compatibility-checker-btn"
                    onClick={handleCompatibilityCheck}
                  >
                    COMPATIBILITY CHECKER
                  </button>
                  <button
                    className="add-to-cart-btn"
                    onClick={addingToAddToCart}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="loading">
              <TailSpin color="#010428" height={200} width={200} />
            </div>
          )}
        </section>
        {showCompatibilityModal && (
          <div className="compatibility-modal">
            <div className="compatibility-modal-content">
              <span
                className="close-button"
                onClick={handleCloseCompatibilityModal}
              >
                &times;
              </span>
              <h3>Compatibility Checker</h3>
              <hr />
              <select onChange={handleBusModelChange} value={selectedBusModel}>
                {models.map((model, index) => (
                  <option key={index} value={`${model.name}|${model._id}`}>
                    {model.name}
                  </option>
                ))}
              </select>
              <br />
              <br />
              <button
                className="add-to-cart-btn"
                onClick={handleCompatibilitySubmit}
              >
                SUBMIT
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Addtocart;
