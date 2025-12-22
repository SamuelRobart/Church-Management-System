'use client'

import { useState } from 'react'
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1) // Step 1: Form, Step 2: Email Verification
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'No password', color: 'bg-gray-300' }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*]/.test(password)) strength++

    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500']
    return { strength, label: labels[strength], color: colors[strength] }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters'

    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (formData.username.length < 4) newErrors.username = 'Username must be at least 4 characters'
    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) newErrors.username = 'Username can only contain letters, numbers, _ and -'

    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'

    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

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

  // Handle verification code input
  const handleVerificationInput = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only allow digits
    
    const newCode = [...verificationCode]
    newCode[index] = value.slice(-1) // Only take last character
    setVerificationCode(newCode)

    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  // Send verification code
  const handleSendVerification = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // Send verification code to email
      const response = await api.auth.sendVerificationCode(formData.email)
      
      if (response.success || response.status === 'success') {
        setStep(2)
        setEmailSent(true)
        setLoading(false)
        setResendCountdown(60)
        
        // Start countdown
        const interval = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setErrors({ submit: response.message || 'Failed to send verification code' })
        setLoading(false)
      }
    } catch (error) {
      setErrors({ submit: 'Failed to send verification code. Please try again.' })
      setLoading(false)
    }
  }

  // Verify email code and create user
  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    
    const code = verificationCode.join('')
    if (code.length !== 6) {
      setErrors({ code: 'Please enter all 6 digits' })
      return
    }

    setLoading(true)
    try {
      // Verify email
      const verifyResponse = await api.auth.verifyEmail(formData.email, code)
      
      if (!verifyResponse.success && verifyResponse.status !== 'success') {
        setErrors({ code: verifyResponse.message || 'Invalid verification code' })
        setLoading(false)
        return
      }

      // Create user after verification
      const registerResponse = await api.users.create({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'Member', // Default role
        verified: true
      })

      if (registerResponse.success || registerResponse.status === 'success') {
        setLoading(false)
        setSuccessMessage('✓ Account created successfully!')
        
        // Redirect to login
        setTimeout(() => {
          window.location.href = '/signin'
        }, 2000)
      } else {
        setErrors({ code: registerResponse.message || 'Failed to create account' })
        setLoading(false)
      }
    } catch (error) {
      setErrors({ code: 'Failed to verify email. Please try again.' })
      setLoading(false)
    }
  }

  // Resend verification code
  const handleResendCode = async () => {
    if (resendCountdown > 0) return
    
    setLoading(true)
    try {
      const response = await api.auth.sendVerificationCode(formData.email)
      
      if (response.success || response.status === 'success') {
        setVerificationCode(['', '', '', '', '', ''])
        setResendCountdown(60)
        setLoading(false)
        
        const interval = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setErrors({ submit: response.message || 'Failed to resend code' })
        setLoading(false)
      }
    } catch (error) {
      setErrors({ submit: 'Failed to resend code. Please try again.' })
      setLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-center'>
          <h1 className='text-3xl font-bold text-white mb-2'>Create Account</h1>
          <p className='text-blue-100'>Join Church Management System</p>
        </div>

        {/* Content */}
        <div className='px-8 py-8'>
          {successMessage && (
            <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center font-medium'>
              {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center font-medium'>
              {errors.submit}
            </div>
          )}

          {/* Step 1: Registration Form */}
          {step === 1 && (
            <form onSubmit={handleSendVerification} className='space-y-4'>
              {/* Full Name */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Full Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='John Doe'
                  className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none`}
                />
                {errors.name && <p className='text-red-500 text-sm mt-1 flex items-center'><FaTimes className='mr-1' /> {errors.name}</p>}
              </div>

              {/* Username */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Username</label>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder='john_doe'
                  className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                    errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none`}
                />
                {errors.username && <p className='text-red-500 text-sm mt-1 flex items-center'><FaTimes className='mr-1' /> {errors.username}</p>}
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Email Address</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='john@example.com'
                  className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none`}
                />
                {errors.email && <p className='text-red-500 text-sm mt-1 flex items-center'><FaTimes className='mr-1' /> {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Password</label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='Enter password'
                    className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none pr-10`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-3.5 text-gray-500 hover:text-gray-700'
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength */}
                {formData.password && (
                  <div className='mt-2'>
                    <div className='flex items-center gap-2 mb-1'>
                      <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${(passwordStrength.strength + 1) * 20}%` }}
                        />
                      </div>
                      <span className='text-xs font-semibold text-gray-600'>{passwordStrength.label}</span>
                    </div>
                    <p className='text-xs text-gray-500'>Min 8 chars, uppercase, lowercase, numbers, symbols</p>
                  </div>
                )}
                {errors.password && <p className='text-red-500 text-sm mt-1 flex items-center'><FaTimes className='mr-1' /> {errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Confirm Password</label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder='Re-enter password'
                    className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none pr-10`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-3.5 text-gray-500 hover:text-gray-700'
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                  {formData.password && formData.confirmPassword === formData.password && (
                    <FaCheck className='absolute right-12 top-3.5 text-green-500' size={18} />
                  )}
                </div>
                {errors.confirmPassword && <p className='text-red-500 text-sm mt-1 flex items-center'><FaTimes className='mr-1' /> {errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div className='flex items-start gap-2 mt-4'>
                <input
                  type='checkbox'
                  id='terms'
                  className='mt-1 w-4 h-4 rounded cursor-pointer'
                />
                <label htmlFor='terms' className='text-sm text-gray-600'>
                  I agree to the <a href='#' className='text-blue-600 hover:underline'>Terms of Service</a> and <a href='#' className='text-blue-600 hover:underline'>Privacy Policy</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Sending verification code...' : 'Continue'}
              </button>

              {/* Sign In Link */}
              <p className='text-center text-gray-600 text-sm mt-4'>
                Already have an account?{' '}
                <Link href='/login' className='text-blue-600 hover:underline font-semibold'>
                  Sign in
                </Link>
              </p>
            </form>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyEmail} className='space-y-6'>
              <div className='text-center'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4'>
                  <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                </div>
                <h2 className='text-2xl font-bold text-gray-800 mb-2'>Verify Your Email</h2>
                <p className='text-gray-600'>We've sent a 6-digit code to<br/><strong>{formData.email}</strong></p>
              </div>

              {/* Verification Code Input */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-4 text-center'>Enter Verification Code</label>
                <div className='flex gap-2 justify-center'>
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type='text'
                      inputMode='numeric'
                      value={digit}
                      onChange={(e) => handleVerificationInput(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength='1'
                      className={`w-12 h-12 text-center text-2xl font-bold rounded-lg border-2 transition ${
                        errors.code ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      } focus:outline-none`}
                    />
                  ))}
                </div>
                {errors.code && <p className='text-red-500 text-sm mt-2 text-center flex items-center justify-center'><FaTimes className='mr-1' /> {errors.code}</p>}
              </div>

              {/* Resend Code */}
              <div className='text-center'>
                <p className='text-gray-600 text-sm mb-2'>Didn't receive code?</p>
                <button
                  type='button'
                  onClick={handleResendCode}
                  disabled={resendCountdown > 0 || loading}
                  className='text-blue-600 hover:underline font-semibold disabled:text-gray-400 disabled:cursor-not-allowed'
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
                </button>
              </div>

              {/* Verify Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              {/* Back Button */}
              <button
                type='button'
                onClick={() => {
                  setStep(1)
                  setVerificationCode(['', '', '', '', '', ''])
                  setErrors({})
                }}
                className='w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-semibold py-2'
              >
                <FaArrowLeft /> Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
