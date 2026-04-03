import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WatchPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isSubscribed) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl aspect-video bg-gray-900 rounded-xl border border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(225,29,72,0.15)] flex items-center justify-center">
        {/* Placeholder for video player */}
        <p className="text-gray-500 text-lg">Premium Video Player</p>
      </div>
      <div className="max-w-5xl w-full mt-8 px-4">
        <h1 className="text-2xl text-white font-serif tracking-wider">Episode 1: The Awakening</h1>
        <p className="text-gray-400 mt-2">The secrets have been revealed. Viewer discretion is advised.</p>
      </div>
    </div>
  );
}
