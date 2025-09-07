import { NextResponse } from 'next/server';

// Version simplifiée pour éviter les timeouts de build
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API de test simplifiée - pas de connexion backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}
