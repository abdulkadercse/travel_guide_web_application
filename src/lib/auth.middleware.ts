import { jwtHelpers } from './jwt';
import { UserRole } from '@/app/modules/user/user.interface';

export interface IAuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

export const verifyAuth = async (
  request: Request,
  requiredRoles: UserRole[] = []
): Promise<IAuthUser> => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized access: No token provided');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized access: Invalid token format');
  }

  const jwtSecret = process.env.JWT_SECRET || 'travla_secret_jwt_token_key_2026';

  let decodedUser: IAuthUser;
  try {
    decodedUser = jwtHelpers.verifyToken(token, jwtSecret) as IAuthUser;
  } catch (error) {
    throw new Error('Unauthorized access: Invalid or expired token');
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(decodedUser.role)) {
    throw new Error('Forbidden access: Insufficient permissions');
  }

  return decodedUser;
};
