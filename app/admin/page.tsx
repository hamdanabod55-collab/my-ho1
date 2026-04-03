import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";

async function generateCode() {
  "use server";
  const length = 8;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  await prisma.activationCode.create({
    data: { code }
  });
}

async function toggleSubscription(formData: FormData) {
  "use server";
  const id = formData.get("userId") as string;
  const user = await prisma.user.findUnique({ where: { id } });
  if (user) {
    await prisma.user.update({
      where: { id },
      data: { isSubscribed: !user.isSubscribed }
    });
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const codes = await prisma.activationCode.findMany({
    orderBy: { id: 'desc' }
  });

  const users = await prisma.user.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#050a14] p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-serif text-[#E11D48]">Admin Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">Activation Codes</h2>
              <form action={generateCode}>
                <button type="submit" className="bg-[#E11D48] px-4 py-2 rounded-md hover:bg-[#be183c] transition-colors">
                  Generate Code
                </button>
              </form>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {codes.map(c => (
                <div key={c.id} className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/10">
                  <code className="text-lg tracking-wider text-white">{c.code}</code>
                  <span className={`text-xs px-2 py-1 rounded ${c.isUsed ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {c.isUsed ? 'USED' : 'AVAILABLE'}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-serif mb-6">Users</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {users.map(u => (
                <div key={u.id} className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/10">
                  <div>
                    <p className="text-sm text-gray-300">{u.email || u.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">Role: {u.role}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded ${u.isSubscribed ? 'bg-[#E11D48]/20 text-[#E11D48]' : 'bg-gray-500/20 text-gray-400'}`}>
                      {u.isSubscribed ? 'SUBSCRIBED' : 'UNSUBSCRIBED'}
                    </span>
                    <form action={toggleSubscription}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button type="submit" className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors">
                        Toggle
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
