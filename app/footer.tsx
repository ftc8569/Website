import Image from "next/image";

export default function Footer() {
  return (
    <div className="bg-[#151515] w-full">
      <div className="flex flex-row justify-center">
        <div className="bg-roboGray w-full mx-10 p-[2px] rounded-xl"></div>
      </div>
      <div className="flex flex-row p-5 px-10 items-center">
        <Image
          src="/stickerlogo.png"
          alt="RoboKnights Logo"
          width={1198 / 16}
          height={1008 / 16}
        />
        <h1 className="pl-5 text-4xl font-semibold">RoboKnights</h1>
        <div className="w-full"></div>
        <a href="https://www.instagram.com/roboknights8569/" target="_blank" className="pr-3">
          <Image
            src="/icons/instagram.svg"
            alt="Instagram Icon"
            width={800 / 16}
            height={800 / 16}
          />
        </a>
        <a href="https://github.com/ftc8569" target="_blank" className="pr-3">
          <Image
            src="/icons/github.svg"
            alt="Github Icon"
            width={800 / 16}
            height={800 / 16}
          />
        </a>
      </div>
    </div>
  )
}