import {
  AbsoluteCenter,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  MenuItemOption,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faUser } from "@fortawesome/free-solid-svg-icons";
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

export function MemberSignup() {
  const [logId, setLogId] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [gender, setGender] = useState("Unidentified");
  const [birthDate, setBirthDate] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 사용 가능 여부 체크
  const [emailValid, setEmailValid] = useState(false);
  const [nickNameValid, setNickNameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordChecked, setPasswordChecked] = useState(false);

  const [emailButtonClicked, setEmailButtonClicked] = useState(false);
  const [nickNameButtonClicked, setNickNameButtonClicked] = useState(false);

  let emailChecked = emailButtonClicked && emailValid;
  let nickNameChecked = nickNameButtonClicked && nickNameValid;

  const toast = useToast();
  const navigate = useNavigate();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  function handleSubmit() {
    axios
      .post("/member/add", {
        email,
        password,
        nickName,
        birthDate: parseInt(birthDate, 10),
        gender,
      })
      .then(() => {
        toast({
          position: "top",
          description: "회원가입이 완료되었습니다",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            position: "top",
            description: "입력값을 확인해주세요",
            status: "error",
          });
        } else {
          toast({
            position: "top",
            description: "입력값을 확인해주세요",
            status: "error",
          });
        }
        toast({
          position: "top",
          description: "가입 도중 오류가 발생하였습니다",
          status: "error",
        });
      })
      .finally(() => console.log("done"));
  }
  function handleEmailCheck() {
    setEmailButtonClicked(true);

    const params = new URLSearchParams();
    params.set("email", encodeURIComponent(email));
    axios
      .get("/member/check", {
        params: params,
      })
      .then(() => {
        setEmailValid(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailValid(true);
        } else {
          setEmailValid(false);
        }
      });
  }

  function handleNickNameCheck() {
    setNickNameButtonClicked(true);
    axios
      .get("/member/check", {
        email,
      })
      .then(() => {
        setNickNameValid(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailValid(true);
        } else {
          setNickNameValid(false);
        }
      });
  }

  // function handleIdCheck() {
  //   const params = new URLSearchParams();
  //   params.set("logId", logId);
  //   axios
  //     .get("/member/check", {
  //       params: params,
  //     })
  //     .then(() => {
  //       setIdValid(false);
  //       toast({
  //         description: "이미 사용 중인 Id입니다.",
  //         status: "warning",
  //       });
  //     })
  //     .catch((error) => {
  //       if (error.response.status === 404) {
  //         setIdValid(true);
  //         toast({
  //           description: "사용 가능한 Id입니다.",
  //           status: "success",
  //         });
  //       }
  //     });
  // }

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

    if (rePassword === password) {
      setPasswordChecked(true);
    } else {
      setPasswordChecked(false);
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
      <Spacer h={10} />
      <Card
        width={{ base: "full", md: "50%", lg: "45%" }}
        ml={{ base: "none", md: "25%", lg: "25%" }}
      >
        <CardHeader>
          <Heading textAlign="center" fontFamily="GmarketSansMedium">
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
                      <CheckCircleIcon /> 사용 가능한 이메일입니다
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
                    isDisabled={emailChecked}
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
                      <CheckCircleIcon /> 사용 가능한 닉네임입니다
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
              <FormLabel htmlFor="birth-date">생년월일</FormLabel>
              <InputGroup>
                <InputLeftElement w="3rem">
                  <CalendarIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  id="birth-date"
                  type="text"
                  placeholder="YYMMDD"
                  maxLength={6}
                  borderRadius={20}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
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
                  colorScheme={gender == "Male" ? "purple" : "gray"}
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
                  colorScheme={gender == "Female" ? "purple" : "gray"}
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
                  colorScheme={gender == "Unidentified" ? "purple" : "gray"}
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
            {/* TODO: 소셜 로그인 기능 추가 */}
            <IconButton
              isRound={true}
              icon={<QuestionIcon />}
              // onClick={() => handleSocialLogin("KAKAO")}
            />
            <IconButton
              isRound={true}
              icon={<QuestionIcon />}
              // onClick={() => handleSocialLogin("NAVER")}
            />
            <IconButton
              isRound={true}
              icon={<QuestionIcon />}
              // onClick={() => handleSocialLogin("GOOGLE")}
            />
          </ButtonGroup>
        </CardBody>
        <CardFooter display="flex" justifyContent="center">
          <Button
            isDisabled={!(emailChecked && nickNameChecked && passwordValid)}
            onClick={handleSubmit}
            colorScheme="purple"
            w="full"
          >
            회원 가입하기
          </Button>
        </CardFooter>
      </Card>
      <Spacer h={50} />
    </Box>
  );
}
