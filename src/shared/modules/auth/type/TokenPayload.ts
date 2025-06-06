import { UserType } from '../../../types/index.js';

export type TokenPayload = {
  name: string;
  email: string;
  type: UserType;
  id: string;
};
