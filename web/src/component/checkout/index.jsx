import { React, useContext, useState } from "react";
import { GlobalContext } from "../../context/context";
import "./index.css";
import { Link } from "react-router-dom";
import Payment from "../payment";
import PaymentForm from "../paymentMethod";

const Checkout = () => {
  //
  let { state } = useContext(GlobalContext);
  console.log(state, "dsagweg");

  var add = state.itemCart.reduce((acc, obj) => {
    let count = obj.price * obj.count;
    return acc + count;
  }, 0);
  const [value, setvalue] = useState(false);
  return (
    <div className="main">
      {value == true ? <PaymentForm itemCart={state.itemCart} /> : <Payment />}

      <div>
        <div className="next-box">
          <div className="subtotal">
            <p>Subtotal</p>
            <p>{add}</p>
          </div>
          <div className="subtotal">
            <p>Total</p>
            <p>{add}</p>
          </div>
          <div>
            <p>
              Tax for the full value and fees will be calculated at checkout.
            </p>
          </div>
          <div className="btn-main">
            <button className="next-btn"
             onClick={() => {
              setvalue(false);
            }}
            >Back</button>
            <button
              onClick={() => {
                setvalue(true);
              }}
              className="next-btn"
            >
              next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
