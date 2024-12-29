// FRONTEND/frontend/src/components/Navbar.js
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import logo from "../assests/logo.jpeg";
import crm from "../assests/crm.png";
import "../styles/nav.css";
import debounce from "lodash.debounce";
import { TailSpin } from "react-loader-spinner";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [busModels, setBusModels] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { cart } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);

  // Check if we're on an auth page
  const isAuthPage =
    location.pathname === "/admin_login" || location.pathname === "/sign_up";

  // Fetch categories and bus models on mount
  useEffect(() => {
    const fetchCategoriesAndBusModels = async () => {
      try {
        const [categoriesRes, busModelsRes] = await Promise.all([
          api.get("/categories/get"),
          api.get("/busModels/get"),
        ]);
        setCategories(categoriesRes.data);
        setBusModels(busModelsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCategoriesAndBusModels();
  }, []);

  // Fetch products for hovered category
  useEffect(() => {
    if (hoveredCategory && !categoryProducts[hoveredCategory]) {
      api
        .get(`/spareParts/get_products/${hoveredCategory}`)
        .then((response) => {
          setCategoryProducts((prevState) => ({
            ...prevState,
            [hoveredCategory]: response.data,
          }));
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  }, [hoveredCategory, categoryProducts]);

  /*   const fetchCartCount = async () => {
    if (user) {
      try {
        const response = await api.get(`/addToCart/cart-details/${user.id}`);
        if (Array.isArray(response.data)) {
          setCartItemCount(response.data.length);
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartItemCount(0);
      }
    }
  };

  useEffect(() => {
    fetchCartCount();
    const updateCartCount = () => fetchCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, [user]);

  useEffect(() => {
    const updateCartCount = () => fetchCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, [user]); */

  // Handle search with debounce
  const handleSearch = useCallback(
    debounce(async (query) => {
      if (!query) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await api.get(`/api/search`, {
          params: { query },
        });
        navigate("/search-results", {
          state: { results: response.data, query },
        });
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryHover = (categoryId) => {
    setHoveredCategory(categoryId);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin_login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-red navbar-dark">
        <div className="wrapper"></div>
        <div className="container-fluid all-show">
          <a className="navbar-brand" href="#">
            <img src={logo} alt="logo" width="30" height="30" />
          </a>

          <a className="navbar-brand" href="#">
            V & M <br /> M O T O R S
          </a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
            <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#"></a>
              </li>

              <li className="nav-item">
                <b>
                  <Link className="nav-link" to="/">
                    HOME
                  </Link>
                </b>
              </li>

              <li className="nav-item">
                <a className="nav-link">
                  <b>SPARE PARTS</b>
                </a>
                <ul className="submenu">
                  {categories.map((category) => (
                    <li
                      className="nav-item"
                      key={category._id}
                      onMouseEnter={() => handleCategoryHover(category._id)}
                      onMouseLeave={handleCategoryLeave}
                    >
                      <a
                        className="nav-link"
                        href={`/Category_item/${category._id}`}
                      >
                        {category.name}
                      </a>

                      {hoveredCategory === category._id && (
                        <ul className="submenu2">
                          {(categoryProducts[category._id] || []).map(
                            (product) => (
                              <li className="nav-item" key={product._id}>
                                <a
                                  className="nav-link"
                                  href={`/View_Cart_item/${product._id}`}
                                >
                                  {product.name}
                                </a>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </li>

              <li className="nav-item">
                <b>
                  <Link className="nav-link" to="/about_us">
                    ABOUT US
                  </Link>
                </b>
              </li>

              <li className="nav-item">
                <b>
                  <Link to="/contact_us" className="nav-link">
                    CONTACT US
                  </Link>
                </b>
              </li>

              <div className="search-container">
                <form onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    placeholder="Search.."
                    id="search-input"
                    name="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <button type="submit" id="search-button" name="search-button">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </form>
              </div>
            </ul>

            {user ? (
              <>
                <Link to="/CRM_System" style={{ marginRight: "20px" }}>
                  <img
                    className="crm-icon"
                    src={crm}
                    width="50"
                    height="50"
                    alt=""
                  />
                </Link>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.name}
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/View_Cart/${user.id}`}
                      >
                        Cart ({cart?.items?.length || 0})
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <button type="button" className="lbutton">
                <Link to="/admin_login">Login</Link>
              </button>
            )}
          </div>
        </div>
      </nav>
      {isLoading && (
        <div className="loading">
          <TailSpin color="#010428" height={200} width={200} />
        </div>
      )}
    </div>
  );
}
