import axios from "axios";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";
import { Button } from "@chakra-ui/react";
import React, { useState } from "react";

export const handleSocialLogin = (socialLoginType) => {
  axios
    .get(`/api/auth/${socialLoginType}`)
    .then((response) => {
      console.log(response.data);
      window.location.href = response.data;
    })
    .catch((error) => console.log(error))
    .finally(() => console.log(`${socialLoginType} 로그인`));
};

export const PostCode = () => {
  const [postCode, setPostCode] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [address, setAddress] = useState("");

  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data) => {
    console.log("받은 데이터: " + data);
    setPostCode(data.zonecode);
    let fullAddress = data.address;
    let extraAddress = "";

    console.log("데이터 addressType에 따라 주소 저장 시작");

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? `(${extraAddress})` : "";
    }
    console.log("fullAddress: " + fullAddress);
    setAddress(fullAddress);
    console.log("우편번호 :" + postCode);
  };

  const handleClick = async () => {
    try {
      console.log("handleClick 시작");
      await open({ onComplete: handleComplete });
    } catch (error) {
      console.log("에러 발생");
      console.log(error.response.data);
    } finally {
      console.log("종료");
    }
  };

  return <Button onClick={handleClick}>우편번호 찾기</Button>;
};

export const startSocialLoginTimer = async (
  accessTokenExpiry,
  refreshThreshold,
  setIsSocial,
  toast,
  navigate,
) => {
  console.log("========== 소셜 로그인 멤버입니다 ==========");
  console.log("==========" + new Date() + "==========");

  let countdownTimer;

  const startCountdownTimer = async (expiresIn) => {
    countdownTimer = setInterval(
      async () => {
        await RefreshSocialAccessToken();
      },
      (expiresIn - refreshThreshold) * 1000,
    );
  };

  const RefreshSocialAccessToken = async () => {
    // try {
    //   console.log("백엔드에 갱신 요청");
    //   const response = await axios.get("/api/auth/refreshToken", {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    //     },
    //   });
    //
    //   if (response.status === 204) {
    //     setIsSocial(false);
    //   } else {
    //     const newExpiresIn = response.data;
    //     console.log("expiresIn:", newExpiresIn);
    //     await startCountdownTimer(newExpiresIn);
    //   }
    // } catch (error) {
    //   toast({
    //     description: "다시 로그인해주세요.",
    //     status: "error",
    //   });
    //   console.log(error.response.data);
    //   navigate("/login");
    // }
  };

  // await startCountdownTimer(accessTokenExpiry);
  console.log("========== 소셜 로그인 멤버 검증 완료 ==========");

  return () => clearInterval(countdownTimer);
};
