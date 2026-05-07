import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="381316880548-0miuurkqio4dbuhbkce31cbmuaeo2ekh.apps.googleusercontent.com">
        <App />
        <Toaster />
      </GoogleOAuthProvider>
    </Provider>
  </BrowserRouter>
);
