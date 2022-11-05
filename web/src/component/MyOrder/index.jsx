import { React, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/context";
import axios from "axios";
const MyOrder = () => {
  let { state, dispatch } = useContext(GlobalContext);
  let [myorders, setmyorders] = useState([]);
  const getMyOrders = async (id) => {
    try {
      let response = await axios({
        url: `${state.baseUrl}/myorders/${id}`,
        method: "get",

        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("response: => ", response.data);
        setmyorders(response.data);

        //   setProducts(response.data.data);
        // setProducts(response.data.data);
      } else {
        console.log("error in api call");
      }
    } catch (e) {
      console.log("Error in api call: ", e);
    }
  };
  useEffect(() => {
    if (state?.user?._id) {
      getMyOrders(state?.user?._id);
    }
  }, [state?.user?._id]);
  return (
    <div>
      {myorders?.itemCart?.map((item) => {
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
          </div>
        );
      })}
    </div>
  );
};

export default MyOrder;
