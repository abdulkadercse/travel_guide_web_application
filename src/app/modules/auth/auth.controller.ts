import { authServices } from './auth.services';
import { authValidation } from './auth.validation';

const loginUser = async (data: unknown) => {
  const validatedData = authValidation.loginValidationSchema.parse(data);
  const result = await authServices.loginUserDB(validatedData);
  return result;
};

const refreshToken = async (data: unknown) => {
  const validatedData = authValidation.refreshTokenValidationSchema.parse(data);
  const result = await authServices.refreshTokenDB(validatedData.refreshToken);
  return result;
};

export const authController = {
  loginUser,
  refreshToken,
};
