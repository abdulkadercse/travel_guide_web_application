import { verifyAuth } from '@/lib/auth.middleware';
import { userServices } from '@/app/modules/user/user.services';

export async function GET(request: Request) {
  try {
    const authUser = await verifyAuth(request);
    const userProfile = await userServices.getUserByIdDB(authUser.userId);

    return Response.json({
      success: true,
      statusCode: 200,
      message: 'Current user profile fetched successfully',
      data: userProfile,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        statusCode: 401,
        message: error.message || 'Unauthorized',
      },
      { status: 401 }
    );
  }
}
