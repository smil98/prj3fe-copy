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
import axiosInstance from "../../axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  CheckCircleIcon,
  EmailIcon,
  LockIcon,
  QuestionIcon,
  SmallCloseIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";

export function MemberSignup() {
  const [logId, setLogId] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Unidentified");
  const [birthDate, setBirthDate] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 사용 가능 여부 체크
  const [emailValid, setEmailValid] = useState(false);
  const [idValid, setIdValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordChecked, setPasswordChecked] = useState(false);

  let sameOriginEmail = false;
  let emailChecked = sameOriginEmail || emailValid;
  let sameOriginId = false;
  let idChecked = sameOriginId || idValid;

  const toast = useToast();
  const navigate = useNavigate();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  function handleSubmit() {
    axiosInstance
      .post("/member/add", {
        logId,
        password,
        email,
        name,
        gender,
        birthDate: parseInt(birthDate, 10),
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
          description: "가입중에 오류가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => console.log("done"));
  }
  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);
    axiosInstance
      .get("/member/check", {
        params: params,
      })
      .then(() => {
        setEmailValid(false);
        toast({
          description: "이미 사용 중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailValid(true);
          toast({
            description: "사용 가능한 email입니다.",
            status: "success",
          });
        }
      });
  }

  function handleIdCheck() {
    const params = new URLSearchParams();
    params.set("logId", logId);
    axiosInstance
      .get("/member/check", {
        params: params,
      })
      .then(() => {
        setIdValid(false);
        toast({
          description: "이미 사용 중인 Id입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdValid(true);
          toast({
            description: "사용 가능한 Id입니다.",
            status: "success",
          });
        }
      });
  }

  const handleGenderChange = (value) => {
    setGender(value);
  };

  //패스워드 점검
  useEffect(() => {
    if (password.length > 0) {
      const hasAlphabet = /[a-zA-Z]/.test(password);
      const hasSpecialChar = /[+\-!@#$%&*]/.test(password);
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

  return (
    <Box>
      <Spacer h={10} />
      <Card
        width={{ base: "full", md: "50%", lg: "45%" }}
        ml={{ base: "none", md: "25%", lg: "25%" }}
      >
        <CardHeader>
          <Heading textAlign="center">회원 가입</Heading>
          <Text textAlign="center" size="xs" mt={5}>
            이미 회원이라면?{"  "}
            <Button colorScheme="purple" variant="link">
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailValid(false);
                  }}
                />
                <InputLeftElement pointerEvents="none">
                  <EmailIcon color="gray.300" />
                </InputLeftElement>
                <InputRightElement w="6rem">
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
              {emailChecked && (
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setRePassword("");
                  }}
                />
                <InputLeftElement pointerEvents="none">
                  <LockIcon color="gray.300" />
                </InputLeftElement>
                <InputRightElement width="6rem">
                  <IconButton
                    isDisabled={password.length <= 0}
                    w="5rem"
                    h="1.75rem"
                    size="sm"
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
                    onChange={(e) => setRePassword(e.target.value)}
                  />
                  <InputLeftElement pointerEvents="none">
                    <LockIcon color="gray.300" />
                  </InputLeftElement>
                </InputGroup>
                {passwordChecked && (
                  <Text color="green.500" fontSize="sm" mt={2}>
                    <CheckCircleIcon /> 비밀번호가 일치합니다
                  </Text>
                )}
                <FormErrorMessage>
                  비밀번호가 일치하지 않습니다
                </FormErrorMessage>
              </FormControl>
            )}
            <FormControl>
              <FormLabel>이름</FormLabel>
              <Flex>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="birth-date">생년월일</FormLabel>
              <Input
                id="birth-date"
                type="text"
                placeholder="YYMMDD"
                maxLength={6}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
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
          <Heading textAlign="center" size="sm" mb={6}>
            소셜 계정으로 가입하기
          </Heading>
          <ButtonGroup
            w="80%"
            ml="10%"
            iconSpacing={5}
            varaint="outline"
            size="lg"
            spacing="4rem"
            justifyContent="center"
          >
            <IconButton isRound={true} icon={<QuestionIcon />} />
            <IconButton isRound={true} icon={<QuestionIcon />} />
            <IconButton isRound={true} icon={<QuestionIcon />} />
          </ButtonGroup>
        </CardBody>
        <CardFooter display="flex" justifyContent="center">
          <Button onClick={handleSubmit} colorScheme="purple" w="full">
            회원 가입하기
          </Button>
        </CardFooter>
      </Card>
      <Spacer h={50} />
    </Box>
  );
}
