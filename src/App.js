import React from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import { MemberSignup } from "./page/member/MemberSignup";
import { MemberView } from "./page/member/MemberView";
import { MemberEdit } from "./page/member/MemberEdit";
import { MemberList } from "./page/member/MemberList";
import { MemberLogin } from "./page/member/MemberLogin";
import { MemeberSocialLogin } from "./page/member/MemeberSocialLogin";
import { MemberLikes } from "./page/member/MemberLikes";
import { MemberOrder } from "./page/member/MemberOrder";
import { Search } from "./page/board/Search";
import { BoardList } from "./page/board/BoardList";
import { BoardWrite } from "./page/board/BoardWrite";
import { BoardView } from "./page/board/BoardView";
import { BoardEdit } from "./page/board/BoardEdit";
import { BoardManage } from "./page/board/BoardManage";
import { OrderWrite } from "./page/order/OrderWrite";
import Payment from "./page/payment/Payment";
import { Success } from "./page/payment/Success";
import { Fail } from "./page/payment/Fail";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
      <Route path="board/:id" element={<BoardView />} />
      <Route path="board/manage" element={<BoardManage />} />
      <Route path="edit/:id" element={<BoardEdit />} />
      <Route path="signup" element={<MemberSignup />} />
      <Route path="member/list" element={<MemberList />} />
      <Route path="member/order/:id" element={<MemberOrder />} />
      <Route path="member/:id" element={<MemberView />} />
      <Route path="medit/:id" element={<MemberEdit />} />
      <Route path="likes/:id" element={<MemberLikes />} />
      <Route path="login" element={<MemberLogin />} />
      <Route path="search" element={<Search />} />
      <Route path="loginprocess/:type" element={<MemeberSocialLogin />} />
      <Route path="order" element={<OrderWrite />} />
      <Route path="payment" element={<Payment />} />
      <Route path="success" element={<Success />} />
      <Route path="fail" element={<Fail />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
