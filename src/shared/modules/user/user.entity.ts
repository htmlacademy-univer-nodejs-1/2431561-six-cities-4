import {
  getModelForClass,
  prop,
  defaultClasses,
  modelOptions,
} from '@typegoose/typegoose';
import { UserType, User } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, default: '', type: String })
  public name: string;

  @prop({ required: true, unique: true, type: String })
  public email: string;

  @prop({ required: false, default: '', type: String })
  public avatar?: string;

  @prop({ required: true, enum: UserType, type: String })
  public type: UserType;

  @prop({ required: true, default: '', type: String })
  private password?: string;

  constructor(userData: User) {
    super();
    this.email = userData.email;
    this.name = userData.name;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
