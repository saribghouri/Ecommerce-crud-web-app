import { Link } from "react-router-dom";
import "./index.css";
import { useContext } from "react";
import { GlobalContext } from "../../context/context";
import axios from "axios";
import CustomizedInputBase from "../searchBar";
import { SiDassaultsystemes } from "react-icons/si";
import { BiLogOutCircle } from "react-icons/bi";
import { BsCart3 } from "react-icons/bs";

import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function NavBar() {
  let { state, dispatch } = useContext(GlobalContext);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const logoutHandler = async () => {
    try {
      let response = await axios.post(
        `${state.baseUrl}/logout
        
        `,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("response: ", response.data);

      dispatch({ type: "USER_LOGOUT" });
    } catch (e) {
      console.log("Error in api call: ", e);
    }
  };
  console.log(state?.itemCart.length);
  const length = state?.itemCart.length;
  return (
    <>
      <nav className="nav">
        <div className="logo">
          <SiDassaultsystemes />
        </div>

        <div>
          <CustomizedInputBase />
        </div>

        {state.isLogin === true ? (
          <ul className="ul">
            <Link to="/Bucket">
              {" "}
              <IconButton aria-label="cart">
                <StyledBadge
                  badgeContent={state?.itemCart.length}
                  color="secondary"
                >
                  <ShoppingCartIcon />
                </StyledBadge>
              </IconButton>
            </Link>
            <li className="my-Order">
              {" "}
              <Link to="/Myorder">My Order</Link>{" "}
            </li>

            <li className="my-products">
              {" "}
              <Link to="/ownProducts">own products</Link>{" "}
            </li>

            <li className="login-btn">
              {" "}
              <Link to="/create-ad">Add Product</Link>{" "}
            </li>
            <li className="login-btn">
              {" "}
              <Link to="/">Products</Link>{" "}
            </li>
            <li className="login-btn">
              {" "}
              <Link to="/profile">Profile</Link>{" "}
            </li>
            <li className="logout-btn">
              {" "}
              <BiLogOutCircle
                style={{ transform: "rotate(90deg)" }}
                className="logout"
                to="/login"
                onClick={logoutHandler}
              ></BiLogOutCircle>{" "}
            </li>
          </ul>
        ) : null}

        {state.isLogin === false ? (
          <ul>
            <li className="bucket">
              <Link to="/Bucket">
                {" "}
                <IconButton aria-label="cart">
                  <StyledBadge
                    badgeContent={state?.itemCart.length}
                    color="secondary"
                  >
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButton>
              </Link>
            </li>
            <li>
              {" "}
              <Link to="/login">Login</Link>{" "}
            </li>
            <li>
              {" "}
              <Link to="/signup">Signup</Link>{" "}
            </li>
          </ul>
        ) : null}
      </nav>
    </>
  );
}
