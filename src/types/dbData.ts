import { Models } from 'appwrite';

type Partial<T> = {
  [A in keyof T]?: T[A];
};

export interface TuneDataDetails {
  readme?: string | null;
  make?: string | null;
  model?: string | null;
  displacement?: number | null;
  year?: number | null;
  hp?: number | null;
  stockHp?: number | null;
  engineCode?: string | null;
  cylindersCount?: number | null;
  aspiration?: string | null;
  fuel?: string | null;
  injectorsSize?: number | null;
  coils?: string | null;
}

export interface TuneDbData {
  userId: string;
  tuneId: string;
  signature: string;
  tuneFileId?: string | null;
  logFileIds?: string[];
  toothLogFileIds?: string[];
  customIniFileId?: string | null;
  vehicleName: string | null;
  engineMake: string | null;
  engineCode: string | null;
  displacement: number | null;
  cylindersCount: number | null;
  aspiration: 'na' | 'turbocharged' | 'supercharged';
  compression?: number | null;
  fuel?: string | null;
  ignition?: string | null;
  injectorsSize?: number | null;
  year?: number | null;
  hp?: number | null;
  stockHp?: number | null;
  readme: string | null;
  textSearch?: string | null;
}

export interface TuneDbDocument extends TuneDbData, Models.Document {}

export type TuneDbDataPartial = Partial<TuneDbData>;

export interface UsersBucket {
  userId: string;
  bucketId: string;
  visibility: 'pubic' | 'private';
  createdAt: number;
}
