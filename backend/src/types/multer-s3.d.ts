declare module 'multer-s3' {
  import { S3Client } from '@aws-sdk/client-s3';
  import { StorageEngine } from 'multer';
  import { Request } from 'express';

  interface Options {
    s3: S3Client;
    bucket: string | ((req: Request, file: Express.Multer.File, callback: (error: Error | null, bucket: string) => void) => void);
    acl?: string | ((req: Request, file: Express.Multer.File, callback: (error: Error | null, acl: string) => void) => void);
    contentType?: (req: Request, file: Express.Multer.File, callback: (error: Error | null, mime: string, stream: NodeJS.ReadableStream) => void) => void;
    metadata?: (req: Request, file: Express.Multer.File, callback: (error: Error | null, metadata: Record<string, string>) => void) => void;
    key?: (req: Request, file: Express.Multer.File, callback: (error: Error | null, key: string) => void) => void;
    serverSideEncryption?: string | ((req: Request, file: Express.Multer.File, callback: (error: Error | null, serverSideEncryption: string) => void) => void);
  }

  function multerS3(options: Options): StorageEngine;

  export = multerS3;
}
