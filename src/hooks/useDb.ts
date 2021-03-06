import * as Sentry from '@sentry/browser';
import {
  Models,
  Query,
} from 'appwrite';
import { database } from '../appwrite';
import {
  TuneDbData,
  UsersBucket,
  TuneDbDataPartial,
  TuneDbDocument,
} from '../types/dbData';
import { databaseGenericError } from '../pages/auth/notifications';

const COLLECTION_ID_PUBLIC_TUNES = 'tunes';
const COLLECTION_ID_USERS_BUCKETS = 'usersBuckets';

const useDb = () => {
  const updateTune = async (documentId: string, data: TuneDbDataPartial) => {
    try {
      await database.updateDocument(COLLECTION_ID_PUBLIC_TUNES, documentId, data);

      return Promise.resolve();
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      databaseGenericError(error as Error);

      return Promise.reject(error);
    }
  };

  const createTune = async (data: TuneDbData) => {
    try {
      const tune = await database.createDocument(
        COLLECTION_ID_PUBLIC_TUNES,
        'unique()',
        data,
        ['role:all'],
        [`user:${data.userId}`],
      );

      return Promise.resolve(tune);
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      databaseGenericError(error as Error);

      return Promise.reject(error);
    }
  };

  const getTune = async (tuneId: string) => {
    try {
      const tune = await database.listDocuments(
        COLLECTION_ID_PUBLIC_TUNES,
        [Query.equal('tuneId', tuneId)],
        1,
      );

      return Promise.resolve(tune.total > 0 ? tune.documents[0] as unknown as TuneDbDocument : null);
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      databaseGenericError(error as Error);

      return Promise.reject(error);
    }
  };

  const getBucketId = async (userId: string) => {
    try {
      const buckets = await database.listDocuments(
        COLLECTION_ID_USERS_BUCKETS,
        [
          Query.equal('userId', userId),
          Query.equal('visibility', 'public'),
        ],
        1,
      );

      if (buckets.total === 0) {
        throw new Error('No public bucket found');
      }

      return Promise.resolve((buckets.documents[0] as unknown as UsersBucket)!.bucketId);
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      databaseGenericError(error as Error);

      return Promise.reject(error);
    }
  };

  const searchTunes = async (search?: string) => {
    // TODO: add pagination
    const limit = 100;

    try {
      const list: Models.DocumentList<TuneDbDocument> = await (
        search
          ? database.listDocuments(COLLECTION_ID_PUBLIC_TUNES, [Query.search('textSearch', search)], limit)
          : database.listDocuments(COLLECTION_ID_PUBLIC_TUNES, [], limit)
      );

      return Promise.resolve(list);
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      databaseGenericError(error as Error);

      return Promise.reject(error);
    }
  };

  return {
    updateTune: (tuneId: string, data: TuneDbDataPartial): Promise<void> => updateTune(tuneId, data),
    createTune: (data: TuneDbData): Promise<Models.Document> => createTune(data),
    getTune: (tuneId: string): Promise<TuneDbDocument | null> => getTune(tuneId),
    searchTunes: (search?: string): Promise<Models.DocumentList<TuneDbDocument>> => searchTunes(search),
    getBucketId: (userId: string): Promise<string> => getBucketId(userId),
  };
};

export default useDb;
