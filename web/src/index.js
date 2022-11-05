import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { loadStripe } from "@stripe/stripe-js";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import ContextProvider from "./context/context";
import { Elements } from "@stripe/react-stripe-js";
const root = ReactDOM.createRoot(document.getElementById("root"));

const stripePromise = loadStripe(
  "pk_test_51LyD94FhTQ9tKGOUjPLzW9KqfZ5qGt4dBzYqvN0wF5Fcw9TgzaZ5eWGfc8SJNe9CkdHLQ5T2wCINxzcSbvvGISzk00f2hXhiDA"
);

root.render(
  <React.StrictMode>
    <ContextProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </ContextProvider>
  </React.StrictMode>
);

reportWebVitals();
