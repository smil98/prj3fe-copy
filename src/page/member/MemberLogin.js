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

export function MemberLogin() {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  // const [imagePrefix, setImagePrefix] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchImagePrefix = async () => {
  //     try {
  //       const response = await axios.get("/api/login/image");
  //       setImagePrefix(response.data);
  //     } catch (error) {
  //       console.error("error fetching image prefix", error);
  //     }
  //   };
  //   fetchImagePrefix();
  // }, []);

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
          description: "아이디나 비밀번호가 틀렸습니다.",
          status: "error",
        });
      });
  }

  // if (imagePrefix === "") {
  //   return <Spinner />;
  // }

  const handleSocialLogin = (socialLoginType) => {
    axios
      .get(`/api/auth/${socialLoginType}`)
      .then((response) => {
        console.log(response.data);
        window.location.href = response.data;
      })
      .catch((error) => console.log(error))
      .finally(() => console.log(`${socialLoginType} 로그인`));
  };

  return (
    <Card
      width={{ base: "full", md: "50%", lg: "45%" }}
      ml={{ base: "none", md: "25%", lg: "25%" }}
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
                  variant="ghost"
                  _hover="none"
                  _active="none"
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
          {/* TODO: 소셜 로그인 기능 추가 */}
          <IconButton
            isRound={true}
            icon={<QuestionIcon />}
            onClick={() => handleSocialLogin("KAKAO")}
          />
          <IconButton
            isRound={true}
            icon={<QuestionIcon />}
            onClick={() => handleSocialLogin("NAVER")}
          />
          <IconButton
            isRound={true}
            icon={<QuestionIcon />}
            onClick={() => handleSocialLogin("GOOGLE")}
          />
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
  );
}
