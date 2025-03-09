import nodemailer from "nodemailer"
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
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_PASSWORD
    }
  })

  const message: MailOptions = {
    from: data.email,
    to: process.env.CONTACT_EMAIL,
    envelope: {
      from: "Contact Us <bedson26t@ncssm.edu>",
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
