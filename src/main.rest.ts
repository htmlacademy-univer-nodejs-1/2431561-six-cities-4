import 'reflect-metadata';
import { Container } from 'inversify';
import {
  RestApplication,
  createRestApplicationContainer,
} from './rest/index.js';
import { Component } from './shared/types/component.enum.js';
import { createUserContainer } from './shared/modules/user/user.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';
import { createFavoriteContainer } from './shared/modules/favorite/favorite.container.js';
import { createAuthContainer } from './shared/modules/auth/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createFavoriteContainer(),
    createAuthContainer()
  );
  const application = appContainer.get<RestApplication>(
    Component.RestApplication
  );
  await application.init();
}

bootstrap();
