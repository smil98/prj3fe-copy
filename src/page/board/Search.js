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
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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
  return (
    <>
      <Box as="form" onSubmit={handleSubmit}>
        <Center>
          <Button type="button" onClick={toggleSearchOptions} mb={4}>
            <FontAwesomeIcon icon={faSearch} />
            {showSearchOptions}
          </Button>
        </Center>
        <Collapse in={showSearchOptions} animateOpacity>
          <Flex mb={4} gap={4} direction="column">
            <FormControl>
              <FormLabel>Title:</FormLabel>
              <Input value={title} onChange={handleTitleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Format:</FormLabel>
              <Select
                placeholder="Select a format"
                value={selectedFormat}
                onChange={handleFormatChange}
              >
                <option value="CD">CD</option>
                <option value="VINYL">Vinyl</option>
                <option value="CASSETTE_TAPE">Cassette Tape</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Genres:</FormLabel>
              <CheckboxGroup
                colorScheme="green"
                value={selectedGenres}
                onChange={handleGenreChange}
              >
                <Stack spacing={2} direction="row">
                  <Checkbox value="INDIE">Indie</Checkbox>
                  <Checkbox value="OST">OST</Checkbox>
                  <Checkbox value="K_POP">K-Pop</Checkbox>
                  <Checkbox value="POP">Pop</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>
            <Flex gap={4}>
              <FormControl>
                <FormLabel>Min Price:</FormLabel>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Max Price:</FormLabel>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                />
              </FormControl>
            </Flex>
          </Flex>
          <Button type="submit" mt={4}>
            Search
          </Button>
        </Collapse>
      </Box>
    </>
  );
};
