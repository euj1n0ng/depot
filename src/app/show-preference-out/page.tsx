import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { IssuePresentee } from "./IssuePresentee"

export const metadata = {
  title: "Show Preference Out - Depot"
}

export default async function ShowPreferenceOutPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/show-preference-out")
  }

  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Show Preference Out</h1>
      <IssuePresentee />
    </div>
  )
}
