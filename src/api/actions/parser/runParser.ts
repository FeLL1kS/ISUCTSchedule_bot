import { IAction, IContext, NotFoundError, IParser } from '../../../core';
import * as parsers from '../../../parsers';

export const runParser: IAction = {
    rest: {
        method: 'get',
        path: '/parser/run',
    },
    params: {
        parserName: {
            type: 'string',
            optional: false,
        },
    },
    method: async (ctx: IContext<{
        parserName: string;
    }>) => {
        if (!parsers[ctx.params.parserName]) {
            throw new NotFoundError();
        }

        const parser: IParser = new (parsers[ctx.params.parserName])();
        await parser.parse();

        return 'done';
    },
};
