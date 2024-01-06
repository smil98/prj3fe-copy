//  앨범 쇼핑몰 첫 페이지 상품 셀렉 페이지
import React, {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AbsoluteCenter,
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
  Icon,
  IconButton,
  Image,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spacer,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faChevronLeft,
  faChevronRight,
  faGrip,
  faHeart as fullHeart,
  faHeartCircleXmark,
  faHourglassHalf,
  faHouse,
  faList,
  faTriangleExclamation,
  faWonSign,
} from "@fortawesome/free-solid-svg-icons";
import { Search } from "./Search";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import * as animateCSSGrid from "animate-css-grid";
import { SearchIcon } from "@chakra-ui/icons";
import { Pagenation } from "../component/Pagenation";

function LikeContainer({
  loggedIn,
  setLoggedIn,
  boardId,
  sendRefreshToken,
  isGrid,
}) {
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
    <>
      {isGrid ? (
        <IconButton
          isRound
          top={3}
          colorScheme={like.isLiked ? "purple" : "gray"}
          right={3}
          position="absolute"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          icon={
            like.isLiked ? (
              <FontAwesomeIcon icon={fullHeart} />
            ) : (
              <FontAwesomeIcon icon={emptyHeart} />
            )
          }
          zIndex={1}
        />
      ) : (
        <IconButton
          isRound
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          icon={
            like.isLiked ? (
              <FontAwesomeIcon colorScheme="pink" icon={fullHeart} />
            ) : (
              <FontAwesomeIcon icon={emptyHeart} />
            )
          }
          zIndex={1}
        />
      )}
    </>
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
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const toast = useToast();
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
    p: 5,
    borderRadius: "sm",
    placeItems: "center",
    templateColumns: isSmallScreen ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
    gap: 5,
    transition: "all 1s",
  };

  //그리드, 리스트 형식 전환용
  const [isGrid, setIsGrid] = useState(true);

  // 2, 1fr <-> 4, 1fr 변동 시 transition 추가
  useLayoutEffect(() => {
    const gridsElement = document.querySelector(".grids");

    if (gridsElement) {
      animateCSSGrid.wrapGrid(gridsElement, {
        duration: 600,
        easing: "linear",
      });
    }
  }, []);

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

          if (response.data.role === "ROLE_SOCIAL") {
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

  useEffect(() => {
    // searchParams 상태를 사용하여 API 호출을 업데이트.
    axios
      .get(`/api/board/list`, {
        params: {
          page: currentPage,
          size: itemsPerPage,
          title: searchParams.title,
          albumFormat:
            albumFormat && !searchParams.format
              ? albumFormat
              : searchParams.format,
          // albumDetails가 undefined가 아닌 경우에만 join을 호출.
          albumDetails: searchParams.genres
            ? searchParams.genres.join(",")
            : "",
          minPrice: searchParams.minPrice,
          maxPrice: searchParams.maxPrice,
          stockQuantity: searchParams.stockQuantity,
        },
      })
      .then((response) => {
        const boards = response.data.content;

        // 각 board 객체에 대해 boardFile의 fileUrl을 추출합니다.
        const updatedBoards = boards.map((board) => {
          // boardFile 객체들이 배열 형태로 저장되어 있다고 가정
          const fileUrls = board.boardFiles.map((file) => file.fileUrl);
          return { ...board, fileUrls };
        });

        setBoardList(updatedBoards);
        setTotalPage(response.data.totalPages);
      });
  }, [currentPage, searchParams, param]);

  if (!boardList || boardList.length === 0) {
    return (
      <>
        <Spacer h={120} />
        <Flex height="70vh" align="center" justify="center" direction="column">
          <AbsoluteCenter align="center">
            <FontAwesomeIcon icon={faHourglassHalf} color="#CDD7E1" size="5x" />
            <Heading
              size={{ base: "md", lg: "lg" }}
              transition="0.3s all ease"
              my={5}
              color="gray.300"
            >
              상품 준비 중입니다
            </Heading>
          </AbsoluteCenter>
        </Flex>
      </>
    );
  }

  function handleInCart(board) {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .postForm(
        "/cart/add",
        {
          boardId: board.id,
          stockQuantity: board.stockQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => {
        console.log(board.id + "번 상품 카트에 추가");
        toast({
          description: `${board.title}을 장바구니에 추가되었습니다.`,
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
            title: `${board.title}을 장바구니에 추가하지 못했습니다.`,
            description: "다시 한 번 시도해주세요",
            status: "error",
          });
        }
      });
  }

  //TODO: board.id 통해서 해당 포스트 좋아요한 사람들 이름 가져오는 쿼리문 작성, axios로 List 받아와 여기에 저장
  const likedPeers = ["John", "Jane", "Alice", "Bob", "Charlie", "David"];

  const TableComponent = ({ boards, likedPeers }) => {
    return (
      <TableContainer
        mx={{ md: "5%", lg: "10%" }}
        p={5}
        transition="0.5s all ease"
      >
        <Table
          variant="simple"
          colorScheme="purple"
          w="full"
          size={{ sm: "xs", base: "sm", md: "md", lg: "lg" }}
          transition="0.5s all ease"
        >
          <Thead>
            <Tr
              fontWeight="bold"
              fontSize={{ base: "sm", md: "md" }}
              color="#805AD5"
            >
              <Td textAlign="center">커버</Td>
              <Td textAlign="center">제목</Td>
              <Td textAlign="center">가수명</Td>
              <Td textAlign="center">가격</Td>
              <Td textAlign="center">찜하기</Td>
              <Td textAlign="center">카트</Td>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr key={board.id} textAlign="center">
                {board.fileUrls &&
                  board.fileUrls.map((url, index) => (
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
                          src={url}
                        />
                      </Flex>
                    </Td>
                  ))}
                <Td textAlign="center" whiteSpace="normal">
                  {board.title}
                </Td>
                <Td textAlign="center" whiteSpace="break-spaces">
                  {board.artist}
                </Td>
                <Td textAlign="center">₩ {board.price.toLocaleString()}</Td>
                <Td>
                  <Flex alignItems="center" justifyContent="center">
                    <LikeContainer
                      loggedIn={loggedIn}
                      setLoggedIn={setLoggedIn}
                      boardId={board.id}
                      sendRefreshToken={sendRefreshToken}
                    />
                  </Flex>
                </Td>
                <Td>
                  <Flex alignItems="center" justifyContent="center">
                    {isSmallScreen ? (
                      <IconButton
                        variant="solid"
                        size="sm"
                        colorScheme="purple"
                        icon={<FontAwesomeIcon icon={faCartPlus} />}
                        onClick={() => handleInCart(board)}
                      />
                    ) : (
                      <Button
                        variant="solid"
                        size="sm"
                        colorScheme="purple"
                        leftIcon={<FontAwesomeIcon icon={faCartPlus} />}
                        borderRadius={20}
                        onClick={() => handleInCart(board)}
                      >
                        {isSmallScreen ? "" : "카트에 넣기"}
                      </Button>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <Box>
        <Spacer h={120} />
        <ButtonGroup ml="5%" isAttached mb={5}>
          <IconButton
            aria-label={"grid"}
            onClick={() => {
              setIsGrid(true);
            }}
            icon={<FontAwesomeIcon icon={faGrip} />}
            colorScheme={isGrid ? "purple" : "gray"}
            borderRadius={0}
          />
          <IconButton
            aria-label={"list"}
            onClick={() => {
              setIsGrid(false);
            }}
            icon={<FontAwesomeIcon icon={faList} />}
            colorScheme={isGrid ? "gray" : "purple"}
            borderRadius={0}
          />
        </ButtonGroup>
        <Search onSearch={handleSearch} /> {/* 검색 컴포넌트*/}
        {isGrid ? (
          <SimpleGrid {...gridStyle} className="grids">
            {boardList.map((board) => (
              <Box
                key={board.id}
                w={{ base: "100%", lg: "95%", xl: "85%" }}
                transition="1s all ease"
                onClick={() => {
                  navigate(`/board/${board.id}`);
                }}
                onMouseEnter={() => setHoveredIndex(board.id)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Card p={5} borderRadius={20} height="450px" shadow="base">
                  <CardHeader position="relative" p={0}>
                    {board.fileUrls &&
                      board.fileUrls.map((url, index) => (
                        <Box
                          position="relative"
                          overflow="hidden"
                          paddingBottom="75%" // 4:3 aspect ratio (75% = (3/4) * 100)
                          w="full"
                        >
                          <Img
                            src={url}
                            borderRadius={10}
                            objectFit="cover"
                            w="full"
                            h="full"
                            position="absolute"
                            top="0"
                            left="0"
                          />
                          {hoveredIndex === board.id && (
                            <Box
                              position="absolute"
                              top="0"
                              left="0"
                              right="0"
                              bottom="0"
                              p={5}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              background="rgba(0, 0, 0, 0.7)"
                              borderRadius={10}
                            >
                              <Text
                                color="white"
                                fontSize="2xl"
                                textAlign="center"
                              >
                                {board.albumFormat}
                              </Text>
                            </Box>
                          )}
                        </Box>
                      ))}
                    <LikeContainer
                      loggedIn={loggedIn}
                      setLoggedIn={setLoggedIn}
                      isGrid={isGrid}
                      boardId={board.id}
                      sendRefreshToken={sendRefreshToken}
                    />
                    {/*  TODO: Board 끝나면 like 살려오기 가져오기 */}
                  </CardHeader>
                  <CardBody
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    h="150px"
                  >
                    <Heading size="sm">{board.title}</Heading>
                    <Text color="gray.600" fontSize="sm">
                      By {board.artist}
                    </Text>
                    <Text textAlign="right">
                      ₩ {board.price.toLocaleString()}
                    </Text>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInCart(board);
                      }}
                    >
                      카트에 넣기
                    </Button>
                  </CardFooter>
                </Card>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <TableComponent boardList={boardList} likedPeers={likedPeers} />
        )}
        {/*-----------------------------------------*/}
        {/*페이지 네이션-------------------------------------------*/}
        <Spacer h={50} />
        <Pagenation
          totalPage={totalPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <Spacer h={50} />
      </Box>
    </>
  );
}
