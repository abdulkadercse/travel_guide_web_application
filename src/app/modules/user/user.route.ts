import { userController } from './user.controller';

export async function handleGetUsers(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('searchTerm') || undefined;
    const role = (searchParams.get('role') as any) || undefined;
    const status = (searchParams.get('status') as any) || undefined;
    const email = searchParams.get('email') || undefined;
    const phone = searchParams.get('phone') || undefined;

    const result = await userController.getAllUsers({
      searchTerm,
      role,
      status,
      email,
      phone,
    });

    return Response.json(
      {
        success: true,
        message: 'Users fetched successfully',
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || 'Failed to fetch users',
      },
      { status: 400 }
    );
  }
}

export async function handleCreateUser(request: Request) {
  try {
    const body = await request.json();
    const result = await userController.createUser(body);

    return Response.json(
      {
        success: true,
        message: 'User created successfully',
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || 'Failed to create user',
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}

export async function handleGetUserById(id: string) {
  try {
    const result = await userController.getUserById(id);
    return Response.json(
      {
        success: true,
        message: 'User retrieved successfully',
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || 'User not found',
      },
      { status: 404 }
    );
  }
}

export async function handleUpdateUser(id: string, request: Request) {
  try {
    const body = await request.json();
    const result = await userController.updateUser(id, body);

    return Response.json(
      {
        success: true,
        message: 'User updated successfully',
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || 'Failed to update user',
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}

export async function handleDeleteUser(id: string) {
  try {
    const result = await userController.deleteUser(id);
    return Response.json(
      {
        success: true,
        message: 'User deleted successfully',
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || 'Failed to delete user',
      },
      { status: 400 }
    );
  }
}
