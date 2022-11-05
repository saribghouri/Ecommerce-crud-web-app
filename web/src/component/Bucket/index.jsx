import { React, useContext } from "react";
import { GlobalContext } from "../../context/context";
import "./index.css";
import { Link } from "react-router-dom";
const Bucket = () => {
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

  return (
    <>
      {state.itemCart.map((item) => {
        console.log(item);
        return (
          <div className="cart">
            <div className="profilePicture">
              <img className="image" src={item.profilePicture} />
            </div>
            <div className="names">
              <p className="prg-nam">{item.name}</p>
              <p className="">
                <i>{item.description}</i>
              </p>
            </div>
            <div className="parent">
              <div className="price">
                <b>Rs: </b>
                {item.price}
              </div>
              <div className="condition">{item.condition}</div>
            </div>
            <button className="but" onClick={() => deleteCart(item)}>
              X
            </button>
          </div>
        );
      })}
            <Link to="/Checkout">
              {" "}
      <button className="butt" onClick={() => deleteCart()}>Checkout</button>
            </Link>
    </>
  );
};

export default Bucket;
