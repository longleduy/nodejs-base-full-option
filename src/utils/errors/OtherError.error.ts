interface Option{
    message?: string
    error?: Error
    status?: number
    name?: string
}
class OtherError extends Error{
    name: string;
    message: string;
    code: string = 'OTHER_ERROR';
    role: number = 1;
    status: number;
    constructor (option?: Option) {
        super();
        this.status = option?.status || 500;
        this.message = option?.message || `Other error`;
        this.name = option?.name || 'OtherError'
    }
}
export {
    OtherError
}