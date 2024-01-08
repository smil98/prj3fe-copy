import { Form, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  AbsoluteCenter,
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tag,
  Td,
  Text,
  Th,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import CommentComponent from "../component/CommentComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeartCircleXmark,
  faHouse,
  faPenToSquare,
  faTags,
  faTrashCan,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export function BoardView() {
  const { id } = useParams(); //URL에서 동적인 값을 컴포넌트 내에서 쓸때 사용. <Route>컴포넌트 내에서 렌더링되는 컴포넌트에서만 사용가능
  const [board, setBoard] = useState(null);
  const [fileURL, setFileURL] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data))
      .catch((error) => console.log(error))
      .finally(() => console.log("끝"));
  }, []);

  useEffect(() => {
    axios
      .get("/api/board/file/id/" + id)
      .then((response) => setFileURL(response.data))
      .catch((e) => console.log(e))
      .finally(() => console.log("끝"));
  }, []);

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
          console.log(response.data);
          setLoggedIn(true);
          setEmail(response.data.email);
          if (response.data.role === "ROLE_ADMIN") {
            console.log("setIsAdmin(true) 동작");
            setIsAdmin(true);
          }
          if (response.data.role === "ROLE_SOCIAL") {
            setIsSocial(true);
          }
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          sendRefreshToken();
        })
        .finally(() => {
          console.log("finally loggedIn: ", loggedIn);
          console.log("isSocial: " + isSocial);
        });
    }
  }, []);

  function sendRefreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("리프레시 토큰: ", refreshToken);

    axios
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
      })
      .finally(() => console.log(loggedIn));
  }

  if (!board) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spacer h={150} />
        <Flex height="70vh" align="center" justify="center" direction="column">
          <AbsoluteCenter align="center">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              color="#CDD7E1"
              size="5x"
            />
            <Heading
              size={{ base: "md", lg: "lg" }}
              transition="0.3s all ease"
              my={5}
              color="gray.300"
            >
              존재하지 않는 제품입니다
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
      </Flex>
    );
  }

  function handleDelete() {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .delete("/api/board/remove/" + id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        toast({
          description: id + "번 앨범이 삭제되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  const formattedDate = (releaseDate) => {
    const date = new Date(releaseDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  return (
    <>
      <Spacer h={150} />
      <HStack spacing="5%" mx={{ base: "5%", md: "10%", lg: "15%" }}>
        {fileURL.map((url) => (
          <Box
            w={{ sm: "50%", base: "45%", md: "45%", lg: "50%" }}
            transition="1s all ease"
            key={url}
          >
            <Image src={url} w="100%" h="100%" objectFit="cover" />
          </Box>
        ))}
        <VStack
          w={{ sm: "45%", base: "50%", md: "50%", lg: "45%" }}
          spacing={{ sm: 2, base: 4, md: 4, lg: 5 }}
          alignItems="left"
          transition="1s all ease"
        >
          <Heading
            size={{ xs: "xs", sm: "lg", base: "2xl" }}
            transition="1s all ease"
          >
            {board.title}
          </Heading>
          <HStack>
            <Text w="25%">가수</Text>
            <Text w="70%" overflowWrap="break-word">
              {board.artist}
            </Text>
          </HStack>
          <HStack>
            <Text w="25%">형태</Text>
            <Text>{board.albumFormat}</Text>
          </HStack>
          <HStack>
            <Text w="25%">음반사</Text>
            <Text w="70%" overflowWrap="break-word">
              {board.agency}
            </Text>
          </HStack>
          <HStack>
            <Text w="25%">판매가</Text>
            <Text
              as="span"
              color="#805AD5"
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              transition="1s all ease"
            >
              {board.price.toLocaleString()}{" "}
            </Text>
            <Text as="span" color="#805AD5" fontSize="base">
              원
            </Text>
          </HStack>
          <HStack mb={2}>
            <Text w="25%">발매일</Text>
            <Text>{formattedDate(board.releaseDate)}</Text>
          </HStack>
        </VStack>
      </HStack>
      {isAdmin && (
        <Flex
          mx={{ base: "5%", md: "10%", lg: "15%" }}
          mt={10}
          borderRadius={20}
          shadow="base"
          justifyContent="space-evenly"
        >
          <Button
            leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
            colorScheme="purple"
            w="50%"
            variant="ghost"
            onClick={() => navigate("/edit/" + id)}
          >
            상품 정보 수정하기
          </Button>
          <Button
            leftIcon={<FontAwesomeIcon icon={faTrashCan} />}
            colorScheme="red"
            w="50%"
            variant="ghost"
            onClick={onOpen}
          >
            상품 삭제하기
          </Button>
        </Flex>
      )}
      <Center>
        <Divider mt={10} w={{ base: "95%", md: "90%", lg: "85%" }} />
      </Center>
      <Text whiteSpace="break-spaces" mx={{ base: "5%", md: "10%", lg: "15%" }}>
        <Heading my={10}>앨범 소개</Heading>
        {board.content}
        <HStack my={10}>
          <FontAwesomeIcon icon={faTags} />
          {board.albumGenres.map((genre, index) => (
            <Tag colorScheme="purple" key={genre.id}>
              {genre.albumDetail === "K_POP" ? "K-POP" : genre.albumDetail}
            </Tag>
          ))}
        </HStack>
      </Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>상품 삭제</ModalHeader>
          <ModalCloseButton />
          <ModalBody>해당 상품을 삭제 하시겠습니까?</ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button w="30%" mr={5} onClick={handleDelete} colorScheme="red">
              삭제
            </Button>
            <Button w="30%" onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Center>
        <Divider mt={10} w={{ base: "95%", md: "90%", lg: "85%" }} />
      </Center>

      <CommentComponent
        boardId={id}
        loggedIn={loggedIn}
        email={email}
        isAdmin={isAdmin}
      />
    </>
  );
}
