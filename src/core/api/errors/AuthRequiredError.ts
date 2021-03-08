import CustomError from './CustomError';

export default class AuthRequiredError extends CustomError {
    constructor() {
        super('Unauthorized', 401);
    }
};
