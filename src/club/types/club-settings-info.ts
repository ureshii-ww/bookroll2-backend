export class ClubSettingsInfoMember {
  readonly username: string;
  readonly url: string;
}

export class ClubSettingsInfo {
  readonly clubname: string;
  readonly description: string;
  readonly members: ClubSettingsInfoMember[];
}