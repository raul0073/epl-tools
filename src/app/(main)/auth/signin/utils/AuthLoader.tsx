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
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser.id);

  useEffect(() => {
    async function initUser() {
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
  }, [session, status, dispatch, router, currentUser]);

  if (status === "loading" || loading) {
    return (
      <EntryLoader />
    );
  }

  // Once session is authenticated and store is ready, render children
  return <>{children}</>;
}
