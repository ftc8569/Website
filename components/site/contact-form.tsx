"use client"

import { useReCaptcha } from "next-recaptcha-v3"
import { useEffect, useRef, useState, type FormEvent } from "react"

import { CONTACT_EMAIL } from "@/components/site/ui"

export const REASONS = [
  "Sponsorship",
  "Mentoring",
  "School or event visit",
  "Another FTC or FLL team",
  "Something else"
] as const

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string; mailto: string }

type Errors = Partial<Record<"name" | "email" | "message", string>>

function mailtoFor(fields: Record<string, string>) {
  const subject = `${fields.reason || "Website message"} from ${fields.name || "the website"}`
  const body = [
    fields.message,
    "",
    fields.name && `Name: ${fields.name}`,
    fields.organisation && `Organisation: ${fields.organisation}`
  ]
    .filter((line): line is string => typeof line === "string")
    .join("\n")
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function ContactForm() {
  const { executeRecaptcha } = useReCaptcha()
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [errors, setErrors] = useState<Errors>({})
  const startedAt = useRef(0)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  useEffect(() => {
    if (status.kind === "sent" || status.kind === "error")
      statusRef.current?.focus()
  }, [status.kind])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >

    const nextErrors: Errors = {}
    if (!data.name?.trim()) nextErrors.name = "Enter your name."
    if (
      !/^[^\s@<>,"]+@[^\s@<>,"]+\.[^\s@<>,"]+$/.test(data.email?.trim() ?? "")
    )
      nextErrors.email = "Enter an email address like name@example.com."
    if (!data.message?.trim()) nextErrors.message = "Write a short message."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    const mailto = mailtoFor(data)
    setStatus({ kind: "sending" })
    try {
      if (!executeRecaptcha) throw new Error("unavailable")
      const token = await executeRecaptcha("form_submit")
      const response = await fetch("/api/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          organisation: data.organisation,
          reason: data.reason,
          subject: data.reason,
          entry: data.message,
          website: data.website,
          startedAt: startedAt.current,
          token
        })
      })
      if (!response.ok) throw new Error(String(response.status))
      form.reset()
      setStatus({ kind: "sent" })
    } catch {
      setStatus({
        kind: "error",
        mailto,
        message:
          "The form couldn't send your message just now. Your email app can send it instead, with everything you wrote filled in."
      })
    }
  }

  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      <div className="form-row">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>
      </div>
      <div className="form-row">
        <Field id="organisation" label="Organisation (optional)">
          <input
            id="organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            maxLength={160}
          />
        </Field>
        <Field id="reason" label="What's this about?">
          <select id="reason" name="reason" defaultValue={REASONS[0]}>
            {REASONS.map((reason) => (
              <option key={reason}>{reason}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="message" label="Message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          aria-invalid={!!errors.message || undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
      </Field>

      {/* Honeypot: hidden from people and screen readers, filled by bots. */}
      <div className="form-trap" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-actions">
        <button
          className="btn"
          type="submit"
          disabled={status.kind === "sending"}
        >
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="caption">
          Or email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>

      <div
        ref={statusRef}
        className={`form-status${status.kind === "error" ? " form-status--error" : ""}`}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        {status.kind === "sent" && (
          <p>
            <strong>Thanks, your message is on its way.</strong> We sent a copy
            to your email address and we&apos;ll reply within a few days.
          </p>
        )}
        {status.kind === "error" && (
          <p>
            {status.message}{" "}
            <a href={status.mailto}>Open it in your email app</a>.
          </p>
        )}
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  children
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
