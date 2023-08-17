import React, { createContext, useContext, useEffect, useState } from "react";
import cartService from "../../service/cartservice";
import { useAuthContext } from "./authcontext";

const initialCartDetails = {
  cartData: [],
  updateCart: () => {},
  emptyCart: () => {},
};

const cartContext = createContext(initialCartDetails);

export const CartWrapper = ({ children }) => {
  const authContext = useAuthContext();
  const [cartData, setCartData] = useState([]);

  const emptyCart = () => {
    setCartData([]);
  };

  
  const updateCart = (updatedCartList) => {
    console.log("called");
    if (updatedCartList) {
      setCartData(updatedCartList);
    } else if (authContext.user.id) {
      cartService.getList(authContext.user.id).then((res) => setCartData(res));
    }
  };

  useEffect(() => {
    updateCart();
    console.log("cartcontex");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.user.id]);

  const value = {
    cartData,
    emptyCart,
    updateCart,
  };
  return <cartContext.Provider value={value}>{children}</cartContext.Provider>;
};

export const useCartContext = () => {
  return useContext(cartContext);
};

