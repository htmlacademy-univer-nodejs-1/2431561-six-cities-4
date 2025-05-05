import dayjs from 'dayjs';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/common.js';
import { MockServerData } from '../../types/mock-server-data.type.js';
import { OfferGenerator } from './offer-generator.interface.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const GALLERY_PHOTOS_COUNT = 6;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 8;

const MIN_GUESTS_COUNT = 1;
const MAX_GUESTS_COUNT = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const publicationDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const pictures = Array.from({ length: GALLERY_PHOTOS_COUNT }, () =>
      getRandomItem(this.mockData.pictures)
    );
    const isPremium = generateRandomValue(0, 1) ? 'true' : 'false';
    const isFavorite = generateRandomValue(0, 1) ? 'true' : 'false';
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const housingType = getRandomItem(this.mockData.housingType);
    const numberOfRooms = generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);
    const numberOfGuests = generateRandomValue(
      MIN_GUESTS_COUNT,
      MAX_GUESTS_COUNT
    );
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE, 0);
    const amenities = getRandomItems(this.mockData.amenities);
    const username = getRandomItem(this.mockData.usernames);
    const email = getRandomItem(this.mockData.emails);
    const avatar = getRandomItem(this.mockData.avatars);
    const status = generateRandomValue(0, 1) ? 'pro' : 'regular';
    const numberOfComments = generateRandomValue(0, 10);
    const coordinates = getRandomItem(this.mockData.coordinates);

    return [
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
    ].join('\t');
  }
}
