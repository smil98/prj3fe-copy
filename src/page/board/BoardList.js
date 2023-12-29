//  앨범 쇼핑몰 첫 페이지 상품 셀렉 페이지
import React, { createElement, useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  css,
  Flex,
  Heading,
  IconButton,
  Image,
  Img,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faChevronLeft,
  faChevronRight,
  faHeart as fullHeart,
} from "@fortawesome/free-solid-svg-icons";
import { Search } from "./Search";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import * as animateCSSGrid from "animate-css-grid";

function LikeContainer({ loggedIn, setLoggedIn, boardId, sendRefreshToken }) {
  const toast = useToast();
  const [like, setLike] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/like/board/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => setLike(response.data))
      .catch((error) => {
        if (error.response.status === 401) {
          setLoggedIn(false);
          sendRefreshToken();
        } else {
          console.error("Error fetching like data: ", error);
        }
      });
  }, [boardId, loggedIn]);

  if (like === null) {
    return <center Spinner />;
  }
  function handleLike() {
    if (loggedIn) {
      axios
        .get("/api/like/update/" + boardId, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log("then", response.data);
          setLike(response.data);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            const re = sendRefreshToken();
            if (re !== undefined) {
              re.then(() => {
                axios
                  .get("/api/like/update/" + boardId, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "accessToken",
                      )}`,
                    },
                  })
                  .then((response) => {
                    setLike(response.data);
                  })
                  .catch((error) =>
                    console.error("Error fetching like data: ", error),
                  );
              });
            }
            console.log("401에러 캐치문");
          } else {
            console.error("Error fetching like data: ", error);
          }
        });
      // .finally(() => setUpdatingLike(false));
    } else {
      toast({
        description: "로그인 후 이용가능한 서비스입니다",
        status: "error",
      });
    }
  }

  return (
    // <Flex gap={3} ml={400}>
    <Flex>
      <Button
        size="md"
        variant="ghost"
        colorScheme="pink"
        onClick={handleLike}
        leftIcon={
          like.isLiked ? (
            <FontAwesomeIcon icon={fullHeart} size="xl" />
          ) : (
            <FontAwesomeIcon icon={emptyHeart} size="xl" />
          )
        }
      >
        <Heading fontSize="md">{like.countLike}</Heading>
      </Button>
    </Flex>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const itemsPerPage = 16;
  const [board, setBoard] = useState();
  // const [like, setLike] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSocial, setIsSocial] = useState(false);

  const toast = useToast();
  // const { id } = useParams();
  // const boardId = id;
  const location = useLocation();

  const { state } = location;
  const param = state?.param;
  console.log("param: ", param);
  const albumFormat = param ? param : "";
  console.log(albumFormat);

  // 화면 따라 보드 리스트 그리드 설정 변경 위해서 가져옴
  const isSmallScreen = useBreakpointValue({
    xs: true,
    sm: true,
    base: false,
    md: false,
    xl: false,
  });

  const gridStyle = {
    border: "1px solid pink",
    p: 5,
    borderRadius: "sm",
    placeItems: "center",
    templateColumns: isSmallScreen ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
    gap: 5,
    transition: "all 1s", // or adjust the duration to your preference
  };
  function sendRefreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("리프레시 토큰: ", refreshToken);
    // setLoggedIn(false);
    if (refreshToken !== null) {
      return axios
        .get("/refreshToken", {
          headers: { Authorization: `Bearer ${refreshToken}` },
        })
        .then((response) => {
          console.log("sendRefreshToken()의 then 실행");

          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          console.log("토큰들 업데이트 리프레시 토큰: ");
          console.log(response.data.refreshToken);
          setLoggedIn(true);
        })
        .catch((error) => {
          console.log("sendRefreshToken()의 catch 실행");
          localStorage.removeItem("refreshToken");

          setLoggedIn(false);
        });
    }
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      console.log(localStorage.getItem("accessToken"));
      axios
        .get("/accessToken", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log("accessToken then 수행");
          setLoggedIn(true);
          console.log(response.data);

          return axios.get("/isSocialMember", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          });
        })
        .then((response) => {
          console.log("isSocialMember = " + response.data);
          if (response.data) {
            setIsSocial(true);
          }
        })
        .catch(() => {
          sendRefreshToken();
          localStorage.removeItem("accessToken");
        })
        .finally(() => {
          console.log("finally loggedIn: ", loggedIn);
          console.log("isSocial: " + isSocial);
        });
    }
    console.log("loggedIn: ", loggedIn);
  }, [location]);

  // 검색 조건을 상태로 관리.
  const [searchParams, setSearchParams] = useState({
    title: "",
    albumFormat: "",
    albumDetails: [],
  });
  // 검색 조건을 업데이트하는 함수.
  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(0); // 검색 시 첫 페이지로 이동.
  };
  // useEffect(() => {
  //   // searchParams 상태를 사용하여 API 호출을 업데이트.
  //   axios
  //     .get(`/api/board/list`, {
  //       params: {
  //         page: currentPage,
  //         size: itemsPerPage,
  //         title: searchParams.title,
  //         albumFormat:
  //           albumFormat && !searchParams.format
  //             ? albumFormat
  //             : searchParams.format,
  //         // albumDetails가 undefined가 아닌 경우에만 join을 호출.
  //         albumDetails: searchParams.genres
  //           ? searchParams.genres.join(",")
  //           : "",
  //         minPrice: searchParams.minPrice,
  //         maxPrice: searchParams.maxPrice,
  //         stockQuantity: searchParams.stockQuantity,
  //       },
  //     })
  //     .then((response) => {
  //       const boards = response.data.content;
  //
  //       // 각 board 객체에 대해 boardFile의 fileUrl을 추출합니다.
  //       const updatedBoards = boards.map((board) => {
  //         // boardFile 객체들이 배열 형태로 저장되어 있다고 가정
  //         const fileUrls = board.boardFiles.map((file) => file.fileUrl);
  //         return { ...board, fileUrls };
  //       });
  //
  //       setBoardList(updatedBoards);
  //       setTotalPage(response.data.totalPages);
  //     });
  // }, [currentPage, searchParams, param]);
  // param
  if (boardList === null) {
    return <Spinner />;
  }

  const pageButton = [];
  for (let i = 0; i < totalPage; i++) {
    pageButton.push(
      <Button
        key={i}
        onClick={() => setCurrentPage(i)}
        colorScheme={i === currentPage ? "pink" : "gray"}
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

  function handleInCart(board) {
    const accessToken = localStorage.getItem("accessToken");
    console.log("카트 클릭");
    axios
      .postForm(
        "/cart/add",
        {
          boardId: board.id,
          stockQuantity: board.stockQuantity,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      .then((response) => {
        console.log(board.id + "번 상품 카트에 추가");
        toast({
          description: `${board.title} 상품이 장바구니에 추가되었습니다.`,
          status: "success",
        });
      })
      .catch((error) => {
        console.log(error.response.data);
        if (error.response.status === 409) {
          toast({
            title: "재고가 없습니다.",
            description: "수량을 줄이시거나, 관리자에게 문의해주세요",
            status: "error",
          });
        } else {
          toast({
            title: `${board.title} 상품을 장바구니에 추가하지 못했습니다.`,
            description: "다시 한 번 시도해주세요",
            status: "error",
          });
        }
      });
  }

  // 보드 포맷 확인용 맵
  const cards = Array.from({ length: 8 }, (_, index) => (
    <Box
      // p={0}
      // border="1px solid blue"
      w={{ base: "100%", lg: "95%", xl: "85%" }}
      transition="all 1s ease"
    >
      <Card key={index} p={5} borderRadius={20} shadow="base">
        <CardHeader border="0px dashed blue" position="relative" p={0}>
          <Box
            position="relative"
            overflow="hidden"
            // border="1px solid yellow"
            paddingBottom="75%" // 4:3 aspect ratio (75% = (3/4) * 100)
            w="full"
          >
            <Img
              src="https://horizon-ui.com/chakra-pro/static/media/Nft4.5fc37877b25c9fb9a52d.png"
              borderRadius={10}
              objectFit="cover"
              w="full"
              h="full"
              position="absolute"
              top="0"
              left="0"
            />
          </Box>
          <IconButton
            isRound={true}
            position="absolute"
            top={3}
            right={3}
            icon={<FontAwesomeIcon icon={emptyHeart} />}
            zIndex={1}
            transition="all 1s ease"
          />
        </CardHeader>
        <CardBody>
          <Heading size="xs">Colorful Heaven</Heading>
          <Text color="gray.600" my={3} fontSize="xs">
            By Mark Benjamin
          </Text>
          <AvatarGroup size="sm" max={3}>
            <Avatar name="xs" />
            <Avatar name="sm" />
            <Avatar name="base" />
            <Avatar name="md" />
            <Avatar name="lg" />
            <Avatar name="xl" />
          </AvatarGroup>
        </CardBody>
        <CardFooter
          h={10}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          p={0}
        >
          <Button
            variant="solid"
            size="sm"
            colorScheme="purple"
            leftIcon={<FontAwesomeIcon icon={faCartPlus} />}
            borderRadius={20}
            w="full"
            // onClick={() => handleInCart(board)}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Box>
  ));

  const gridsElement = document.querySelector(".grids");

  animateCSSGrid.wrapGrid(gridsElement, {
    duration: 600,
    easing: "linear",
  });

  return (
    <>
      <Box>
        <Spacer h={120} />
        <Search onSearch={handleSearch} /> {/* 검색 컴포넌트*/}
        <Spacer h={50} />
        <SimpleGrid {...gridStyle} className="grids">
          {cards}
          {/*{boardList.map((board) => (*/}
          {/*  <Card*/}
          {/*    key={board.fileUrl}*/}
          {/*    borderRadius="xl"*/}
          {/*    w="100%"*/}
          {/*    h="100%"*/}
          {/*    variant="outline"*/}
          {/*    colorScheme="gray"*/}
          {/*  >*/}
          {/*    <CardHeader onClick={() => navigate(`/board/${board.id}`)}>*/}
          {/*      <Center>*/}
          {/*        {board.fileUrls &&*/}
          {/*          board.fileUrls.map((url, index) => (*/}
          {/*            <Image*/}
          {/*              src={url}*/}
          {/*              borderRadius="xl"*/}
          {/*              style={{*/}
          {/*                width: "200px",*/}
          {/*                height: "200px",*/}
          {/*                objectFit: "cover",*/}
          {/*              }}*/}
          {/*            />*/}
          {/*          ))}*/}
          {/*      </Center>*/}
          {/*    </CardHeader>*/}
          {/*    <CardBody onClick={() => navigate(`/board/${board.id}`)}>*/}
          {/*      <Heading size="md" mb={3}>*/}
          {/*        {board.title} - {board.artist}*/}
          {/*      </Heading>*/}
          {/*      <Heading size="m" textAlign="left">*/}
          {/*        {board.price.toLocaleString()} 원*/}
          {/*      </Heading>*/}
          {/*    </CardBody>*/}
          {/*    <CardFooter>*/}
          {/*      <Center>*/}
          {/*        <ButtonGroup spacing="2">*/}
          {/*          <IconButton*/}
          {/*            aria-label="cart"*/}
          {/*            variant="solid"*/}
          {/*            colorScheme="pink"*/}
          {/*            onClick={() => handleInCart(board)}*/}
          {/*            icon={<FontAwesomeIcon icon={faCartPlus} />}*/}
          {/*          />*/}
          {/*          <LikeContainer*/}
          {/*            loggedIn={loggedIn}*/}
          {/*            setLoggedIn={setLoggedIn}*/}
          {/*            boardId={board.id}*/}
          {/*            sendRefreshToken={sendRefreshToken}*/}
          {/*          />*/}
          {/*        </ButtonGroup>*/}
          {/*      </Center>*/}
          {/*    </CardFooter>*/}
          {/*  </Card>*/}
          {/*))}*/}
        </SimpleGrid>
        {/*-----------------------------------------*/}
        {/*페이지 네이션-------------------------------------------*/}
        <Spacer h={50} />
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
        <Spacer h={50} />
      </Box>
    </>
  );
}
