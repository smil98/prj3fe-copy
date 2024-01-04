import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Img,
  Spacer,
  Table,
  TableContainer,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Pagenation } from "../component/Pagenation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faHeartCircleXmark,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function MemberLikes() {
  const location = useLocation();
  const navigate = useNavigate();
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

  // 검색 조건 상태로 관리
  const [searchParams, setSearchParams] = useState({
    title: "",
    artist: "",
  });

  // 검색 조건 업데이트
  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(0);
  };

  // 불러오기
  useEffect(() => {
    // sendRefreshToken();

    axios
      .get(`/api/like/list/${id}`, {
        params: {
          page: currentPage,
          size: itemsPerPage,
          title: searchParams.title,
          artist: searchParams.artist,
        },
      })
      .then((response) => {
        const boards = response.data.content;

        const updatedBoards = boards
          ? boards.map((board) => {
              const fileUrls = board.boardFiles.map((file) => file.fileUrl);
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

  return (
    <>
      <Spacer h={120} />
      <TableContainer>
        <Table>
          <Tr>
            <Th>커버</Th>
            <Th>제목</Th>
            <Th>가수</Th>
            <Th>가격</Th>
            <Th>좋아요</Th>
          </Tr>
          {likeList.map((like) => (
            <Tr key={like.id}>
              <Td>
                <Img src={like.fileUrls} />
              </Td>
              <Td>{like.title}</Td>
              <Td>{like.artist}</Td>
              <Td>₩ {like.price.toLocaleString()}</Td>
              <Td>
                <IconButton
                  isRound
                  isDisabled
                  icon={<FontAwesomeIcon icon={faHeart} />}
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
