import {
  AbsoluteCenter,
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPenToSquare,
  faQuestionCircle,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { sendRefreshToken } from "../component/authUtils";
import { Pagenation } from "../component/Pagenation";

function SearchComponent({ navigate, setSearchParams, setCurrentPage }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);
    setSearchParams((prevSearchParams) => {
      const newSearchParams = { ...prevSearchParams, k: keyword, c: category };
      setCurrentPage(0);
      return newSearchParams;
    });
  }

  return (
    <Center mt={5}>
      <Flex gap={1}>
        <Select
          defaultValue="all"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="id">제품 번호</option>
          <option value="title">제품명</option>
        </Select>
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <IconButton
          onClick={handleSearch}
          icon={<FontAwesomeIcon icon={faSearch} />}
        />
      </Flex>
    </Center>
  );
}

export function BoardManage() {
  const [boardList, setBoardList] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const itemsPerPage = 10;
  const { onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const [openModalId, setOpenModalId] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const location = useLocation();

  const [searchParams, setSearchParams] = useState({
    k: "",
    c: "",
  });

  // 선택
  function handleCheckBoxChange(board) {
    setSelectedBoards((prevSelectedBoards) =>
      prevSelectedBoards.includes(board.id)
        ? prevSelectedBoards.filter((id) => id !== board.id)
        : [...prevSelectedBoards, board.id],
    );
  }

  // 전체 선택
  function handleSelectAllBoards(isChecked) {
    if (isChecked) {
      setSelectedBoards(boardList.map((board) => board.id));
    } else {
      setSelectedBoards([]);
    }
  }

  //가져오기
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/board/manage`, {
        params: {
          page: currentPage,
          size: itemsPerPage,
          c: searchParams.c,
          k: searchParams.k,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setBoardList(response.data.content);
        setTotalPage(response.data.totalPages);
      })
      .catch((error) => {
        if (error.response.data === 401) {
          sendRefreshToken();
          toast({
            title: "접근 권한이 없습니다",
            description:
              "관리자 외에 접속 불가능합니다. 관리자일 경우 다시 한 번 시도하시거나 토큰 데이터베이스를 확인해주세요.",
            status: "warning",
          });
        }
        toast({
          title: "제품을 불러오기에 실패했습니다.",
          description: "다시 한 번 시도해주시거나 데이터베이스를 체크해주세요",
          status: "error",
        });
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [currentPage, searchParams.k, searchParams.c]);

  //첫 로딩 시
  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner
          center
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#805AD5"
          size="xl"
        />
      </Flex>
    );
  }

  //로딩이 끝났고 제품 리스트가 없을 시
  if (!loading && !boardList) {
    return (
      <>
        <Spacer h={150} />
        <Flex height="70vh" align="center" justify="center" direction="column">
          <AbsoluteCenter align="center">
            <FontAwesomeIcon
              icon={faQuestionCircle}
              color="#CDD7E1"
              size="5x"
            />
            <Heading
              size={{ base: "md", lg: "lg" }}
              transition="0.3s all ease"
              my={5}
              color="gray.300"
            >
              등록된 상품이 없습니다
            </Heading>
            <Button
              leftIcon={<FontAwesomeIcon icon={faHouse} />}
              colorScheme="purple"
              onClick={() => navigate("/")}
            >
              홈으로 가기
            </Button>
          </AbsoluteCenter>
        </Flex>
      </>
    );
  }

  //제품 삭제 모달
  function handleDelete(board) {
    axios
      .delete("/api/board/remove/" + board.id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        toast({
          description: board.title + "이(가) 삭제되었습니다.",
          status: "success",
        });
        setSearchParams({
          k: "",
          c: "",
        });
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
        setBoardList(boardList);
      })
      .finally(() => onClose());
  }

  //선택한 제품(들) 삭제
  function handleSelectedDelete(selectedBoards) {
    if (selectedBoards.length !== 0) {
      axios
        .delete("/api/board/select/delete", {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { selectedBoards: selectedBoards.join(",") },
        })
        .then(() => {
          setSelectedBoards([]);
          setSearchParams({
            k: "",
            c: "",
          });
        })
        .catch((error) => {
          if (error.response.data === 401) {
            sendRefreshToken();
            toast({
              title: "상품 삭제에 실패했습니다",
              description:
                "다시 한 번 시도해주시고, 현상이 계속 될 경우 토큰 만료 여부를 확인하시기 바랍니다",
              status: "error",
            });
          } else {
            toast({
              title: "상품 지우기에 실패했습니다",
              description:
                "다시 한 번 시도하시고, 현상이 계속될 경우에는 데이터베이스를 확인해보시기 바랍니다.",
              status: "error",
            });
          }
        });
    } else {
      toast({
        title: "선택된 제품이 없습니다",
        description: "삭제하려는 제품을 선택해주세요",
        status: "warning",
      });
    }
  }

  return (
    <>
      <Spacer h={150} />
      <Heading>상품 관리</Heading>
      <TableContainer
        mx={{ md: "5%", lg: "10%" }}
        p={5}
        transition="0.5s all ease"
      >
        <Flex>
          <Checkbox
            colorScheme="purple"
            isChecked={selectedBoards.length === boardList.length}
            onChange={(e) => handleSelectAllBoards(e.target.checked)}
          >
            전체 선택
          </Checkbox>
          <Button
            size="sm"
            onClick={() => handleSelectedDelete(selectedBoards)}
          >
            선택 삭제
          </Button>
        </Flex>
        <Table
          w="full"
          size={{ sm: "xs", base: "sm", md: "md", lg: "lg" }}
          transition="0.5s all ease"
        >
          <Thead>
            <Tr>
              <Th textAlign="center">선택</Th>
              <Th textAlign="center">제품 번호</Th>
              <Th textAlign="center">제품명</Th>
              <Th textAlign="center">재고량</Th>
              <Th textAlign="center">수정</Th>
              <Th textAlign="center">삭제</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Container key={board.id}>
                <Tr
                  _hover={{
                    cursor: "pointer",
                    bgColor: "gray.50",
                    color: "white",
                  }}
                  onClick={() => navigate(`/board/${board.id}`)}
                >
                  <Td onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      colorScheme="purple"
                      isChecked={selectedBoards.includes(board.id)}
                      onChange={(e) => handleCheckBoxChange(board)}
                    />
                  </Td>
                  <Td textAlign="center">{board.id}</Td>
                  <Td>{board.title}</Td>
                  <Td>{board.stockQuantity}</Td>
                  <Td>
                    <IconButton
                      icon={<FontAwesomeIcon icon={faPenToSquare} />}
                      colorScheme="purple"
                      w="50%"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit/${board.id}`);
                      }}
                    />
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FontAwesomeIcon icon={faTrashCan} />}
                      colorScheme="red"
                      w="50%"
                      variant="ghost"
                      onClick={onOpen}
                    />
                  </Td>
                </Tr>
                <Modal
                  isOpen={openModalId === board.id}
                  onClose={() => setOpenModalId(null)}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>상품 삭제</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>해당 상품을 삭제 하시겠습니까?</ModalBody>
                    <ModalFooter display="flex" justifyContent="center">
                      <Button
                        w="30%"
                        mr={5}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(board);
                        }}
                        colorScheme="red"
                      >
                        삭제
                      </Button>
                      <Button w="30%" onClick={onClose}>
                        닫기
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Container>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Center mb={10}>
        <SearchComponent
          navigate={navigate}
          setSearchParams={setSearchParams}
          setCurrentPage={setCurrentPage}
        />
      </Center>
      <Spacer h={50} />
      <Pagenation
        totalPage={totalPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Spacer h={50} />
    </>
  );
}
