import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';
import { Component } from '../../types/index.js';

export function createFavoriteContainer() {
  const favoriteContainer = new Container();

  favoriteContainer
    .bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel)
    .toConstantValue(FavoriteModel);

  return favoriteContainer;
}
