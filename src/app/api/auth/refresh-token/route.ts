import { handleRefreshToken } from '@/app/modules/auth/auth.route';

export async function POST(request: Request) {
  return handleRefreshToken(request);
}
