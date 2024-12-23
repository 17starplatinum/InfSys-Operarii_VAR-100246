package ru.ifmo.se.service.storage;

import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Service
public class MinIOService {
    @Getter
    private final MinioClient minioClient;

    @Value("${minio.bucketName}")
    private String bucketName;

    public MinIOService(@Value("${minio.url}") String url,
                        @Value("${minio.accessKey}") String accessKey,
                        @Value("${minio.secretKey}") String secretKey) {
        this.minioClient = MinioClient.builder().endpoint(url).credentials(accessKey, secretKey).build();
    }

    public void uploadFile(String fileName, byte[] data) {
        try {
            checkBucketExistence();
            minioClient.putObject(PutObjectArgs.builder().bucket(bucketName).object(fileName).stream(new ByteArrayInputStream(data), data.length, -1).build());
        } catch (ErrorResponseException | InsufficientDataException | InternalException |
                 InvalidKeyException | InvalidResponseException | IOException |
                 NoSuchAlgorithmException | XmlParserException | ServerException e) {
            throw new RuntimeException("Ошибка при загрузке файла в сервис MinIO: " + e.getMessage(), e);
        }
    }

    private void checkBucketExistence() {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build()
            );
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException |
                 InvalidResponseException | IOException | NoSuchAlgorithmException | XmlParserException | ServerException e) {
            throw new RuntimeException("Ошибка при проверке/создании корзине в MinIO: " + e.getMessage(), e);
        }
    }

    public void renameObject(String source, String target) {
        try {
            minioClient.copyObject(
                    CopyObjectArgs.builder()
                            .bucket(bucketName)
                            .object(target)
                            .source(
                                    CopySource.builder()
                                            .bucket(bucketName)
                                            .object(source)
                                            .build()
                            )
                            .build());
            minioClient.removeObject(
                    RemoveObjectArgs.builder().bucket(bucketName).object(source).build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при переименовании файла в MinIO: " + e.getMessage(), e);
        }
    }

    public void deleteObject(String source) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder().bucket(bucketName).object(source).build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при удалении файла в MinIO: " + e.getMessage(), e);
        }
    }

    public String getPresignedUrl(String fileName) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .method(Method.GET)
                            .build()
            );
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException |
                 InvalidResponseException | IOException | NoSuchAlgorithmException | XmlParserException |
                 ServerException e) {
            throw new RuntimeException("Ошибка при получении ссылки на файл из MinIO: " + e.getMessage(), e);
        }
    }
}
