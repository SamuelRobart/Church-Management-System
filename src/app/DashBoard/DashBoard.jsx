'use client'
import React, { useState } from 'react'

const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`
import HeaderDash from './HeaderDash'
import SideBarDash from './SideBarDash'
import AdminDash from '../AdminDash/page'
import Profile from '../Profile/page'
import Members from '../Members/page'
import Events from '../Events/page'
import Donations from '../Donation/page'
import Groups from '../Group/page'
import Communications from '../Communication/page'
import Media from '../Media/page'
import Settings from '../Setting/page'
import Footer from '../../layout/Footer/Footer'

const DashBoard = () => {
  const [activeView, setActiveView] = useState('dashboard')

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <AdminDash />
      case 'profile': return <Profile />
      case 'members': return <Members />
      case 'events': return <Events />
      case 'donations': return <Donations />
      case 'groups': return <Groups />
      case 'communication': return <Communications />
      case 'media': return <Media />
      case 'settings': return <Settings />
      default: return <AdminDash />
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className='h-screen max-w-screen bg-slate-200 overflow-hidden'>
        <HeaderDash />
        <div className='flex h-[calc(100vh-60px)] mt-10 md:mt-14 overflow-hidden'>
          <SideBarDash onMenuClick={setActiveView} />
          <div className='flex-1 pt-1 pr-1 overflow-y-auto scrollbar-hide' style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  )
}

export default DashBoard
