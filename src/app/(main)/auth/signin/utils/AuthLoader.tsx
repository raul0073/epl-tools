'use client';

import EntryLoader from "@/components/root/loaders/EntryLoader";
import { setUser } from "@/lib/slices/user";
import { RootState } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomSession, registerUserOnServer } from "./register_user";

interface Props {
  children: ReactNode;
}

export default function AuthLoaderPage({ children }: Props) {
  const { data: session, status } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "authenticated" | "unauthenticated";
  };
  const [loading, setLoading] = useState(true);
  const [serverUp, setServerUp] = useState<boolean | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser.id);

  // Ping the backend first
  useEffect(() => {
    async function pingServer() {
      try {
        await fetch("/api/health/ping", { cache: "no-store" });
        setServerUp(true);
      } catch {
        setServerUp(false);
      }
    }
    pingServer();
  }, []);

  useEffect(() => {
    async function initUser() {
      if (!serverUp) return; // Skip if server is down

      if (session?.user && !currentUser) {
        const user = await registerUserOnServer(session);
        if (user.id) {
          dispatch(setUser(user));
        }
      }
      setLoading(false);
    }

    if (status === "authenticated") {
      initUser();
    } else if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session, status, dispatch, router, currentUser, serverUp]);

  if (status === "loading" || loading) {
    return <EntryLoader />;
  }

  if (serverUp === false) {
    return (
      <div className="p-4 text-center text-red-600">
        Backend server is currently down. Please try again later.
      </div>
    );
  }

  return <>{children}</>;
}
