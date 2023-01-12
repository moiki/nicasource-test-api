export const Errors = {
    Aborted: {
        status: 406,
        error_type: "Process Aborted.",
    },
    BadRequest: {
        status: 400,
        error_type: "Request Failed.",
    },
    NotFound: {
        status: 404,
        error_type: "Resource not found.",
    },
    Unauthorized: {
        status: 401,
        error_type: "Authentication credentials not valid.",
    },
    Forbidden: {
        status: 403,
        error_type: "Process or request is not allowed.",
    },
    NotSupported: {
        status: 404,
        error_type: "Currencies not supported.",
    },
    ExternalRequest: {
        status: 409,
        error_type: "External Service Request Failed.",
    },
    ServerError: {
        status: 500,
        error_type: "Internal Server Error.",
    },
};

export default class ErrorREST extends Error {
    public error: {
        status: number;
        error_type: string;
        message: string;
        stack?: string;
    };

    constructor(
        error: { status: number; error_type: string },
        message: any = undefined,
        stack?: string,
        ...args: any[]
    ) {
        super(...args);
        this.error = {
            status: error.status,
            error_type: error.error_type,
            message: message,
            stack: stack || undefined,
        };
    }
}
