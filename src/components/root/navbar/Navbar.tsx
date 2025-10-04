'use client';

import epl from '@/../public/logos/epl/epl.png';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { clearUser } from '@/lib/slices/user';
import { RootState } from '@/lib/store';
import { LogOutIcon, SettingsIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { deleteCookie } from "cookies-next"; // install cookies-next
import { clearPredictions } from '@/lib/slices/prediction';
function Navbar() {
  const user = useSelector((state: RootState) => state.currentUser);
  const userImg = user.picture;
  const dispatch = useDispatch();
  const isLoggedIn = !!user.id;
  const pathname = usePathname();

const handleSignOut = async () => {
  try {
      // Kill all NextAuth-related cookies
    deleteCookie("next-auth.session-token");
    deleteCookie("__Secure-next-auth.session-token"); // https-only version
    deleteCookie("next-auth.csrf-token");
    deleteCookie("next-auth.callback-url");
    deleteCookie("next-auth._refresh_token"); // your custom refresh hash

    // Call next-auth signOut (avoid redirect loop)
    await signOut();
    // Clear redux state
    dispatch(clearUser());
    dispatch(clearPredictions())
  

    toast.info("Logged out");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

  // Dynamic title logic
  const getTitle = () => {
    if (pathname.startsWith("/auth/signin")) return "Sign In";
    return isLoggedIn ? "POKER ISRAEL" : "Welcome";
  };

  return (
    <header className="w-full h-fit border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo + Title */}
        <div className="flex items-center gap-6 w-full">
          <Link href={'/'}>
            <Image src={epl} width={36} height={36} alt="epl_logo" />
          </Link>
          <div className="flex flex-col items-start">
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-bl from-indigo-600 to-teal-800 bg-clip-text text-transparent">
              {getTitle()}
            </h1>
            <p className="text-sm text-gray-500">EPL PREDICTION LEAGUE</p>
          </div>
        </div>

        {/* User info + dropdown */}
        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  {userImg ? (
                    <AvatarImage
                      src={userImg}
                      alt={`${user.name}_avatar`}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/settings" className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
