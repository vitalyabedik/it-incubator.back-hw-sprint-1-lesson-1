import { TFieldError } from '../../core/types/error';
import { FIELD_REQUIRED_LENGTH } from '../../core/constants';
import {
  EVideoFieldError,
  EVideoResolution,
  videoErrorMessage,
} from '../constants';
import { TVideoInputDto } from '../types';
import {
  VIDEO_AUTHOR_MAX_LENGTH,
  VIDEO_MIN_AGE_RESTRICTION_MAX_LENGTH,
  VIDEO_TITLE_MAX_LENGTH,
} from './constants';

export const videoInputDtoValidation = (data: Partial<TVideoInputDto>) => {
  const {
    title,
    author,
    canBeDownloaded,
    availableResolutions = [],
    minAgeRestriction,
    publicationDate,
  } = data;

  const errors: TFieldError<EVideoFieldError>[] = [];

  if (
    !title ||
    typeof title !== 'string' ||
    title.trim().length < FIELD_REQUIRED_LENGTH ||
    title.trim().length > VIDEO_TITLE_MAX_LENGTH
  ) {
    errors.push({
      field: EVideoFieldError.Title,
      message: videoErrorMessage[EVideoFieldError.Title].dataType,
    });
  }

  if (
    !author ||
    typeof author !== 'string' ||
    author.trim().length < FIELD_REQUIRED_LENGTH ||
    author.trim().length > VIDEO_AUTHOR_MAX_LENGTH
  ) {
    errors.push({
      field: EVideoFieldError.Author,
      message: videoErrorMessage[EVideoFieldError.Author].dataType,
    });
  }

  if (
    EVideoFieldError.CanBeDownloaded in data &&
    typeof canBeDownloaded !== 'boolean'
  ) {
    errors.push({
      field: EVideoFieldError.CanBeDownloaded,
      message: videoErrorMessage[EVideoFieldError.CanBeDownloaded].dataType,
    });
  }

  if (
    EVideoFieldError.MinAgeRestriction in data &&
    minAgeRestriction !== null &&
    (typeof minAgeRestriction !== 'number' ||
      minAgeRestriction < FIELD_REQUIRED_LENGTH ||
      minAgeRestriction > VIDEO_MIN_AGE_RESTRICTION_MAX_LENGTH)
  ) {
    errors.push({
      field: EVideoFieldError.MinAgeRestriction,
      message: videoErrorMessage[EVideoFieldError.MinAgeRestriction].dataType,
    });
  }

  if (
    EVideoFieldError.PublicationDate in data &&
    (typeof publicationDate !== 'string' ||
      isNaN(new Date(publicationDate).getTime()) ||
      new Date(publicationDate).toISOString() !== publicationDate)
  ) {
    errors.push({
      field: EVideoFieldError.PublicationDate,
      message: videoErrorMessage[EVideoFieldError.PublicationDate].dataType,
    });
  }

  if (!Array.isArray(availableResolutions)) {
    errors.push({
      field: EVideoFieldError.AvailableResolutions,
      message:
        videoErrorMessage[EVideoFieldError.AvailableResolutions].dataType,
    });
  }

  if (
    availableResolutions &&
    availableResolutions.length < FIELD_REQUIRED_LENGTH
  ) {
    errors.push({
      field: EVideoFieldError.AvailableResolutions,
      message: videoErrorMessage[EVideoFieldError.AvailableResolutions].length,
    });
  }

  for (let resolution of availableResolutions) {
    if (!EVideoResolution[resolution]) {
      errors.push({
        field: EVideoFieldError.AvailableResolutions,
        message: videoErrorMessage[EVideoFieldError.AvailableResolutions].value,
      });
    }
  }

  return errors;
};
