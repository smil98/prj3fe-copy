import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { startSocialLoginTimer } from "./authUtils";
import { Breadcrumbs } from "./Breadcrumbs";
import { HamburgerIcon } from "@chakra-ui/icons";

export function NavBar(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();
  const location = useLocation();
  const toast = useToast();
  const [titleIconOpen, setTitleIconOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);
  const [placement, setPlacement] = React.useState("left");
  const onCloseDrawer = () => {
    setTitleIconOpen(false);
  };

  //BreadCrumb 위해 현재 링크에서 따오는 것들
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  const currentPageName =
    pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() +
        pathSegments[pathSegments.length - 1].slice(1)
      : "Home";

  //Nav Bar 변환 위해서 따오는 것들
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

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

          return axios.get("/isSocialMember", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          });
        })
        .then((response) => {
          console.log("isSocialMember = " + response.data);
          if (response.data) {
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

  useEffect(() => {
    navigate("/");
  }, [loggedIn]);

  function handleLogout() {
    console.log("handleLogout");
    axios
      .get("/api/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      })
      .then(() => {
        console.log("!!!!!!!!!!!!!!!!!!!");
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
  return (
    <>
      <Flex
        display="flex"
        position="fixed"
        alignItems="center"
        h={"8%"}
        top={0}
        left={0}
        right={0}
        bgColor="whiteAlpha.100"
        border="1px solid green"
        backdropFilter="blur(10px) hue-rotate(90deg)"
        borderRadius={20}
        boxShadow="sm"
        mt={5}
        mx={{ base: "5%", md: "10%", lg: "15%" }}
        zIndex={1}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          bgColor={"0,0,0,0"}
          border="1px solid blue"
          w="94%"
          mx="3%"
        >
          <VStack ml={5} spacing={0} alignItems="baseline">
            <Breadcrumbs pathSegments={pathSegments} navigate={navigate} />
            <Heading size="lg">{currentPageName}</Heading>
          </VStack>
          {isSmallScreen ? (
            // Show IconButton for smaller screens
            <IconButton
              border="1px solid purple"
              variant="undefined"
              onClick={() => onOpen()}
              icon={<HamburgerIcon />}
            />
          ) : (
            // Show the other four buttons for larger screens
            <ButtonGroup
              display="flex"
              justifyContent="space-between"
              w={{ md: "60%", lg: "50%" }}
              variant="unstyled"
              textAlign="center"
              border="1px solid red"
            >
              <Button onClick={() => navigate("/")}>Home</Button>
              <Button onClick={() => navigate("/order")}>Order</Button>
              <Button onClick={() => navigate("/signup")}>Sign up</Button>
              <Button onClick={() => navigate("/login")}>Login</Button>
            </ButtonGroup>
          )}
        </Flex>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Consequat nisl vel pretium lectus quam id. Semper quis lectus
              nulla at volutpat diam ut venenatis. Dolor morbi non arcu risus
              quis varius quam quisque. Massa ultricies mi quis hendrerit dolor
              magna eget est lorem. Erat imperdiet sed euismod nisi porta.
              Lectus vestibulum mattis ullamcorper velit.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
    // <>
    //   <Flex flexDirection="column" mb={2}>
    //     <Text
    //       textAlign="center"
    //       border="0px solid black"
    //       marginTop="70px"
    //       variant="ghost"
    //       w="100%"
    //       h="auto"
    //       fontFamily="Constantia"
    //       fontSize="80px"
    //       fontWeight="bold"
    //       _hover={{ cursor: "pointer" }}
    //       onClick={() => {
    //         navigate("/");
    //       }}
    //     >
    //       MUSIC RECORDS SHOP
    //     </Text>
    //     <Box
    //       margin="8"
    //       border="1px solid black"
    //       style={{
    //         marginTop: "60px",
    //         display: "flex",
    //         border: "0px solid navy",
    //         width: "100%",
    //         height: "auto",
    //         justifyContent: "space-evenly",
    //         alignItems: "center", // Align items vertically in the center
    //       }}
    //     >
    //       <Button
    //         variant="ghost"
    //         size="lg"
    //         fontFamily="Constantia"
    //         border="0px solid red"
    //         _hover={{ bg: "none" }}
    //         onClick={() => navigate("/", { state: { param: "CD" } })}
    //         leftIcon={<FontAwesomeIcon icon={faMusic} />}
    //       >
    //         Cd
    //       </Button>
    //       <Button
    //         variant="ghost"
    //         size="lg"
    //         fontFamily="Constantia"
    //         border="0px solid red"
    //         _hover={{ bg: "none" }}
    //         onClick={() => navigate("/", { state: { param: "VINYL" } })}
    //         leftIcon={<FontAwesomeIcon icon={faMusic} />}
    //       >
    //         Vinyl
    //       </Button>
    //       <Button
    //         variant="ghost"
    //         size="lg"
    //         fontFamily="Constantia"
    //         border="0px solid red"
    //         _hover={{ bg: "none" }}
    //         onClick={() => navigate("/", { state: { param: "CASSETTE_TAPE" } })}
    //         leftIcon={<FontAwesomeIcon icon={faMusic} />}
    //       >
    //         CASSETTE TAPE
    //       </Button>
    //       <Box>
    //         {loggedIn || (
    //           <Button
    //             borderRadius={0}
    //             variant="ghost"
    //             size="lg"
    //             fontFamily="Constantia"
    //             border="0px solid red"
    //             leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
    //             onClick={() => navigate("/signup")}
    //           >
    //             Sign up
    //           </Button>
    //         )}
    //         {!loggedIn && (
    //           <Button
    //             variant="ghost"
    //             size="lg"
    //             fontFamily="Constantia"
    //             border="0px solid red"
    //             _hover={{ bg: "none" }}
    //             onClick={() => navigate("/login")}
    //             leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
    //           >
    //             Log in
    //           </Button>
    //         )}
    //         {loggedIn && (
    //           <Button
    //             variant="ghost"
    //             size="lg"
    //             fontFamily="Constantia"
    //             border="0px solid red"
    //             _hover={{ bg: "none" }}
    //             onClick={handleLogout}
    //             leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
    //           >
    //             log out
    //           </Button>
    //         )}
    //       </Box>
    //     </Box>
    //     {/*여기는 햄버거 바 Drawer*/}
    //     <Box position="fixed" top={0} left={0}>
    //       <Button
    //         zIndex={1}
    //         variant="ghost"
    //         border="0px solid red"
    //         size="lg"
    //         leftIcon={<FontAwesomeIcon icon={faBars} />}
    //         onClick={onOpen}
    //       />
    //       {/*====---------------------------------------------------------------- 바 누르면 */}
    //       <Drawer
    //         bg="gray.100"
    //         placement="left"
    //         isOpen={isOpen}
    //         onClose={onClose}
    //         size={"sm"}
    //       >
    //         {/*펼쳐지고*/}
    //         <DrawerOverlay />
    //         <DrawerContent>
    //           {/*머리*/}
    //           <DrawerHeader
    //             border="0px solid black"
    //             borderBottomWidth="1px"
    //             display="flex"
    //           >
    //             <Button
    //               marginTop="3"
    //               border="0px solid red"
    //               variant="ghost"
    //               fontSize={30}
    //               onClick={() => {
    //                 onCloseDrawer();
    //                 onClose();
    //                 navigate("/");
    //               }}
    //             >
    //               <FontAwesomeIcon
    //                 icon={faMusic}
    //                 style={{ color: "#000000" }}
    //               />
    //               MUSIC IS MY LIFE{" "}
    //               <FontAwesomeIcon
    //                 icon={faMusic}
    //                 style={{ color: "#000000" }}
    //               />
    //             </Button>
    //             <CloseButton
    //               size="md"
    //               border="0px solid blue"
    //               onClick={() => {
    //                 onClose();
    //               }}
    //               position="absolute"
    //               right="5"
    //             />
    //             <br />
    //             <br />
    //           </DrawerHeader>
    //           {/*몸통*/}
    //           <DrawerBody>
    //             {/*새로운 음반 등록 시스템 : 관리자만이 접근 가능.*/}
    //             {/*로그인으로 가기 */}
    //             <br />
    //             <Stack
    //               direction={["column", "row"]}
    //               justifyContent="space-evenly"
    //             >
    //               {loggedIn || (
    //                 <Button
    //                   textDecoration="underline"
    //                   // border="1px solid black"
    //                   variant="ghost"
    //                   size="lg"
    //                   borderRadius={0}
    //                   _hover={{ bg: "none" }}
    //                   onClick={() => {
    //                     onCloseDrawer();
    //                     onClose();
    //                     navigate("/login");
    //                   }}
    //                 >
    //                   Log in
    //                 </Button>
    //               )}
    //               {/*멤버로 가입하기 */}
    //               {loggedIn || (
    //                 <Button
    //                   textDecoration="underline"
    //                   // border="1px solid black"
    //                   borderRadius={0}
    //                   variant="ghost"
    //                   size="lg"
    //                   onClick={() => {
    //                     onCloseDrawer();
    //                     onClose();
    //                     navigate("/signup");
    //                   }}
    //                 >
    //                   Sign Up
    //                 </Button>
    //               )}
    //               <Button
    //                 textDecoration="underline"
    //                 // border="1px solid black"
    //                 borderRadius={0}
    //                 variant="ghost"
    //                 size="lg"
    //                 onClick={() => {
    //                   onCloseDrawer();
    //                   onClose();
    //                   navigate("/order");
    //                 }}
    //               >
    //                 Order
    //               </Button>
    //               {loggedIn && (
    //                 <Button
    //                   borderRadius={0}
    //                   variant="ghost"
    //                   size="lg"
    //                   onClick={() => {
    //                     onCloseDrawer();
    //                     onClose();
    //                     navigate("/member?" + urlParams.toString());
    //                   }}
    //                 >
    //                   Member Info
    //                 </Button>
    //               )}
    //               {loggedIn && (
    //                 <Button
    //                   variant="ghost"
    //                   size="lg"
    //                   onClick={handleLogout}
    //                   leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
    //                 >
    //                   Log out
    //                 </Button>
    //               )}
    //             </Stack>
    //             <Card
    //               mt={15}
    //               size="lg"
    //               variant="ghost"
    //               margin="center"
    //               w="100%"
    //               h="0 auto"
    //               border="0px solid black"
    //               onClick={() => {
    //                 onCloseDrawer();
    //                 onClose();
    //               }}
    //             >
    //               <Button
    //                 border="0px solid black"
    //                 onClick={() => {
    //                   navigate("/");
    //                 }}
    //               >
    //                 Home
    //               </Button>
    //               <Button
    //                 onClick={() => navigate("/", { state: { param: "CD" } })}
    //                 border="0px solid black"
    //               >
    //                 CD
    //               </Button>
    //               <Button
    //                 onClick={() => navigate("/", { state: { param: "VINYL" } })}
    //                 border="0px solid black"
    //               >
    //                 VINYL
    //               </Button>
    //               <Button
    //                 onClick={() =>
    //                   navigate("/", { state: { param: "CASSETTE_TAPE" } })
    //                 }
    //                 border="0px solid black"
    //               >
    //                 CASSETTE TAPE
    //               </Button>
    //             </Card>
    //             <Card>
    //               {/*" 관리자의 경우 열람 가능 */}
    //               {isAdmin && (
    //                 <Button
    //                   border="0px solid black"
    //                   borderRadius={0}
    //                   variant="ghost"
    //                   size="lg"
    //                   leftIcon={<FontAwesomeIcon icon={faRecordVinyl} />}
    //                   onClick={() => navigate("/write")}
    //                 >
    //                   {" "}
    //                   ALBUM REGISTER SYSTEM
    //                 </Button>
    //               )}
    //
    //               {/*회원 리스트*/}
    //               {isAdmin && (
    //                 <Button
    //                   borderRadius={0}
    //                   variant="ghost"
    //                   size="lg"
    //                   leftIcon={<FontAwesomeIcon icon={faUsers} />}
    //                   onClick={() => navigate("/member/list")}
    //                 >
    //                   Member List
    //                 </Button>
    //               )}
    //             </Card>
    //             <br />
    //           </DrawerBody>
    //         </DrawerContent>
    //       </Drawer>
    //     </Box>
    //     {/*회원 가입 버튼*/}
    //   </Flex>
    // </>
  );
}

export default NavBar;
