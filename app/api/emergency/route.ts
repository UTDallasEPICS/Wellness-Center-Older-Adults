import { NextRequest } from 'next/server';
import * as ridesEmergency from '../rides/emergency/route';

export async function POST(req: NextRequest) {
  // Delegate to the rides/emergency handler for backward compatibility.
  return await ridesEmergency.POST(req as any);
}
