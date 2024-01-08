import { useContext, useEffect, useState } from "react";
import {
  AbsoluteCenter,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spacer,
  Spinner,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import {
  EmailIcon,
  LockIcon,
  QuestionIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import axios from "axios";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleSocialLogin } from "../component/authUtils";

export function MemberLogin() {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  // const [imagePrefix, setImagePrefix] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  function handleLogin() {
    axios
      .post("/login", { email, password })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        toast({
          description: "로그인 되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "이메일 혹은 비밀번호가 틀렸습니다.",
          status: "error",
        });
      });
  }

  return (
    <>
      <Spacer h={150} />
      <Card
        width={{ base: "full", md: "60%", lg: "50%" }}
        ml={{ base: "none", md: "20%", lg: "25%" }}
      >
        <CardHeader>
          <Heading textAlign="center" my={5}>
            회원 로그인
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <InputGroup>
                <Input
                  type="email"
                  value={email}
                  borderRadius={20}
                  placeholder="이메일을 입력하세요"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <InputLeftElement pointerEvents="none" w="3rem">
                  <EmailIcon color="gray.300" />
                </InputLeftElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>비밀번호</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="비밀번호를 입력하세요"
                  borderRadius={20}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <InputLeftElement pointerEvents="none" w="3rem">
                  <LockIcon color="gray.300" />
                </InputLeftElement>
                <InputRightElement width="5rem">
                  <IconButton
                    isDisabled={password.length <= 0}
                    w="3rem"
                    h="1.75rem"
                    size="sm"
                    color="gray.300"
                    variant="undefined"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Stack>
          <Button colorScheme="purple" mt={10} w="full" onClick={handleLogin}>
            로그인
          </Button>
          <Box position="relative" padding="3" mt={5}>
            <Divider my={2} />
            <AbsoluteCenter bg="white" px={5}>
              <Heading size="sm" color="purple">
                OR
              </Heading>
            </AbsoluteCenter>
          </Box>
          <Heading textAlign="center" size="sm" my={5} color="purple">
            소셜 계정으로 로그인하기
          </Heading>
          <ButtonGroup
            w="80%"
            ml="10%"
            mt={3}
            iconspacing={5}
            varaint="outline"
            size="lg"
            spacing="4rem"
            justifyContent="center"
          >
            <IconButton
              isRound={true}
              bgColor="#FEE500"
              color="#191919"
              variant="undefined"
              icon={<FontAwesomeIcon icon={faComment} />}
              onClick={() => handleSocialLogin("KAKAO")}
            />
            <IconButton
              isRound={true}
              vairant="undefined"
              onClick={() => handleSocialLogin("NAVER")}
            >
              <Image src="/naverButton.png" boxSize="100%" objectFit="fit" />
            </IconButton>
            <IconButton
              isRound={true}
              variant="undefined"
              onClick={() => handleSocialLogin("GOOGLE")}
            >
              <Image src="/googleButton.png" boxSize="100%" objectFit="fit" />
            </IconButton>
          </ButtonGroup>
        </CardBody>
        <CardFooter display="flex" justifyContent="center">
          <Text textAlign="center" size="xs">
            아직 회원이 아니라면?{"  "}
            <Button
              colorScheme="purple"
              variant="link"
              onClick={() => navigate("/signup")}
            >
              회원 가입하기
            </Button>
          </Text>
        </CardFooter>
      </Card>
    </>
  );
}
