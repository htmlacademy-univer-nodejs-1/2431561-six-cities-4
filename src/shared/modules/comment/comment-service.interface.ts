import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto, CommentEntity } from './index.js';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(
    offerId: string,
    count?: number
  ): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
