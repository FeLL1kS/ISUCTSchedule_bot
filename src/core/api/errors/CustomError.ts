export default abstract class CustomError {
    public message: string;
    public statusCode: number;
    public stack: any;

    constructor(message: any = 'Server error', statusCode: number = 500) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        this.message = message;
        this.statusCode = statusCode;

        try {
            throw Error();
        } catch(error) {
            const stack = error.stack.split('\n');
            stack.splice(1, 2);
            this.stack = JSON.stringify(stack);
        }
    }

    public toString(): string {
        return [
            'Message: ' + this.message,
            'Status code: ' + this.statusCode,
            'Stack trace: ' + this.stack,
        ].join('\n');
    }
}
