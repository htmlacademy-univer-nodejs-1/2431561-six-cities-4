import {
  Amenity,
  City,
  HousingType,
  Offer,
  UserType,
  User,
} from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    publicationDate,
    city,
    previewImage,
    pictures,
    isPremium,
    isFavorite,
    rating,
    housingType,
    numberOfRooms,
    numberOfGuests,
    price,
    amenities,
    username,
    email,
    avatar,
    status,
    numberOfComments,
    coordinates,
  ] = offerData.replace('\n', '').split('\t');

  const user: User = {
    name: username,
    email: email,
    avatar: avatar,
    type: status === 'pro' ? UserType.pro : UserType.regular,
  };

  return {
    title,
    description,
    publicationDate: new Date(publicationDate),
    city: Object.values(City).includes(city as City)
      ? (city as City)
      : City.Amsterdam,
    previewImage,
    pictures: pictures.split(','),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseFloat(rating),
    housingType: Object.values(HousingType).includes(housingType as HousingType)
      ? (housingType as HousingType)
      : HousingType.apartment,
    numberOfRooms: Number(numberOfRooms),
    numberOfGuests: Number(numberOfGuests),
    price: Number(price),
    amenities: amenities
      .split(',')
      .map((amenity) =>
        Object.values(Amenity).includes(amenity as Amenity)
          ? (amenity as Amenity)
          : Amenity.AirConditioning
      ),
    author: user,
    numberOfComments: Number(numberOfComments),
    coordinates: {
      latitude: Number(coordinates.split(';')[0]),
      longitude: Number(coordinates.split(';')[1]),
    },
  };
}
