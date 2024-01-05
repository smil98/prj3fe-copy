import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faPenToSquare,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { Pagenation } from "../component/Pagenation";

function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);
    navigate("/member/list?" + params);
  }
  return (
    <Center mt={5}>
      <Flex gap={1}>
        <Box>
          <Select
            defaultValue="all"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">닉네임 검색</option>
            <option value="email">이메일 검색</option>
          </Select>
        </Box>
        <Box>
          <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </Box>
        <Button onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </Flex>
    </Center>
  );
}

export function MemberList() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [list, setList] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL의 위치 정보를 가져옵니다.
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호 (0부터 시작)
  const [totalPage, setTotalPage] = useState(0); // 총 페이지 수
  const itemsPerPage = 10; // 페이지당 항목 수

  const [openModalId, setOpenModalId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("k");
    const category = queryParams.get("c");

    axios
      .get(
        `/member/list?page=${currentPage}&size=${itemsPerPage}&k=${keyword}&c=${category}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )
      .then((response) => {
        setList(response.data.content);
        setTotalPage(response.data.totalPages);
      });
  }, [currentPage, location.search]);

  if (list === null) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner
          center
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#805AD5"
          size="xl"
        />
      </Flex>
    );
  }

  const formattedDate = (joinDate) => {
    const date = new Date(joinDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };

  function handleDelete({ member }) {
    axios
      .delete("/member/delete/" + member.id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.log("회원 탈퇴 성공");
      })
      .catch(() => console.log("회원 탈퇴 실패"))
      .finally(() => {
        console.log("해치웠나");
        onClose();
        navigate("/");
        // 페이지 새로고침
        window.location.reload();
      });
    //   axios.delete().then().catch();
    // 홈 화면으로 이동시킬 것
  }

  return (
    <>
      <Spacer h={120} />
      <TableContainer
        mx={{ md: "5%", lg: "10%" }}
        p={5}
        transition="0.5s all ease"
      >
        <Table
          w="full"
          size={{ sm: "xs", base: "sm", md: "md", lg: "lg" }}
          transition="0.5s all ease"
        >
          <Thead>
            <Tr>
              <Th textAlign="center">닉네임</Th>
              <Th textAlign="center">이메일</Th>
              <Th textAlign="center">등급</Th>
              <Th textAlign="center">가입일</Th>
              <Th textAlign="center">수정</Th>
              <Th textAlign="center">탈퇴</Th>
            </Tr>
          </Thead>
          <Tbody>
            {list.map((member) => (
              <React.Fragment key={member.id}>
                <Tr
                  _hover={{ cursor: "pointer" }}
                  onClick={() => navigate(`/member/${member.id}`)}
                >
                  <Td textAlign="center">{member.nickName}</Td>
                  <Td textAlign="center">{member.email}</Td>
                  <Td textAlign="center">
                    {member.role ? member.role.substring(5) : ""}
                  </Td>
                  <Td textAlign="center">{formattedDate(member.joinDate)}</Td>
                  <Td textAlign="center">
                    <IconButton
                      variant="ghost"
                      colorScheme="purple"
                      icon={<FontAwesomeIcon icon={faPenToSquare} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/medit/" + member.id);
                      }}
                    />
                  </Td>
                  <Td textAlign="center">
                    <IconButton
                      variant="ghost"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenModalId(member.id);
                      }}
                      icon={<FontAwesomeIcon icon={faTrashCan} />}
                    />
                    <Modal
                      isOpen={openModalId === member.id}
                      onClose={() => setOpenModalId(null)}
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>회원 강퇴 확인</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Flex>
                            정말 회원
                            <Heading
                              as="span"
                              mx={2}
                              mt={1}
                              size="sm"
                              color="#805AD5"
                            >
                              {member.nickName}
                            </Heading>
                            을(를) 강퇴하시겠습니까?
                          </Flex>
                        </ModalBody>

                        <ModalFooter>
                          <Button onClick={onClose}>닫기</Button>
                          <Button
                            onClick={() => {
                              handleDelete(member);
                            }}
                            colorScheme="red"
                          >
                            탈퇴
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </Td>
                </Tr>
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Center mb={10}>
        <SearchComponent />
      </Center>
      <Pagenation
        totalPage={totalPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
