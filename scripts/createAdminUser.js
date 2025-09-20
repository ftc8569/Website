import { PrismaClient } from "@prisma/client"
import * as argon2 from "argon2"

(async () => {

  const prisma = new PrismaClient()

  const password = await argon2.hash(process.env.ADMIN_PASSWORD)

  const res = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL,
      firstName: process.env.ADMIN_FIRST,
      lastName: process.env.ADMIN_LAST,
      passwordHash: Buffer.from(password, "utf8")
    }
  })

  console.log(res)

})()