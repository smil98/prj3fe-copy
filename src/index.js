import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import "typeface-roboto";
import Fonts from "./Fonts";
import theme from "./Theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <Fonts />
    <App />
  </ChakraProvider>,
);
