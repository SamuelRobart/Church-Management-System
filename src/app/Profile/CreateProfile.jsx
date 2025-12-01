import { FaUserPlus } from 'react-icons/fa'

const CreateProfile = ({ onCreateClick }) => {
  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-800'>Create New Profile</h2>
        <button onClick={onCreateClick} className='bg-persian-blue-600 text-white px-6 py-2 rounded-lg hover:bg-persian-blue-700 flex items-center gap-2'>
          <FaUserPlus /> Create Profile
        </button>
      </div>
    </div>
  )
}

export default CreateProfile
