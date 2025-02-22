'use server'

import { nanoid } from "nanoid";

import { createPresignedUrlToUpload, createPresignedUrlToDownload } from "@/shared/lib";

import * as fileRepository from "../repositories";
import { S3_BUCKET_NAME } from "@/core/constants";

const defaultOnUploadSuccess = () => {
  console.log('Success loading files!');
}

const bucketName = S3_BUCKET_NAME;
const expiry = 60 * 60; // 1 час

/** Получение последних 10 загруженных файлов */
const getFiles = async () => {
  return fileRepository.getFiles();
};

/** Получение presigned URL для загрузки файлов в S3
 * @param files File[]
 * @returns Promise<{
 *   url: string;
 *   fileSize: number;
 *   fileName: string;
 *   originalFileName: string;
 * }[]> Массив presigned URL-ов
*/
const getPresignedUrls = async (files) => {
  if (!files?.length) return [];

  const presignedUrls = await Promise.all(
    files.map(async (file) => {
      // Генерация уникального имени файла для S3
      const fileName = `${nanoid(5)}-${file?.originalFileName}`;

      // Получение presigned URL с использованием S3 SDK
      const url = await createPresignedUrlToUpload({
        fileName,
        bucketName,
        expiry,
      });

      return {
        fileNameInBucket: fileName,
        originalFileName: file.originalFileName,
        fileSize: file.fileSize,
        url,
      };
    })
  );

  return presignedUrls;
};

/** Загрузка файла в S3 напрямую с использованием presigned URL
 * @param presignedUrl {
 *   url: string;
 *   fileSize: number;
 *   fileName: string;
 *   originalFileName: string;
 * }
 * @param file File
 * @returns Minio Response
 */
const uploadToS3 = async (presignedUrl, file) => {
  const response = await fetch(presignedUrl.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
      'Access-Control-Allow-Origin': '*',
    },
  });

  return response;
};

/** Сохранение информации о файле в базе данных
 * @param presignedUrls {
 *   url: string;
 *   fileSize: number;
 *   fileName: string;
 *   originalFileName: string;
 * }[]
 * @returns File[]
 */
const saveFileInfoInDB = async (presignedUrls) => {
  return await fileRepository.saveFilesInfo(presignedUrls);
};

/** Загрузка файлов в S3 и сохранение информации о файлах в базе данных
 * @param files File[]
 * @param presignedUrls {
 *   url: string;
 *   fileSize: number;
 *   fileName: string;
 *   originalFileName: string;
 * }[]
 * @param onUploadSuccess функция, которая будет вызвана после загрузки всех файлов
 * : (@param filesFromDb - массив информации о загруженных файлах, @param uploadToS3Response - массив ответов от S3)
 * @returns File[]
 */
const saveFilesToS3AndDB = async (files, presignedUrls, onUploadSuccess = defaultOnUploadSuccess) => {
  // Загружаем все файлы по presigned URL-ам в S3
  const uploadToS3Response = await Promise.all(
    presignedUrls.map(async (presignedUrl) => {
      // Находим нужный файл по имени и размеру
      const file = files.find(
        (file) => file.name === presignedUrl.originalFileName && file.size === presignedUrl.fileSize
      );
      if (!file) {
        throw new Error('File not found');
      }
      // Загружаем файл в S3
      return await uploadToS3(presignedUrl, file);
    })
  );

  // Проверяем, что все загрузки успешны
  if (uploadToS3Response.some((res) => res.status !== 200)) {
    alert('Upload failed');
    return;
  }

  // Сохраняем информацию о загруженных файлах в базе данных
  const filesFromDB = await saveFileInfoInDB(presignedUrls);

  // Вызываем функцию обратного вызова
  onUploadSuccess?.(filesFromDB, uploadToS3Response);

  return filesFromDB;
};

/** Получение ссылки на файл по его ID
 * @param id string ID файла
 * @returns Promise<string> Presigned URL
 */
const getFileLinkById = async (id) => {
  const file = await fileRepository.getFileNameById(id);

  const presignedUrl = await createPresignedUrlToDownload({
    bucketName: S3_BUCKET_NAME,
    fileName: file.fileName
  })

  return presignedUrl;
}

export {
  getFiles,
  getPresignedUrls,
  uploadToS3,
  saveFileInfoInDB,
  saveFilesToS3AndDB,
  getFileLinkById
};
