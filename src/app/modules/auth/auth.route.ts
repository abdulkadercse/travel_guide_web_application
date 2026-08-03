import { authController } from './auth.controller';

export async function handleLogin(request: Request) {
  try {
    const body = await request.json();
    const result = await authController.loginUser(body);

    return Response.json(
      {
        success: true,
        statusCode: 200,
        message: 'User logged in successfully',
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        statusCode: 400,
        message: error.message || 'Login failed',
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}

export async function handleRefreshToken(request: Request) {
  try {
    const body = await request.json();
    const result = await authController.refreshToken(body);

    return Response.json(
      {
        success: true,
        statusCode: 200,
        message: 'Access token refreshed successfully',
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        statusCode: 401,
        message: error.message || 'Token refresh failed',
      },
      { status: 401 }
    );
  }
}
