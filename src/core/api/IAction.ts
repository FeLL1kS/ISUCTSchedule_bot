import IContext from './IContext';

export default interface IAction {
    /**
     * REST options
     */
    rest?: {
        method: 'get' | 'post' | 'patch' | 'all';
        path: string;
    };
    /**
     * Fastest-validator schema
     */
    params?: { [key: string]: any };
    /**
     * Method, returned data will be sent to user
     */
    method: (ctx: IContext<any>) => any;
}
