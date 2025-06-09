import { DocumentType } from '@typegoose/typegoose';
import { UserEntity, CreateUserDto, UpdateUserDto } from './index.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>>;
  exists(documentId: string): Promise<boolean>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  updateById(
    userId: string,
    dto: UpdateUserDto
  ): Promise<DocumentType<UserEntity> | null>;
}
