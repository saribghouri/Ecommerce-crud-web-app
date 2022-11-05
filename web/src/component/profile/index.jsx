import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/context";
import axios from "axios";

let Profile = () => {
  let { state, dispatch } = useContext(GlobalContext);
  let [loading, setLoading] = useState(false);
  let [toggleReload, setToggleReload] = useState(false);
  const [fname, setfName] = useState(state?.user.firstName);
  const [lname, setlName] = useState(state?.user.lastName);
  let [email, setEmail] = useState(state.user?.email);
  const [address, setAddress] = useState(state.user?.address);

  let updateHandler = async (e) => {
    e.preventDefault();
    console.log(
      "🚀 ~ file: index.jsx ~ line 37 ~ updateHandler ~ updateHandler"
    );

    console.log("🚀 ~ file: index.jsx ~ line 28 ~ updateHandler ~ ", {
      firstName: fname,
      lastName: lname,
      address: address,
    });

    try {
      let updated = await axios.put(
        `${state.baseUrl}/profile/${state?.user?._id}`,
        {
          firstName: fname,
          lastName: lname,
          address: address,
        },

        {
          withCredentials: true,
        }
      );
      console.log("user=== ", updated.data);

      setToggleReload(!toggleReload);
    } catch (e) {
      console.log("Error in api call: ", e);
      setLoading(false);
    }
  };
  return (
    <div className="parent">
      <h1 className="add-product">EDIT PROFILE</h1>
      <form onSubmit={updateHandler}>
        <div className="font"></div>
        <input
          id="name"
          name="name"
          value={fname}
          placeholder="FirstName"
          onChange={(e) => {
            setfName(e.target.value);
          }}
        />{" "}
        <br />
        <input
          id="description"
          name="LastName"
          value={lname}
          placeholder="LastName"
          type="text"
          onChange={(e) => {
            setlName(e.target.value);
          }}
        />{" "}
        <br />
        <input
          id="description"
          name="LastName"
          value={email}
          placeholder="email"
          type="text"
          disabled
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />{" "}
        <br />
        <input
          id="price"
          name="price"
          value={address}
          placeholder="Address"
          type="text"
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />{" "}
        <br />
        <button className="submitbtn" type="submit">
          Submit
        </button>
      </form>

      <hr />
    </div>
  );
};

export default Profile;
