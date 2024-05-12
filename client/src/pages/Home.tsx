import axios from "axios";
import React, { useEffect } from "react";
import chatLogo from "../assets/chat-logo.svg"
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { logout, setOnlineUsers, setSocketConnection, setToken, setUser } from "../redux/userSlice";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { io } from "socket.io-client";

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`
    try {
      const response = await axios({
        url: URL,
        withCredentials: true
      });

      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/login')
        toast("Please login to chat.");
        return;
      }

      dispatch(setUser(response.data.data));
      if (!user.token.length) {
        dispatch(setToken({ token: localStorage.getItem('token') || '' }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserDetails();
  }, [])

  {/*Socket Connection*/ }
  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token') || ''
      }
    });

    socketConnection.on('onlineUser', (data: string[]) => {
      console.log(data);
      dispatch(setOnlineUsers(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    }
  }, []);

  const basePath = location.pathname === '/';

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
        <div className="flex justify-center items-center overflow-hidden">
          <img
            src={chatLogo}
            alt="Logo"
            width={60}
            height={60}
            className="text-primary"
          />
          <span className="mx-4 text-4xl font-bold text-slate-700">Chat</span>
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  )
}

export default Home
