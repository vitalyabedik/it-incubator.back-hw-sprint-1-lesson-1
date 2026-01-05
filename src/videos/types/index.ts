import { EVideoFieldError, EVideoResolution } from '../constants';
import { TBaseFieldErrorMessage } from '../../core/types/error';

export type TVideo = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: EVideoResolution[];
};

export type TGetAllVideosParams = {
  id: string;
};

export type TUpdateVideoParams = {
  id: string;
};

export type TCreateVideoInput = Pick<
  TVideo,
  'title' | 'author' | 'availableResolutions'
>;

export type TVideoInputDto = Omit<TVideo, 'id' | 'createdAt'>;

export type TDeleteVideoParams = {
  id: string;
};

export type TVideoErrorMessages = {
  [EVideoFieldError.Title]: TBaseFieldErrorMessage;
  [EVideoFieldError.Author]: TBaseFieldErrorMessage;
  [EVideoFieldError.CanBeDownloaded]: TBaseFieldErrorMessage;
  [EVideoFieldError.MinAgeRestriction]: TBaseFieldErrorMessage;
  [EVideoFieldError.PublicationDate]: TBaseFieldErrorMessage;
  [EVideoFieldError.AvailableResolutions]: TBaseFieldErrorMessage & {
    length: string;
    value: string;
  };
};
