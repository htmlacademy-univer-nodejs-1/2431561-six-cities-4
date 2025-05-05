import { Container } from 'inversify';
import {
  UserService,
  DefaultUserService,
  UserEntity,
  UserModel,
} from './index.js';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/component.enum.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer
    .bind<UserService>(Component.UserService)
    .to(DefaultUserService)
    .inSingletonScope();
  userContainer
    .bind<types.ModelType<UserEntity>>(Component.UserModel)
    .toConstantValue(UserModel);
  return userContainer;
}
