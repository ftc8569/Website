"use client";

export default function AdminApp({
  user
}: {
  user: any
}) {
  return (
    <h1>Hi {user.name}</h1>
  )
}