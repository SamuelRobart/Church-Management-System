'use client'
import React, { useState } from 'react'; 
import {
  MdSpaceDashboard, MdPeople, MdEvent, MdAttachMoney, MdGroups, MdVolunteerActivism,
  MdMessage, MdPermMedia, MdSettings, MdPerson, MdChevronLeft, MdChevronRight
} from "react-icons/md";

// Add CSS-in-JS for smooth fade transitions
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .fade-out {
    animation: fadeOut 0.3s ease-in-out;
  }
`;

const NAV_ITEMS = [
  { label: "Dashboard", icon: <MdSpaceDashboard />, view: "dashboard" },
  { label: "Profile", icon: <MdPerson />, view: "profile" },
  { label: "Members", icon: <MdPeople />, view: "members" },
  // { label: "Attendance", icon: <MdEvent />, view: "attendance" },
  { label: "Events", icon: <MdEvent />, view: "events" },
  { label: "Donations", icon: <MdAttachMoney />, view: "donations" },
  { label: "Groups", icon: <MdGroups />, view: "groups" },
  // { label: "Volunteers", icon: <MdVolunteerActivism />, view: "volunteers" },
  { label: "Communication", icon: <MdMessage />, view: "communication" },
  { label: "Media", icon: <MdPermMedia />, view: "media" },
  { label: "Settings", icon: <MdSettings />, view: "settings" },
];

const SideBarDash = ({ onMenuClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <style>{styles}</style>
      <div className={`fixed md:static left-0 top-20 h-[calc(100vh-80px)] md:h-auto ${isExpanded ? 'w-64 md:w-64 lg:w-72' : 'w-20 md:w-20'} bg-white rounded-none md:rounded-lg md:m-1 shadow-lg md:shadow-none transition-all duration-500 ease-in-out z-40 `}>
        <div className='flex flex-col h-full'>
          {/* Toggle Button */}
          <div className='flex justify-end p-2 transition-all duration-500'>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='bg-persian-blue-600 hover:bg-persian-blue-700 text-white p-1 rounded-lg transition-all duration-300 transform hover:scale-110'
              title={isExpanded ? 'Collapse menu' : 'Expand menu'}
            >
              {isExpanded ? (
                <MdChevronLeft size={20} className='transition-transform duration-500' />
              ) : (
                <MdChevronRight size={20} className='transition-transform duration-500' />
              )}
            </button>
          </div>

          {isExpanded && (
            <div className='fade-in'>
              <h1 className='flex justify-center text-xl md:text-2xl font-semibold text-persian-blue-700 px-2 transition-all duration-500'>Main Menu</h1>
              <ul className='flex flex-col justify-start p-2 md:p-2 w-full flex-1 transition-all duration-500'>
                {NAV_ITEMS.map(({ label, icon, view }) => (
                  <li
                    key={label}
                    onClick={() => onMenuClick(view)}
                    className='transition-all duration-300 text-persian-blue-600 group hover:bg-persian-blue-600 hover:text-persian-blue-50 hover:rounded-lg cursor-pointer flex pl-3 md:pl-5 items-center text-base md:text-lg gap-2 md:gap-3 p-3 md:p-4 whitespace-nowrap transform hover:translate-x-1'
                  >
                    <span className='flex-shrink-0 group-hover:scale-125 transition-all duration-300'>{icon}</span>
                    <span className='group-hover:scale-105 transition-all duration-300 opacity-100'>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Collapsed view - show icons only */}
          {!isExpanded && (
            <div className='fade-in'>
              <ul className='flex flex-col justify-start p-2 w-full gap-4 flex-1 mt-10 transition-all duration-500'>
                {NAV_ITEMS.map(({ label, icon, view }) => (
                  <li
                    key={label}
                    onClick={() => onMenuClick(view)}
                    className='transition-all duration-300 text-persian-blue-600 group hover:bg-persian-blue-600 hover:text-persian-blue-50 hover:rounded-lg cursor-pointer flex justify-center items-center text-2xl p-2 transform hover:scale-125'
                    title={label}
                  >
                    <span className='group-hover:scale-125 transition-all duration-300'>{icon}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideBarDash;
