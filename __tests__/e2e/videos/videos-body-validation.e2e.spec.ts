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

  it('POST /videos; не должен создавать video при некорректном body', async () => {
    const invalidCreateData1: TCreateVideoInput = {
      title: '', // пустой title
      author: '', // пустой author
      availableResolutions: [], // пустой availableResolutions
    };

    const invalidCreateRequest1 = await request(app)
      .post(ERoutePath.Videos)
      .send(invalidCreateData1)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidCreateRequest1.body.errorMessages).toHaveLength(3);

    const invalidCreateData2: TCreateVideoInput = {
      title: '    ', // пустой title
      author: '    ', // пустой author
      availableResolutions: [], // пустой availableResolutions
    };

    const invalidCreateRequest2 = await request(app)
      .post(ERoutePath.Videos)
      .send(invalidCreateData2)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidCreateRequest2.body.errorMessages).toHaveLength(3);

    const videoResponse = await request(app).get(ERoutePath.Videos);
    expect(videoResponse.body).toHaveLength(0);
  });

  it('PUT /videos/:id; не должен обновлять video при некорректном body', async () => {
    const createResponse = await request(app)
      .post(ERoutePath.Videos)
      .send({
        title: testVideoData.title,
        author: testVideoData.author,
        availableResolutions: [...testVideoData.availableResolutions],
      } as TCreateVideoInput)
      .expect(EHttpStatus.Created_201);

    const invalidUpdateData1: TVideoInputDto = {
      title: '', // пустой title
      author: '', // пустой author
      availableResolutions: [], // пустой availableResolutions
      minAgeRestriction: 50, // больше максимального minAgeRestriction
      canBeDownloaded: true,
      publicationDate: 'некорректное значение', // некорректное значение publicationDate
    };

    const invalidRequest1 = await request(app)
      .put(`${ERoutePath.Videos}/${createResponse.body.id}`)
      .send(invalidUpdateData1)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidRequest1.body.errorMessages).toHaveLength(5);

    const invalidUpdateData2: TVideoInputDto = {
      title: '    ', // пустой title
      author: '    ', // пустой author
      availableResolutions: [], // пустой availableResolutions
      minAgeRestriction: 0, // меньше минимального minAgeRestriction
      canBeDownloaded: true,
      publicationDate: 'некорректное значение', // некорректное значение publicationDate
    };

    const invalidRequest2 = await request(app)
      .put(`${ERoutePath.Videos}/${createResponse.body.id}`)
      .send(invalidUpdateData2)
      .expect(EHttpStatus.BadRequest_400);

    expect(invalidRequest2.body.errorMessages).toHaveLength(5);

    const videoResponse = await request(app).get(
      `${ERoutePath.Videos}/${createResponse.body.id}`,
    );

    expect(videoResponse.body).toEqual({
      ...testVideoData,
      id: createResponse.body.id,
      publicationDate: createResponse.body.publicationDate,
      createdAt: expect.any(String),
    });
  });
});
