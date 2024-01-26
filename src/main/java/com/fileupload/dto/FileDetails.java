package com.fileupload.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class FileDetails {
    @NonNull
    private String fileName;
    @NonNull
    private String fileDownloadUri;
    private String fileType;
    private Long size;
}
