'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

const Member = dynamic(() => import('./Member'), {
  loading: () => <div className='w-full h-screen flex items-center justify-center'><p>Loading...</p></div>,
  ssr: true
})

const page = () => {
  return (
    <Suspense fallback={<div className='w-full h-screen flex items-center justify-center'><p>Loading...</p></div>}>
      <div className='bg-white w-full h-full rounded-lg flex items-start p-4 text-black text-2xl'>      
        <Member />
      </div>
    </Suspense>
  )
}

export default page