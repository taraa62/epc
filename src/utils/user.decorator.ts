import { createParamDecorator, ForbiddenException } from '@nestjs/common';

export const User = createParamDecorator((isOpt: boolean, req) => {
  const user = req.args[0]?.user;
  if (!user && !isOpt) {
    throw new ForbiddenException('User not found');
  }
  const { password, ...info } = user;
  return info;
});
