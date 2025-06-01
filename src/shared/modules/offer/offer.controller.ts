import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Component, City } from '../../types/index.js';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  RequestQuery,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { fillDTO } from '../../helpers/index.js';
import {
  CreateOfferDto,
  CreateOfferRequest,
  DEFAULT_OFFER_COUNT,
  OfferRdo,
  OfferService,
  ParamsCity,
  ParamsOfferId,
  UpdateOfferDto,
} from './index.js';
import { CommentService, CommentRdo } from '../comment/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:city/premium',
      method: HttpMethod.Get,
      handler: this.getPremium,
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorite,
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.removeFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async index(
    { query }: Request<RequestQuery>,
    _res: Response
  ): Promise<void> {
    const limit = parseInt(query.limit as string, 10) || DEFAULT_OFFER_COUNT;
    const offers = await this.offerService.find(limit);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(_res, responseData);
  }

  public async create(
    { body }: CreateOfferRequest,
    _res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(_res, fillDTO(OfferRdo, offer));
  }

  public async show(
    { params }: Request<ParamsOfferId>,
    _res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }
    this.ok(_res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request<ParamsOfferId>,
    _res: Response
  ): Promise<void> {
    const { offerId } = params;
    const result = await this.offerService.deleteById(offerId);
    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found or not authorized',
        'OfferController'
      );
    }
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(_res, result);
  }

  public async update(
    { body, params }: Request<ParamsOfferId, unknown, UpdateOfferDto>,
    _res: Response
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(
      params.offerId,
      body
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

  public async getPremium(
    { params }: Request<ParamsCity>,
    _res: Response
  ): Promise<void> {
    const city = params.city as City;
    const offers = await this.offerService.findPremiumOffersByCity(city);
    this.ok(_res, fillDTO(OfferRdo, offers));
  }

  public async getFavorite(_req: Request, _res: Response): Promise<void> {
    const offers = await this.offerService.getUserFavorites(_req.body?.userId);
    this.ok(_res, fillDTO(OfferRdo, offers));
  }

  public async addFavorite(_req: Request, _res: Response): Promise<void> {
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

  public async removeFavorite(_req: Request, _res: Response): Promise<void> {
    await this.offerService.deleteFavorite(
      _req.params.offerId,
      _req.body?.userId
    );
    this.noContent(_res, {});
  }

  public async getComments(
    { params }: Request<ParamsOfferId>,
    _res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);

    this.ok(_res, fillDTO(CommentRdo, comments));
  }
}
