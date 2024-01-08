import React, { useEffect, useRef, useState } from "react";
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
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faComment,
  faCommentSlash,
  faPenToSquare,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pagenation } from "./Pagenation";

function CommentContent({
  comment,
  onDeleteModalOpen,
  isSubmitting,
  setIsSubmitting,
  email,
  isAdmin,
  sendRefreshToken,
  setAccessToken,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentEdit, setCommentEdit] = useState(comment.content);
  const toast = useToast();

  const commentUpdate = {
    updateTime: comment.updateTime,
  };
  const updateTime = new Date(comment.updateTime);

  const commentUpdateTime = updateTime
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/(\d+)\/(\d+)\/(\d+),?/, "$3/$1/$2");

  function handleSubmit() {
    setIsSubmitting(true);
    axios
      .put(
        "/api/comment/update/" + comment.id,
        {
          id: comment.id,
          content: commentEdit,
          member: { email: comment.member.email },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )
      .then(() =>
        toast({
          description: "리뷰가 수정 되었습니다.",
          status: "success",
        }),
      )
      .catch(() => {
        const re = sendRefreshToken();
        re.then(() =>
          axios
            .put(
              "/api/comment/update/" + comment.id,
              {
                id: comment.id,
                content: commentEdit,
                member: { email: comment.member.email },
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken",
                  )}`,
                },
              },
            )
            .then(() =>
              toast({
                description: "리뷰가 수정 되었습니다.",
                status: "success",
              }),
            )
            .catch(() =>
              toast({
                description: "수정 중 문제가 발생하였습니다.",
                status: "error",
              }),
            )
            .finally(() => setIsSubmitting(false)),
        );
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsEditing(false);
      });
  }

  return (
    <Box>
      <Flex justifyContent="space-between" mb={isEditing ? 2 : 0}>
        <HStack>
          <Text size={10} fontSize="sm" color="dimgrey">
            <Text as="span" color="#805AD5" fontWeight="bold">
              {comment.member.nickName}
            </Text>
            님
          </Text>
          <Text fontSize="xs" color="gray">
            {/*{comment.updateTime}*/}
            {commentUpdateTime}
          </Text>
        </HStack>
        <ButtonGroup>
          {comment.member.email === email && !isEditing && (
            <IconButton
              size="xs"
              colorScheme="purple"
              variant="ghost"
              _hover={{ color: "white", bgColor: "purple" }}
              icon={<FontAwesomeIcon icon={faPenToSquare} />}
              onClick={() => setIsEditing(true)}
            />
          )}
          {isEditing && (
            <IconButton
              size="xs"
              color="purple"
              variant="ghost"
              _hover={{ color: "white", bgColor: "purple" }}
              icon={<FontAwesomeIcon icon={faXmark} />}
              onClick={() => setIsEditing(false)}
            />
          )}
          {(comment.member.email === email || isAdmin) && (
            <IconButton
              size="xs"
              color="red"
              variant="ghost"
              _hover={{ color: "white", bgColor: "red" }}
              icon={<FontAwesomeIcon icon={faTrashCan} />}
              onClick={() => onDeleteModalOpen(comment.id)}
            />
          )}
        </ButtonGroup>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          {!isEditing && (
            <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="medium">
              {comment.content}
            </Text>
          )}

          {isEditing && (
            <Flex justifyContent="space-between">
              <Textarea
                w="84%"
                value={commentEdit}
                _focus={{
                  outline: "none",
                  border: "1px solid purple",
                  boxShadow: "sm",
                  bgColor: "none",
                }}
                onChange={(e) => setCommentEdit(e.target.value)}
              />
              <Button
                w="14%"
                p={0}
                m={0}
                size="undefined"
                colorScheme="purple"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                작성
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

function CommentList({
  commentList,
  onDeleteModalOpen,
  isSubmitting,
  setIsSubmitting,
  email,
  isAdmin,
  sendRefreshToken,
  setAccessToken,
  loggedIn,
}) {
  return (
    <>
      {commentList && commentList.length > 0 ? (
        commentList.map((comment, index) => (
          <Box key={comment.id}>
            <Box
              p={3}
              bgColor={comment.member.email === email ? "gray.50" : "none"}
            >
              <CommentContent
                comment={comment}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                onDeleteModalOpen={onDeleteModalOpen}
                email={email}
                isAdmin={isAdmin}
                sendRefreshToken={sendRefreshToken}
                setAccessToken={setAccessToken}
              />
            </Box>
            {index < commentList.length - 1 && <Divider />}
          </Box>
        ))
      ) : (
        <Flex
          align="center"
          direction="column"
          justify="center"
          textAlign="center"
          color="gray.400"
          mt={-5}
        >
          <FontAwesomeIcon icon={faCommentSlash} size="2xl" />
          <Text fontSize="lg" mt={5}>
            리뷰가 존재하지 않습니다.
          </Text>
        </Flex>
      )}
    </>
  );
}

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [content, setContent] = useState("");

  function handleSubmit() {
    onSubmit({ content });
  }

  return (
    <Flex justifyContent="space-between" px={5}>
      <Textarea
        w="84%"
        placeholder="리뷰를 작성해주세요"
        _focus={{
          outline: "none",
          border: "1px solid purple",
          boxShadow: "sm",
          bgColor: "none",
        }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></Textarea>
      <Button
        w="14%"
        p={0}
        m={0}
        colorScheme="purple"
        size="undefined"
        onClick={handleSubmit}
        isDisabled={isSubmitting}
      >
        {/*버튼 활성화*/}
        작성
      </Button>
    </Flex>
  );
}

function CommentComponent({ boardId, loggedIn, email, isAdmin }) {
  const [isSubmitting, setIsSubmitting] = useState(false); //제출이 됐는지 알 수 있는 상태를 씀
  //submit했으면 isDisabled가 true되도록 설정

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const commentPerPage = 10;

  // const [id, setId] = useState(0); //id를 렌더링 할 필요없는 경우 useState쓸 필요없음
  const commentIdRef = useRef(0); // current를 통해 현재 참조하는 값을 가져오거나 변경
  const toast = useToast();
  let navigate = useNavigate();
  const [commentList, setCommentList] = useState([]);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken"),
  );

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId); //url에서 id에 boardId가 들어감
      params.set("page", currentPage);
      params.set("size", commentPerPage);

      axios.get("/api/comment/list?" + params).then((response) => {
        setCommentList(response.data.content);
        setTotalPage(response.data.totalPages);
      });
    }
  }, [isSubmitting, boardId, currentPage, accessToken]); //pageSize 삭제

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

          setAccessToken(localStorage.getItem("accessToken"));
          console.log("토큰들 업데이트 리프레시 토큰: ");
          console.log(response.data.refreshToken);
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

  function handleSubmit({ content }) {
    setIsSubmitting(true);
    console.log(content);
    axios
      .post(
        `/api/comment/add/${boardId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      .then(() => {
        toast({
          description: "리뷰가 저장되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        console.log("리프레시 토큰 보내기");
        const re = sendRefreshToken();
        if (re !== undefined) {
          re.then(() => {
            axios
              .post(
                `/api/comment/add/${boardId}`,
                { content },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken",
                    )}`,
                  },
                },
              )
              .then(() => {
                toast({
                  description: "리뷰가 저장되었습니다.",
                  status: "success",
                });
              })
              .catch((error) => {
                if (error.response.status === 401) {
                  toast({
                    description: "로그인이 필요합니다.",
                    status: "error",
                  });
                } else {
                  toast({
                    description: "저장 중 문제가 발생하였습니다.",
                    status: "error",
                  });
                }
              })
              .finally(() => setIsSubmitting(false));
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false); //제출 완료되면 버튼 활성화
      });
  }

  function handleDelete() {
    setIsSubmitting(true);
    axios
      .delete("/api/comment/delete/" + commentIdRef.current, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        toast({
          description: "리뷰를 삭제하였습니다.",
          status: "success",
        });
      })
      .catch(() => {
        const re = sendRefreshToken();
        if (re !== undefined) {
          re.then(() =>
            axios
              .delete("/api/comment/delete/" + commentIdRef.current, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken",
                  )}`,
                },
              })
              .then(() => {
                toast({
                  description: "리뷰를 삭제하였습니다.",
                  status: "success",
                });
              })
              .catch(() =>
                toast({
                  description: "삭제 중 문제가 발생하였습니다.",
                  status: "error",
                }),
              )
              .finally(() => {
                setIsSubmitting(false);
              }),
          );
        }
      })
      .finally(() => {
        onClose();
        setIsSubmitting(false);
      });
  }

  function handleDeleteModalOpen(id) {
    //모달이 열릴때 아이디 저장
    commentIdRef.current = id;
    onOpen(); //모달 열기
  }

  return (
    <Box>
      <Card
        mt={10}
        mx={{ base: "5%", md: "10%", lg: "15%" }}
        transition="1s all ease"
      >
        {/*댓글 바로 올라가도록 하려면 CommentForm의 상태를 CommentList가 알도록 해야함.
       부모인 Comment컴포넌트가 그 상태를 갖고있으면 됨. 그리고 prop으로 받기*/}
        <CardHeader>
          <HStack spacing={3} p={5}>
            <Heading size="md">
              <FontAwesomeIcon icon={faComment} />
            </Heading>
            <Heading size="md">리뷰</Heading>
          </HStack>
          {loggedIn && (
            <CommentForm
              boardId={boardId}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          )}
        </CardHeader>
        <CardBody px={10}>
          <CommentList
            boardId={boardId}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            commentList={commentList}
            onDeleteModalOpen={handleDeleteModalOpen}
            email={email}
            isAdmin={isAdmin}
            loggedIn={loggedIn}
            sendRefreshToken={sendRefreshToken}
            setAccessToken={setAccessToken}
          />
        </CardBody>
        <CardFooter justifyContent="center">
          <Pagenation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={totalPage}
          />
        </CardFooter>
      </Card>

      {/*삭제 모달*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter justifyContent="center">
            <Button
              w="30%"
              mr={5}
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
            <Button w="30%" onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CommentComponent;
