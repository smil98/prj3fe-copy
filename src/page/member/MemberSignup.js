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
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  CalendarIcon,
  CheckCircleIcon,
  EmailIcon,
  LockIcon,
  QuestionIcon,
  SmallCloseIcon,
  ViewIcon,
  ViewOffIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import axios from "axios";
import { handleSocialLogin } from "../component/authUtils";

export function MemberSignup() {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [gender, setGender] = useState("Unidentified");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 사용 가능 여부 체크
  const [emailValid, setEmailValid] = useState(false);
  const [nickNameValid, setNickNameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const [emailButtonClicked, setEmailButtonClicked] = useState(false);
  const [nickNameButtonClicked, setNickNameButtonClicked] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const nickNameChecked = nickNameValid && nickNameButtonClicked;
  const passwordChecked = passwordValid && rePassword === password;
  const emailChecked = emailValid && emailButtonClicked;

  function handleSubmit() {
    axios
      .post("/member/add", {
        email,
        password,
        nickName,
        age,
        gender,
      })
      .then(() => {
        toast({
          description: "회원가입이 완료되었습니다",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "입력값을 확인해주세요",
            status: "error",
          });
        } else {
          toast({
            description: "입력값을 확인해주세요",
            status: "error",
          });
        }
        toast({
          description: "가입 도중 오류가 발생하였습니다",
          status: "error",
        });
      })
      .finally(() => console.log("done"));
  }
  async function handleEmailCheck() {
    setEmailButtonClicked(true);
    console.log("Before try-catch, emailButtonClicked: ", emailButtonClicked);

    try {
      console.log("Before Axios request");
      await axios.get("/member/check?email=" + email);
      setEmailValid(false);
    } catch (error) {
      if (error.response.status === 404) {
        setEmailValid(true);
        console.log("emailValid after 404: ", emailValid);
      } else if (error.response.status === 431) {
        console.log("Header too large again?");
      } else {
        setEmailValid(false);
      }
    } finally {
      console.log("Axios request finished");
      console.log(emailChecked);
    }
  }

  async function handleNickNameCheck() {
    setNickNameButtonClicked(true);
    console.log(
      "Before try-catch, NickNameButtonClicked: ",
      nickNameButtonClicked,
    );

    try {
      await axios.get("/member/check", {
        params: {
          nickName: nickName,
        },
      });
      setNickNameValid(false);
    } catch (error) {
      if (error.response.status === 404) {
        setNickNameValid(true);
        console.log("nickNamevalid after 404: ", nickNameValid);
      } else {
        setNickNameValid(false);
      }
    } finally {
      console.log("Axios request finished");
      console.log(nickNameChecked);
    }
  }

  const handleGenderChange = (value) => {
    setGender(value);
  };

  //패스워드 점검
  useEffect(() => {
    if (password.length > 0) {
      const hasAlphabet = /[a-zA-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
      const hasNumber = /\d/.test(password);

      const combinationsCount = [hasAlphabet, hasSpecialChar, hasNumber].filter(
        Boolean,
      ).length;

      if (combinationsCount >= 2 && password.length >= 6) {
        setPasswordValid(true);
        setPasswordErrorMessage("");
      } else {
        setPasswordValid(false);
        setPasswordErrorMessage(
          "비밀번호는 6자리 이상이어야 하며, 영문, 숫자, 특수문자 중 두 가지 이상을 포함해야 합니다.",
        );
      }
    } else {
      setPasswordValid(false);
      setPasswordErrorMessage("패스워드를 입력해주세요.");
    }
  }, [password, rePassword]);

  useEffect(() => {
    setEmailButtonClicked(false);
    setEmailValid(false);
  }, [email]);

  useEffect(() => {
    setNickNameButtonClicked(false);
    setNickNameValid(false);
  }, [nickName]);

  return (
    <Box>
      <Spacer h={120} />
      <Card
        width={{ base: "full", md: "60%", lg: "50%" }}
        ml={{ base: "none", md: "20%", lg: "25%" }}
      >
        <CardHeader>
          <Heading textAlign="center" mt={5} fontFamily="GmarketSansMedium">
            회원 가입
          </Heading>
          <Text textAlign="center" size="xs" mt={5}>
            이미 회원이라면?{"  "}
            <Button
              colorScheme="purple"
              variant="link"
              onClick={() => navigate("/login")}
            >
              로그인
            </Button>
          </Text>
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
                <InputRightElement w="7rem">
                  <Button
                    w="5rem"
                    h="1.75rem"
                    size="sm"
                    isDisabled={emailChecked}
                    onClick={handleEmailCheck}
                  >
                    중복 확인
                  </Button>
                </InputRightElement>
              </InputGroup>
              {emailButtonClicked && (
                <>
                  {emailValid ? (
                    <Text color="green.500" fontSize="sm" mt={2}>
                      <CheckCircleIcon mb={1} /> 사용 가능한 이메일입니다
                    </Text>
                  ) : (
                    <Text color="red.500" fontSize="sm" mt={2}>
                      <SmallCloseIcon /> 사용 불가능한 이메일입니다
                    </Text>
                  )}
                </>
              )}
            </FormControl>
            <FormControl isInvalid={password.length > 0 && !passwordValid}>
              <FormLabel>
                <HStack>
                  <Text>비밀번호</Text>{" "}
                  <Tooltip
                    hasArrow
                    placement="right"
                    label="비밀번호는 6자리 이상이어야 하며, 영문, 숫자, 또는 특수문자 중 두 가지 이상을 포함해야 합니다."
                    fontSize="xs"
                  >
                    <QuestionIcon color="purple" size="xs" />
                  </Tooltip>
                </HStack>
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="비밀번호를 입력하세요"
                  borderRadius={20}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setRePassword("");
                  }}
                />
                <InputLeftElement pointerEvents="none" w="3rem">
                  <LockIcon color="gray.300" />
                </InputLeftElement>
                <InputRightElement width="7rem">
                  <IconButton
                    isDisabled={password.length <= 0}
                    w="5rem"
                    h="1.75rem"
                    size="sm"
                    color="gray.300"
                    variant="undefined"
                    _active="none"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{passwordErrorMessage}</FormErrorMessage>
            </FormControl>
            {passwordValid && (
              <FormControl isInvalid={!passwordChecked}>
                <FormLabel>비밀번호 확인</FormLabel>
                <InputGroup>
                  <Input
                    type="password"
                    value={rePassword}
                    borderRadius={20}
                    onChange={(e) => setRePassword(e.target.value)}
                  />
                  <InputLeftElement pointerEvents="none" w="3rem">
                    <LockIcon color="gray.300" />
                  </InputLeftElement>
                </InputGroup>
                {passwordChecked && (
                  <Text color="green.500" fontSize="sm" mt={2}>
                    <CheckCircleIcon mb={1} /> 비밀번호가 일치합니다
                  </Text>
                )}
                <FormErrorMessage>
                  <WarningTwoIcon mr={1} /> 비밀번호가 일치하지 않습니다
                </FormErrorMessage>
              </FormControl>
            )}
            <FormControl>
              <FormLabel>닉네임</FormLabel>
              <InputGroup>
                <Input
                  value={nickName}
                  borderRadius={20}
                  placeholder="닉네임을 입력하세요"
                  onChange={(e) => {
                    setNickName(e.target.value);
                  }}
                />
                <InputLeftElement w="3rem">
                  <FontAwesomeIcon icon={faUser} color="#CBD5E0" />
                </InputLeftElement>
                <InputRightElement w="7rem">
                  <Button
                    w="5rem"
                    h="1.75rem"
                    size="sm"
                    onClick={handleNickNameCheck}
                  >
                    중복 확인
                  </Button>
                </InputRightElement>
              </InputGroup>
              {nickNameButtonClicked && (
                <>
                  {nickNameValid ? (
                    <Text color="green.500" fontSize="sm" mt={2}>
                      <CheckCircleIcon mb={1} /> 사용 가능한 닉네임입니다
                    </Text>
                  ) : (
                    <Text color="red.500" fontSize="sm" mt={2}>
                      <SmallCloseIcon /> 사용 불가능한 닉네임입니다
                    </Text>
                  )}
                </>
              )}
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="birth-date">나이</FormLabel>
              <InputGroup>
                <InputLeftElement w="3rem">
                  <CalendarIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="number"
                  placeholder="나이"
                  min={14}
                  borderRadius={20}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>성별</FormLabel>
              <ButtonGroup onChange={handleGenderChange} isAttached w="full">
                <Button
                  borderLeftRadius={20}
                  borderRightRadius={0}
                  borderRightWidth={0}
                  w="33%"
                  colorScheme={gender === "Male" ? "purple" : "gray"}
                  variant="solid"
                  value="Male"
                  _focus={{ boxShadow: "none", outline: "none" }}
                  onClick={() => handleGenderChange("Male")}
                >
                  남
                </Button>
                <Button
                  borderTopRadius={0}
                  borderBottomRadius={0}
                  w="33%"
                  colorScheme={gender === "Female" ? "purple" : "gray"}
                  variant="solid"
                  _focus={{ boxShadow: "none", outline: "none" }}
                  onClick={() => handleGenderChange("Female")}
                >
                  여
                </Button>
                <Button
                  borderLeftRadius={0}
                  borderLeftWidth={0}
                  borderRightRadius={20}
                  w="33%"
                  colorScheme={gender === "Unidentified" ? "purple" : "gray"}
                  variant="solid"
                  value="Unidentified"
                  _focus={{ boxShadow: "none", outline: "none" }}
                  onClick={() => handleGenderChange("Unidentified")}
                >
                  밝히고 싶지 않음
                </Button>
              </ButtonGroup>
            </FormControl>
            {/*<FormControl>*/}
            {/*  <FormLabel htmlFor="role">역할</FormLabel>*/}
            {/*  <Select*/}
            {/*    id="role"*/}
            {/*    placeholder="역할 선택"*/}
            {/*    value={role}*/}
            {/*    onChange={(e) => setRole(e.target.value)}*/}
            {/*  >*/}
            {/*    <option value="ROLE_ADMIN">관리자</option>*/}
            {/*    <option value="ROLE_USER">사용자</option>*/}
            {/*  </Select>*/}
            {/*</FormControl>*/}
          </Stack>
          <Box position="relative" padding="15">
            <Divider my={6} />
            <AbsoluteCenter bg="white" px={5}>
              <Heading size="sm" color="purple">
                OR
              </Heading>
            </AbsoluteCenter>
          </Box>
          <Heading textAlign="center" size="sm" mb={6} color="purple">
            소셜 계정으로 가입하기
          </Heading>
          <ButtonGroup
            w="80%"
            ml="10%"
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
          <Button
            isDisabled={!(emailChecked && nickNameChecked && passwordChecked)}
            onClick={handleSubmit}
            colorScheme="purple"
            w="full"
          >
            회원 가입하기
          </Button>
        </CardFooter>
      </Card>
    </Box>
  );
}
