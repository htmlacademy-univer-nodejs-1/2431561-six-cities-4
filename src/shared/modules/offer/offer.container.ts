import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import {
  OfferService,
  DefaultOfferService,
  OfferEntity,
  OfferModel,
  OfferController,
} from './index.js';
import { Component } from '../../types/component.enum.js';
import { Controller } from '../../libs/rest/index.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer
    .bind<OfferService>(Component.OfferService)
    .to(DefaultOfferService);
  offerContainer
    .bind<types.ModelType<OfferEntity>>(Component.OfferModel)
    .toConstantValue(OfferModel);
  offerContainer
    .bind<Controller>(Component.OfferController)
    .to(OfferController)
    .inSingletonScope();
  return offerContainer;
}
