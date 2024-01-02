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
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { SearchIcon } from "@chakra-ui/icons";

export const Search = ({ onSearch }) => {
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [title, setTitle] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };
  const handleGenreChange = (selectedGenres) => {
    setSelectedGenres(selectedGenres);
  };
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch({
      format: selectedFormat,
      genres: selectedGenres,
      title: title,
      minPrice: minPrice,
      maxPrice: maxPrice,
    });
  };
  const toggleSearchOptions = () => {
    setShowSearchOptions(!showSearchOptions); // 버튼 클릭 시 상태 업데이트
  };

  // 장르명 : 태그로 선택
  const genres = ["INDIE", "OST", "K_POP", "POP"];

  const genreDisplayNames = {
    INDIE: "Indie",
    OST: "OST",
    K_POP: "K-Pop",
    POP: "Pop",
  };

  const GenreTags = () => {
    const [selectedGenres, setSelectedGenres] = useState([]);

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

  return (
    <>
      <Box
        as="form"
        mx={{ base: "5%", md: "10%", lg: "15%" }}
        onSubmit={handleSubmit}
      >
        <Button
          w={{ base: "full", md: "40%", lg: "30%" }}
          mx={{ base: "none", md: "30%", lg: "35%" }}
          type="button"
          variant="outline"
          colorScheme="purple"
          mb={3}
          onClick={toggleSearchOptions}
          _hover="none"
          leftIcon={<SearchIcon />}
          iconSpacing={2}
        >
          검색 조건 설정
          {showSearchOptions}
        </Button>
        <Collapse in={showSearchOptions} animateOpacity>
          <Flex mb={4} gap={4} direction="column">
            <FormControl>
              <FormLabel>제목</FormLabel>
              <Input value={title} onChange={handleTitleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>종류:</FormLabel>
              <Select
                placeholder="종류 선택"
                value={selectedFormat}
                onChange={handleFormatChange}
              >
                <option value="CD">CD</option>
                <option value="VINYL">Vinyl</option>
                <option value="CASSETTE_TAPE">Cassette Tape</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>장르</FormLabel>
              <GenreTags />
              {/*<CheckboxGroup*/}
              {/*  colorScheme="green"*/}
              {/*  value={selectedGenres}*/}
              {/*  onChange={handleGenreChange}*/}
              {/*>*/}
              {/*  <Stack spacing={2} direction="row">*/}
              {/*    <Checkbox value="INDIE">Indie</Checkbox>*/}
              {/*    <Checkbox value="OST">OST</Checkbox>*/}
              {/*    <Checkbox value="K_POP">K-Pop</Checkbox>*/}
              {/*    <Checkbox value="POP">Pop</Checkbox>*/}
              {/*  </Stack>*/}
              {/*</CheckboxGroup>*/}
            </FormControl>
            <Flex direction="row" align="center" gap={4}>
              <FormControl>
                <FormLabel>최소 금액:</FormLabel>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                />
              </FormControl>
              <Text mt={8}>~</Text>
              <FormControl>
                <FormLabel>최대 금액:</FormLabel>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                />
              </FormControl>
            </Flex>
            <Button type="submit" w="full" mt={4} colorScheme="purple">
              검색
            </Button>
          </Flex>
        </Collapse>
      </Box>
    </>
  );
};
