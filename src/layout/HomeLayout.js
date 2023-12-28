import { Box, Spacer } from "@chakra-ui/react";
import NavBar from "../page/component/NavBar";
import { Outlet } from "react-router-dom";
import React from "react";
import { Breadcrumbs } from "../page/component/Breadcrumbs";

export function HomeLayout() {
  return (
    <>
      <Box>
        <NavBar />
        <Outlet />
      </Box>
      <Spacer h={100} />
    </>
  );
}
