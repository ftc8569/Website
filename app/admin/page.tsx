"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import Admin from "../../components/admin/adminApp"
import { redirect } from "next/navigation"

export default async function Wrapper() {
  const session = await getServerSession(authOptions)

  if (session) {
    return <Admin />
  } else {
    redirect("/api/auth/signin?callbackUrl=/admin")
  }
}
