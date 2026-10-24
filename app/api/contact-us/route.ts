import nodemailer from "nodemailer"

const SENDER = "RoboKnights Contact <ftcteam8569@roboknights.net>"
const MAX_MESSAGE_LENGTH = 5_000

type ContactUsData = {
  email: string
  entry: string
  name: string
  subject: string
  token: string
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }
    return entities[character]
  })
}

function isContactUsData(value: unknown): value is ContactUsData {
  if (!value || typeof value !== "object") return false
  const data = value as Record<string, unknown>
  return (
    typeof data.email === "string" &&
    typeof data.entry === "string" &&
    typeof data.token === "string" &&
    (data.name === undefined || typeof data.name === "string") &&
    (data.subject === undefined || typeof data.subject === "string")
  )
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError("Please submit a valid contact request.", 400)
  }

  if (!isContactUsData(body)) {
    return jsonError("Please complete the required contact fields.", 400)
  }

  const email = body.email.trim()
  const entry = body.entry.trim()
  const name = (body.name ?? "").trim().slice(0, 120)
  const subject = (body.subject ?? "")
    .trim()
    .replace(/[\r\n\u0000-\u001f]/g, " ")
    .slice(0, 120)
  const token = body.token.trim()

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !entry ||
    entry.length > MAX_MESSAGE_LENGTH ||
    !token ||
    token.length > 4_096
  ) {
    return jsonError(
      "Enter a valid email and a message under 5,000 characters.",
      400
    )
  }

  const googleApiKey = process.env.GOOGLE_API_KEY
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const recipient = process.env.CONTACT_EMAIL
  const gmailClientId = process.env.GMAIL_CLIENT_ID
  const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET
  const gmailRefreshToken = process.env.GMAIL_CLIENT_REFRESH_TOKEN

  if (
    !googleApiKey ||
    !recaptchaSiteKey ||
    !recipient ||
    !gmailClientId ||
    !gmailClientSecret ||
    !gmailRefreshToken
  ) {
    return jsonError("Contact service is temporarily unavailable.", 503)
  }

  let assessment: {
    tokenProperties?: { valid?: boolean; action?: string }
  }
  try {
    const endpoint = new URL(
      "https://recaptchaenterprise.googleapis.com/v1/projects/prorickey/assessments"
    )
    endpoint.searchParams.set("key", googleApiKey)
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: { token, siteKey: recaptchaSiteKey }
      })
    })
    if (!response.ok)
      return jsonError("Contact service is temporarily unavailable.", 503)
    assessment = await response.json()
  } catch {
    return jsonError("Contact service is temporarily unavailable.", 503)
  }

  if (
    assessment.tokenProperties?.valid !== true ||
    assessment.tokenProperties.action !== "form_submit"
  ) {
    return jsonError("We could not verify this request. Please try again.", 403)
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "ftcteam8569@roboknights.net",
      clientId: gmailClientId,
      clientSecret: gmailClientSecret,
      refreshToken: gmailRefreshToken
    }
  })

  try {
    await transporter.sendMail({
      from: SENDER,
      to: recipient,
      replyTo: name ? `${name} <${email}>` : email,
      cc: email,
      subject: `Contact Us: ${subject || "Website message"}`,
      html: `<!doctype html><html lang="en"><body><p>Thank you for reaching out to us. We will get back to you as soon as possible.</p><hr /><p>${escapeHtml(entry).replace(/\n/g, "<br />")}</p></body></html>`
    })
  } catch {
    return jsonError(
      "Your message could not be sent. Please try again later.",
      502
    )
  } finally {
    transporter.close()
  }

  return Response.json({ message: "Your message was sent." }, { status: 200 })
}
