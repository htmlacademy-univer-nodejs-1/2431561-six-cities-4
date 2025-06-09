import {
  defaultClasses,
  modelOptions,
  getModelForClass,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { Amenity, HousingType, City, Coordinates } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true, type: String })
  public title!: string;

  @prop({ trim: true, required: true, type: String })
  public description!: string;

  @prop({ required: true, type: Date })
  public publicationDate!: Date;

  @prop({ enum: City, type: String })
  public city!: City;

  @prop({ required: true, type: String })
  public previewImage!: string;

  @prop({ required: true, type: () => [String] })
  public pictures!: string[];

  @prop({ required: true, type: Boolean })
  public isPremium!: boolean;

  @prop({ required: true, type: Boolean })
  public isFavorite!: boolean;

  @prop({ required: true, type: Number })
  public rating!: number;

  @prop({ required: true, enum: HousingType, type: String })
  public housingType!: HousingType;

  @prop({ required: true, type: Number })
  public numberOfRooms!: number;

  @prop({ required: true, type: Number })
  public numberOfGuests!: number;

  @prop({ required: true, type: Number })
  public price!: number;

  @prop({ required: true, enum: Amenity, type: () => [String] })
  public amenities!: Amenity[];

  @prop({ required: true, type: () => Object })
  public coordinates!: Coordinates;

  @prop({ required: true, type: Number })
  public commentCount!: number;

  @prop({
    ref: () => UserEntity,
    required: true,
  })
  public author!: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
