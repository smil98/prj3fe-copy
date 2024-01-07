import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
  HStack,
  IconButton,
  Image,
  AbsoluteCenter,
  Checkbox,
  Button,
  ButtonGroup,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, MinusIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { sendRefreshToken } from "../component/authUtils";

function MyNumberInput({ cartItemId, accessToken, count, fetchList, toast }) {
  const handleAddCount = () => {
    axios
      .get(`/cart/addCount/${cartItemId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        console.log("증가");
      })
      .catch(() => {
        toast({
          title: "재고가 없습니다",
          description: "자세한 사항은 관리자를 통해 문의하세요.",
          status: "error",
          position: "top",
        });
      })
      .finally(() => fetchList());
  };

  //오더 네임, 총 가격 넘기기

  const handleSubtractCount = () => {
    if (count !== 1) {
      axios
        .get(`/cart/subtractCount/${cartItemId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then(() => {
          console.log("감소");
          fetchList();
        })
        .catch(() => {})
        .finally(() => fetchList());
    } else {
      toast({
        title: "한 개 이상 주문 가능합니다",
        position: "top",
        description: "취소를 원하시면 x 버튼을 눌러주세요.",
        status: "error",
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label="inc"
        icon={<AddIcon />}
        onClick={handleAddCount}
        variant="outline"
      />
      <Text width="20px" textAlign="center">
        {count}
      </Text>
      <IconButton
        aria-label="dec"
        icon={<MinusIcon />}
        variant="outline"
        onClick={handleSubtractCount}
      />
    </>
  );
}

export function CartDisplay({
  accessToken,
  orderName,
  totalPrice,
  items,
  fetchList,
  toast,
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectAllItems = (isChecked) => {
    if (isChecked) {
      setSelectedItems(items.map((item) => item.cartItemId));
    } else {
      setSelectedItems([]);
    }
  };

  function handleCheckBoxChange(item) {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(item.cartItemId)
        ? prevSelectedItems.filter(
            (cartItemId) => cartItemId !== item.cartItemId,
          )
        : [...prevSelectedItems, item.cartItemId],
    );
  }

  const handleDeleteItem = ({ item }) => {
    console.log(item.title + "삭제 요청 전송하는 함수");

    axios
      .delete(`/cart/delete/${item.cartItemId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        toast({
          description: "성공적으로 삭제했습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        console.log(error.response.data);
        toast({
          description: "삭제 요청 중 에러가 발생했습니다.",
          status: "error",
        });
      })
      .finally(() => {
        console.log("삭제 요청 끝");
        fetchList();
      });
  };

  // @@
  function handleAllToLiked(selectedItems) {
    if (selectedItems.length !== 0) {
      axios
        .post(
          "/cart/move",
          { selectedItems: selectedItems },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        )
        .then(() => {
          setSelectedItems([]);
          fetchList();
        })
        .catch((error) => {
          toast({
            title: "상품을 찜한 목록에 옮기는데 실패했습니다",
            description: "다시 시도하거나 관리자에게 문의하세요",
            status: "error",
          });
          if (error.response.data === 401) {
            sendRefreshToken();
          }
          setSelectedItems(selectedItems);
        });
    } else {
      toast({
        title: "선택된 상품이 없습니다",
        description: "원하시는 상품을 선택해주세요",
        status: "warning",
      });
    }
  }

  //@@
  function handleDeleteCartItem(selectedItems) {
    if (selectedItems.length !== 0) {
      axios
        .delete("/cart/delete/cartItems", {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { selectedItems: selectedItems.join(",") },
        })
        .then(() => {
          setSelectedItems([]);
          fetchList();
        })
        .catch((error) => {
          if (error.response.data === 401) {
            sendRefreshToken();
            toast({
              title: "상품 지우기에 실패했습니다",
              description: "다시 한 번 시도해주세요",
              status: "error",
            });
          } else {
            toast({
              title: "상품 지우기에 실패했습니다",
              description:
                "다시 한 번 시도해보시고, 계속 실패할 경우 관리자에게 문의 바랍니다.",
              status: "error",
            });
          }
        });
    } else {
      toast({
        title: "선택된 상품이 없습니다",
        description: "삭제하려는 상품을 선택해주세요",
        status: "warning",
      });
    }
  }

  return (
    <Card mx={{ base: "5%", md: "10%", lg: "15%" }} transition="1s all ease">
      <CardHeader px={5}>
        <Heading size="md" alignItems="center">
          <FontAwesomeIcon icon={faList} /> {orderName}
        </Heading>
      </CardHeader>
      <CardBody>
        <Flex
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Checkbox
            colorScheme="purple"
            isChecked={selectedItems.length === items.length}
            onChange={(e) => handleSelectAllItems(e.target.checked)}
          >
            전체 선택
          </Checkbox>
          <ButtonGroup>
            <Button size="sm" onClick={() => handleAllToLiked(selectedItems)}>
              선택 찜한 목록으로 이동
            </Button>
            <Button
              size="sm"
              onClick={() => handleDeleteCartItem(selectedItems)}
            >
              선택 삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <Stack divider={<StackDivider />} spacing="4">
          {items && items.length > 0 ? (
            items.map((item) => (
              <Box key={item.cartItemId}>
                <HStack alignItems="center" mb="2">
                  <Checkbox
                    colorScheme="purple"
                    isChecked={selectedItems.includes(item.cartItemId)}
                    onChange={() => {
                      handleCheckBoxChange(item);
                    }}
                  />
                  <Heading size="sm">{item.title}</Heading>
                </HStack>
                <HStack justifyContent="space-between">
                  <Image
                    src={item.fileUrl}
                    alt={`Thumbnail for ${item.name}`}
                    boxSize="50px"
                    border="1px solid red"
                  />
                  <Text fontWeight="bold" fontSize="lx">
                    {item.price.toLocaleString()} 원
                  </Text>
                  <HStack maxW="150px">
                    <MyNumberInput
                      count={item.count}
                      accessToken={accessToken}
                      cartItemId={item.cartItemId}
                      fetchList={fetchList}
                      toast={toast}
                    />
                  </HStack>
                  <IconButton
                    onClick={() => handleDeleteItem({ item })}
                    aria-label="delete"
                    variant="ghost"
                    color="red"
                    icon={<CloseIcon fontSize="xs" />}
                  />
                </HStack>
              </Box>
            ))
          ) : (
            <Box
              h="200px"
              border="2px dashed grey"
              borderRadius="10"
              opacity="30%"
              textAlign="center"
            >
              <AbsoluteCenter mx="auto">
                <FontAwesomeIcon icon={faShoppingCart} size="5x" color="grey" />
                <Heading
                  color="grey"
                  size={{ base: "sm", md: "md" }}
                  mt="4"
                  transition="0.5s all ease"
                >
                  주문하신 상품이 없습니다
                </Heading>
              </AbsoluteCenter>
            </Box>
          )}
        </Stack>
      </CardBody>
      <CardFooter>
        <HStack justifyContent="space-between" width="100%">
          <Heading size="md">Total Price:</Heading>
          <Heading size="md" textAlign="right">
            {totalPrice.toLocaleString()} 원
          </Heading>
        </HStack>
      </CardFooter>
    </Card>
  );
}
