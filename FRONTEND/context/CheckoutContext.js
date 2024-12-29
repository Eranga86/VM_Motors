// FRONTEND/frontend/src/context/CheckoutContext.js
import React, { createContext, useState, useContext } from "react";

const CheckoutContext = createContext();

export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider = ({ children }) => {
  const [isCheckoutStarted, setIsCheckoutStarted] = useState(false);

  const startCheckout = () => {
    console.log("Starting checkout");
    setIsCheckoutStarted(true);
  };
  const endCheckout = () => {
    console.log("Ending checkout");
    setIsCheckoutStarted(false);
  };

  console.log("Current checkout state:", isCheckoutStarted);

  return (
    <CheckoutContext.Provider
      value={{ isCheckoutStarted, startCheckout, endCheckout }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
