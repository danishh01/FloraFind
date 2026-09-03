import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import { store, persistor } from "./app/store";

import HomePage from "./pages/HomePage.jsx";
import Shop from "./pages/Shop.jsx";
import ScanPlant from "./pages/ScanPlant.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import MainLayout from "./components/MainLayout.jsx";
import PlantDetails from "./pages/PlantDetails.jsx";
import PossibleMatches from "./pages/PossibleMatches.jsx";
import ProductsListing from "./pages/ProductsListing.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Orders from "./pages/Orders.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import AuthBootstrap from "./components/AuthBootstrap.jsx";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/ScanPlant",
        element: <ScanPlant />,
      },
      {
        path: "/AboutUs",
        element: <AboutUs />,
      },
      {
        path: "/ContactUs",
        element: <ContactUs />,
      },
    ],
  },
  {
    path: "/PlantDetails/:plantName",
    element: <PlantDetails />,
  },
  {
    path: "/PossibleMatches",
    element: <PossibleMatches />,
  },
  {
    path: "/Account",
    element: <UserDetails />,
  },
  {
    path: "/Shop",
    element: <Shop />,
  },
  {
    path: "/Shop/ProductsListing",
    element: <ProductsListing />,
  },
  {
    path: "/Shop/ProductsListing/:Category",
    element: <ProductsListing />,
  },
  {
    path: "/Shop/Product/:id",
    element: <ProductDetails />,
  },
  {
  path: "/Shop/Cart",
  element: <Cart />,
},
  {
  path: "/Shop/Wishlist",
  element: <Wishlist />,
},
 {
  path: "/Shop/Checkout",
  element: <Checkout />,
},
 {
  path: "/Shop/OrderSuccess",
  element: <OrderSuccess />,
},
 {
  path: "/Shop/Orders",
  element: <Orders />,
},
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthBootstrap router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
