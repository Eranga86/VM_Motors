import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/addtocart2.css";
import Visa from "../assests/visa.png";
import Amex from "../assests/amex.png";
import Debit from "../assests/debit.png";
import Debit2 from "../assests/debit2.png";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Addtocart2 = () => {
  const [cartItems, setCartItems] = useState([]);
  const [uId, setuId] = useState("");
  const userId = "6665bde883d0b1be9c618c55";
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/addToCart/cart-details/${userId}`)
      .then((response) => {
        console.log("cart_details:", response.data);
        if (Array.isArray(response.data)) {
          setCartItems(response.data);
          if (response.data.length > 0) {
            const initialItem = response.data[0];
            setuId(initialItem.userId);
          }
        } else {
          console.log("cart is empty");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [userId]);

  useEffect(() => {
    const tprice = cartItems.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
    setTotalPrice(tprice);
  }, [cartItems]);

  const handleIncrease = (productId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = (productId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Serialize the cart items array to a JSON string
    const serializedCartItems = JSON.stringify(cartItems);

    // Store the serialized cart items in session storage
    sessionStorage.setItem("cartItems", serializedCartItems);
    sessionStorage.setItem("totalPrice", totalPrice.toString());

    // Redirect to the checkout page
    window.location.href = "/proceedToCheckout";
  };

  const removeFromAddToCart = async (productId) => {
    try {
      const url = `http://localhost:3001/addToCart/cart_remove/${uId}/${productId}`;
      const response = await axios.delete(url);
      console.log("cart_removed_status:", response.data);
      setCartItems(cartItems.filter((item) => item.productId !== productId));
    } catch (error) {
      if (error.response) {
        console.error("Error removing item:", error.response.data);
      } else if (error.request) {
        console.error(
          "Error removing item: No response received",
          error.request
        );
      } else {
        console.error("Error removing item:", error.message);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="row">
          <div className="col-md-8 cart">
            <div className="title">
              <div className="row">
                <div className="col">
                  <h4>
                    <b>Shopping Cart</b>
                  </h4>
                </div>
              </div>
            </div>
            {Array.isArray(cartItems) && cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div className="row border-top border-bottom" key={index}>
                  <div className="row main align-items-center">
                    <div className="col-2">
                      <img
                        className="item-list-item-img"
                        src={`data:image/png;base64,${item.productImage}`}
                        alt="Base64 Image"
                      />
                    </div>
                    <div className="col">
                      <div className="row text-muted">
                        {item.productDescription}
                      </div>
                      <div className="row">{item.productName}</div>
                    </div>
                    <div className="col">
                      <button
                        id="decrease"
                        onClick={() => handleDecrease(item.productId)}
                      >
                        -
                      </button>
                      <span id="quantity">{item.quantity}</span>
                      <button
                        id="increase"
                        onClick={() => handleIncrease(item.productId)}
                      >
                        +
                      </button>
                    </div>
                    <div className="col">
                      {" "}
                      {item.productPrice} <span className="close"></span>
                    </div>
                    <div>
                      <a
                        href="#"
                        className="trash-link"
                        onClick={() => removeFromAddToCart(item.productId)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="cart_empty">Your cart is empty</div>
            )}
          </div>
          <div className="col-md-4 summary">
            <div>
              <h5>
                <b>Summary</b>
              </h5>
            </div>
            <hr />
            <div className="row">
              <div className="col" style={{ paddingLeft: 0 }}>
                ITEMS {cartItems.length}
              </div>
              <div className="col text-right"> Rs {totalPrice}</div>
            </div>
            <div
              className="row"
              style={{
                borderTop: "1px solid rgba(0,0,0,.1)",
                padding: "2vh 0",
              }}
            >
              <div className="col">TOTAL PRICE</div>
              <div className="col text-right">{totalPrice}</div>
            </div>
            <div
              className="row"
              style={{
                borderTop: "1px solid rgba(0,0,0,.1)",
                padding: "2vh 0",
              }}
            >
              <div className="col image-row" style={{ margin: 0 }}>
                <img src={Visa} alt="Visa" className="me-2" />
                <img src={Debit} alt="Debit" className="me-2" />
                <img src={Amex} alt="Amex" className="me-2" />
                <img src={Debit2} alt="Debit2" className="me-2" />
              </div>
            </div>
            <div className="button-container text-center">
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="totalPrice" value={totalPrice} />
                <input
                  type="hidden"
                  name="cartItems"
                  value={JSON.stringify(cartItems)}
                />
                <button type="submit">Checkout</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Addtocart2;
