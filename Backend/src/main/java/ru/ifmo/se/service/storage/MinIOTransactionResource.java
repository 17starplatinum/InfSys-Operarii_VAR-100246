package ru.ifmo.se.service.storage;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MinIOTransactionResource implements TwoPCResource{
    @Getter
    private final MinIOService minIOService;

    private String tempFileName;
    private String finalFileName;
    private byte[] fileData;

    public void setFileData(String finalFileName, byte[] fileData) {
        this.finalFileName = finalFileName;
        this.fileData = fileData;
    }

    @Override
    public void prepare() throws Exception {
        log.info("MiniO: запуск стадии подготовки. Файл под названием {} загружается как {} временно", finalFileName, finalFileName + ".tmp");
        this.tempFileName = finalFileName + ".tmp";
        minIOService.uploadFile(tempFileName, fileData);
        log.info("MinIO: файл под названием {} успешно загружен.", finalFileName);
    }

    @Override
    public void commit() throws Exception {
        log.info("MinIO: Выполняется транзакция. Переименуется {} в {}.", tempFileName, finalFileName);
        minIOService.renameObject(tempFileName, finalFileName);
        log.info("MinIO: Файл с названием {} успешно переименован", finalFileName);
    }

    @Override
    public void rollback() throws Exception {
        log.info("MinIO: выполняется откат транзакции. Удаляется временный файл {}", tempFileName);
        minIOService.deleteObject(tempFileName);
        log.info("MinIO: временный файл {} удален успешно.", tempFileName);
    }
}
