import { TVideoErrorMessages } from '../types';

export enum EVideoResolution {
  P144 = 'P144',
  P240 = 'P240',
  P360 = 'P360',
  P480 = 'P480',
  P720 = 'P720',
  P1080 = 'P1080',
  P1440 = 'P1440',
  P2160 = 'P2160',
}

export enum EVideoFieldError {
  Title = 'title',
  Author = 'author',
  CanBeDownloaded = 'canBeDownloaded',
  MinAgeRestriction = 'minAgeRestriction',
  PublicationDate = 'publicationDate',
  AvailableResolutions = 'availableResolutions',
}

export const videoErrorMessage: TVideoErrorMessages = {
  [EVideoFieldError.Title]: { dataType: 'Incorrect title' },
  [EVideoFieldError.Author]: { dataType: 'Incorrect author' },
  [EVideoFieldError.CanBeDownloaded]: { dataType: 'Incorrect canBeDownloaded' },
  [EVideoFieldError.MinAgeRestriction]: {
    dataType: 'Incorrect minAgeRestriction',
  },
  [EVideoFieldError.PublicationDate]: { dataType: 'Incorrect publicationDate' },
  [EVideoFieldError.AvailableResolutions]: {
    dataType: 'availableResolutions must be array',
    length: 'At least one resolution should be added',
    value:
      'availableResolutions must be one of P144, P240, P360, P480, P720, P1080, P1440, P2160',
  },
};
