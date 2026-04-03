import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="w-full bg-[#050a14]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif text-[#E11D48] tracking-widest">
          LUMINARY
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm uppercase tracking-widest hover:text-[#E11D48] transition-colors text-white">Home</Link>
          {session?.user ? (
            <div className="flex items-center gap-4">
               {session.user.role === 'ADMIN' && (
                 <Link href="/admin" className="text-sm uppercase tracking-widest text-[#E11D48] hover:text-white transition-colors">Admin</Link>
               )}
               <span className="text-sm text-gray-400 hidden sm:inline">{session.user.email}</span>
               <Link href="/api/auth/signout" className="text-sm uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Sign Out</Link>
            </div>
          ) : (
            <Link href="/login" className="text-sm uppercase tracking-widest hover:text-[#E11D48] transition-colors text-white">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
