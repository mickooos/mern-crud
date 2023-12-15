import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/css/main.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./store/store.jsx";
import axios from "axios";

const persistor = persistStore(store);
axios.defaults.baseURL = import.meta.env.VITE_API_EP;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </>
);
