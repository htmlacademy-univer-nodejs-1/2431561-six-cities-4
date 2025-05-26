import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Component, City } from '../../types/index.js';
import {
  BaseController,
  HttpError,
  HttpMethod,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { fillDTO } from '../../helpers/index.js';
import {
  CreateOfferRequest,
  DEFAULT_OFFER_COUNT,
  OfferRdo,
  OfferService,
} from './index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getOffers,
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.createOffer,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOfferById,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.updateOffer,
    });

    this.addRoute({
      path: '/:city/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffersByCity,
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffers,
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Post,
      handler: this.addToFavorites,
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorites,
    });
  }

  public async getOffers(_req: Request, _res: Response): Promise<void> {
    const limit =
      parseInt(_req.query.limit as string, 10) || DEFAULT_OFFER_COUNT;
    const offers = await this.offerService.find(limit, _req.body?.userId);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(_res, responseData);
  }

  public async createOffer(
    { body }: CreateOfferRequest,
    _res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(_res, fillDTO(OfferRdo, result));
  }

  public async getOfferById(_req: Request, _res: Response): Promise<void> {
    const offer = await this.offerService.findById(_req.params.offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'OfferController'
      );
    }
    this.ok(_res, fillDTO(OfferRdo, offer));
  }

  public async deleteOffer(_req: Request, _res: Response): Promise<void> {
    const result = await this.offerService.deleteById(_req.params.offerId);
    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found or not authorized',
        'OfferController'
      );
    }
    this.noContent(_res, {});
  }

  public async updateOffer(_req: Request, _res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(
      _req.params.offerId,
      _req.body
    );
    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found or not authorized',
        'OfferController'
      );
    }
    this.created(_res, fillDTO(OfferRdo, updatedOffer));
  }

  public async getPremiumOffersByCity(
    _req: Request,
    _res: Response
  ): Promise<void> {
    const city = _req.params.city as City;
    const offers = await this.offerService.findPremiumOffersByCity(
      city,
      _req.body?.userId
    );
    this.ok(_res, fillDTO(OfferRdo, offers));
  }

  public async getFavoriteOffers(_req: Request, _res: Response): Promise<void> {
    const offers = await this.offerService.getUserFavorites(_req.body?.userId);
    this.ok(_res, fillDTO(OfferRdo, offers));
  }

  public async addToFavorites(_req: Request, _res: Response): Promise<void> {
    const offer = await this.offerService.addFavorite(
      _req.params.offerId,
      _req.body?.userId
    );
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'OfferController'
      );
    }
    this.created(_res, fillDTO(OfferRdo, offer));
  }

  public async removeFromFavorites(
    _req: Request,
    _res: Response
  ): Promise<void> {
    await this.offerService.deleteFavorite(
      _req.params.offerId,
      _req.body?.userId
    );
    this.noContent(_res, {});
  }
}
