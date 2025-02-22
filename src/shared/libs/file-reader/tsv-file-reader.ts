import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import {
  Amenity,
  City,
  HousingType,
  Offer,
  UserType,
} from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, 'utf-8');
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(
        ([
          title,
          description,
          date,
          city,
          previewImage,
          images,
          isPremium,
          isFavorite,
          rating,
          housingType,
          numberOfRooms,
          numberOfGuests,
          price,
          amenities,
          name,
          email,
          avatar,
          userType,
          numberOfComments,
          coordinates,
        ]) => ({
          title,
          description,
          publicationDate: new Date(date),
          city: Object.values(City).includes(city as City)
            ? (city as City)
            : City.Amsterdam,
          previewImage,
          pictures: images.split(','),
          isPremium: isPremium.toLowerCase() === 'true',
          isFavorite: isFavorite.toLocaleLowerCase() === 'true',
          rating: parseFloat(rating),
          housingType: Object.values(HousingType).includes(
            housingType as HousingType
          )
            ? (housingType as HousingType)
            : HousingType.apartment,
          numberOfRooms: parseInt(numberOfRooms, 10),
          numberOfGuests: parseInt(numberOfGuests, 10),
          price: parseInt(price, 10),
          amenities: amenities
            .split(',')
            .map((amenity) =>
              Object.values(Amenity).includes(amenity.trim() as Amenity)
                ? (amenity as Amenity)
                : Amenity.AirConditioning
            ),
          author: {
            name: name,
            email: email,
            avatar: avatar,
            type: Object.values(UserType).includes(userType as UserType)
              ? (userType as UserType)
              : UserType.regular,
          },
          numberOfComments: parseInt(numberOfComments, 10),
          coordinates: {
            latitude: Number(coordinates.split(';')[0]),
            longitude: Number(coordinates.split(';')[1]),
          },
        })
      );
  }
}
