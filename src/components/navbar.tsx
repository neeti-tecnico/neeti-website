import Link from 'next/link'
import { Button } from './ui/button'
import UserProfile from './user-profile'

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-xl font-bold">
          Logo
        </Link>
        <div className="flex gap-4 items-center">
          <UserProfile />
        </div>
      </div>
    </nav>
  )
}
