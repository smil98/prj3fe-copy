import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  InputGroup,
  InputRightAddon,
  useToast,
  Textarea,
  Spacer,
  InputRightElement,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [albumFormat, setAlbumFormat] = useState("");
  const [albumDetails, setAlbumDetails] = useState([]);
  const [agency, setAgency] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [uploadFiles, setUploadFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [stockQuantity, setStockQuantity] = useState("");

  function handleSubmit() {
    setIsSubmitting(true);

    axios
      .postForm(
        "/api/board/add",
        {
          title,
          artist,
          albumFormat,
          albumDetails:
            Array.isArray(albumDetails) && albumDetails.length > 1 //값이 배열이고, 배열길이 1보다 큰지 확인
              ? albumDetails.join(",")
              : albumDetails.toString(),
          releaseDate,
          agency,
          price,
          content,
          stockQuantity,
          uploadFiles,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )
      .then(() => {
        toast({
          description: "새 상품이 저장되었습니다",
          status: "success",
        });
        navigate("/"); //글 저장이 완료되면 home으로 이동
      })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 400) {
          toast({
            description: "작성한 내용을 확인 해주세요",
            status: "error",
          });
        } else if (error.response.status === 401) {
          // refresh token으로 access token 갱신 시도
          sendRefreshToken();
        } else {
          toast({
            description: "저장 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function sendRefreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("리프레시 토큰: ", refreshToken);
    if (refreshToken !== null) {
      return axios
        .get("/refreshToken", {
          headers: { Authorization: `Bearer ${refreshToken}` },
        })
        .then((response) => {
          console.log("sendRefreshToken()의 then 실행");
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          console.log("토큰들 업데이트 리프레시 토큰: ");
          console.log(response.data.refreshToken);

          handleSubmit();
        })
        .catch((error) => {
          console.log("sendRefreshToken()의 catch 실행");
          localStorage.removeItem("refreshToken");
          toast({
            description: "로그인 되어 있지 않습니다.",
            status: "warning",
          });
          navigate(0);
        });
    }
  }

  const labelStyles = {
    color: "#805AD5",
    fontSize: "lg",
    fontWeight: "bold",
    my: 4,
  };

  return (
    <>
      <Spacer h={120} />
      <Card
        p={8}
        mx={{ base: "5%", md: "10%", lg: "15%" }}
        transition="1s all ease"
      >
        <CardHeader>
          <Heading>앨범 등록</Heading>
        </CardHeader>
        <CardBody>
          <FormControl>
            <FormLabel {...labelStyles}>앨범 이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setUploadFiles(e.target.files)}
            />
            <FormHelperText color="#805AD5">
              파일당 1MB 이내, 총 용량은 10MB 이내로 첨부 가능합니다.
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel {...labelStyles}>앨범명</FormLabel>
            <Input
              value={title}
              placeholder="등록하려는 앨범의 이름을 입력해주세요"
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          {/*================================*/}
          <FormControl>
            <FormLabel {...labelStyles}>가수</FormLabel>
            <Input
              value={artist}
              placeholder="가수명을 입력해주세요"
              onChange={(e) => setArtist(e.target.value)}
            />
          </FormControl>
          {/*======================================*/}
          <FormControl>
            <FormLabel {...labelStyles}>음반 소개</FormLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="음반 소개를 입력해주세요"
            />
          </FormControl>
          {/* 앨범 포맷 입력란 */}
          <FormControl>
            <FormLabel {...labelStyles}>형태</FormLabel>
            <Select
              value={albumFormat}
              onChange={(e) => setAlbumFormat(e.target.value)}
              placeholder="앨범 형태를 선택하세요"
            >
              <option value="CD">CD</option>
              <option value="VINYL">VINYL</option>
              <option value="CASSETTE_TAPE">CASSETTE_TAPE</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel {...labelStyles}>장르</FormLabel>
            <CheckboxGroup
              value={albumDetails}
              onChange={(selectedAlbumGenres) =>
                setAlbumDetails(selectedAlbumGenres)
              }
            >
              <Stack spacing={2} direction="row">
                <Checkbox value="INDIE">Indie</Checkbox>
                <Checkbox value="OST">OST</Checkbox>
                <Checkbox value="K_POP">K-POP</Checkbox>
                <Checkbox value="POP">Pop</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>

          {/* 릴리스 날짜 입력란 */}
          <FormControl>
            <FormLabel {...labelStyles}>발매일</FormLabel>
            <Input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </FormControl>

          {/*발매사 입력란 */}
          <FormControl>
            <FormLabel {...labelStyles}>음반사</FormLabel>
            <Input
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              placeholder="해당 앨범의 발매회사를 입력해주세요"
            />
          </FormControl>
          {/*수량 입력란*/}
          <FormControl>
            <FormLabel {...labelStyles}>재고 수량</FormLabel>
            <Input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              min="0"
              placeholder="재고 수량을 입력해주세요"
            />
          </FormControl>

          {/*사용한 가격 입력 폼*/}
          <FormControl>
            <FormLabel {...labelStyles}>가격</FormLabel>
            <InputGroup>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                min="0"
                placeholder="가격만 입력해주세요 (Ex. 18000)"
              />
              <InputLeftElement pointerEvents="none" w="3rem">
                ₩
              </InputLeftElement>
            </InputGroup>
          </FormControl>
        </CardBody>
        <CardFooter>
          <Button
            isDisabled={isSubmitting}
            onClick={handleSubmit}
            colorScheme="purple"
            w="full"
          >
            저장
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
