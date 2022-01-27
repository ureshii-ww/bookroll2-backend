export class ClubInfo {
  readonly clubname: string;
  readonly url: string;
  readonly master: {
    username: string,
    url: string
  }
  readonly bookToRead: {
    title: string,
    authors: string[]
  } | null;
}