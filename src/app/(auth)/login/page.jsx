'use client'

import { useState } from 'react'
import { FaEye, FaEyeSlash, FaTimes, FaCheck } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      // API call to backend
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token)
        }
        
        // Store user data
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }

        setSuccessMessage('✓ Login successful!')
        setLoading(false)

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        const errorData = await response.json()
        setErrors({
          submit: errorData.message || 'Invalid username or password',
        })
        setLoading(false)
      }
    } catch (error) {
      setErrors({
        submit: 'Failed to login. Please check your connection and try again.',
      })
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center'>
          <h1 className='text-3xl font-bold text-white mb-2'>Welcome Back</h1>
          <p className='text-blue-100'>Sign in to Church Management System</p>
        </div>

        {/* Content */}
        <div className='px-8 py-8'>
          {/* Error Message */}
          {errors.submit && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center font-medium flex items-center gap-2 justify-center'>
              <FaTimes size={18} />
              {errors.submit}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center font-medium flex items-center gap-2 justify-center'>
              <FaCheck size={18} />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className='space-y-5'>
            {/* Username/Email */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Username or Email
              </label>
              <input
                type='text'
                name='username'
                value={formData.username}
                onChange={handleInputChange}
                placeholder='Enter your username or email'
                className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none ${
                  errors.username
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.username && (
                <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                  <FaTimes size={14} /> {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className='flex justify-between items-center mb-2'>
                <label className='block text-sm font-semibold text-gray-700'>
                  Password
                </label>
                <Link
                  href='/forgot-password'
                  className='text-xs text-blue-600 hover:underline font-semibold'
                >
                  Forgot?
                </Link>
              </div>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='Enter your password'
                  className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none pr-10 ${
                    errors.password
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition'
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                  <FaTimes size={14} /> {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='remember'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='w-4 h-4 rounded cursor-pointer accent-blue-600'
              />
              <label htmlFor='remember' className='text-sm text-gray-600 cursor-pointer'>
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>New to CMS?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              href='/register'
              className='w-full block text-center px-4 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition'
            >
              Create Account
            </Link>
          </form>

          {/* Additional Links */}
          <div className='mt-6 text-center space-y-2'>
            <p className='text-sm text-gray-600'>
              Having trouble?{' '}
              <a href='#' className='text-blue-600 hover:underline font-semibold'>
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage