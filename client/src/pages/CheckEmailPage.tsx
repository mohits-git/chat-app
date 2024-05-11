import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { PiUserCircle } from "react-icons/pi";
import LoadingSpinner from '../components/loading/spinner';

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  })
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

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

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`
    setLoading(true);
    try {
      const response = await axios.post(URL, data)

      toast.success(response.data.message)

      if (response.data.success) {
        setData({ email: "" })
        navigate('/password', {
          state: response?.data?.data
        })
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error while login")
    }
    setLoading(false);
  }


  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>

        <div className='w-fit mx-auto mb-2'>
          <PiUserCircle
            size={80}
          />
        </div>

        <h3 className='font-semibold text-xl text-center'>Welcome Back to Chat!</h3>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email...'
              className='bg-slate-100 px-2 py-1 focus:outline-primary/20'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <button
            className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-semibold text-white tracking-wide'
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : "Login"}
          </button>
        </form>
        <p className='my-3 text-center'>New User ? <Link to={"/register"} className='hover:text-primary hover:underline'>Register</Link></p>
      </div>
    </div>
  )
}

export default CheckEmailPage
