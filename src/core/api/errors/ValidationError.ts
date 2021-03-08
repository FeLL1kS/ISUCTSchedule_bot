import CustomError from './CustomError';

export default class ValidationError extends CustomError {
    constructor(message: any) {
        super(message, 400);
    }
}
