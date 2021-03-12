import { Application } from 'express';

export default interface IBot {
    bind: (app: Application) => any;
}
