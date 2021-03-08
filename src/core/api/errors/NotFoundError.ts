import CustomError from './CustomError';

export default class NotFoundError extends CustomError {
    constructor() {
        super('Not Found', 404);
    }
}
