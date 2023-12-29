import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import "typeface-roboto";
import Fonts from "./layout/Fonts";
import theme from "./layout/Theme";
import ScrollToTopButton from "./page/component/ScrollToTopButton";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <Fonts />
    <App />
    <ScrollToTopButton />
  </ChakraProvider>,
);
