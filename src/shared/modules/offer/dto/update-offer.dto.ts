import {
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Amenity, City, HousingType } from '../../../types/index.js';
import { UpdateOfferMessages } from './update-offer.messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: UpdateOfferMessages.title.minLength })
  @MaxLength(100, { message: UpdateOfferMessages.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: UpdateOfferMessages.description.minLength })
  @MaxLength(1024, { message: UpdateOfferMessages.description.maxLength })
  public description?: string;

  // public publicationDate?: Date;

  @IsOptional()
  @IsEnum(City, { message: UpdateOfferMessages.city.invalid })
  public city?: City;

  @IsOptional()
  @IsString({ message: UpdateOfferMessages.image.invalidFormat })
  @MaxLength(256, { message: UpdateOfferMessages.image.maxLength })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferMessages.images.invalidFormat })
  @Length(6, 6, { message: UpdateOfferMessages.images.length })
  public pictures?: string[];

  @IsOptional()
  public isPremium?: boolean;

  // public isFavorite?: boolean;
  // public rating?: number;

  @IsOptional()
  @IsEnum(HousingType, { message: UpdateOfferMessages.type.invalidFormat })
  public housingType?: HousingType;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.bedrooms.invalidFormat })
  @Min(1, { message: UpdateOfferMessages.bedrooms.min })
  @Max(8, { message: UpdateOfferMessages.bedrooms.max })
  public numberOfRooms?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.maxAdults.invalidFormat })
  @Min(1, { message: UpdateOfferMessages.maxAdults.min })
  @Max(10, { message: UpdateOfferMessages.maxAdults.max })
  public numberOfGuests?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.price.invalidFormat })
  @Min(100, { message: UpdateOfferMessages.price.min })
  @Max(100000, { message: UpdateOfferMessages.price.max })
  public price?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferMessages.amenities.invalidFormat })
  public amenities?: Amenity[];

  @IsOptional()
  @IsMongoId({ message: UpdateOfferMessages.userId.invalidId })
  public userId?: string;

  // public coordinates?: Coordinates;
}
