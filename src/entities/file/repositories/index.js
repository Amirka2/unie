'use server'

import { S3_BUCKET_NAME } from "@/core/constants";
import { prisma } from "@/shared/lib/db";

const LIMIT_FILES = 10;

/**
 * Получение последних 10 загруженных файлов
 * @returns Promise<{
 *  id: string;
 *  originalName: string;
 *  size: number
 * }[]> Список файлов
 */
const getFiles = async () => {
  return prisma.file.findMany({
    take: LIMIT_FILES,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      originalName: true,
      size: true,
    },
  })
}

/**
 * Сохранение информации о массиве файлов в базе данных
 * @param presignedUrls: string[] Список presigned URL-ов
 * @returns Promise<File[]> Информация о сохраненных файлов
 */
const saveFilesInfo = async (presignedUrls) => {
  return Promise.all(presignedUrls.map(async ({
    fileNameInBucket,
    originalFileName: originalName,
    fileSize: size,
    url // хз есть ли нужно ли
  }) => {
    return prisma.file.create({
      data: {
        bucket: S3_BUCKET_NAME,
        fileName: fileNameInBucket,
        originalName,
        size,
      },
    });
  }));
}

/**
 * Получение имени файла по его ID
 * @param id: string ID файла
 * @returns Promise<{
 *   fileName: string;
 * }> Информация о файле
 */
const getFileNameById = async (id) => {
  return prisma.file.findUnique({
    where: {
      id,
    },
    select: {
      fileName: true,
    },
  });
}

export {
  getFiles,
  saveFilesInfo,
  getFileNameById
};
