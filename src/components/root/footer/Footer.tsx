'use client';

import Link from 'next/link';
import { BsTwitter, BsInstagram, BsFacebook } from 'react-icons/bs';

export default function Footer() {
  return (
    <footer className="w-full bg-muted text-muted-foreground py-6 px-6 border-t border-gray-200 mt-10 ">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Links */}
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/contact" className="hover:text-blue-500 transition-colors">Contact</Link>
          <Link href="/rules" className="hover:text-blue-500 transition-colors">Rules</Link>
          <Link href="/privacy" className="hover:text-blue-500 transition-colors">Privacy</Link>
        </div>

        {/* Social icons */}
        <div className="flex gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            <BsTwitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
            <BsInstagram size={20} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
            <BsFacebook size={20} />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
}
