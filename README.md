# RoboKnights Website

---

This is the code for the RoboKnights website. This README will explain a little about
the architecture and where things are located. The hope is that if you are reading
this, you know how to install all your packages and what not. If that is not true, someone
should update this to include information on that.

This uses NextJS, Typescript, Tailwindcss, and React. There are various other frameowrks
baked in too but those are the important ones to know.

### Important Folders and Files

- **public/robot** - Contains the rendered frames for the robot. This is rendered in
  blender and stored as pngs there. The blender file should be on the google drive because
  it is too large for github.
- **.env** - This file is needed to make the recaptcha work. To use it, rename .env.example
  to just .env and fill in the correct values.

_The Nextjs README below has been kept for information on running the app_

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
