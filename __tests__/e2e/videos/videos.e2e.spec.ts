import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { TCreateVideoInput, TVideoInputDto } from '../../../src/videos/types';
import { EVideoResolution } from '../../../src/videos/constants';
import { EHttpStatus, ERoutePath } from '../../../src/core/constants';

describe('Video API', () => {
  const app = express();
  setupApp(app);

  const testVideoData: TVideoInputDto = {
    title: 'Samurai Way',
    author: 'Dimych',
    canBeDownloaded: false,
    minAgeRestriction: null,
    publicationDate: '2026-01-04T12:00:00.000Z',
    availableResolutions: [
      EVideoResolution.P1080,
      EVideoResolution.P1440,
      EVideoResolution.P2160,
    ],
  };

  beforeAll(async () => {
    await request(app)
      .delete(ERoutePath.Reset_DB)
      .expect(EHttpStatus.NoContent_204);
  });

  it('POST /videos; должен создавать video', async () => {
    const createVideoInput: TCreateVideoInput = {
      title: 'Valera',
      author: 'RTK',
      availableResolutions: [EVideoResolution.P2160],
    };
    const newVideo: TVideoInputDto = {
      ...testVideoData,
      ...createVideoInput,
      availableResolutions: [...createVideoInput.availableResolutions],
    };

    await request(app)
      .post(ERoutePath.Videos)
      .send(newVideo)
      .expect(EHttpStatus.Created_201);
  });

  it('GET /videos; должен возвращать массив video', async () => {
    await request(app)
      .post(ERoutePath.Videos)
      .send({ ...testVideoData, title: 'Video1' } as TVideoInputDto)
      .expect(EHttpStatus.Created_201);

    await request(app)
      .post(ERoutePath.Videos)
      .send({ ...testVideoData, title: 'Video2' } as TVideoInputDto)
      .expect(EHttpStatus.Created_201);

    const videoListResponse = await request(app)
      .get(ERoutePath.Videos)
      .expect(EHttpStatus.Ok_200);

    expect(videoListResponse.body).toBeInstanceOf(Array);
    expect(videoListResponse.body.length).toBeGreaterThan(2);
  });

  it('GET /videos/:id; должен возвращать video по id', async () => {
    const createResponse = await request(app)
      .post(ERoutePath.Videos)
      .send({ ...testVideoData, title: 'Video' } as TVideoInputDto)
      .expect(EHttpStatus.Created_201);

    const getResponse = await request(app)
      .get(`${ERoutePath.Videos}/${createResponse.body.id}`)
      .expect(EHttpStatus.Ok_200);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it('PUT /videos/:id; должен корректно обновлять video', async () => {
    const updateResponse = await request(app)
      .post(ERoutePath.Videos)
      .send({ ...testVideoData, title: 'Video' } as TVideoInputDto)
      .expect(EHttpStatus.Created_201);

    const videoUpdateData: TVideoInputDto = {
      title: 'Updated Title',
      author: 'Updated Author',
      canBeDownloaded: true,
      minAgeRestriction: 10,
      availableResolutions: [EVideoResolution.P144],
      publicationDate: '2026-01-01T10:00:00.000Z',
    };

    await request(app)
      .put(`${ERoutePath.Videos}/${updateResponse.body.id}`)
      .send(videoUpdateData)
      .expect(EHttpStatus.NoContent_204);

    const videoResponse = await request(app).get(
      `${ERoutePath.Videos}/${updateResponse.body.id}`,
    );

    expect(videoResponse.body).toEqual({
      ...videoUpdateData,
      id: updateResponse.body.id,
      createdAt: expect.any(String),
    });
  });
});
