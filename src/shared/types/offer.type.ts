import { Amenity } from './amenity.enum.js';
import { City } from './city.enum.js';
import { HousingType } from './housing-type.enum.js';
import { Coordinates } from './coordinates.interface.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  publicationDate: Date;
  city: City;
  previewImage: string;
  pictures: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  numberOfRooms: number;
  numberOfGuests: number;
  price: number;
  amenities: Amenity[];
  author: User;
  numberOfComments: number;
  coordinates: Coordinates;
};
