import React, { ChangeEvent, FormEvent, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/upload-file";
import LoadingSpinner from "../components/loading/spinner";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const RegisterPage: React.FC = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });
  const [loading, setLoading] = useState(false);

  const [uploadPicture, setUploadPicture] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleUploadPicture = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoading(true);

      const upload = await uploadFile(file);
      console.log("UploadedPhoto", upload);
      if (!upload) return;
      setUploadPicture(file);
      setData((prev) => ({
        ...prev,
        profile_pic: upload?.url
      }))
    } catch (error) {
      console.log("Could not upload picture", error);
    }
    setLoading(false);
  }

  const handleClearUploadPicture = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPicture(null);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    console.log(data);

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log("RESPONSE:", response);
      toast.success(response.data.message);
      if (response.data.success) {
        setData({ name: '', email: '', password: '', profile_pic: '' });
        navigate('/login');
      }
    } catch (error: any) {
      console.log("Error while registering", error);
      if (error instanceof AxiosError)
        toast.error(error?.response?.data?.message || "Error while registering");
      else toast.error(error?.message || "Error while registering");
    }

    setLoading(false);
  }

  return (
    <div className="h-screen -mt-16 flex items-center">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3 className="text-lg font-semibold">Welcome to Chat</h3>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name..."
              className="bg-slate-100 px-2 py-1 focus:outline-primary/20"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email..."
              className="bg-slate-100 px-2 py-1 focus:outline-primary/20"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Password: </label>
            <input
              type="text"
              id="password"
              name="password"
              placeholder="Enter your password..."
              className="bg-slate-100 px-2 py-1 focus:outline-primary/20"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">Profile Picture:
              <div className="h-14 bg-slate-100 flex justify-center items-center rounded hover:border hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {
                    uploadPicture?.name ? uploadPicture.name : "Upload Your Profile Picture. No file yet..."
                  }
                </p>
                {uploadPicture?.name &&
                  <button
                    type="button"
                    className="text-lg ml-2 hover:text-red-500"
                    onClick={handleClearUploadPicture}
                  >
                    <IoClose />
                  </button>}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="hidden bg-slate-100 px-2 py-1 focus:outline-primary/20"
              onChange={handleUploadPicture}
            />
          </div>

          <button
            className="bg-primary text-white text-lg px-4 py-1 hover:bg-secondary rounded font-semibold mt-2 tracking-wide flex justify-center"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center">Already have an account? <Link to={'/login'} className="text-primary hover:underline">Login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage
