export async function POST(req: Request) {
  const data = await req.json()
  // TODO: Verify token and do something with data we recieve, probably some email service
}