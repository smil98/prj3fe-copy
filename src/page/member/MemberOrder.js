import {
  AbsoluteCenter,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendRefreshToken } from "../component/authUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export function MemberOrder() {
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/member/order/` + id)
      .then((response) => {
        if (response.data !== null) {
          setOrderList(response.data);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("accessToken");
          sendRefreshToken();
          console.log("sendRefreshToken 호출");
        } else if (error.response && error.response.status === 403) {
          toast({
            description: "접근이 거부되었습니다",
            status: "error",
          });
        } else {
          toast({
            description: "오류가 발생했습니다",
            status: "error",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (orderList.length === 0 && !loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
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
            구매 내역이 존재하지 않습니다
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
    );
  }

  return (
    <>
      <Spacer h={150} />
      <Heading>주문 내역</Heading>
      {orderList.map((orderName, index) => (
        <FormControl key={index}>
          <FormLabel>Order Name {index + 1}</FormLabel>
          <Input type="text" value={orderName} readOnly />
        </FormControl>
      ))}
      <Spacer h={150} />
      <Heading mx={{ base: "5%", md: "10%", lg: "15%" }} my={5}>
        주문 내역
      </Heading>
      <TableContainer
        mx={{ base: "5%", md: "10%", lg: "15%" }}
        p={5}
        transition="0.5s all ease"
      >
        <Table>
          <Thead>
            <Tr>
              <Th textAlign="center">번호</Th>
              <Th textAlign="center">주문명</Th>
              <Th textAlign="center">가격</Th>
              <Th textAlign="center">시간</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderList.map((order, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{order}</Td>
                <Td>{order.price}</Td>
                <Td>{order.regTime}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
