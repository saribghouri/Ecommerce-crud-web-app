import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/context";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
// import FontAwesomeIcon from "FontAwesomeIcon";
import { BsCardImage } from "react-icons/bs";

const Addproducts = () => {
  let { state, dispatch } = useContext(GlobalContext);
  let [toggleReload, setToggleReload] = useState(false);
  // const [imageSelected, setImageSelected] = useState("");
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      profilepic: "",
      // code: "",
      condition: "",
    },
    validationSchema: yup.object({
      name: yup
        .string("enter your product name")
        .min(3, "product name is too short")
        .required("product name is required"),
      description: yup.string("Enter your description"),
      price: yup
        .number("Enter a number")
        .moreThan(0, "price can not be zero")
        .required("price is required"),

      condition: yup
        .string("condition must be a string")
        .required("condition is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log(values);

      let formData = new FormData();

      formData.append("profilepic", values["profilepic"][0]);
      formData.append("name", values["name"]);
      formData.append("description", values["description"]);
      formData.append("price", values["price"]);
      formData.append("photo", values["photo"]);
      formData.append("userid", state.user?._id);
      console.log( state.user?._id)

      formData.append("condition", values["condition"]);
      axios({
        method: "post",
        url: `${state.baseUrl}/product`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
        .then((res) => {
          console.log("response: " + res.data);
          setToggleReload(!toggleReload);
          resetForm();
        })
        .catch((err) => {
          console.log("Error in api call: ", err);
        });
    },
  });

  return (
    <div className="parent">
      <h1 className="add-product">Add Product</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="font">
          <input
            multiple
            id="profilepic"
            accept="image/*,.pdgf"
            type="file"
            name="file"
            onChange={(e) => {
              var profilepic = document.getElementById("profilepic");

              var url = URL.createObjectURL(profilepic.files[0]);

              formik.handleChange({
                target: {
                  name: "profilepic",
                  value: e.target.files,
                },
              });
            }}
          />
          <i class="fa fa-image fa-2x icons"></i>
        </div>
        {/* <div id="img"></div> */}
        {formik.touched.profilepic && formik.errors.profilepic ? (
          <div className="errorMessage">{formik.errors.profilepic}</div>
        ) : null}

        <input
          id="name"
          name="name"
          placeholder="Name" 
          value={formik.values.name}
          onChange={formik.handleChange}
        />

        {formik.touched.name && formik.errors.name ? (
          <div className="errorMessage">{formik.errors.name}</div>
        ) : null}
        <br />
        <input
          id="description"
          name="description"
          placeholder="Description"
          type="text"
          value={formik.values.description}
          onChange={formik.handleChange}
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="errorMessage">{formik.errors.description}</div>
        ) : null}
        <br />
        <input
          id="price"
          name="price"
          placeholder="Price"
          type="number"
          value={formik.values.price}
          onChange={formik.handleChange}
        />
        {formik.touched.price && formik.errors.price ? (
          <div className="errorMessage">{formik.errors.price}</div>
        ) : null}
        <br />

        <select
          id="condition"
          name="condition"
          placeholder="condition"
          type="text"
          value={formik.values.condition}
          onChange={formik.handleChange}
        >
          <option value="">Condition</option>
          <option value="new">new</option>
          <option value="Used- like new"> Used- like new</option>
          <option value="used-good">used-good</option>

          <option value="new 3">used-fair</option>
        </select>
        {formik.touched.condition && formik.errors.condition ? (
          <div className="errorMessage">{formik.errors.condition}</div>
        ) : null}
        <br></br>
        <button className="submitbtn" type="submit">
          Submit
        </button>
      </form>

      <hr />
    </div>
  );
};

export default Addproducts;
