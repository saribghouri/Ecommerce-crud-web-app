import React, { useContext } from "react";
import { GlobalContext } from "../context/context";

const Payment = () => {
  let { state, dispatch } = useContext(GlobalContext);

  console.log(state, "dsagweg");

  const deleteCart = (items) => {
    let data = state.itemCart.filter((item) => item._id !== items._id);
    dispatch({
      type: "CART_ITEMS",
      payload: data,
    });
    localStorage.setItem("itemCart", JSON.stringify(data));
    console.log(items, "aehe");
  };

  function increment(items) {
    console.log(items);
    const newArr = state.itemCart.map((obj) => {
      if (obj._id === items._id) {
        return { ...obj, count: obj.count + 1 };
      }

      return obj;
    });
    console.log(newArr);
    dispatch({
      type: "CART_ITEMS",
      payload: newArr,
    });
  }

  function decrement(items) {
    console.log(items);
    if (items.count < 2) {
      //   items.count = 1;
      return;
    }
    const newArr = state.itemCart.map((obj) => {
      if (obj._id === items._id) {
        return { ...obj, count: obj.count - 1 };
      }

      return obj;
    });
    console.log(newArr);
    dispatch({
      type: "CART_ITEMS",
      payload: newArr,
    });
  }
  return (
    <div className="main-parent">
      {state.itemCart.map((item) => {
        return (
          <div className="carts">
            <div className="profilePictures">
              <img className="images" src={item.profilePicture} />
            </div>
            <div className="informations">
              <div className="price-name">
                <p className="prg-nams">{item.name}</p>
                <div className="prices">
                  <b>Rs: </b>
                  {item.price}
                </div>
              </div>

              <div className="conditions  ">{item.condition}</div>
              <div className="names">
                <p className="">
                  <i>{item.description}</i>
                </p>
              </div>
              <div className="parent"></div>

              <div className="parent">
                <div className="App">
                  <div className="button1" onClick={() => increment(item)}>
                    +
                  </div>
                  <div className="num">{item.count}</div>
                  <div className="button1" onClick={() => decrement(item)}>
                    -
                  </div>
                  <button className="buy-now">Buynow</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Payment;
