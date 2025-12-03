
import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendar, FaEdit, FaCamera, FaTimes } from 'react-icons/fa'

const Member = () => {

    const searchParams = useSearchParams()
  

    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        fetchAllUsers()
        if (searchParams.get('create') === 'true') {
          handleCreateProfile()
        }
      }, [searchParams])
    
      const fetchAllUsers = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/users/getAllUser')
          if (response.ok) {
            const data = await response.json()
            setAllUsers(data)
          }
        } catch (error) {
          console.error('Error fetching users:', error)
        }
      }
  

  return (
    <div className='w-full'>
        <div className=' grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3  justify-center items-center gap-5 scroll-'>
                  {allUsers.map((user) => (
                    <div key={user.id} className='bg-white rounded-lg shadow-md overflow-hidden'>
                                  <div className='bg-amber-400 h-20'></div>
                                  <div className='relative px-4 pb-4'>
                                    <div className='flex flex-col items-center -mt-10'>
                                      <div className='w-20 h-20 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center overflow-hidden'>
                                        {user.avatar ? (
                                          <img src={user.avatar} alt={user.name} className='w-full h-full object-cover' />
                                        ) : (
                                          <FaUser className='text-black text-3xl' />
                                        )}
                                      </div>
                                      <h3 className='text-xl font-bold text-black mt-2'>{user.name}</h3>
                                      <p className='text-black font-medium'>{user.role}</p>
                                    </div>
                                    
                                    <div className='mt-4 space-y-2'>
                                      <div className='flex items-center gap-2 text-sm'>
                                        <FaEnvelope className='text-black' />
                                        <span className='text-black'>{user.email}</span>
                                      </div>
                                      <div className='flex items-center gap-2 text-sm'>
                                        <FaPhoneAlt className='text-black' />
                                        <span className='text-black'>{user.phone}</span>
                                      </div>
                                      <div className='flex items-center gap-2 text-sm'>
                                        <FaMapMarkerAlt className='text-black' />
                                        <span className='text-black'>{user.address}</span>
                                      </div>
                                    </div>
                    
                                    {/* {isAdmin && (
                                      <button onClick={() => handleEditClick(user)} className='w-full mt-4 bg-persian-blue-600 text-white py-2 rounded-lg hover:bg-persian-blue-700 flex items-center justify-center gap-2'>
                                        <FaEdit /> Edit
                                      </button>
                                    )} */}
                                  </div>
                                </div>
                    
                  ))}
                </div>
    </div>
  )
}

export default Member