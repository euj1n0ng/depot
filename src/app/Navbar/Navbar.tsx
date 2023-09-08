import Link from "next/link"
import Image from "next/image"
import logo from "@/assets/logo.png"
import UserMenuButton from "./UserMenuButton"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function Navbar() {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-base-100">
      <div className="navbar max-w-7xl m-auto flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl normal-case">
            <Image src={logo} alt="logo" width={40} height={40} />
            Depot
          </Link>
        </div>
        <div className="flex-none gap-2">
          <UserMenuButton session={session} />
        </div>
      </div>
    </div>
  )
}
