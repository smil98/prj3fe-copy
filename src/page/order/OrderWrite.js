import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  Select,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { CartDisplay } from "./CartDisplay";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export function OrderWrite() {
  const [name, setName] = useState("");
  const toast = useToast();
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(10000); // 가정된 아이템 가격
  const [email, setEmail] = useState("");
  const [emailType, setEmailType] = useState("");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [customEmail, setCustomEmail] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // 총 가격
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderName, setOrderName] = useState("");
  const [items, setItems] = useState([]);

  const fetchList = () => {
    axios
      .get("/cart/fetch", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setItems(response.data);

        if (response.data.length > 1) {
          const newOrderName = `${response.data[0].title} 외 ${
            response.data.length - 1
          } 건`;
          setOrderName(newOrderName);
        } else if (response.data.length === 1) {
          const newOrderName = `${response.data[0].title}`;
          setOrderName(newOrderName);
        } else {
          setOrderName("주문 없음");
        }

        const newTotalPrice = response.data.reduce((total, item) => {
          return total + (item.count || 0) * item.price;
        }, 0);
        setTotalPrice(newTotalPrice);
      })
      .catch((error) => {
        console.log(error.response.data);
        toast({
          description: "상품 불러오기에 실패했습니다.",
          status: "error",
        });
      });
  };

  useEffect(() => {
    fetchList();
  }, []);

  // ===========================================

  function getMember() {
    axios
      .get("/api/order", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log("getMember()의 then 실행");
        // setMember(response.data);
        const memberData = response.data;
        setName(memberData.name); // 예: 응답에서 'name' 필드 사용

        const [userName, domain] = memberData.email.split("@");
        setEmail(userName);
        setEmailType(domain);

        setAddress(memberData.address); // 예: 응답에서 'address' 필드 사용
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
        //navigate("/login");
        toast({
          description: "권한이 없습니다",
          status: "warning",
        });
      });
  }
  useEffect(() => {
    getMember();
  }, []);

  const handleSubmit = async () => {
    try {
      // 요청을 위한 데이터 생성
      const requestData = {
        orderId: nanoid(),
        orderName: orderName, // 실제 아이템 이름의 일부를 사용
        amount: totalPrice,
        // 나머지 필요한 데이터
        name,
        address,
        email, // 사용자 이메일
        // ...
      };
      const serverData = {
        ...requestData,
        paymentUid: requestData.orderId,
        paymentName: requestData.orderName,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      };
      delete requestData.orderId;
      delete requestData.orderName;
      // 서버에 POST 요청 보내기
      const response = await axios.post("/payment/toss", serverData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      //응답 데이터를 사용하여 Payment페이지로 넘기기
      navigate("/payment", {
        state: {
          ...response.data,
        },
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
    }
  };

  return (
    <div>
      <Heading my={3}>주문 페이지</Heading>
      <CartDisplay
        accessToken={accessToken}
        orderName={orderName}
        totalPrice={totalPrice}
        items={items}
        fetchList={fetchList}
        toast={toast}
      />
      <Card my={5}>
        <CardHeader>
          <Heading size="md">
            <FontAwesomeIcon icon={faPenToSquare} mr={3} /> 주문 정보 입력
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={5}>
            <HStack spacing={3}>
              <Text w="10%" fontWeight="bold">
                이름
              </Text>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
              />
            </HStack>
            <Text fontWeight="bold">배송지</Text>
            <HStack spacing={3}>
              <Input
                type="number"
                w="70%"
                placeholder="우편번호를 입력하세요"
              />
              <Button w="30%" onClick={onOpen}>
                우편번호 찾기
              </Button>
            </HStack>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="상세 주소를 입력하세요"
            />
            <Checkbox defaultChecked>
              해당 주소를 기본 배송지로 저장하기
            </Checkbox>
            <HStack>
              <Text w="10%" fontWeight="bold">
                이메일
              </Text>
              <Input
                w="50%"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
              />
              <Text w="5%" textAlign="center">
                @
              </Text>
              <Select
                w="35%"
                value={emailType}
                onChange={(e) => {
                  if (e.target.value !== "custom") {
                    setCustomEmail(false);
                    setEmailType(e.target.value);
                  } else {
                    setCustomEmail(true);
                    setEmailType("");
                  }
                }}
              >
                {customEmail ? (
                  <>
                    <option value="custom">직접 입력</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="naver.com">naver.com</option>
                    <option value="daum.net">daum.net</option>
                  </>
                ) : (
                  <>
                    <option value="gmail.com">gmail.com</option>
                    <option value="naver.com">naver.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="custom">직접 입력</option>
                  </>
                )}
              </Select>
            </HStack>
            {customEmail && (
              <Input
                value={emailType}
                placeholder="기타 도메인을 입력해주세요"
                onChange={(e) => setEmailType(e.target.value)}
              />
            )}
          </Stack>
        </CardBody>
        <CardFooter style={{ display: "flex", justifyContent: "center" }}>
          <Button colorScheme={"orange"} onClick={handleSubmit} mr={2}>
            주문하기
          </Button>
          <Button onClick={() => navigate(-1)}>취소</Button>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>우편번호 찾기 팝업 API</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>우편번호</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
