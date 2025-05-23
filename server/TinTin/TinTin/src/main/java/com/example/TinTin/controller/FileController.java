package com.example.TinTin.controller;

import com.example.TinTin.domain.response.file.ResUploadFileDTO;
import com.example.TinTin.service.FileService;
import com.example.TinTin.util.annotation.ApiMessage;
import com.example.TinTin.util.error.StorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class FileController {
    @Value("${upload-file.base-uri}")
    private String baseURI;
    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files")
    public ResponseEntity<ResUploadFileDTO> uploadFile(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("folder") String folder
    ) throws URISyntaxException, IOException, StorageException {
        //validate data
        if(file == null || file.isEmpty()){
            throw new StorageException("File is empty. Please upload a file");
        }

        //validate extension
        String fileName = file.getOriginalFilename();
        List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx");
        boolean isValid = allowedExtensions.stream().anyMatch(fileExtension -> fileName.toLowerCase().endsWith(fileExtension));
        if(!isValid){
            throw new StorageException("File extension is not valid. Please upload a file has extension"+ allowedExtensions.toString());
        }
        //create upload directory if not exists
        this.fileService.createUploadFolder(baseURI+folder);

        //store file
        String uploadedFile = this.fileService.store(file, folder);

        ResUploadFileDTO resUploadFileDTO = new ResUploadFileDTO(uploadedFile, Instant.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(resUploadFileDTO);
    }

    @GetMapping("/files")
    @ApiMessage("Download a file")
    public ResponseEntity<Resource> downloadFile(
            @RequestParam("fileName") String fileName,
            @RequestParam("folder") String folder
    ) throws StorageException, FileNotFoundException, URISyntaxException {
        if(fileName == null || folder == null){
            throw new StorageException("Missing required params. ");
        }

        //check file exist and not a directory
        long fileLength = this.fileService.getFileLength(fileName, folder);
        if(fileLength == 0){
            throw new StorageException("File with name " + fileName + " does not exist.");
        }

        //download a file
        InputStreamResource resource = this.fileService.getResource(fileName, folder);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentLength(fileLength)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);

    }

}
