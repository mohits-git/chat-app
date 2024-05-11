import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { logout, setToken, setUser } from "../redux/userSlice";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`
    try {
      const response = await axios({
        url: URL,
        withCredentials: true
      });

      if (response.data.logout) {
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

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className="bg-white">
        <Sidebar />
      </section>
      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default Home
