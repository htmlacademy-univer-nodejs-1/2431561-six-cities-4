export class CreateCommentDto {
  public text!: string;
  public publicationDate!: Date;
  public rating!: number;
  public offerId!: string;
  public userId!: string;
}
