# FavHub

## 🎵 프로젝트 소개
FavHub는 음반이 아닌 형태의 음악 카피를 구하기 어려운 환경에서  
**음악을 소장하고 싶은 소비자와 공급자를 연결하는 음원 거래 플랫폼**입니다.

React + Spring Boot 기반으로 개발되었으며,  
실제 서비스 수준의 **인증·결제·장바구니·검색 기능**을 구현하는 것을 목표로 했습니다.

## 📅 개발 기간
2023.11.23 ~ 2023.12.21

## 👥 팀 구성 및 역할
| 주예린[@yel106](https://github.com/yel106/prj3) | 전희연[@jeon602](https://github.com/jeon602/pfj3fe3) | 원아영[@azerone52](https://github.com/azerone52/teamPrj2312Fe) | 김도형[@kkssii0210](https://github.com/kkssii0210/prj3) | 이승미 |
|------|-------|-------|-------|-------|
| 상품 CRUD, 댓글 CRUD | 상품 CRUD, 좋아요, 메인 UI | JWT 토큰을 이용한 로그인 | AWS 배포, 결제 (토스 API) | 소셜 로그인, 장바구니 CRUD |


## 🛠 기술 스택
- **Frontend**: React, Chakra UI, JSX
- **Backend**: Spring Boot, Spring Security, JPA, QueryDSL
- **Auth**: JWT, OAuth (소셜 로그인)
- **Infra**: AWS EC2, RDS
- **DB**: RDBMS (JPA 기반)

## 🏗 시스템 아키텍처
<img width="805" height="444" alt="image" src="https://github.com/user-attachments/assets/1b792f60-1901-466d-adda-85022dbc907a" />


## ✨ 주요 기능
- 회원가입 / 로그인 / 소셜 로그인
- JWT 기반 인증 및 권한 관리
- 음반 상품 조회 및 검색 필터링
- 장바구니 CRUD (회원 / 비회원)
- 댓글 및 좋아요 기능
- 결제 기능
- AWS 기반 배포

## 🧠 트러블슈팅 (요약)
- **CORS + 431 오류**  
  → Axios params 구조 개선 및 Spring CorsFilter 설정 조정
- **QueryDSL Q-Class 미생성 문제**  
  → Gradle 빌드 설정 수정 및 Annotation Processor 이해
- **JWT 환경에서 비회원 장바구니 처리**  
  → sessionStorage 활용 후 로그인 시 서버 데이터 병합
- **JPA 연관관계 쿼리 오류**  
  → 엔티티 기반 JPQL 재설계로 null 반환 문제 해결

## 🚀 개선 및 개인 기여
- **이미지 로딩 성능 개선 (WebP 적용)**  
  - 서버 단에서 이미지 포맷 변환 처리
  - 스토리지 용량 절감 및 페이지 로딩 성능 개선
  - 정적 리소스 관리 및 CDN 캐싱에 유리한 구조로 개선

## 📄 상세 문서
- 프로젝트 기획 배경
- ERD 및 상세 아키텍처
- API 명세
- 트러블슈팅 전체 과정 및 회고

👉 [프로젝트 상세 문서 (Notion)](https://www.notion.so/FavHub-5b3bf25c000c44ef8668d08a1dab992c?source=copy_link)
