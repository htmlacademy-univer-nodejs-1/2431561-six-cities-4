import { UserType } from './user-type.enum.js';

export interface User {
  name: string;
  email: string;
  avatar?: string;
  type: UserType;
}
