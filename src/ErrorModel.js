export class ErrorModel {
  constructor(error) {
    this.error = error;
    this.timestamp = new Date()
  }
}