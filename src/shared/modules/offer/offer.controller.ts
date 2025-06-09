import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Component, City } from '../../types/index.js';
import {
  BaseController,
  CheckOwnerMiddleware,
  DocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  RequestQuery,
  UploadFileMiddleware,
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
  UploadImageRdo,
} from './index.js';
import { CommentService, CommentRdo } from '../comment/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>
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
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
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
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new CheckOwnerMiddleware(this.offerService),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new CheckOwnerMiddleware(this.offerService),
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
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.removeFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
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

    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'image'
        ),
      ],
    });
  }

  public async index(
    { query }: Request<RequestQuery>,
    res: Response
  ): Promise<void> {
    const limit = parseInt(query.limit as string, 10) || DEFAULT_OFFER_COUNT;
    const offers = await this.offerService.find(limit);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body, tokenPayload }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({
      ...body,
      author: tokenPayload.id,
    });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show(
    { params }: Request<ParamsOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request<ParamsOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async update(
    { body, params }: Request<ParamsOfferId, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(
      params.offerId,
      body
    );
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async getPremium(
    { params, tokenPayload }: Request<ParamsCity>,
    res: Response
  ) {
    const city = params.city as City;
    if (!Object.values(City).includes(city)) {
      return this.send(res, StatusCodes.NOT_FOUND, city);
    }

    const offers = await this.offerService.findPremiumOffersByCity(
      city,
      tokenPayload.id
    );

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavorite({ tokenPayload }: Request, res: Response) {
    const offers = await this.offerService.getUserFavorites(tokenPayload.id);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async addFavorite({ params, tokenPayload }: Request, res: Response) {
    const offer = await this.offerService.addFavorite(
      tokenPayload.id,
      params.offerId
    );

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async removeFavorite(
    { params, tokenPayload }: Request,
    res: Response
  ) {
    await this.offerService.deleteFavorite(tokenPayload.id, params.offerId);
    this.noContent(res, {});
  }

  public async getComments(
    { params }: Request<ParamsOfferId>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async uploadImage(
    { params, file }: Request<ParamsOfferId>,
    res: Response
  ) {
    const { offerId } = params;
    const updateDto = { previewImage: file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageRdo, updateDto));
  }
}
