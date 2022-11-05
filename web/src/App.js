import "./App.css";

import NavBar from "./component/navbar";
import Profile from "./component/profile";
import Login from "./component/login";
import Signup from "./component/signup";
import Products from "./component/products";
import OwnProducts from "./component/ownProducts";
// import stripe from './component/paymentMethod/stripe';
import MyOrder from "./component/MyOrder";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useContext } from "react";
import { GlobalContext } from "./context/context";
import axios from "axios";
import backgroundImage from "./assets/background.webp";
import Addproducts from "./component/add products";
import Bucket from "./component/Bucket";
import Checkout from "./component/checkout";
import CheckoutSucess from "./component/Checkoutsuccess";

function App() {
  let { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    const getProfile = async () => {
      try {
        let response = await axios({
          url: `${state.baseUrl}/profile`,
          method: "get",
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log("response: ", response.data);
          dispatch({
            type: "USER_LOGIN",
            payload: response.data,
          });
        } else {
          dispatch({ type: "USER_LOGOUT" });
        }
      } catch (e) {
        console.log("Error in api call: ", e);
        dispatch({ type: "USER_LOGOUT" });
      }
    };
    getProfile();
  }, []);

  return (
    <Router>
      <NavBar />

      <Routes>
        {state.isLogin === true ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/MyOrder" element={<MyOrder />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Products />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-ad" element={<Addproducts />} />
            <Route path="/bucket" element={<Bucket />} />
            <Route path="/Checkout" element={<Checkout />} />
            <Route path="/Checkout-success" element={<CheckoutSucess />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/ownProducts" element={<OwnProducts />} />
          </>
        ) : null}
        {state.isLogin === false ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/Checkout" element={<Checkout />} /> */}
            <Route path="/bucket" element={<Bucket />} />
            <Route path="/" element={<Products />} />
            {/* <Route path="/ownProducts" element={<OwnProducts />} /> */}
            {/* <Route path="/Checkout" element={<Checkout />} /> */}
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </>
        ) : null}
        {state.isLogin === null ? (
          <>
            <Route
              path="*"
              element={
                <div className="loading">
                  <img src={backgroundImage} alt="" />
                  <div> LOADING... </div>
                </div>
              }
            />
          </>
        ) : null}
      </Routes>
    </Router>
  );
}

export default App;
