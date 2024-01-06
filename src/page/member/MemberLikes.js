import {
  AbsoluteCenter,
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Img,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Pagenation } from "../component/Pagenation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faHeart,
  faHeartCircleXmark,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { sendRefreshToken } from "../component/authUtils";

export function MemberLikes() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [likeList, setLikeList] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const [fileUrl, setFileUrl] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const itemsPerPage = 10;
  const [board, setBoard] = useState();
  const { state } = location;
  const { id } = useParams();
  const param = state?.param;
  console.log("param: ", param);

  //도전
  const [selectedLikes, setSelectedLikes] = useState([]);

  const handleSelectAllLikes = (isChecked) => {
    if (isChecked) {
      setSelectedLikes(likeList.map((like) => like.id));
    } else {
      setSelectedLikes([]);
    }
  };

  // 검색 조건 상태로 관리
  const [searchParams, setSearchParams] = useState({
    title: "",
    artist: "",
  });

  const combinedSearchParams = { title: "", artist: "", currentPage: 0 };

  // 검색 조건 업데이트
  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(0);
  };

  // 불러오기
  useEffect(() => {
    // sendRefreshToken();
    const accessToken = localStorage.getItem("accessToken");

    axios
      .get(`/api/like/list/${id}`, {
        params: {
          page: currentPage,
          size: itemsPerPage,
          title: searchParams.title,
          artist: searchParams.artist,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log("/api/like/list/${id} 후");
        const boards = response.data.content;
        console.log(boards);

        const updatedBoards = boards
          ? boards.map((board) => {
              const fileUrls = board.boardFiles
                ? board.boardFiles.map((file) => file.fileUrl)
                : [];
              return { ...board, fileUrls };
            })
          : [];

        setLikeList(updatedBoards);
        setTotalPage(response.data.totalPages);
      });
  }, [currentPage, searchParams, param]);

  if (!likeList || likeList.length === 0) {
    return (
      <>
        <Spacer h={120} />
        <Flex height="70vh" align="center" justify="center" direction="column">
          <AbsoluteCenter align="center">
            <FontAwesomeIcon
              icon={faHeartCircleXmark}
              color="#CDD7E1"
              size="5x"
            />
            <Heading
              size={{ base: "md", lg: "lg" }}
              transition="0.3s all ease"
              my={5}
              color="gray.300"
            >
              좋아요 내역이 없습니다.
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

  function handleMoveToCart(boardId, title, artist) {
    console.log("handleLikeToCart boardId: " + boardId);
    const accessToken = localStorage.getItem("accessToken");

    axios
      .post(
        "/cart/add/liked",
        {
          boardId: boardId,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      .then((response) => {
        toast({
          title: `${title}을 카트로 옮기기 완료`,
          description: `${artist}의 ${title}를 카트에 성공적으로 옮겼습니다.`,
          status: "success",
        });
        setSearchParams(combinedSearchParams);
      })
      .catch((error) => {
        if (error.response.data === 401) {
          sendRefreshToken();
        }
        toast({
          title: `${title}을 카트로 옮기기 실패`,
          description: `${artist}의 ${title}를 카트에 옮기지 못했습니다. 오류가 계속되면 관리자에게 문의하세요.`,
          status: "error",
        });
      });
  }

  function handleCheckBoxChange(like) {
    setSelectedLikes((prevSelectedLikes) =>
      prevSelectedLikes.includes(like.id)
        ? prevSelectedLikes.filter((id) => id !== like.id)
        : [...prevSelectedLikes, like.id],
    );
  }

  function handleAllToCart(selectedLikes) {
    if (selectedLikes.length !== 0 && selectedLikes !== null) {
      const accessToken = localStorage.getItem("accessToken");

      axios
        .post(
          "/cart/add/selected",
          { selectedLikes },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        )
        .then(() => {
          setSelectedLikes([]);
          setSearchParams(combinedSearchParams);
        })
        .catch((error) => {
          toast({
            title: "상품을 카트에 옮기는데 실패했습니다",
            description: "다시 시도하거나 관리자에게 문의하세요",
            status: "error",
          });
          if (error.response.data === 401) {
            sendRefreshToken();
          }
          setSelectedLikes(selectedLikes);
        });
    } else {
      toast({
        title: "선택된 상품이 없습니다",
        description: "원하시는 상품을 선택해주세요",
        status: "warning",
      });
    }
  }

  function handleDeleteLike(selectedLikes) {
    if (selectedLikes.length !== 0 && selectedLikes !== null) {
      const accessToken = localStorage.getItem("accessToken");
      axios
        .delete("/cart/delete/selected", {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { selectedLikes: selectedLikes.join(",") },
        })
        .then(() => {
          setSelectedLikes([]);
          setSearchParams(combinedSearchParams);
        })
        .catch((error) => {
          if (error.response.data === 401) {
            sendRefreshToken();
            toast({
              title: "상품 지우기에 실패했습니다",
              description: "다시 한 번 시도해주세요",
              status: "error",
            });
          } else {
            toast({
              title: "상품 지우기에 실패했습니다",
              description:
                "다시 한 번 시도하시고, 현상이 계속 될 경우에는 관리자에게 문의하세요",
              status: "error",
            });
          }
        });
    } else {
      toast({
        title: "선택된 상품이 없습니다",
        description: "삭제하려는 상품을 선택해주세요",
        status: "warning",
      });
    }
  }

  return (
    <>
      <Spacer h={120} />

      <TableContainer
        mx={{ md: "5%", lg: "10%" }}
        p={5}
        transition="0.5s all ease"
      >
        <Flex
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Checkbox
            isChecked={selectedLikes.length === likeList.length}
            onChange={(e) => handleSelectAllLikes(e.target.checked)}
          >
            전체 선택
          </Checkbox>
          <ButtonGroup>
            <Button size="sm" onClick={() => handleAllToCart(selectedLikes)}>
              선택 카트로 이동
            </Button>
            <Button size="sm" onClick={() => handleDeleteLike(selectedLikes)}>
              선택 삭제
            </Button>
          </ButtonGroup>
        </Flex>

        <Table
          variant="simple"
          w="full"
          size={{ sm: "xs", base: "sm", md: "md", lg: "lg" }}
          transition="0.5s all ease"
        >
          <Tr
            fontWeight="bold"
            fontSize={{ sm: "xs", base: "sm", md: "md" }}
            height={10}
            color="#805AD5"
          >
            <Th textAlign="center">선택</Th>
            <Th textAlign="center">커버</Th>
            <Th textAlign="center">제목</Th>
            <Th textAlign="center">가수</Th>
            <Th textAlign="center">가격</Th>
            <Th textAlign="center">카트</Th>
          </Tr>
          {likeList.map((like) => (
            <Tr
              key={like.id}
              onClick={() => navigate(`/board/${like.boardId}`)}
            >
              <Td
                textAlign="center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Checkbox
                  isChecked={selectedLikes.includes(like.id)}
                  onChange={() => {
                    handleCheckBoxChange(like);
                  }}
                />
              </Td>
              <Td>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  overflow="hidden"
                  paddingBottom="100%"
                  w="full"
                >
                  <Img
                    w="full"
                    h="full"
                    borderRadius={5}
                    position="absolute"
                    top="0"
                    left="0"
                    src={
                      like.fileUrl
                        ? like.fileUrl
                        : "https://placehold.co/400x400"
                    }
                  />
                </Flex>
              </Td>
              <Td textAlign="center">{like.title}</Td>
              <Td textAlign="center">{like.artist}</Td>
              <Td textAlign="center">₩ {like.price.toLocaleString()}</Td>
              <Td textAlign="center">
                <IconButton
                  variant="solid"
                  colorScheme="purple"
                  icon={<FontAwesomeIcon icon={faCartPlus} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveToCart(like.boardId, like.title, like.artist);
                  }}
                />
              </Td>
            </Tr>
          ))}
        </Table>
      </TableContainer>
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
