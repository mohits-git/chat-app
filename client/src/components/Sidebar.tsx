import React, { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaUserPlus } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import EditUserDetails from "./EditUserDetails";
import { logout } from "../redux/userSlice";
import axios from "axios";
import toast from "react-hot-toast";

const Sidebar: React.FC = () => {
  const user = useSelector((state: RootState) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/logout`
    try {
      await axios({
        url: URL,
        withCredentials: true
      });
      dispatch(logout());
      navigate('/login');
    } catch (error: any) {
      console.log("Couldn't logout", error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    }
  }
  return (
    <div className="w-full h-full grid grid-cols-[50px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-4 text-slate-600 flex flex-col justify-between">
        <div className="grid gap-2">
          <NavLink to={'/'} className={(isActive) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md ${isActive ? "text-primary bg-slate-200" : ""}`} title="Chat">
            <IoChatbubbleEllipses size={20} />
          </NavLink>

          <div className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md`} title="Chat">
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="grid gap-2">
          <button
            className="flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
            />
          </button>
          <button
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md"
            onClick={handleLogout}
          >
            <span className="-ml-2 hover:ml-0 transition-all duration-200">
              <BiLogOut size={25} />
            </span>
          </button>
        </div>
      </div>

      {
        editUserOpen && (
          <EditUserDetails
            onClose={() => setEditUserOpen(false)}
            user={user}
          />
        )
      }
    </div>
  )
}

export default Sidebar
