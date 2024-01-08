import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberView() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    getMember(id);
  }, []);

  if (member === null) {
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

  function getMember(memberId) {
    const accessToken = localStorage.getItem("accessToken");
    console.log("엑세스 토큰", accessToken);
    axios
      .get(`/member/${memberId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log("getMember()의 then 실행");
        console.log(response.data);
        setMember(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log("getMember()의 catch 실행");
          localStorage.removeItem("accessToken");
          sendRefreshToken();
          console.log("sendRefreshToken 호출");
        } else if (error.response && error.response.status === 403) {
          toast({
            description: "접근이 거부되었습니다",
            status: "error",
          });
          console.log("403에러!!!");
        } else {
          toast({
            description: "오류가 발생했습니다",
            status: "error",
          });
          console.log("그 외 에러");
        }
      });
  }

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
        getMember();
      })
      .catch((error) => {
        console.log("sendRefreshToken()의 catch 실행");
        localStorage.removeItem("refreshToken");
        toast({
          description: "권한이 없습니다",
          status: "warning",
        });
        navigate("/login");
      });
  }

  function handleDelete() {
    axios
      .delete("/member/delete/" + member.id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.log("회원 탈퇴 성공");
      })
      .catch(() => console.log("회원 탈퇴 실패"))
      .finally(() => {
        console.log("해치웠나");
        onClose();
        navigate("/");
        window.location.reload();
      });
  }

  const formattedEmail = () => {
    const email = member.email;

    if (email) {
      const [username, domain] = email.split("@");
      const maskedUsername =
        username.slice(0, 2) + "*".repeat(username.length - 2);
      return `${maskedUsername}@${domain}`;
    }
    return "";
  };

  const labelStyles = {
    color: "#805AD5",
    fontWeight: "bold",
    my: 3,
    mx: 4,
  };

  return (
    <>
      <Spacer h={150} />
      <Card mx={{ base: "5%", md: "10%", lg: "15%" }} transition="1s all ease">
        <CardHeader pt={8} px={8}>
          <Heading display="flex" transition="1s all ease">
            <Text color="#805AD5">{member.nickName}</Text>님 정보
          </Heading>
        </CardHeader>
        <CardBody px={5}>
          <FormControl>
            <FormLabel {...labelStyles}>닉네임</FormLabel>
            <Input value={member.nickName} variant="undefined" readOnly />
          </FormControl>
          <FormControl>
            <FormLabel {...labelStyles}>이메일</FormLabel>
            <Input value={formattedEmail()} variant="undefined" readOnly />
          </FormControl>
          <FormControl>
            <FormLabel {...labelStyles}>주소</FormLabel>
            <Input
              type="text"
              variant="undefined"
              value={member.address}
              readOnly
            />
          </FormControl>
          <FormControl>
            <FormLabel {...labelStyles}>나이</FormLabel>
            <Input
              type="text"
              variant="undefined"
              value={member.age}
              readOnly
            />
          </FormControl>
          <FormControl>
            <FormLabel {...labelStyles}>성별</FormLabel>
            <Input
              type="text"
              variant="undefined"
              value={member.gender}
              readOnly
            />
          </FormControl>
        </CardBody>
        <CardFooter
          display={{ base: "block", md: "flex" }}
          justifyContent="center"
        >
          <Button
            colorScheme="purple"
            w={{ base: "full", md: "45%" }}
            mb={{ base: 5, md: 0 }}
            mr={{ base: 0, md: 5 }}
            onClick={() => navigate("/medit/" + member.id)}
          >
            수정
          </Button>
          <Button
            colorScheme="red"
            w={{ base: "full", md: "45%" }}
            onClick={onOpen}
          >
            탈퇴
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
