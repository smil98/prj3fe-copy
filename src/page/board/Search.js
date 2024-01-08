//검색 관련 컴포넌트
import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Collapse,
  Center,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  HStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";
import { SearchIcon } from "@chakra-ui/icons";

export const Search = ({ handleSearch }) => {
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [title, setTitle] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 장르명 : 태그로 선택
  const genres = ["INDIE", "OST", "K_POP", "POP"];

  const genreDisplayNames = {
    INDIE: "Indie",
    OST: "OST",
    K_POP: "K-Pop",
    POP: "Pop",
  };

  const GenreTags = ({ setSelectedGenres }) => {
    const handleTagClick = (value) => {
      setSelectedGenres((prevGenres) =>
        prevGenres.includes(value)
          ? prevGenres.filter((genre) => genre !== value)
          : [...prevGenres, value],
      );
    };

    return (
      <Stack spacing={2} direction="row">
        {genres.map((genre) => (
          <Tag
            key={genre}
            borderRadius="full"
            variant={selectedGenres.includes(genre) ? "solid" : "subtle"}
            colorScheme={selectedGenres.includes(genre) ? "purple" : "gray"}
            onClick={() => handleTagClick(genre)}
          >
            <TagLabel>{genreDisplayNames[genre]}</TagLabel>
            {selectedGenres.includes(genre) && <TagCloseButton />}
          </Tag>
        ))}
      </Stack>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch({
      format: selectedFormat,
      genres: selectedGenres,
      title: title,
      minPrice: minPrice,
      maxPrice: maxPrice,
    });
  };

  return (
    <>
      <Box
        as="form"
        mx={{ base: "5%", md: "10%", lg: "15%" }}
        opacity={1}
        transition="opacity 0.5s"
        onSubmit={handleSubmit}
      >
        <Flex mb={4} gap={4} direction="column">
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>종류:</FormLabel>
            <Select
              placeholder="종류 선택"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="CD">CD</option>
              <option value="VINYL">Vinyl</option>
              <option value="CASSETTE_TAPE">Cassette Tape</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>장르</FormLabel>
            <GenreTags setSelectedGenres={setSelectedGenres} />
          </FormControl>
          <Flex direction="row" align="center" gap={4}>
            <FormControl>
              <FormLabel>최소 금액:</FormLabel>
              <Input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </FormControl>
            <Text mt={8}>~</Text>
            <FormControl>
              <FormLabel>최대 금액:</FormLabel>
              <Input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </FormControl>
          </Flex>
          <Button
            type="submit"
            w="full"
            mt={4}
            colorScheme="purple"
            onClick={handleSubmit}
          >
            검색
          </Button>
        </Flex>
      </Box>
    </>
  );
};
