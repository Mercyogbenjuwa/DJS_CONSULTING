export const ResponseMessage = {
    LOGIN_SUCCESS: 'Login successful',
    REGISTRATION_SUCCESS: 'Registration successful',
    POST_LIST: 'List of posts',
    POST_DETAILS: 'Post details',
    POST_CREATED: 'Post created',
    POST_UPDATED: 'Post updated',
    POST_DELETED: 'Post deleted',
    FORBIDDEN: 'Forbidden',
  };
  
  
  export const StatusCode = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT : 409
  };

  
  export const ResponseFormat = (statusCode: number, message: string, data: any = null) => {
    return {
      statusCode,
      message,
      data,
    };
  };
  