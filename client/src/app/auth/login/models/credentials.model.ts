import { Credentials } from '@shared/types/credentials';

export class CredentialsModel {
  constructor(
    public username: string,
    public password: string,
  ) {}

  clear() {
    this.username = '';
    this.password = '';
  }

  get credentials(): Credentials {
    return {
      username: this.username,
      password: this.password
    }
  }
}
