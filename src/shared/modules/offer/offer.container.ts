import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import {
  OfferService,
  DefaultOfferService,
  OfferEntity,
  OfferModel,
} from './index.js';
import { Component } from '../../types/component.enum.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer
    .bind<OfferService>(Component.OfferService)
    .to(DefaultOfferService);
  offerContainer
    .bind<types.ModelType<OfferEntity>>(Component.OfferModel)
    .toConstantValue(OfferModel);

  return offerContainer;
}
