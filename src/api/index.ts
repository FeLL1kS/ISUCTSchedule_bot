import { Router, Request, Response } from 'express';
import FastestValidator from 'fastest-validator';

import { IContext, ValidationError } from '../core';
import { logger } from '../utils';
import * as actions from './actions';

const router: Router = Router();

const validator: FastestValidator = new FastestValidator();

for (const action of Object.values(actions)) {
    if (action.rest) {
        router[action.rest.method](
            action.rest.path,
            async (req: Request, res: Response): Promise<void> => {
                let statusCode: number = 200;
                let data: any = null;
                let error: string | null = null;

                const ctx: IContext<any> = {
                    params: {
                        ...req.query,
                        ...req.body,
                    },
                };

                try {
                    if (action.params) {
                        const isValid: any = validator.validate(ctx.params, action.params);
                        if (isValid !== true) {
                            throw new ValidationError(isValid);
                        }
                    }

                    data = await action.method(ctx);
                } catch (e) {
                    logger.error('API error: %s', e);
                    statusCode = e.statusCode || 500;
                    error = e.message;
                }

                const response: any = {
                    ok: !error,
                };

                if (error) {
                    response.error = error;
                } else {
                    response.data = data;
                }

                res.status(statusCode).json(response);
            }
        );
        logger.info(
            'API method %s %s ready',
            action.rest.method.toUpperCase(),
            action.rest.path
        );
    }
}

export default router;
