// FRONTEND/frontend/src/components/SearchResults.js
import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Footer from "./Footer";
import "../styles/search.css";

const SearchResults = () => {
  const location = useLocation();
  const results = location.state?.results || [];
  const { user, checkUserSession } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has just logged in
    const justLoggedIn = localStorage.getItem("justLoggedIn");
    if (justLoggedIn) {
      localStorage.removeItem("justLoggedIn");
      const itemToPurchase = localStorage.getItem("itemToPurchase");
      if (itemToPurchase) {
        localStorage.removeItem("itemToPurchase");
        navigate(`/View_Cart_item/${itemToPurchase}`);
      }
    }
  }, [navigate]);

  const handlePurchaseClick = (itemId) => {
    if (!user) {
      // Store the item ID before redirecting to login
      localStorage.setItem("itemToPurchase", itemId);
      navigate("/admin_login");
    } else {
      // User is logged in, proceed to purchase page
      navigate(`/View_Cart_item/${itemId}`);
    }
  };

  return (
    <div className="search-results">
      <div className="container">
        <h2 className="search-results-title">Search Results</h2>
        {results.length === 0 ? (
          <p className="no-results-message">No results found.</p>
        ) : (
          <div className="row">
            {results.map((result) => (
              <div key={result._id} className="col-md-4 mb-4">
                <div className="cards h-100 shadow-sm">
                  <img
                    src={`data:image/png;base64,${result.image}`}
                    alt={result.name}
                    className="cards-img-top"
                  />
                  <div className="cards-body">
                    <h5 className="cards-title">{result.name}</h5>
                    <p className="cards-text">{result.description}</p>
                    <p className="cards-price">Price: RS.{result.price}</p>
                    <button
                      className="btn btn-logins"
                      onClick={() => handlePurchaseClick(result._id)}
                    >
                      {user ? "Purchase" : "Login to Purchase"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
