import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component, City } from '../../types/index.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import {
  CreateOfferDto,
  OfferEntity,
  OfferService,
  UpdateOfferDto,
} from './index.js';
import { FavoriteEntity } from '../favorite/index.js';
import {
  DEFAULT_OFFER_COUNT,
  DEFAULT_PREMIUM_OFFER_COUNT,
  DEFAULT_SORT_TYPE,
} from './offer.constant.js';
import { CommentEntity } from '../comment/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.FavoriteModel)
    private readonly favoriteModel: types.ModelType<FavoriteEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(
    dto: CreateOfferDto
  ): Promise<types.DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(
    offerId: string,
    userId?: string
  ): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();

    if (!offer) {
      return null;
    }

    if (!userId) {
      offer.isFavorite = false;
    } else {
      const isFavorite = await this.favoriteModel
        .findOne({ userId, offerId })
        .exec();

      offer.isFavorite = Boolean(isFavorite);
    }

    return offer;
  }

  public async find(
    count?: number,
    userId?: string
  ): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    const offers = await this.offerModel
      .find()
      .limit(limit)
      .sort({ createdAt: DEFAULT_SORT_TYPE })
      .populate(['userId'])
      .exec();

    return this.addFavoriteToOffer(offers, userId);
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['userId'])
      .exec();
  }

  public async getUserFavorites(
    userId: string
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const favorites = await this.favoriteModel.find({ userId }).exec();
    const offerIds = favorites.map((f) => f.offerId);

    return this.offerModel
      .find({ _id: { $in: offerIds } })
      .populate('userId')
      .exec();
  }

  public async addFavorite(
    userId: string,
    offerId: string
  ): Promise<types.DocumentType<OfferEntity>> {
    const exist = await this.favoriteModel.findOne({ userId, offerId }).exec();

    if (!exist) {
      await this.favoriteModel.create({ userId, offerId });
    }

    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new Error('Offer not found');
    }

    offer.isFavorite = true;
    return offer;
  }

  public async deleteFavorite(userId: string, offerId: string): Promise<void> {
    await this.favoriteModel.deleteOne({ userId, offerId }).exec();
  }

  public async findPremiumOffersByCity(
    city: City,
    userId?: string
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find({ city, isPremium: true })
      .limit(DEFAULT_PREMIUM_OFFER_COUNT)
      .sort({ createdAt: DEFAULT_SORT_TYPE })
      .populate(['userId'])
      .exec();

    return this.addFavoriteToOffer(offers, userId);
  }

  public async incCommentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentCount: 1,
        },
      })
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  private async addFavoriteToOffer(
    offers: DocumentType<OfferEntity>[],
    userId?: string
  ): Promise<DocumentType<OfferEntity>[]> {
    if (!userId) {
      return offers.map((offer) => ({
        ...offer.toObject(),
        isFavorite: false,
      })) as DocumentType<OfferEntity>[];
    }

    const favorites = await this.favoriteModel
      .find({ userId })
      .lean<{ offerId: string }[]>()
      .exec();

    const offerIds = new Set(favorites.map((f) => f.offerId.toString()));

    return offers.map((offer) => ({
      ...offer.toObject(),
      isFavorite: offerIds.has(offer.id.toString()),
    })) as DocumentType<OfferEntity>[];
  }

  public async updateRating(
    offerId: string
  ): Promise<types.DocumentType<OfferEntity> | null> {
    const comments = await this.commentModel.find({ offerId }).exec();

    const ratings = comments.map((comment) => comment.rating);
    const total = ratings.reduce((acc, cur) => (acc += cur), 0);
    const avgRating = ratings.length > 0 ? total / ratings.length : 0;

    return this.offerModel
      .findByIdAndUpdate(offerId, { rating: avgRating }, { new: true })
      .exec();
  }
}
