import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import LoadingSpinner from '../components/loading/spinner';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/login')
    }
  }, [])

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`
    setLoading(true);
    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true,
      });

      toast.success(response.data.message)

      if (response.data.success) {
        setData({ password: "" })
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Error while login")
    }
    setLoading(false);
  }


  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>

        <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
          <Avatar
            userId={location?.state?._id}
            imageUrl={location?.state?.profile_pic}
            name={location?.state?.name}
            width={60}
            height={60}
          />
          <h2 className='font-semibold text-xl mt-1'>{location?.state?.name}</h2>
        </div>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Verify Password:</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password...'
              className='bg-slate-100 px-2 py-1 focus:outline-primary/20'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
          <button
            className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-semibold text-white tracking-wide'
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : "Verify"}
          </button>
        </form>
        <p className='my-3 text-center'><Link to={"/forgot-password"} className='hover:text-primary hover:underline'>Forgot Password?</Link></p>
      </div>
    </div>
  )
}

export default CheckPasswordPage;
