import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/" >
      <Route element={<AuthLayouts />}>
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<CheckEmailPage />} />
        <Route path="password" element={<CheckPasswordPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route path="" element={<Home />}>
        <Route path=":userId" element={<MessagePage />} />
      </Route>
    </Route>
  )
);

export default router;
