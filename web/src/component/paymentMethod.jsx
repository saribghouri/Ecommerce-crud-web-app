import React, { useMemo, useState, useEffect } from "react";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import "../index.css";

import { GlobalContext } from "../context/context";

import axios from "axios";
import { useContext } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

function useResponsiveFontSize() {
  const getFontSize = () => (window.innerWidth < 450 ? "16px" : "18px");
  const [fontSize, setFontSize] = useState(getFontSize);

  useEffect(() => {
    const onResize = () => {
      setFontSize(getFontSize());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return fontSize;
}

const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    [fontSize]
  );

  return options;
};

const PaymentMethod = (itemCart) => {
  let { state, dispatch } = useContext(GlobalContext);

  console.log("state", state);

  const handleCheckout = async (event) => {
    // event.preventDefault();
    // console.log(itemCart, "itemCart");
    // console.log(event, "event");
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (!error) {
      const { id } = paymentMethod;
      try {
        const data = await axios.post(
          `${state.baseUrl}/create-checkout-session`,
          {
            id,
            amount: state.itemCart.reduce((acc, obj) => {
              let count = obj.price * obj.count;
              return acc + count;
            }, 0),
            user_id: state.user._id,
            itemCart: state.itemCart,
          },
          {
            withCredentials: true,
            header: {
              "access-Control-Allow-Origin": "*",
              "Context-Type": "application/json",
            },
          }
        );
      } catch (e) {
        // console.log(data);
        console.log(e);
      }
    }
  };

  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  return (
    <>
      <div className="purchase-parent">
        <div className="payment-parent">
          <h3>payment</h3>
          <div className="payment-card">
            <div className="CreditCardIcon">
              <CreditCardIcon className="credit" />
              Enter credit or debit card
            </div>
            <div>
              <hr />
              <h4>eCommerce Pay</h4>
              <hr />

              <form className="card-form" onSubmit={handleCheckout}>
                <CardElement
                  className=""
                  options={options}
                  onReady={() => {
                    console.log("CardElement [ready]");
                  }}
                  onChange={(event) => {
                    console.log("CardElement [change]", event);
                  }}
                />
              </form>
              <button
                className="purchase"
                type="submit"
                disabled={!stripe}
                onClick={handleCheckout}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PaymentMethod;
