import { Box } from "@chakra-ui/react";
import NavBar from "../page/component/NavBar";
import { Outlet } from "react-router-dom";
import React from "react";
import { Footer } from "../page/component/Footer";

export function HomeLayout() {
  return (
    <Box bgGradient="linear(to-b, #FFFFFF 0%, #FCFCFC 50%, #FEFEFE 100%)">
      <NavBar />
      <Outlet />
      <Footer />
    </Box>
  );
}
