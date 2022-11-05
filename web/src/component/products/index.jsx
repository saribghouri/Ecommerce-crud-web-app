import { startTransition, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/context";
import axios from "axios";

import "./index.css";
import PopUpModel from "../popUpModel";

import { TfiPencilAlt } from "react-icons/tfi";
import { MdOutlineSnowshoeing } from "react-icons/md";
import { ImCart } from "react-icons/im";

let Products = () => {
  let { state, dispatch } = useContext(GlobalContext);
  let [products, setProducts] = useState([]);
  let [editProduct, setEditProduct] = useState(null);
  const [items, setItems] = useState([]);
  let [loading, setLoading] = useState(false);
  const [productToShow, setProductToShow] = useState(null);

  let [toggleReload, setToggleReload] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const OpenModal = (product) => {
    console.log("workinbg");
    setProductToShow(product);
    setOpenModal(true);
  };
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        let response = await axios({
          url: `${state.baseUrl}/products`,
          method: "get",
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log("response: ", response.data.data);

          setProducts(response.data.data.reverse());
          // setProducts(response.data.data);
        } else {
          console.log("error in api call");
        }
      } catch (e) {
        console.log("Error in api call: ", e);
      }
    };
    getAllProducts();
  }, [toggleReload]);

  let updateHandler = async (e) => {
    e.preventDefault();

    try {
      let updated = await axios.put(
        `${state.baseUrl}/product/${editProduct?._id}`,
        {
          profilepic: editProduct.profilepic,
          name: editProduct.name,
          price: editProduct.price,
          description: editProduct.description,

          condition: editProduct.condition,
        },
        {
          withCredentials: true,
        }
      );
      console.log("updated: ", updated.data);

      setToggleReload(!toggleReload);
      setEditProduct(null);
    } catch (e) {
      console.log("Error in api call: ", e);
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    if (!state.itemCart.some((a) => a._id == item._id)) {
      const cardItems = [...state?.itemCart, { ...item, count: 1 }];
      console.log(cardItems,"sdheheahae");
      dispatch({
        type: "CART_ITEMS",
        payload: cardItems,
      });
      localStorage.setItem("itemCart", JSON.stringify(cardItems));
    }
  };

  return (
    <div>
      <br></br>

      {editProduct !== null ? (
        <div className="parent">
          <h1>update form</h1>
          <form onSubmit={(e) => updateHandler(e)}>
            <input
              type="text"
              onChange={(e) => {
                setEditProduct({ ...editProduct, profilepic: e.target.value });
              }}
              value={editProduct.profilepic}
            />{" "}
            Name:{" "}
            <input
              type="text"
              onChange={(e) => {
                setEditProduct({ ...editProduct, name: e.target.value });
              }}
              value={editProduct.name}
            />{" "}
            <br />
            Price:{" "}
            <input
              type="text"
              onChange={(e) => {
                setEditProduct({ ...editProduct, price: e.target.value });
              }}
              value={editProduct.price}
            />{" "}
            <br />
            Description:{" "}
            <input
              type="text"
              onChange={(e) => {
                setEditProduct({ ...editProduct, description: e.target.value });
              }}
              value={editProduct.description}
            />{" "}
            <br />
            condition:{" "}
            <input
              type="text"
              onChange={(e) => {
                setEditProduct({ ...editProduct, condition: e.target.value });
              }}
              value={editProduct.condition}
            />{" "}
            <br />
            <button type="submit"> Proceed Update </button>
          </form>
        </div>
      ) : null}

      <div className="parant">
        {products?.map((eachProduct) => (
          <div className="product-parent" key={eachProduct?._id}>
            <div className="product-img">
              <img src={eachProduct?.profilePicture} />
            </div>
            <div className="information">
              <div className="inp-2">
                <h3 className="product-name">{eachProduct?.name}</h3>
                <div className="product-price">
                  <b>Rs: </b>
                  {eachProduct?.price}
                </div>
              </div>

              <div className="conditon">{eachProduct?.condition}</div>

              <div className="descri">{eachProduct?.description}</div>

              {eachProduct.userid == state.user?._id ? (
                <div class="btn-container">
                  <div
                    className="button"
                    onClick={async () => {
                      try {
                        setLoading(true);

                        let deleted = await axios.delete(
                          `${state.baseUrl}/product/${eachProduct?._id}`,
                          {
                            withCredentials: true,
                          }
                        );
                        console.log("deleted: ", deleted.data);
                        setLoading(false);

                        setToggleReload(!toggleReload);
                      } catch (e) {
                        console.log("Error in api call: ", e);
                        setLoading(false);
                      }
                    }}
                  >
                    <p className="btnText">delete</p>
                    <div className="btnTwo">
                      <p className="btnText2">X</p>
                    </div>
                  </div>

                  <div
                    className="button2"
                    onClick={() => OpenModal(eachProduct)}
                  >
                    <p className="btn2text">edit</p>
                    <div className="btn2">
                      <p className="btntext32">
                        <TfiPencilAlt />
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div class="btn-container">
                  <div
                    className="button"
                    onClick={() => addToCart(eachProduct)}
                  >
                    <p className="btnText">Add to Cart</p>
                    <div className="btnTwo">
                      <p className="btnText2">
                        <MdOutlineSnowshoeing />
                      </p>
                    </div>
                  </div>

                  <div
                    className="button2"
                    // onClick={() => OpenModal(eachProduct)}
                  >
                    <p className="btn2text">Buy Now</p>
                    <div className="btn2">
                      <p className="btntext32">
                        <ImCart />
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {openModal && (
        <PopUpModel
          openModal={openModal}
          setOpenModal={() => {
            setOpenModal(false);
            setProductToShow({});
          }}
          // editProduct
          setProducts={setProducts}
          setProductToShow={setProductToShow}
          product={productToShow}
          setItems={setItems}
        />
      )}
    </div>
  );
};

export default Products;
