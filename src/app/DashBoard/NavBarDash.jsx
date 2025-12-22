import Link from "next/link";
import React from "react";

const NAV_Dash = [
  { label: "Home", href: "/" },
  { label: "Schedule", href: "/schedule" },
  { label: "Report", href: "/register" },
   
];

const NavBarDash = () => {
  return (
    
    <nav className= " bg-persian-blue-600 text-white h-14 sm:h-14 px-4 sm:px-6 md:px-10 flex justify-center items-center fixed w-full ">
    <ul className="hidden md:flex gap-4 lg:gap-6 xl:gap-8 text-base lg:text-lg xl:text-xl">
       
        {NAV_Dash.map(link =>  (
          
          <li key={link.href}>
            <Link href={link.href} className="group relative">
            
              <span   className="relative text-2xl text-persian-blue-50   inline-block transition-all duration-500 after:content-[''] 
                    after:block after:w-0 after:h-[3px] after:bg-amber-400 after:transition-all after:duration-500 hover:after:w-full hover:text-amber-500">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBarDash;
