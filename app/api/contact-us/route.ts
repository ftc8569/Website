export async function POST(req: Request) {
  const data: ContactUsData = await req.json()

  const valid: boolean = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${data.token}`,
    { method: 'POST' })
    .then(res => res.json())
    .then(res => res.sucess)

  console.log(valid)
  return new Response(null, { status: 200 })
}

interface ContactUsData {
  email: string,
  entry: string,
  name: string,
  subject: string,
  token: string
}