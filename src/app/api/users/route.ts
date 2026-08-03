import { handleGetUsers, handleCreateUser } from '@/app/modules/user/user.route';

export async function GET(request: Request) {
  return handleGetUsers(request);
}

export async function POST(request: Request) {
  return handleCreateUser(request);
}
