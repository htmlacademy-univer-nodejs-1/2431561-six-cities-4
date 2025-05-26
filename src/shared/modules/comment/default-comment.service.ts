import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import {
  CommentEntity,
  CreateCommentDto,
  CommentService,
  DEFAULT_SORT_TYPE,
  DEFAULT_COMMENTS_COUNT,
} from './index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(
    dto: CreateCommentDto
  ): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByOfferId(
    offerId: string,
    count?: number
  ): Promise<DocumentType<CommentEntity>[]> {
    const limit = count ?? DEFAULT_COMMENTS_COUNT;

    return this.commentModel
      .find({ offerId })
      .limit(limit)
      .sort({ createdAt: DEFAULT_SORT_TYPE })
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    return result.deletedCount;
  }
}
