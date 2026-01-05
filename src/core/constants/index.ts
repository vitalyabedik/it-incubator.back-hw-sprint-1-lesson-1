export enum ERoutePath {
  Main = '/',
  Videos = '/videos',
  Testing = '/testing',
  Data = '/all-data',
  Reset_DB = '/testing/all-data',
}

export enum EHttpStatus {
  Ok_200 = 200,
  Created_201 = 201,
  NoContent_204 = 204,

  BadRequest_400 = 400,
  Unauthorized_401 = 401,
  Forbidden_403 = 403,
  NotFound_404 = 404,

  InternalServerError_500 = 500,
}

export const FIELD_REQUIRED_LENGTH = 1;

export enum EErrorVariant {
  Invalid_Data_Type = 'type',
  Invalid_Length = 'length',
  Invalid_Value = 'value',
}
