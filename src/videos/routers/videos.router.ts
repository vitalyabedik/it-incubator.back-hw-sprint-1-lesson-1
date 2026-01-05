import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { EHttpStatus } from '../../core/constants';
import {
  TRequestWithBody,
  TRequestWithParams,
  TRequestWithParamsAndBody,
} from '../../core/types/request';
import { createErrorMessages } from '../../core/utils/validation';
import { getTomorrowISODate } from '../../core/utils/date';
import {
  TDeleteVideoParams,
  TGetAllVideosParams,
  TVideoInputDto,
  TUpdateVideoParams,
  TVideo,
  TCreateVideoInput,
} from '../types';
import { EVideoFieldError } from '../constants';
import { videoInputDtoValidation } from '../validation/videoInputDtoValidation';

export const videosRouter = Router({});

videosRouter
  .get('', (_: Request, res: Response<TVideo[]>) => {
    res.status(EHttpStatus.Ok_200).send(db.videos);
  })

  .get(
    '/:id',
    (req: TRequestWithParams<TGetAllVideosParams>, res: Response<TVideo>) => {
      const video = db.videos.find(
        (video) => video.id === Number(req.params.id),
      );

      if (!video) {
        res.sendStatus(EHttpStatus.NotFound_404);
        return;
      }

      res.status(EHttpStatus.Ok_200).send(video);
    },
  )

  .post('', (req: TRequestWithBody<TCreateVideoInput>, res: Response) => {
    const errors = videoInputDtoValidation(req.body);

    if (errors.length > 0) {
      res
        .status(EHttpStatus.BadRequest_400)
        .send(createErrorMessages<EVideoFieldError>(errors));
      return;
    }

    const { title, author, availableResolutions } = req.body;
    const newVideo: TVideo = {
      id: Number(new Date()),
      title,
      author,
      availableResolutions,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: getTomorrowISODate(),
    };

    db.videos.push(newVideo);
    res.status(EHttpStatus.Created_201).send(newVideo);
  })

  .put(
    '/:id',
    (
      req: TRequestWithParamsAndBody<TUpdateVideoParams, TVideoInputDto>,
      res: Response,
    ) => {
      const index = db.videos.findIndex(
        (video) => video.id === Number(req.params.id),
      );

      if (index === -1) {
        res.sendStatus(EHttpStatus.NotFound_404);
        return;
      }

      const errors = videoInputDtoValidation(req.body);
      if (errors.length > 0) {
        res
          .status(EHttpStatus.BadRequest_400)
          .send(createErrorMessages<EVideoFieldError>(errors));
        return;
      }

      const {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate,
      } = req.body;
      const video = db.videos[index];

      video.title = title;
      video.author = author;
      video.availableResolutions = availableResolutions;
      video.canBeDownloaded = canBeDownloaded;
      video.minAgeRestriction = minAgeRestriction;
      video.publicationDate = publicationDate;

      res.sendStatus(EHttpStatus.NoContent_204);
    },
  )

  .delete(
    ' /:id',
    (req: TRequestWithParams<TDeleteVideoParams>, res: Response) => {
      const index = db.videos.findIndex(
        (video) => video.id === Number(req.params.id),
      );

      if (index === -1) {
        res.sendStatus(EHttpStatus.NotFound_404);
        return;
      }

      db.videos.splice(index, 1);
      res.sendStatus(EHttpStatus.NoContent_204);
    },
  );
