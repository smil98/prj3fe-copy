import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Spinner,
  Stack,
  Switch,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null); //객체 사용해서 가변적으로 상태 변경
  // /edit/:id
  const { id } = useParams();
  const [fileURL, setFileURL] = useState("");
  // const [previousFileUrl, setPreviousFileUrl] = useState('');
  // const handleFileUrl = () => {
  //   setPreviousFileUrl(fileURL);
  // };
  //먼저 조회함.  updateBoard로 응답 받아옴
  const navigate = useNavigate();
  const toast = useToast();
  const [boardFiles, setBoardFiles] = useState(null);
  const [removeFileIds, setRemoveFileIds] = useState([]);

  //

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);
  // useEffect(() => {
  //   axios.get("/api/board/edit/"+ id)
  //     .then((response)=>setFileURL(response.data))
  //     .catch((error)=> console.log(error))
  //     .finally(()=>console.log("얍"));
  // }, []);

  // useEffect(() => {
  //   if (board !== null) {
  //     setPreviousFileUrl(fileURL); // 이전 이미지 URL 설정
  //   }
  // }, [board]);

  if (!board) {
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

  function handleFileUrlChange(e) {
    setFileURL(e.target.value);
  }

  //타이틀 수정
  function handleTitleEdit(e) {
    updateBoard((draft) => {
      draft.title = e.target.value;
    });
  }

  //가수 명 수정
  function handleArtistEdit(e) {
    updateBoard((draft) => {
      draft.artist = e.target.value;
    });
  }

  //발매일자 수정
  function handleReleaseDateEdit(e) {
    updateBoard((draft) => {
      draft.releaseDate = e.target.value;
    });
  }

  //가격 수정
  function handlePriceEdit(e) {
    updateBoard((draft) => {
      draft.price = e.target.value;
    });
  }

  function handleContentEdit(e) {
    updateBoard((draft) => {
      draft.content = e.target.value;
    });
  }
  function handleQuantityEdit(e) {
    updateBoard((draft) => {
      draft.stockQuantity = e.target.value;
    });
  }

  // 이미지 수정 코드
  // function handleImageUpload(e){}
  //   const file = e.target.images[0]; //
  //   const formData= new FormData();
  //   formData.append("file",file);
  //
  //   axios
  //     .post("/api/upload",formData)
  //     .then((response)=> {
  //       updateBoard((draft)=> {
  //         draft.imageURL = response.data.url; //이미지 url
  //       });
  //     });
  //
  // }

  function handleSubmit(e) {
    const accessToken = localStorage.getItem("accessToken");

    axios
      .putForm(
        "/api/board/edit/" + id,
        {
          title: board.title,
          artist: board.artist,
          price: board.price,
          content: board.content,
          fileURL: board.fileURL,
          releaseDate: board.releaseDate,
          stockQuantity: board.stockQuantity,
          // removeFileIds, //이미지도 전송
          uploadFiles: boardFiles,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((response) => {
        toast({
          description: id + "번 앨범이 수정되었습니다.",
          status: "success",
        });
        navigate(-1);
      })
      .catch((error) =>
        toast({
          description: "수정 중 문제가 발생하였습니다.",
          status: "error",
        }),
      );
  }

  function handleRemoveFileSwitch(e) {
    if (e.target.checked) {
      setRemoveFileIds([...removeFileIds, e.target.value]);
      updateBoard((draft) => {
        draft.boardFiles = draft.boardFiles.filter(
          (file) => file.id !== e.target.value,
        );
      });
    } else {
      setRemoveFileIds(removeFileIds.filter((item) => item !== e.target.value));
    }
  }

  const labelStyles = {
    color: "#805AD5",
    fontWeight: "bold",
  };

  //--------------------------------------등록된 제품 수정 폼
  return (
    <>
      <Spacer h={150} />
      <Card mx={{ base: "5%", md: "10%", lg: "15%" }}>
        <CardHeader>
          <Heading>
            {id}번 제품 - {board.title} 수정
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={3}>
            <FormControl mb={3}>
              <FormLabel {...labelStyles}>커버</FormLabel>
              {board.boardFiles !== null &&
                board.boardFiles.map((file) => (
                  <Box key={file.id}>
                    <Image src={file.fileUrl} alt={file.fileName} w="100%" />
                    <HStack justifyContent="center">
                      <Text my={5}>등록된 앨범 커버 삭제 후 재업로드</Text>
                      <Switch
                        value={file.id}
                        colorScheme="purple"
                        onChange={handleRemoveFileSwitch}
                      />
                    </HStack>
                  </Box>
                ))}
              {/*----------------이미지 파일 수정 코드 --------------*/}
              {removeFileIds.length > 0 && (
                <FormControl>
                  <FormLabel {...labelStyles}>앨범 커버 교체</FormLabel>
                  <Image
                    src={fileURL}
                    borderRadius="l"
                    border="0px solid black"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setBoardFiles(e.target.files[0])}
                  />
                  <FormHelperText color="#805AD5">
                    한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부
                    가능합니다.
                  </FormHelperText>
                </FormControl>
              )}
            </FormControl>
            {/*앨범 타이틀. 가수명, 가격, 발매일자 ,발매 회사 순*/}

            {/*타이틀 수정 폼*/}
            <FormControl>
              <FormLabel {...labelStyles}>제목</FormLabel>
              <Input value={board.title} onChange={handleTitleEdit} />
            </FormControl>
            {/*가수명 편집 */}
            <FormControl>
              <FormLabel {...labelStyles}>가수명</FormLabel>
              <Input value={board.artist} onChange={handleArtistEdit} />
            </FormControl>
            {/*발매일자 편집 */}
            <FormControl>
              <FormLabel {...labelStyles}>발매일</FormLabel>
              <Input
                type="date"
                value={board.releaseDate}
                onChange={handleReleaseDateEdit}
              />
            </FormControl>
            {/*수량 수정 */}
            <FormControl>
              <FormLabel {...labelStyles}>재고량</FormLabel>
              <Input
                value={board.stockQuantity}
                onChange={handleQuantityEdit}
              />
            </FormControl>
            {/*가격 수정 */}
            <FormControl>
              <FormLabel {...labelStyles}>앨범 가격</FormLabel>
              <InputGroup>
                <Input value={board.price} onChange={handlePriceEdit} />
                <InputLeftElement pointerEvents="none" w="3rem">
                  ₩
                </InputLeftElement>
              </InputGroup>
            </FormControl>
            {/*앨범 상세 설명 란*/}
            <FormControl>
              <FormLabel {...labelStyles}>앨범 제품 상세 설명 수정</FormLabel>
              <Textarea
                value={board.content}
                h="sm"
                onChange={handleContentEdit}
              />
            </FormControl>
          </Stack>
        </CardBody>
        <CardFooter
          display={{ base: "block", md: "flex" }}
          justifyContent="center"
        >
          <Button
            w={{ base: "full", md: "45%" }}
            mb={{ base: 5, md: 0 }}
            mr={{ base: 0, md: 5 }}
            onClick={handleSubmit}
            colorScheme="purple"
          >
            수정
          </Button>
          <Button
            w={{ base: "full", md: "45%" }}
            onClick={() => navigate(-1)}
            colorScheme="red"
          >
            취소
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
