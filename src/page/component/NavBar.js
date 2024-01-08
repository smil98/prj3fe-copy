import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AbsoluteCenter,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
  Tag,
  TagLabel,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { startSocialLoginTimer } from "./authUtils";
import { HamburgerIcon, LockIcon, SearchIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCloudArrowUp,
  faCompactDisc,
  faCreditCard,
  faGears,
  faHeart,
  faHome,
  faScroll,
  faUser,
  faUserGear,
  faUserPlus,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";

export function NavBar(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const [member, setMember] = useState({});
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();
  const location = useLocation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    getMember();
    navigate("/");
  }, [loggedIn]);

  //Nav Bar 변환 위해서 따오는 것들
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  // Button Style
  const drawerButtonStyle = {
    textAlign: "left",
    justifyContent: "flex-start",
    _hover: { color: "white", bgColor: "#805AD5" },
  };

  const fullNavButtonHover = {
    _hover: { color: "#805AD5" },
  };

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
        setLoggedIn(true);
      })
      .catch((error) => {
        console.log("sendRefreshToken()의 catch 실행");
        localStorage.removeItem("refreshToken");

        setLoggedIn(false);
      });
  }

  function getMember() {
    const accessToken = localStorage.getItem("accessToken");
    console.log("엑세스 토큰", accessToken);
    axios
      .get("/member", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        console.log("getMember()의 then 실행");
        console.log(response.data);
        setMember(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log("getMember()의 catch 실행");
          localStorage.removeItem("accessToken");
          sendRefreshToken();
          console.log("sendRefreshToken 호출");
        } else if (error.response && error.response.status === 403) {
          toast({
            description: "접근이 거부되었습니다",
            status: "error",
          });
          console.log("403에러!!!");
        } else {
          toast({
            description: "오류가 발생했습니다",
            status: "error",
          });
          setLoggedIn(false);
          console.log("그 외 에러");
        }
      });
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      console.log(localStorage.getItem("accessToken"));
      axios
        .get("/accessToken", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log("accessToken then 수행");
          setLoggedIn(true);
          console.log(response.data);

          if (response.data.role === "ROLE_ADMIN") {
            console.log("setIsAdmin(true) 동작");
            setIsAdmin(true);
          }
          if (response.data.role === "ROLE_SOCIAL") {
            setIsSocial(true);
          }
        })
        .catch((error) => {
          sendRefreshToken();
          localStorage.removeItem("accessToken");
        })
        .finally(() => {
          console.log("finally loggedIn: ", loggedIn);
          console.log("isSocial: " + isSocial);
        });
    }
    console.log("loggedIn: ", loggedIn);
  }, [location]);

  useEffect(() => {
    if (loggedIn && isSocial) {
      const cleanupTimer = startSocialLoginTimer(
        3600, // accessTokenExpiry
        1800, // refreshThreshold
        setIsSocial,
        toast,
        navigate,
      );
      return cleanupTimer;
    }
    return () => {};
  }, [loggedIn, isSocial]);

  function handleLogout() {
    console.log("handleLogout");
    axios
      .get("/api/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      })
      .then(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        console.log(accessToken, refreshToken);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.log(accessToken, refreshToken);
        if (isAdmin) {
          setIsAdmin(false);
        }
        setLoggedIn(false);
        toast({
          description: "성공적으로 로그아웃 되었습니다",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.status === 302) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setLoggedIn(false);
          if (isAdmin) {
            setIsAdmin(false);
          }
          // Open a new popup window for the logout URL
          const popupWindow = window.open(
            "http://nid.naver.com/nidlogin.logout",
            "_blank",
          );
          if (popupWindow) {
            setTimeout(() => {
              popupWindow.close();
            }, 0); //바로 닫기
          }
          toast({
            description: "성공적으로 로그아웃 되었습니다",
            status: "success",
          });
        } else {
          console.log(
            "로컬스토리지 refreshToken 상태: ",
            localStorage.getItem("refreshToken"),
          );
          console.log(
            "로컬스토리지 accessToken 상태: ",
            localStorage.getItem("accessToken"),
          );
          toast({
            description: "로그아웃 도중 에러가 발생했습니다",
            status: "error",
          });
        }
      })
      .finally(() => {
        console.log("로그아웃 finally");
        navigate("/");
      });
  }

  const MenuNav = () => {
    return (
      <Menu>
        <MenuButton as={Avatar} boxSize={8} />
        <MenuList>
          <Text fontSize="sm" fontWeight="bold" textIndent={10}>
            👋 환영합니다,{" "}
            <Text as="span" color="#805AD5">
              {member.nickName}
            </Text>
            님
          </Text>
          <MenuDivider />
          <MenuGroup title="내 정보 보기">
            <MenuItem
              icon={<FontAwesomeIcon icon={faUserGear} />}
              onClick={() => navigate(`/member/${member.id}`)}
            >
              내 정보
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon icon={faHeart} />}
              onClick={() => {
                navigate(`/likes/${member.id}`);
              }}
            >
              찜한 목록
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon icon={faScroll} />}
              onClick={() => {
                navigate("/member/order");
              }}
            >
              주문 내역 //TODO: 수정
            </MenuItem>
          </MenuGroup>
          {isAdmin && (
            <>
              <MenuDivider />
              <MenuGroup title="관리자">
                <MenuItem
                  icon={<FontAwesomeIcon icon={faCloudArrowUp} />}
                  onClick={() => navigate("/write")}
                >
                  제품 등록
                </MenuItem>
                <MenuItem
                  icon={<FontAwesomeIcon icon={faGears} />}
                  onClick={() => {
                    navigate("/board/manage");
                  }}
                >
                  제품 관리
                </MenuItem>
                <MenuItem
                  icon={<FontAwesomeIcon icon={faUsersGear} />}
                  onClick={() => navigate("/member/list")}
                >
                  회원 관리
                </MenuItem>
              </MenuGroup>
            </>
          )}
        </MenuList>
      </Menu>
    );
  };

  return (
    <>
      <Flex
        display="flex"
        position="fixed"
        alignItems="center"
        h={"10%"}
        top={2}
        left={0}
        right={0}
        bgColor="whiteAlpha.100"
        backdropFilter="blur(10px)"
        borderRadius={20}
        boxShadow="md"
        mt={5}
        mx={{ base: "5%", md: "10%", lg: "15%" }}
        zIndex={3}
        transition="all 1s ease"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          // border="1px solid blue"
          w="94%"
          mx="3%"
        >
          <Button
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
            ml={5}
            className="logo"
            variant="undefined"
            p={0}
            fontSize="xl"
          >
            FavHub
          </Button>
          <InputGroup w={isSmallScreen ? "55%" : "35%"}>
            <Input
              variant="filled"
              bgColor="blackAlpha.100"
              _hover={{
                bgColor: "none",
              }}
              _focus={{
                outline: "none",
                border: "2px solid purple",
                boxShadow: "sm",
                bgColor: "none",
              }}
              borderRadius={20}
              placeholder="Find your favorite"
            />
            <InputLeftElement w="3rem">
              <SearchIcon />
            </InputLeftElement>
          </InputGroup>
          {isSmallScreen ? (
            <IconButton
              variant="undefined"
              fontSize="xl"
              mr={5}
              p={0}
              onClick={() => onOpen()}
              icon={<HamburgerIcon />}
              transition="all 1s ease"
            />
          ) : (
            <ButtonGroup
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              w={{ md: "40%", lg: "35%" }}
              transition="all 1s ease"
              variant="unstyled"
              mr={5}
            >
              {loggedIn ? (
                <>
                  <Button
                    {...fullNavButtonHover}
                    onClick={() => navigate("/order")}
                  >
                    주문하기
                  </Button>
                  <Button
                    {...fullNavButtonHover}
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    로그아웃
                  </Button>
                  <Menu>
                    <MenuButton as={Avatar} boxSize={8} />
                    <MenuList>
                      <Text fontSize="sm" fontWeight="bold" textIndent={10}>
                        👋 환영합니다,{" "}
                        <Text as="span" color="#805AD5">
                          {member.nickName}
                        </Text>
                        님
                      </Text>
                      <MenuDivider />
                      <MenuGroup title="내 정보 보기">
                        <MenuItem
                          icon={<FontAwesomeIcon icon={faUserGear} />}
                          onClick={() => navigate(`/member/${member.id}`)}
                        >
                          내 정보
                        </MenuItem>
                        <MenuItem
                          icon={<FontAwesomeIcon icon={faHeart} />}
                          onClick={() => {
                            navigate(`/likes/${member.id}`);
                          }}
                        >
                          찜한 목록
                        </MenuItem>
                        <MenuItem
                          icon={<FontAwesomeIcon icon={faScroll} />}
                          onClick={() => {
                            navigate("/member/order");
                          }}
                        >
                          주문 내역 //TODO: 수정
                        </MenuItem>
                      </MenuGroup>
                      <MenuDivider />
                      {isAdmin && (
                        <MenuGroup title="관리자">
                          <MenuItem
                            icon={<FontAwesomeIcon icon={faCloudArrowUp} />}
                            onClick={() => navigate("/write")}
                          >
                            제품 등록
                          </MenuItem>
                          <MenuItem
                            icon={<FontAwesomeIcon icon={faGears} />}
                            onClick={() => {
                              navigate("/board/manage");
                            }}
                          >
                            제품 관리
                          </MenuItem>
                          <MenuItem
                            icon={<FontAwesomeIcon icon={faUsersGear} />}
                            onClick={() => navigate("/member/list")}
                          >
                            회원 관리
                          </MenuItem>
                        </MenuGroup>
                      )}
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <>
                  <Box></Box>
                  <Button
                    {...fullNavButtonHover}
                    onClick={() => navigate("/signup")}
                  >
                    회원가입
                  </Button>
                  <Button
                    {...fullNavButtonHover}
                    onClick={() => navigate("/login")}
                  >
                    로그인
                  </Button>
                </>
              )}
            </ButtonGroup>
          )}
        </Flex>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Tag variant="ghost">
              <Avatar size="sm" ml={-1} mr={3} />
              <TagLabel fontSize="md" fontWeight="bold">
                {loggedIn ? (
                  <>
                    환영합니다,{" "}
                    <Text as="span" color="#805AD5">
                      {member.nickName !== null
                        ? member.nickName
                        : member.email.split("@")[0]}
                    </Text>
                    님
                  </>
                ) : (
                  "로그인 해주세요"
                )}
              </TagLabel>
            </Tag>
          </DrawerHeader>
          <DrawerBody>
            <ButtonGroup
              h="full"
              isAttached
              flexDirection="column"
              flexWrap="wrap"
              variant="undefined"
              w="full"
              size="lg"
              // border="1px solid black"
            >
              <Button
                borderRadius={0}
                iconSpacing={5}
                leftIcon={<FontAwesomeIcon icon={faHome} />}
                {...drawerButtonStyle}
                onClick={() => {
                  onClose();
                  navigate("/");
                  window.location.reload();
                }}
              >
                홈
              </Button>
              {loggedIn ? (
                <>
                  {/* 회원일 때 보여줄 메뉴 */}
                  <Button
                    iconSpacing={4}
                    leftIcon={<FontAwesomeIcon icon={faUserGear} />}
                    {...drawerButtonStyle}
                    onClick={() => {
                      onClose();
                      navigate(`/member/${member.id}`);
                    }}
                  >
                    내 정보
                  </Button>
                  <Button
                    iconSpacing={5}
                    leftIcon={<FontAwesomeIcon icon={faHeart} />}
                    {...drawerButtonStyle}
                    onClick={() => {
                      onClose();
                      navigate(`/likes/${member.id}`);
                    }}
                  >
                    찜한 목록
                  </Button>
                  <Button
                    iconSpacing={5}
                    leftIcon={<FontAwesomeIcon icon={faCreditCard} />}
                    {...drawerButtonStyle}
                    onClick={() => {
                      onClose();
                      navigate("/order");
                    }}
                  >
                    주문하기
                  </Button>
                  <Button
                    iconSpacing={5}
                    leftIcon={<FontAwesomeIcon icon={faScroll} />}
                    {...drawerButtonStyle}
                    onClick={() => {
                      onClose();
                      navigate("/member/order"); //TODO: 수정
                    }}
                  >
                    주문 내역
                  </Button>
                  {isAdmin && (
                    <>
                      <Button
                        iconSpacing={5}
                        leftIcon={<FontAwesomeIcon icon={faCloudArrowUp} />}
                        {...drawerButtonStyle}
                        onClick={() => {
                          onClose();
                          navigate("/write");
                        }}
                      >
                        제품 등록
                      </Button>
                      <Button
                        iconSpacing={5}
                        leftIcon={<FontAwesomeIcon icon={faGears} />}
                        {...drawerButtonStyle}
                        onClick={() => {
                          onClose();
                          navigate("/board/manage");
                        }}
                      >
                        제품 관리
                      </Button>
                      <Button
                        iconSpacing={5}
                        leftIcon={<FontAwesomeIcon icon={faUsersGear} />}
                        {...drawerButtonStyle}
                        onClick={() => {
                          onClose();
                          navigate("/member/list");
                        }}
                      >
                        회원 관리
                      </Button>
                    </>
                  )}
                  <Button
                    iconSpacing={5}
                    leftIcon={
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    }
                    {...drawerButtonStyle}
                    onClick={() => {
                      onClose();
                      handleLogout();
                    }}
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  {/* 비회원일 때 보여줄 메뉴 */}
                  <Button
                    iconSpacing={6}
                    leftIcon={<FontAwesomeIcon icon={faUser} />}
                    {...drawerButtonStyle}
                    onClick={() => {
                      onClose();
                      navigate("/login");
                    }}
                  >
                    로그인
                  </Button>
                  <Button
                    iconSpacing={4}
                    leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
                    {...drawerButtonStyle}
                    onClick={() => {
                      onClose();
                      navigate("/signup");
                    }}
                  >
                    회원 가입
                  </Button>
                </>
              )}
            </ButtonGroup>
          </DrawerBody>
          <DrawerFooter h="10%">
            <Flex
              justifyContent="space-between"
              alignItems="center"
              w="full"
              h="full"
            >
              <FontAwesomeIcon
                icon={faCompactDisc}
                color="#805AD5"
                size="2xl"
              />
              <VStack>
                <Text className="logo" fontSize="2xl">
                  FavHub
                </Text>
                <Text mt={-4} color="#805AD5" fontSize="xs">
                  Find Your Favorite
                </Text>
              </VStack>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NavBar;
