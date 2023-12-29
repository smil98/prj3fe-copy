import { Box } from "@chakra-ui/react";
import NavBar from "../page/component/NavBar";
import { Outlet } from "react-router-dom";
import React from "react";
import { Footer } from "../page/component/Footer";

export function HomeLayout() {
  return (
    <Box bgGradient="linear(to-b, #FFFFF 0%, #FAFBFC 50%, #F7F8FB 100%)">
      <NavBar />
      <Outlet />
      <Footer />
    </Box>
  );
}
