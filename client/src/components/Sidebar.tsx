import React, { Suspense, lazy, useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaImage, FaUserPlus, FaVideo } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logout, setSocketConnection } from "../redux/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
import Divider from "./Divider";
import { FiArrowLeft } from "react-icons/fi";
import LoadingSpinner from "./loading/spinner";
const EditUserDetails = lazy(() => import("./EditUserDetails"));
const SearchUser = lazy(() => import('./SearchUser'));

const Sidebar: React.FC = () => {
  const user = useSelector((state: RootState) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const socketConnection = useSelector((state: RootState) => state?.user?.socketConnection);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('get-all-convo', user._id);
      const handleAllConvo = (data: any) => {
        const conversationUserData = data.map((conversationUser: any) => {
          if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender
            }
          }
          else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver
            }
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender
            }
          }
        })

        setAllUsers(conversationUserData)
      }
      socketConnection.on('all-conversation', handleAllConvo);

      return () => {
        socketConnection.off('all-conversation', handleAllConvo);
      }
    }
  }, [socketConnection, user])

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

          <button onClick={() => setOpenSearchUser(true)} className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md`} title="Add Friends">
            <FaUserPlus size={20} />
          </button>
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
              userId={user?._id}
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

      <div className="w-full">
        <div className="h-14 flex items-center mt-1">
          <h2 className="text-xl font-bold p-4 text-slate-800">Messages</h2>
        </div>
        <Divider />

        <div className="h-[calc(100vh-68px)] overflow-x-hidden overflow-y-auto scrollbar">
          {
            allUsers.length === 0 && (
              <div>
                <div className="flex justify-center items-center my-4">
                  <FiArrowLeft size={35} className="text-slate-400" />
                </div>
                <p className="text-sm text-center text-slate-400">Add friends to start a conversation.</p>
              </div>
            )
          }

          {
            allUsers.map((conv) => {
              return (
                <NavLink to={"/" + conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 py-3 px-2 border rounded hover:bg-slate-100 cursor-pointer'>
                  <div>
                    <Avatar
                      imageUrl={conv?.userDetails?.profile_pic}
                      name={conv?.userDetails?.name}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                    <div className='text-slate-500 text-xs flex items-center gap-1'>
                      <div className='flex items-center gap-1'>
                        {
                          conv?.lastMessage?.imageUrl && (
                            <div className='flex items-center gap-1'>
                              <span><FaImage /></span>
                              {!conv?.lastMsg?.text && <span>Image</span>}
                            </div>
                          )
                        }
                        {
                          conv?.lastMessage?.videoUrl && (
                            <div className='flex items-center gap-1'>
                              <span><FaVideo /></span>
                              {!conv?.lastMsg?.text && <span>Video</span>}
                            </div>
                          )
                        }
                      </div>
                      <p className='text-ellipsis line-clamp-1'>{conv?.lastMessage?.text}</p>
                    </div>
                  </div>
                  {
                    Boolean(conv?.unseen) && (
                      <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseen}</p>
                    )
                  }

                </NavLink>
              )
            })
          }
        </div>
      </div>

      {
        editUserOpen && (
          <Suspense fallback={
            <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
              <LoadingSpinner />
            </div>
          }>
            <EditUserDetails
              onClose={() => setEditUserOpen(false)}
              user={user}
            />
          </Suspense>
        )
      }

      {
        openSearchUser && (
          <Suspense fallback={
            <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
              <LoadingSpinner />
            </div>
          }>
            <SearchUser onClose={() => setOpenSearchUser(false)} />
          </Suspense>
        )
      }
    </div>
  )
}

export default Sidebar
