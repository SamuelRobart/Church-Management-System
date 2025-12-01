// components/Navbar.jsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Dash Board", href: "/DashBoard" },
  { label: "Events", href: "/events" },
  { label: "Sermons", href: "/sermons" },
  { label: "Offering", href: "/offering" },
  { label: "Contact", href: "/contact" },
   
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-persian-blue-600 text-white h-14 px-10 flex justify-between items-center relative">
      <div>
        <Link href="/" className="font-bold text-xl">
          {/* Church Logo */}
          CMS
        </Link>
      </div>
      <ul className="hidden md:flex gap-8 text-xl">
        {NAV_LINKS.map(link => (
          <li key={link.href}>
            <Link href={link.href} className="group relative">
              <span   className="relative inline-block transition-all duration-500 after:content-[''] 
                    after:block after:w-0 after:h-[3px] after:bg-amber-400 after:transition-all after:duration-500 hover:after:w-full hover:text-amber-500">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="md:hidden">
        <button aria-label="Open menu" onClick={() => setOpen(!open)}>
          {open ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      {open && (
        <ul className="absolute top-24 left-0 w-full bg-blue-900 flex flex-col items-center py-4">
          {NAV_LINKS.map(link => (
            <li key={link.href} className="py-2 w-full">
              <Link href={link.href} onClick={() => setOpen(false)} className="group relative block w-full text-center">
                <span   className="relative inline-block transition-all duration-700 after:content-[''] after:block after:w-0 after:h-[2px]
                 after:bg-blue-500 after:transition-all after:duration-500 hover:after:w-full">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
