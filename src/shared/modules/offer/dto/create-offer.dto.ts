import {
  Amenity,
  City,
  Coordinates,
  HousingType,
} from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public city!: City;
  public previewImage!: string;
  public pictures!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public housingType!: HousingType;
  public numberOfRooms!: number;
  public numberOfGuests!: number;
  public price!: number;
  public amenities!: Amenity[];
  public author!: string;
  public coordinates!: Coordinates;
}
