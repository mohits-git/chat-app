import React, { ChangeEvent, FormEvent, MouseEvent as MouseEventHandler, useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/upload-file'
import Divider from './Divider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { UserState, setUser } from '../redux/userSlice'

type Props = {
  onClose: () => void;
  user: UserState;
}

const EditUserDetails: React.FC<Props> = React.memo(({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic
  });
  const uploadPhotoRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const handler = ({ key }: KeyboardEvent) => {
      if (key === "Escape") {
        onClose();
      }
    }
    document.addEventListener('keyup', handler);
    return () => {
      document.removeEventListener('keyup', handler);
    }
  }, []);

  useEffect(() => {
    setData((preve) => {
      return {
        ...preve,
        ...user
      }
    })
  }, [user])

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleOpenUploadPhoto = (e: MouseEventHandler<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    uploadPhotoRef?.current?.click()
  }
  const handleUploadPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    if (!file) return;
    const uploadPhoto = await uploadFile(file)

    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url
      }
    })
  }

  const handleSubmit = async (e: MouseEventHandler<HTMLButtonElement> | FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-user`

      const response = await axios.post(URL, {
          name: data.name,
          profile_pic: data.profile_pic,
        }, { withCredentials: true });

      console.log('response', response)
      toast.success(response?.data?.message)

      if (response.data.success) {
        dispatch(setUser(response.data.data))
        onClose()
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong")
    }
  }
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
      <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
        <h2 className='font-semibold'>Profile Details</h2>
        <p className='text-sm text-slate-500'>Edit user details</p>

        <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              name='name'
              id='name'
              value={data.name}
              onChange={handleOnChange}
              className='w-full py-1 px-2 focus:outline-primary/20 border'
            />
          </div>

          <div>
            <div>Profile Picture:</div>
            <div className='my-1 flex items-center gap-4'>
              <label htmlFor='profile_pic'>
                <button className='flex items-center space-x-4' onClick={handleOpenUploadPhoto}>
                  <Avatar
                    width={40}
                    height={40}
                    imageUrl={data?.profile_pic}
                    name={data?.name}
                    userId={user?._id}
                  />
                  <span>Change Photo</span>
                </button>
                <input
                  type='file'
                  id='profile_pic'
                  className='hidden'
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <Divider />
          <div className='flex gap-2 w-fit ml-auto '>
            <button type='button' onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
            <button onClick={handleSubmit} className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary'>Save</button>
          </div>
        </form>
      </div>
    </div>
  )
})

export default EditUserDetails;
