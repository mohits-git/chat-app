import React, { ChangeEvent, useEffect, useState, MouseEvent as MouseEventHandler, FormEvent, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from "react-icons/fa";
import uploadFile from "../helpers/upload-file";
import { IoClose } from "react-icons/io5";
import LoadingSpinner from "./loading/spinner";
import backgroundImage from "../assets/wallapaper.jpeg"
import { IoMdSend } from "react-icons/io";
import moment from "moment";

const MessagePage: React.FC = () => {
  const params = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const socketConnection = useSelector((state: RootState) => state.user?.socketConnection)
  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  })
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: '',
  });
  const currentMessage = useRef<HTMLDivElement>(null);
  const [allMessages, setAllMessages] = useState<{
    text: string,
    imageUrl: string,
    videoUrl: string,
    createdAt: string,
    updatedAt: string,
    sender: string,
  }[]>([]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [allMessages])

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
      const handleMessage = (data: any) => {
        if (data._id) setUserData(data);
      }
      const handleNewMessage = (data: any) => {
        if (data.sender === params.userId || data.receiver === params.userId) {
          setAllMessages(data.messages);
        }
      }
      socketConnection.on("message-user", handleMessage);
      socketConnection.on("message", handleNewMessage);
      return () => {
        socketConnection.off("message-user", handleMessage);
        socketConnection.off("message", handleNewMessage);
      }
    }
  }, [params.userId, socketConnection, user])

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoading(true);
      setOpenImageVideoUpload(false);

      const upload = await uploadFile(file);
      console.log("UploadedPhoto", upload);
      if (!upload) return;

      setMessage(prev => ({
        ...prev,
        imageUrl: upload?.url
      }));
    } catch (error) {
      console.log("Could not upload picture", error);
    }
    setLoading(false);
  }

  const handleUploadVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoading(true);
      setOpenImageVideoUpload(false);

      const upload = await uploadFile(file);
      console.log("UploadedPhoto", upload);
      if (!upload) return;
      setMessage(prev => ({
        ...prev,
        videoUrl: upload?.url
      }));
    } catch (error) {
      console.log("Could not upload video", error);
    }
    setLoading(false);

  }


  const handleClearUploadImage = (e: MouseEventHandler<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMessage(prev => ({
      ...prev,
      imageUrl: '',
    }));
  }
  const handleClearUploadVideo = (e: MouseEventHandler<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMessage(prev => ({
      ...prev,
      videoUrl: '',
    }));
  }

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (message.text?.length || message.imageUrl?.length || message.videoUrl?.length) {
      if (socketConnection) {
        socketConnection.emit('new-message', {
          sender: user?._id,
          receiver: userData._id,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
        });
        setMessage({
          text: '',
          imageUrl: '',
          videoUrl: '',
        });
      }
    }
  }

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-cover border-l'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={userData?.profile_pic}
              name={userData?.name}
              userId={userData?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{userData?.name}</h3>
            <p className='-my-2 text-sm mx-1'>
              {
                userData.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
              }
            </p>
          </div>
        </div>

        <div >
          <button className='cursor-pointer hover:text-primary'>
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {
            allMessages.map((msg, index) => {
              return (
                <div key={index} className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.sender ? "ml-auto bg-teal-100" : "bg-white"}`}>
                  <div className='w-full relative'>
                    {
                      msg?.imageUrl && (
                        <img
                          src={msg?.imageUrl}
                          className='w-full h-full object-scale-down'
                        />
                      )
                    }
                    {
                      msg?.videoUrl && (
                        <video
                          src={msg.videoUrl}
                          className='w-full h-full object-scale-down'
                          controls
                        />
                      )
                    }
                  </div>
                  <p className='px-2'>{msg.text}</p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                </div>
              )
            })
          }
        </div>
        {
          message.imageUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center overflow-hidden'>
              <button className='w-fit p-2 absolute top-0 right-0 cursor-pointer text-slate-600 hover:text-white' onClick={handleClearUploadImage}>
                <IoClose size={30} />
              </button>
              <div className='bg-white p-3 min-h-[300px] min-w-[300px] rounded-lg'>
                <img
                  src={message.imageUrl}
                  alt='uploadImage'
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                />
              </div>
            </div>
          )
        }
        {
          message.videoUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <button className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                <IoClose size={30} />
              </button>
              <div className='bg-white p-3'>
                <video
                  src={message.videoUrl}
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )
        }
        {
          loading && (
            <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
              <LoadingSpinner />
            </div>
          )
        }
      </section>

      <section className='h-16 bg-white flex items-center px-4'>
        <div className="relative">
          <button
            onClick={() => setOpenImageVideoUpload(prev => !prev)}
            className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
            <FaPlus size={20} />
          </button>

          {
            openImageVideoUpload && (
              <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                <form>
                  <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-primary'>
                      <FaImage size={18} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-purple-500'>
                      <FaVideo size={18} />
                    </div>
                    <p>Video</p>
                  </label>

                  <input
                    type='file'
                    id='uploadImage'
                    onChange={handleUploadImage}
                    className='hidden'
                  />

                  <input
                    type='file'
                    id='uploadVideo'
                    onChange={handleUploadVideo}
                    className='hidden'
                  />
                </form>
              </div>
            )
          }
        </div>

        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Type here message...'
            className='py-1 px-4 outline-none w-full h-full'
            value={message.text}
            onChange={(e) => setMessage(prev => ({ ...prev, text: e.target.value }))}
          />
          <button className='text-primary hover:text-secondary'>
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  )
}

export default MessagePage
