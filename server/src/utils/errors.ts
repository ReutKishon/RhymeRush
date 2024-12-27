export class GameCodeError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "GameCodeError";
    }
  }
  
  export class UserNameError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "UserNameError";
    }
  }
  