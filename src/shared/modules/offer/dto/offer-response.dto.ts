import { Amenity, City, HousingType } from '../../../types/index.js';

export class OfferResponseDto {
  public id!: string;
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
  // public author!: string;
  // public coordinates!: Coordinates;
}
