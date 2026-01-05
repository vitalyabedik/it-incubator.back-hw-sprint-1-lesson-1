export type TAPIErrorResult<T> = {
  errorMessages: TFieldError<T>[];
};

export type TFieldError<T> = {
  field: T;
  message: string;
};

export type TBaseFieldErrorMessage = {
  dataType: string;
};
