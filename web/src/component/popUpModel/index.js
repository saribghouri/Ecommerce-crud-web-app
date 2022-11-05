import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../../context/context";
import { useState } from "react";
import "./index.css";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PopUpModel({
  openModal,
  setOpenModal,
  product,
  setProductToShow,
  setProducts,
}) {
  let { state, dispatch } = useContext(GlobalContext);
  let [editProduct, setEditProduct] = useState(null);
  console.log(editProduct, "editProduct");
  let [loading, setLoading] = useState(false);
  let [toggleReload, setToggleReload] = useState(false);
  let updateHandler = async (e) => {
    e.preventDefault();

    try {
      let updated = await axios.put(
        `${state.baseUrl}/product/${product?._id}`,
        {
          name: product.name,
          price: product.price,
          description: product.description,

          condition: product.condition,
        },
        {
          withCredentials: true,
        }
      );
      console.log("updated: ", updated.data);

      setToggleReload(!toggleReload);
      setEditProduct(null);
      setProducts((prev) =>
        prev.map((prod) =>
          prod?._id === product?._id ? { ...prod, ...product } : prod
        )
      );
    } catch (e) {
      console.log("Error in api call: ", e);
      setLoading(false);
    }
  };
  return (
    <div>
      <Modal
        open={openModal}
        onClose={setOpenModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-heading">
            <h1>update form</h1>
          </div>
          <div className="parent">
            <form className="update-parent" onSubmit={(e) => updateHandler(e)}>
              <div>
                Name:{" "}
                <input
                  type="text"
                  onChange={(e) => {
                    setProductToShow({ ...product, name: e.target.value });
                  }}
                  value={product.name}
                />{" "}
              </div>

              <div>
                Price:{" "}
                <input
                  type="text"
                  onChange={(e) => {
                    setProductToShow({ ...product, price: e.target.value });
                  }}
                  value={product.price}
                />{" "}
              </div>

              <div>
                Description:{" "}
                <input
                  type="text"
                  onChange={(e) => {
                    setProductToShow({
                      ...product,
                      description: e.target.value,
                    });
                  }}
                  value={product.description}
                />{" "}
              </div>

              <div>
                condition:{" "}
                <input
                  type="text"
                  onChange={(e) => {
                    setProductToShow({ ...product, condition: e.target.value });
                  }}
                  value={product.condition}
                />{" "}
              </div>
              <div>
                <button type="submit">Update </button>

                <div>
                <button onClick={setOpenModal}>Close</button>
                </div>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
