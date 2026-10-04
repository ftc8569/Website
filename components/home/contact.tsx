"use client"

import { type FormEvent, type RefObject, useState } from "react"
import { useReCaptcha } from "next-recaptcha-v3"

type ContactStatus = "idle" | "sending" | "success" | "error"

export default function ContactUs({
  divRef
}: {
  divRef: RefObject<HTMLDivElement | null>
}) {
  const { executeRecaptcha } = useReCaptcha()
  const [status, setStatus] = useState<ContactStatus>("idle")

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!executeRecaptcha) {
      setStatus("error")
      return
    }

    const form = event.currentTarget
    const data = new FormData(form)
    setStatus("sending")

    try {
      const token = await executeRecaptcha("form_submit")
      const response = await fetch("/api/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          entry: data.get("entry"),
          name: data.get("name"),
          subject: data.get("subject"),
          token
        })
      })

      if (!response.ok) throw new Error("Contact request failed")
      form.reset()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      id="contact-us"
      className="py-10 bg-[#151515] px-2 lg:px-56"
      ref={divRef}
    >
      <div className="flex items-center justify-center">
        <h2 className="inline text-3xl lg:text-4xl p-3 text-roboPink font-extrabold text-center rounded-2xl mt-2 mb-4">
          Contact
        </h2>
      </div>
      <form
        id="contact-form"
        className="flex flex-col lg:flex-row gap-4"
        onSubmit={send}
      >
        <div className="w-full lg:w-2/3">
          <label className="sr-only" htmlFor="contact-entry">
            Message
          </label>
          <textarea
            id="contact-entry"
            className="w-full h-36 py-2 px-3 bg-[#363636] rounded-xl border-2 border-roboPink"
            placeholder="I was wondering how you guys did..."
            name="entry"
            required
            maxLength={5000}
          />
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-2">
          <label className="sr-only" htmlFor="contact-email">
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className="bg-[#363636] text-lg w-full py-2 px-2 rounded-xl border-roboPink border-2"
            required
          />
          <label className="sr-only" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your name"
            className="bg-[#363636] text-lg py-2 px-2 rounded-xl border-roboPink border-2 w-full"
            maxLength={120}
          />
          <label className="sr-only" htmlFor="contact-subject">
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="Enter your subject"
            className="bg-[#363636] text-lg py-2 px-2 rounded-xl border-roboPink border-2 w-full"
            maxLength={120}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="g-recaptcha bg-roboHotPink px-4 py-2 rounded-xl text-lg disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>
          <p aria-live="polite" role={status === "error" ? "alert" : "status"}>
            {status === "success" && "Your message was sent."}
            {status === "error" &&
              "Your message could not be sent. Please try again later."}
          </p>
        </div>
      </form>
    </section>
  )
}
