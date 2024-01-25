package com.fileupload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileUploadResponseDto {
    private String fileName;
    private String fileDownloadUri;
    private String fileType;
    private Long size;
}
