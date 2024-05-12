import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import LoadingSpinner from './loading/spinner';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast'
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import { UserState } from '../redux/userSlice';

type Props = {
  onClose: () => void;
}

const SearchUser: React.FC<Props> = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState<UserState[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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
    if (!search.length) {
      if (searchUser.length) setSearchUser([]);
      return;
    }
    const handleSearchUser = async () => {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;
      setLoading(true);
      try {
        const response = await axios.post(URL, {
          search: search
        });

        setSearchUser(response.data.data);

      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
      }
      setLoading(false);
    }

    let id = setTimeout(handleSearchUser, 250);

    return () => clearTimeout(id);
  }, [search]);

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
      <div className='w-full max-w-lg mx-auto mt-10'>
        <div className='bg-white rounded h-14 overflow-hidden flex '>
          <input
            type='text'
            placeholder='Search user by name, email....'
            className='w-full outline-none py-1 h-full px-4'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className='h-14 w-14 flex justify-center items-center'>
            <IoSearchOutline size={25} />
          </div>
        </div>

        <div className='bg-white mt-2 w-full p-4 rounded'>
          {
            searchUser.length === 0 && !loading && (
              <p className='text-center text-slate-500'>no user found!</p>
            )
          }
          {
            loading && (
              <div className='w-full flex justify-center items-center'><LoadingSpinner variant='primary' /></div>
            )
          }
          {
            searchUser.length !== 0 && !loading && (
              searchUser.map((user) => {
                return (
                  <UserSearchCard key={user._id} user={user} onClose={onClose} />
                )
              })
            )
          }
        </div>
      </div>

      <div className='absolute top-0 right-0 text-2xl p-2 text-slate-200 lg:text-4xl hover:text-white' onClick={onClose}>
        <button>
          <IoClose />
        </button>
      </div>
    </div>
  )
}

export default SearchUser;
