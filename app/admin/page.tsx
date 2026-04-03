import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Hero } from "@/components/Hero";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isSubscribed = session?.user?.isSubscribed || false;

  return (
    <main className="min-h-screen bg-[#050a14]">
      <Hero isSubscribed={isSubscribed} />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-serif text-[#E11D48] mb-8">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl border border-white/10 relative group overflow-hidden cursor-pointer hover:border-[#E11D48] transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] to-transparent z-10 opacity-80 group-hover:opacity-40 transition-opacity" />
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white border border-white/10">Premium</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
