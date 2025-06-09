import { Amenity, City, Coordinates, HousingType, User } from './index.js';

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
