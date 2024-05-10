import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/" >
      <Route path="register" element={<RegisterPage />} />
      <Route path="email" element={<CheckEmailPage />} />
      <Route path="password" element={<CheckPasswordPage />} />
      <Route path="" element={<Home />}>
        <Route path=":userId" element={<MessagePage />} />
      </Route>
    </Route>
  )
);

export default router;
