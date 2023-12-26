import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export function MemberSignup() {
  const [logId, setLogId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("Unidentified");
  const [birthDate, setBirthDate] = useState("");
  const [firstDigit, setFirstDigit] = useState("");
  const [role, setRole] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [idAvailable, setIdAvailable] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  let sameOriginEmail = false;
  let emailChecked = sameOriginEmail || emailAvailable;
  let sameOriginId = false;
  let idChecked = sameOriginId || idAvailable;

  let passwordChecked = false;
  if (passwordCheck === password) {
    passwordChecked = true;
  }
  if (password.length === 0) {
    passwordChecked = true;
  }

  function handleSubmit() {
    axiosInstance
      .post("/member/add", {
        logId,
        password,
        email,
        name,
        address,
        gender,
        birthDate: parseInt(birthDate, 10),
        firstDigit: parseInt(firstDigit, 10),
        // gender: role,
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
        setEmailAvailable(false);
        toast({
          description: "이미 사용 중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
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
        setIdAvailable(false);
        toast({
          description: "이미 사용 중인 Id입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
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

  return (
    <Box>
      <Spacer h={10} />
      {/* card안에 있던 내용//backgroundColor={"#fae0ea"} overflow={"hidden"}*/}
      <Card
        width={{ base: "full", md: "50%", lg: "45%" }}
        ml={{ base: "none", md: "25%", lg: "25%" }}
      >
        {/*backgroundColor="#b4c0ea":헤더에 있던거*/}
        <CardHeader>
          <Heading textAlign="center">회원 가입</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>아이디</FormLabel>
              <HStack spacing={2}>
                <Input
                  value={logId}
                  onChange={(e) => {
                    setLogId(e.target.value);
                    setIdAvailable(false);
                  }}
                />
                <Button isDisabled={idChecked} onClick={handleIdCheck}>
                  중복 확인
                </Button>
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>비밀번호</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormErrorMessage>암호를 입력해 주세요.</FormErrorMessage>
            </FormControl>
            {password.length > 0 && (
              <FormControl isInvalid={!passwordChecked}>
                <FormLabel>비밀번호 재입력</FormLabel>
                <Input
                  type="password"
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />
                <FormErrorMessage>
                  패스워드가 일치하지 않습니다
                </FormErrorMessage>
              </FormControl>
            )}
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <HStack spacing={2}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailAvailable(false);
                  }}
                />
                <Button isDisabled={emailChecked} onClick={handleEmailCheck}>
                  중복 확인
                </Button>
              </HStack>
            </FormControl>
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
            {/*<FormControl>*/}
            {/*  <FormLabel>주소</FormLabel>*/}
            {/*  <Flex>*/}
            {/*    <Input*/}
            {/*      maxWidth={600}*/}
            {/*      value={address}*/}
            {/*      onChange={(e) => {*/}
            {/*        setAddress(e.target.value);*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </Flex>*/}
            {/*</FormControl>*/}

            <FormControl isRequired>
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
            <FormControl isRequired>
              <FormLabel>성별</FormLabel>
              <ButtonGroup onChange={handleGenderChange} isAttached>
                <Button
                  borderLeftRadius={20}
                  borderRightRadius={0}
                  borderRightWidth={0}
                  variant={gender === "Male" ? "solid" : "outline"}
                  value="Male"
                  onClick={() => handleGenderChange("Male")}
                >
                  남
                </Button>
                <Button
                  borderRadius={0}
                  variant={gender === "Female" ? "solid" : "outline"}
                  value="Female"
                  onClick={() => handleGenderChange("Female")}
                >
                  여
                </Button>
                <Button
                  borderLeftRadius={0}
                  borderLeftWidth={0}
                  borderRightRadius={20}
                  variant={gender === "Unidentified" ? "solid" : "outline"}
                  value="Unidentified"
                  onClick={() => handleGenderChange("Unidentified")}
                >
                  밝히고 싶지 않음
                </Button>
              </ButtonGroup>
              {/*<FormLabel htmlFor="first-digit">*/}
              {/*  주민등록번호 뒷자리 첫 번째 숫자*/}
              {/*</FormLabel>*/}
              {/*<Input*/}
              {/*  id="first-digit"*/}
              {/*  type="text"*/}
              {/*  placeholder="1"*/}
              {/*  maxLength={1}*/}
              {/*  maxWidth={50}*/}
              {/*  value={firstDigit}*/}
              {/*  onChange={(e) => setFirstDigit(e.target.value)}*/}
              {/*/>*/}
            </FormControl>
            {/*<FormControl isRequired>*/}
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
        </CardBody>

        <CardFooter>
          <Button onClick={handleSubmit}>
            {/*backgroundColor="#b4c0ea": 버튼 온 클릭뒤에 있던거*/}
            회원 가입
          </Button>
        </CardFooter>
      </Card>
      <Spacer h={50} />
    </Box>
  );
}
