// FRONTEND/frontend/src/pages/Home.js
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import Slider from "../components/Slider";
import Banner from "../components/Banner";
import Itemlist from "../components/Itemlist";
import Footer from "../components/Footer";
import Parts from "../components/Parts";
import BrandBanner from "../components/BrandBanner";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, checkUserSession } = useContext(UserContext);

  useEffect(() => {
    const initializeHome = async () => {
      await checkUserSession();
      setIsLoading(false);
    };

    initializeHome();
  }, [checkUserSession]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <div>
      <Slider />
      <Banner />
      <br />
      <Itemlist />
      <Parts />
      <BrandBanner/>
      <Footer />
    </div>
  );
}
