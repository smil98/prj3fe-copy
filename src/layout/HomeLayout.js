import {
  AbsoluteCenter,
  Box,
  DrawerFooter,
  Spacer,
  Text,
} from "@chakra-ui/react";
import NavBar from "../page/component/NavBar";
import { Outlet } from "react-router-dom";
import React from "react";

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
//주석
