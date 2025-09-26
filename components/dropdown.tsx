import { ReactNode, useState } from "react"
import { FaAngleDown } from "react-icons/fa"

export default function Dropdown({
  children,
  title
}: {
  children?: ReactNode
  title: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <div
        className="flex justify-between hover:cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className="text-xl font-semibold">{title}</p>
        <FaAngleDown
          className={`w-6 h-6 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </div>
      <div className="relative">
        <p className={`mt-4 mb-4 ${isOpen ? "" : "h-0 hidden"}`}>{children}</p>
      </div>
      <hr className="mt-2" />
    </div>
  )
}
