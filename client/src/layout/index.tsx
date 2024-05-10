import React from "react";
import { Outlet } from "react-router-dom";
import chatLogo from "../assets/chat-logo.svg"

const AuthLayouts: React.FC = () => {
  return (
    <>
      <header className="flex justify-center items-center py-3 h-20 shadow-md overflow-hidden bg-white">
        <img
          src={chatLogo}
          alt="Logo"
          width={40}
          height={25}
          className="text-primary"
        />
        <span className="mx-4 text-3xl font-bold">Chat</span>
      </header>
      <Outlet />
    </>
  )
}

export default AuthLayouts
