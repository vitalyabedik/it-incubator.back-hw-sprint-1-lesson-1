import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { EHttpStatus, ERoutePath } from '../../core/constants';

export const testingRouter = Router({});

testingRouter.delete(ERoutePath.Data, (req: Request, res: Response) => {
  db.videos = [];
  res.sendStatus(EHttpStatus.NoContent_204);
});
