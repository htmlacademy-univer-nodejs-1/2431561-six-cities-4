import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Amenity, City, HousingType } from '../../../types/index.js';
import { CreateOfferMessages } from './create-offer.messages.js';

export class CreateOfferDto {
  @IsNotEmpty()
  @MinLength(10, { message: CreateOfferMessages.title.minLength })
  @MaxLength(100, { message: CreateOfferMessages.title.maxLength })
  public title: string;

  @IsNotEmpty()
  @MinLength(20, {
    message: CreateOfferMessages.description.minLength,
  })
  @MaxLength(1024, {
    message: CreateOfferMessages.description.maxLength,
  })
  public description: string;

  // @IsNotEmpty()
  // @IsDateString({}, { message: CreateOfferValidationMessage.postDate.invalidFormat })
  // public publicationDate: Date;

  @IsNotEmpty()
  @IsEnum(City, { message: CreateOfferMessages.city.invalid })
  public city: City;

  @IsNotEmpty({ message: CreateOfferMessages.image.empty })
  public previewImage: string;

  @IsArray({ message: CreateOfferMessages.images.invalidFormat })
  @ArrayMinSize(6, { message: CreateOfferMessages.images.count })
  @ArrayMaxSize(6, { message: CreateOfferMessages.images.count })
  @IsNotEmpty({ each: true })
  public pictures: string[];

  @IsNotEmpty()
  @IsBoolean()
  public isPremium: boolean;

  // public isFavorite: boolean;
  // public rating: number;

  @IsNotEmpty()
  @IsEnum(HousingType, { message: CreateOfferMessages.type.invalid })
  public housingType: HousingType;

  @IsNotEmpty()
  @IsInt({ message: CreateOfferMessages.bedrooms.invalidFormat })
  @Min(1, { message: CreateOfferMessages.bedrooms.minValue })
  @Max(8, { message: CreateOfferMessages.bedrooms.maxValue })
  public numberOfRooms: number;

  @IsNotEmpty()
  @IsInt({ message: CreateOfferMessages.maxAdults.invalidFormat })
  @Min(1, { message: CreateOfferMessages.maxAdults.minValue })
  @Max(10, { message: CreateOfferMessages.maxAdults.maxValue })
  public numberOfGuests: number;

  @IsNotEmpty()
  @IsInt({ message: CreateOfferMessages.price.invalidFormat })
  @Min(100, { message: CreateOfferMessages.price.minValue })
  @Max(100000, { message: CreateOfferMessages.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferMessages.amenities.invalidFormat })
  @IsEnum(Amenity, {
    each: true,
    message: CreateOfferMessages.amenities.invalidValue,
  })
  @ArrayMinSize(1, { message: CreateOfferMessages.amenities.minSize })
  public amenities: Amenity[];

  @IsNotEmpty()
  @IsMongoId({ message: CreateOfferMessages.userId.invalidId })
  public userId: string;
  // public coordinates: Coordinates;
}
