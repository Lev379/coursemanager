export class LoginModel {
  constructor(
    public username: string,
    public password: string,
  ) {}

  clearInput() {
    this.username = '';
    this.password = '';
  }
}
