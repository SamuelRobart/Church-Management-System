'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendar, FaEdit, FaCamera, FaTimes, FaSearch } from 'react-icons/fa'
import CreateProfile from './CreateProfile'
import {api} from '@/services/api'

const Profile = () => {
  const searchParams = useSearchParams()
  const [allUsers, setAllUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [editingUserId, setEditingUserId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const fileInputRef = useRef(null)
  const isAdmin = true
  
  const roles = ['Admin', 'Member', 'Volunteer', 'Pastor']

  useEffect(() => {
    fetchAllUsers()
    if (searchParams.get('create') === 'true') {
      handleCreateProfile()
    }
  }, [searchParams])

  useEffect(() => {
    filterUsers()
  }, [allUsers, searchTerm, selectedRole])

  const filterUsers = () => {
    let filtered = allUsers
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      )
    }
    
    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole)
    }
    
    setFilteredUsers(filtered)
  }

  const fetchAllUsers = async () => {
    try {
      const data = await api.users.getAll()
      setAllUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleCreateProfile = () => {
    setFormData({})
    setEditingUserId(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (user) => {
    setFormData(user)
    setEditingUserId(user.id)
    setIsModalOpen(true)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = editingUserId 
        ? await api.users.update(editingUserId, formData)
        : await api.users.create(formData)
      
      if (response.ok) {
        await fetchAllUsers()
        setIsModalOpen(false)
        setFormData({})
      }
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await api.users.delete(editingUserId)
        
        if (response.ok) {
          await fetchAllUsers()
          setIsModalOpen(false)
          setFormData({})
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  return (
    <div className='w-full h-auto p-6 bg-gray-50 '>
      <div className='max-w-6xl mx-auto'>
        {isAdmin && <CreateProfile onCreateClick={handleCreateProfile} />}

        {/* Search and Filter Section */}
        <div className='max-w-6xl mx-auto h-auto m-10'>
          <div className='bg-red-700 rounded-md p-6 shadow-lg'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
              {/* Search Bar */}
              <div className='md:col-span-2'>
                <label className='block text-white text-sm font-semibold mb-2'>Search Users</label>
                <div className='flex items-center bg-white rounded-lg overflow-hidden shadow-md'>
                  <FaSearch className='text-gray-400 ml-3' />
                  <input
                    type='text'
                    placeholder='Search by name, email, or phone...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='flex-1 px-4 py-3 focus:outline-none text-gray-700 placeholder-gray-400'
                  />
                </div>
              </div>
              
              {/* Filter by Role */}
              <div>
                <label className='block text-white text-sm font-semibold mb-2'>Filter by Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className='w-full px-4 py-3 rounded-lg border-2 border-white bg-white text-gray-700 font-medium focus:outline-none cursor-pointer hover:bg-gray-50'
                >
                  <option value=''>All Roles</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Results Counter */}
            <div className='mt-4 text-white text-sm font-medium'>
              Showing {filteredUsers.length} of {allUsers.length} user{allUsers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-wrap'>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className='bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='bg-amber-400 h-20'></div>
                <div className=' px-4 pb-4'>
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

                  {isAdmin && (
                    <button onClick={() => handleEditClick(user)} className='w-full mt-4 bg-persian-blue-600 text-white py-2 rounded-lg hover:bg-persian-blue-700 flex items-center justify-center gap-2'>
                      <FaEdit /> Edit
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-1 md:col-span-2 lg:col-span-3 text-center py-12'>
              <p className='text-gray-500 text-lg'>No users found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center p-6 border-b'>
              <h2 className='text-2xl font-bold text-gray-800'>{editingUserId ? 'Edit Profile' : 'Create Profile'}</h2>
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
                  {editingUserId ? 'Save Changes' : 'Create Profile'}
                </button>
                {editingUserId && (
                  <button type='button' onClick={handleDelete} className='flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700'>
                    Delete
                  </button>
                )}
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

export default Profile
