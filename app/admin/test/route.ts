import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

export async function GET(req: Request) {
  /*const prisma = new PrismaClient()

  const password = await argon2.hash(process.env.MYPASS as string)

  const user = await prisma.user.findFirst({
    where: {
      email: "bedson26t@ncssm.edu"
    }
  })

  console.log(user == null)

  await prisma.user.create({
    data: {
      email: "bedson26t@ncssm.edu",
      firstName: "Trevor",
      lastName: "Bedson",
      passwordHash: Buffer.from(password, "utf8")
    }
  })

  return new Response(null, { status: 200, statusText: "Account added" })*/
  return new Response(null, { status: 404 })
}