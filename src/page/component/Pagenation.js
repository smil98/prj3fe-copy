import { Button, ButtonGroup, Center, Spacer } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

export function Pagenation({ totalPage, currentPage, setCurrentPage }) {
  const pageButton = [];

  for (let i = 0; i < totalPage; i++) {
    pageButton.push(
      <Button
        key={i}
        onClick={() => setCurrentPage(i)}
        colorScheme={i === currentPage ? "purple" : "gray"}
      >
        {i + 1}
      </Button>,
    );
  }

  function handlePreviousPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }

  function handleNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPage - 1));
  }

  return (
    <Center>
      <ButtonGroup>
        <Button onClick={handlePreviousPage} disable={currentPage === 0}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        {pageButton}
        <Button
          onClick={handleNextPage}
          e
          disabled={currentPage === totalPage - 1}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </ButtonGroup>
    </Center>
  );
}
