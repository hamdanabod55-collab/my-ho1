import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Activation code is required' }, { status: 400 });
    }

    const activationCode = await prisma.activationCode.findUnique({
      where: { code }
    });

    if (!activationCode) {
      return NextResponse.json({ error: 'Invalid activation code' }, { status: 404 });
    }

    if (activationCode.isUsed) {
      return NextResponse.json({ error: 'Activation code already used' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.activationCode.update({
        where: { id: activationCode.id },
        data: {
          isUsed: true,
          userId: session.user.id
        }
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          isSubscribed: true
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
