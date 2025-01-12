"use client";

import { SessionProvider, signIn, useSession } from "next-auth/react"
import AdminApp from "@/app/admin/adminApp"

export default function Wrapper() {

  return (
    <SessionProvider>
      <Admin />
    </SessionProvider>
  )
}

export function Admin() {

  const { data: session } = useSession();

  return (
    <div>
      {
        session?.user != null ?
          <AdminApp user={session?.user} /> :
          <button onClick={() => signIn()}>Sign in</button>
      }
    </div>
  )
}