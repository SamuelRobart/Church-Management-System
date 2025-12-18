'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaUsers, FaCalendarAlt, FaDonate, FaChartLine, FaUsersCog, FaBullhorn, FaHandsHelping, FaImages, FaTimes } from 'react-icons/fa'
import { api } from '@/services/api'

const AdminDash = () => {
  const router = useRouter()
  const [userCount, setUserCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchUserCount()
  }, [])

  const fetchUserCount = async () => {
    try {
      const count = await api.users.count()
      setUserCount(count)
    } catch (err) {
      console.error(err)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.users.create(formData)
      
      if (response.ok) {
        setIsModalOpen(false)
        setFormData({})
        fetchUserCount()
      }
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const stats = [
    { title: 'Total Members', value: userCount, icon: FaUsers, color: 'bg-blue-500', link: '/Members' },
    { title: 'Upcoming Events', value: '12', icon: FaCalendarAlt, color: 'bg-green-500', link: '/Events' },
    { title: 'Monthly Donations', value: '$45,678', icon: FaDonate, color: 'bg-yellow-500', link: '/Donation' },
    { title: 'Attendance Rate', value: '87%', icon: FaChartLine, color: 'bg-purple-500', link: '/Attendance' },
    { title: 'Active Groups', value: '24', icon: FaUsersCog, color: 'bg-indigo-500', link: '/Group' },
    { title: 'Communications', value: '156', icon: FaBullhorn, color: 'bg-pink-500', link: '/Communication' },
    { title: 'Volunteers', value: '89', icon: FaHandsHelping, color: 'bg-teal-500', link: '/Volunteer' },
    { title: 'Media Files', value: '342', icon: FaImages, color: 'bg-orange-500', link: '/Media' },
  ]

  return (
    <div className='w-full h-full p-6 bg-gray-50'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>Admin Dashboard</h1>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer`}
            onClick={() => window.location.href = stat.link}
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-persian-blue-50 text-sm font-medium'>{stat.title}</p>
                <p className='text-3xl font-bold text-slate-200 mt-2'>{typeof stat.value === 'number' ? stat.value : stat.value}</p>
              </div>
              <div className={` p-4 rounded-full`}>
                <stat.icon className='text-white text-4xl' />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Recent Activities</h2>
          <ul className='space-y-3'>
            <li className='flex items-center text-gray-600'>
              <span className='w-2 h-2 bg-blue-500 rounded-full mr-3'></span>
              New member registered: John Doe
            </li>
            <li className='flex items-center text-gray-600'>
              <span className='w-2 h-2 bg-green-500 rounded-full mr-3'></span>
              Event created: Sunday Service
            </li>
            <li className='flex items-center text-gray-600'>
              <span className='w-2 h-2 bg-yellow-500 rounded-full mr-3'></span>
              Donation received: $500
            </li>
          </ul>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Quick Actions</h2>
          <div className='grid grid-cols-2 gap-3'>
            <button onClick={() => setIsModalOpen(true)} className='bg-persian-blue-600 text-white py-2 px-4 rounded-lg hover:bg-persian-blue-700 transition'>
              Add Member
            </button>
            <button className='bg-persian-blue-600 text-white py-2 px-4 rounded-lg hover:bg-persian-blue-700 transition'>
              Create Event
            </button>
            <button className='bg-persian-blue-600 text-white py-2 px-4 rounded-lg hover:bg-persian-blue-700 transition'>
              Send Message
            </button>
            <button className='bg-persian-blue-600 text-white py-2 px-4 rounded-lg hover:bg-persian-blue-700 transition'>
              View Reports
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center p-6 border-b'>
              <h2 className='text-2xl font-bold text-gray-800'>Create Profile</h2>
              <button type='button' onClick={() => setIsModalOpen(false)} className='text-gray-500 hover:text-gray-700'>
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className='p-6'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-2'>Name</label>
                  <input type='text' name='name' value={formData.name || ''} onChange={handleInputChange} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-500' required />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-2'>Role</label>
                  <select name='role' value={formData.role || ''} onChange={handleInputChange} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-500' required>
                    <option value=''>Select Role</option>
                    <option value='Admin'>Admin</option>
                    <option value='Member'>Member</option>
                    <option value='Volunteer'>Volunteer</option>
                    <option value='Pastor'>Pastor</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-2'>Email</label>
                  <input type='email' name='email' value={formData.email || ''} onChange={handleInputChange} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-500' required />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-2'>Phone</label>
                  <input type='tel' name='phone' value={formData.phone || ''} onChange={handleInputChange} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-500' required />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-500 mb-2'>Address</label>
                  <textarea name='address' value={formData.address || ''} onChange={handleInputChange} rows='3' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-persian-blue-600 outline-none text-gray-500' required />
                </div>
              </div>

              <div className='flex gap-4 mt-6'>
                <button type='submit' className='flex-1 bg-persian-blue-600 text-white py-2 rounded-lg hover:bg-persian-blue-700'>
                  Create Profile
                </button>
                <button type='button' onClick={() => setIsModalOpen(false)} className='flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400'>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDash
