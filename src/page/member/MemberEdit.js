import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CalendarIcon,
  CheckCircleIcon,
  LockIcon,
  QuestionIcon,
  SmallCloseIcon,
  ViewIcon,
  ViewOffIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { faAddressBook, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";
import { PostCode } from "../component/authUtils";

export function MemberEdit() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [address, setAddress] = useState("");
  const [postCode, setPostCode] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");

  const [gender, setGender] = useState("");
  const [age, setAge] = useState(0);

  const [nickNameValid, setNickNameValid] = useState(false);
  const [nickNameButtonClicked, setNickNameButtonClicked] = useState(false);
  const nickNameChecked = nickNameValid && nickNameButtonClicked;

  const [passwordValid, setPasswordValid] = useState(false);
  const passwordChecked = passwordValid && rePassword === password;
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  let updateData;

  // 멤버 불러오기
  useEffect(() => {
    getMember();
  }, []);

  function getMember() {
    const accessToken = localStorage.getItem("accessToken");
    console.log("엑세스 토큰", accessToken);
    axios
      .get("/member", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        console.log("getMember()의 then 실행");
        setMember(response.data);
        console.log("멤버 함수 결과 : " + response.data.id);
        setNickName(response.data.nickName);
        setAddress(response.data.address);
        setGender(response.data.gender);
        setAge(response.data.age);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("getMember()의 catch 실행");
          localStorage.removeItem("accessToken");
          sendRefreshToken();
          console.log("sendRefreshToken 호출");
        } else if (error.response.status === 403) {
          console.log("403에러");
        } else {
          console.log("그 외 에러");
        }
      });
  }

  // 기존 데이터 저장
  useEffect(() => {
    if (member !== null) {
      updateData = { ...member };
    }
  }, [member]);

  // 닉네임 중복 체크
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

  //패스워드 충족 기준 체크
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
    setNickNameButtonClicked(false);
    setNickNameValid(false);
  }, [nickName]);

  // 토큰 리프레쉬
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
        //navigate("/login");
      });
  }

  // 해당 멤버 존재하지 않을 경우 Spinner
  if (member === null) {
    return <Spinner />;
  }

  // 버튼 비활성화 지정
  // 수정 시 필수로 필요한 데이터 -> 패스워드
  // 나머지는 수정 안해도 괜찮도록 함

  // 백엔드로 전송
  const handleEdit = () => {
    // TODO: 데이터가 수정됐을 경우만 반영하도록 state hook 사용

    for (const field of [
      "gender",
      "age",
      "password",
      "nickName",
      "address",
      // "detailedAddress",
      // "postCode",
    ]) {
      if (updateData[field] !== eval(field)) {
        if (field === "age" && eval(field) === 0) {
          updateData[field] = null;
        } else {
          updateData[field] = eval(field);
        }
      }
    }

    axios
      .put(
        "/member/edit/" + member.id,
        {
          id: member.id,
          email: member.email,
          ...updateData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )
      .then(() => {
        toast({
          description: member.id + "번 회원이 수정 됐습니다.",
          status: "success",
        });
        navigate(-1);
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "요청이 잘못됐습니다",
            status: "error",
          });
        } else {
          toast({
            description: "수정 중에 문제가 발생했습니다",
            status: "error",
          });
        }
      })
      .finally(() => onClose());
  };

  const formLabelStyle = {
    color: "#805AD5",
    fontWeight: "bold",
    my: 5,
  };

  return (
    <>
      <Spacer h={120} />
      <Card mx={{ base: "5%", md: "10%", lg: "15%" }} transition="1s all ease">
        <CardHeader p={8}>
          <Heading display="flex" transition="1s all ease">
            <Text color="#805AD5">{member.nickName}</Text>님 정보 수정
          </Heading>
        </CardHeader>
        <CardBody p={10}>
          <Heading size="xs" mt={-14}>
            수정하지 않을 시 기존 정보가 보존됩니다
          </Heading>
          <FormControl>
            <FormLabel {...formLabelStyle}>닉네임</FormLabel>
            <InputGroup>
              <Input
                value={nickName}
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
          <FormControl isInvalid={password.length > 0 && !passwordValid}>
            <FormLabel {...formLabelStyle}>
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
              <FormLabel {...formLabelStyle}>비밀번호 확인</FormLabel>
              <InputGroup>
                <Input
                  type="password"
                  value={rePassword}
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
            <FormLabel {...formLabelStyle}>주소</FormLabel>
            <Stack spacing={3}>
              <HStack spacing={3}>
                <Input
                  type="number"
                  w="40%"
                  placeholder="우편번호"
                  readOnly
                  value={postCode}
                />
                <PostCode />
              </HStack>
              <Input type="text" value={address} readOnly placeholder="주소" />
              <Input
                type="text"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                placeholder="상세 주소"
              />
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="birth-date" {...formLabelStyle}>
              나이
            </FormLabel>
            <NumberInput
              defaultValue={age !== null ? age : 0}
              min={15}
              max={99}
              onChange={(value) => setAge(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel {...formLabelStyle}>성별</FormLabel>
            <ButtonGroup isAttached w="full">
              <Button
                borderLeftRadius={20}
                borderRightRadius={0}
                borderRightWidth={0}
                w="33%"
                colorScheme={gender === "Male" ? "purple" : "gray"}
                variant="solid"
                _focus={{ boxShadow: "none", outline: "none" }}
                onClick={() => setGender("Male")}
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
                onClick={() => setGender("Female")}
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
                onClick={() => setGender("Unidentified")}
              >
                밝히고 싶지 않음
              </Button>
            </ButtonGroup>
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
            isDisabled={!passwordChecked}
            onClick={onOpen}
          >
            수정
          </Button>
          <Button w={{ base: "full", md: "45%" }} onClick={() => navigate(-1)}>
            취소
          </Button>
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>수정 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleEdit} colorScheme="red">
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
