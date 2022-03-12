export class ClubSettingsInfoMember {
  readonly username: string;
  readonly url: string;
}

export class ClubSettingsInfo {
  readonly clubname: string;
  readonly rules: string;
  readonly members: ClubSettingsInfoMember[];
}