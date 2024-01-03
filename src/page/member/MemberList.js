import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  IconButton,
  Input,
  Select,
  Spacer,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faPenNib,
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
  const [list, setList] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL의 위치 정보를 가져옵니다.
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호 (0부터 시작)
  const [totalPage, setTotalPage] = useState(0); // 총 페이지 수
  const itemsPerPage = 10; // 페이지당 항목 수

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
    return <Spinner />;
  }

  function handleTableRowClick(id) {
    console.log("Clicked Member's ID :" + id);
    navigate("/medit/" + id);
  }

  const mapGenderToAbbreviation = (gender) => {
    const genderMappings = {
      Female: "F",
      Male: "M",
      Unidentified: "X",
    };

    return genderMappings[gender] || gender; // Default to the original value if not found
  };

  const formattedDate = (joinDate) => {
    const date = new Date(joinDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };

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
              <Tr
                _hover={{ cursor: "pointer" }}
                key={member.id}
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
                    icon={<FontAwesomeIcon icon={faPenNib} />}
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
                    icon={<FontAwesomeIcon icon={faTrashCan} />}
                  />
                </Td>
              </Tr>
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
