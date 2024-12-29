import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";
import Category from "./pages/Catogory";
import LoginAd from "./pages/LoginAd";
import SignUp from "./pages/SignupAdmin";
import AboutUs from "./pages/AboutUS";
import ContactUs from "./pages/ContactUs";
import Addtocart from "./pages/Addtocart";
import AddtoCart2 from "./pages/Addtocart2";
import Billing_form from "./pages/Billing_form";
import ResetPassword from "./pages/ResetPassword";
import SearchResults from "./components/SearchResults";
import { UserProvider } from "./context/UserContext";
import AuthWrapper from "./components/AuthWrapper";
import Navbar from "./components/Navbar";
import { CheckoutProvider } from "./context/CheckoutContext";
import { CartProvider } from "./context/CartContext";
import NotFound from "./components/NotFound";
import UserProfile from "./pages/UserProfile";
import Details from "./pages/Details";
import CRM_system from './pages/CRMSystem';
import Virtual_garage from './pages/VirtualGarage';
import Blog from './pages/Blog';
import Viewpost from "./pages/Viewpost";
import ViewMyPost from './pages/Viewmypost';
import Editpost from "./pages/Editpost";


function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <CheckoutProvider>
            <AuthWrapper>
              <div className="App">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/Category_item/:categoryId" element={<Category />} />
                  <Route path="/details/:itemId" element={<Details />} />
                  <Route path="/admin_login" element={<LoginAd />} />
                  <Route path="/sign_up" element={<SignUp />} />
                  <Route path="/about_us" element={<AboutUs />} />
                  <Route path="/contact_us" element={<ContactUs />} />
                  <Route path="/View_Cart_item/:Id" element={<Addtocart />} />
                  <Route path="/View_Cart/:itemId" element={<AddtoCart2 />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/proceedToCheckout" element={<Billing_form />} />
                  <Route path="/search-results" element={<SearchResults />} />
                  <Route path="/virtualGarage" element={<Virtual_garage />} />
                  <Route path="/CRM_System" element={<CRM_system />} />
                  <Route path="/Blog" element={<Blog />} />
                  <Route path="/Viewpost/:postId" element={<Viewpost />} />
                  <Route path="/ViewMyPost/:id" element={<ViewMyPost />} />
                  <Route path="/Editpost" element={<Editpost/>}/>
                  
                  <Route path="/reset-password/:userId/:resetString" element={<ResetPassword />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </AuthWrapper>
          </CheckoutProvider>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
