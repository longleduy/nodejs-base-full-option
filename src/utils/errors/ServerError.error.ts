interface Option{
    message?: string
    error?: Error
    status?: number
    name?: string
}
class ServerError extends Error{
    name: string;
    code: string = 'SERVER_ERROR';
    role: number = 0;
    status: 500;
    constructor (option?: Option) {
        super();
        this.name = option?.name || 'OtherError'
    }
}
export {
    ServerError
}