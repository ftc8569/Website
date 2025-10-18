import nodemailer from "nodemailer"
import { google } from 'googleapis'
import { readFileSync } from "fs"
import { MailOptions } from "nodemailer/lib/smtp-transport"

export async function POST(req: Request) {
  const data: ContactUsData = await req.json()

  const valid: boolean = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${data.token}`,
    { method: "POST" }
  )
    .then((res) => res.json())
    .then((res) => res.success)

  if (!valid) return new Response(null, { status: 403 })
  
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAUTH2",
      user: "ftcteam8569@roboknights.net",
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_CLIENT_REFRESH_TOKEN
    }
  })

  const message: MailOptions = {
    from: data.email,
    to: process.env.CONTACT_EMAIL,
    envelope: {
      from: "Contact Us <ftcteam8569@roboknights.net>",
      to: process.env.CONTACT_EMAIL,
      cc: data.email
    },
    subject: "Contact Us: " + data.subject,
    html: readFileSync("./email.html", "utf-8").replace(
      "${message}",
      data.entry
    )
  }

  transporter.sendMail(message, (err) => {
    if (err) {
      console.log(err)
      transporter.close()
      return new Response(null, { status: 500 })
    }
  })

  transporter.close()
  return new Response(null, { status: 200 })
}

interface ContactUsData {
  email: string
  entry: string
  name: string
  subject: string
  token: string
}
