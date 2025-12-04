'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

const Profile = dynamic(() => import('./Profile'), {
  loading: () => <div className='w-full h-screen flex items-center justify-center bg-gray-50'><p>Loading...</p></div>,
  ssr: true
})

const page = () => {
  return(
    <Suspense fallback={<div className='w-full h-screen flex items-center justify-center bg-gray-50'><p>Loading...</p></div>}>
      <Profile/>
    </Suspense>
  )
}

export default page
