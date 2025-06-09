import chalk from 'chalk';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import {
  getErrorMessage,
  createOffer,
  getMongoURI,
} from '../../shared/helpers/index.js';
import {
  OfferService,
  DefaultOfferService,
  OfferModel,
} from '../../shared/modules/offer/index.js';
import {
  DatabaseClient,
  MongoDatabaseClient,
} from '../../shared/libs/database-client/index.js';
import { Logger, ConsoleLogger } from '../../shared/libs/logger/index.js';
import {
  DefaultUserService,
  UserModel,
  UserService,
} from '../../shared/modules/user/index.js';
import { Offer } from '../../shared/types/offer.type.js';
import { DEFAULT_USER_PASSWORD, DEFAULT_DB_PORT } from './command.constant.js';
import { FavoriteModel } from '../../shared/modules/favorite/favorite.entity.js';
import { CommentModel } from '../../shared/modules/comment/comment.entity.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(
      this.logger,
      OfferModel,
      FavoriteModel,
      CommentModel
    );
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(
      chalk.green(`Import completed successfully. Imported ${count} offers.`)
    );
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const author = await this.userService.findOrCreate(
      {
        ...offer.author,
        password: DEFAULT_USER_PASSWORD,
      },
      this.salt
    );
    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      publicationDate: offer.publicationDate,
      city: offer.city,
      previewImage: offer.previewImage,
      pictures: offer.pictures,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      housingType: offer.housingType,
      numberOfRooms: offer.numberOfRooms,
      numberOfGuests: offer.numberOfGuests,
      price: offer.price,
      author: author.id,
      amenities: offer.amenities,
      coordinates: offer.coordinates,
      commentCount: 0,
    });
  }

  public async execute(
    filename: string,
    login: string,
    host: string,
    dbname: string,
    salt: string
  ): Promise<void> {
    const uri = getMongoURI(
      login,
      DEFAULT_USER_PASSWORD,
      host,
      DEFAULT_DB_PORT,
      dbname
    );
    this.salt = salt;
    await this.databaseClient.connect(uri);
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.bgRed(`Details: ${getErrorMessage(error)}`));
    }
  }
}
