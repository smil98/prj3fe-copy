import { Spacer, Text, VStack } from "@chakra-ui/react";
import React from "react";

export function Footer() {
  return (
    <>
      <Spacer h={30} />
      <VStack>
        <Text className="logo" fontSize="2xl">
          FavHub
        </Text>
        <Text mt={-4} color="#805AD5" fontSize="xs">
          Find Your Favorite
        </Text>
      </VStack>
      <Spacer h={50} />
    </>
  );
}
