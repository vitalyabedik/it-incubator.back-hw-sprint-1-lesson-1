import express, { Express } from 'express';
import { EHttpStatus, ERoutePath } from './core/constants';
import { videosRouter } from './videos/routers/videos.router';
import { testingRouter } from './testing/routers/testing.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get(ERoutePath.Main, (req, res) => {
    res.status(EHttpStatus.Ok_200).send('Hello world!');
  });

  app.use(ERoutePath.Videos, videosRouter);
  app.use(ERoutePath.Testing, testingRouter);
};
