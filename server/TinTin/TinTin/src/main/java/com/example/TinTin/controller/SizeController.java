package com.example.TinTin.controller;

import com.example.TinTin.domain.Size;
import com.example.TinTin.service.SizeService;
import com.example.TinTin.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class SizeController {

    private final SizeService sizeService;
    public SizeController(SizeService sizeService) {
        this.sizeService = sizeService;
    }

    @PostMapping("/sizes")
    @ApiMessage("Create new size")
    public ResponseEntity<Size> createSize(@Valid @RequestBody Size size) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.sizeService.createSize(size));
    }

    @GetMapping("/sizes")
    @ApiMessage("Get all sizes")
    public ResponseEntity<List<Size>> getAllSizes() {
        return ResponseEntity.ok().body(this.sizeService.getAllSizes());
    }

    @PutMapping("/sizes")
    @ApiMessage("Update a size")
    public ResponseEntity<Size> updateSize(@Valid @RequestBody Size size) {
        return ResponseEntity.ok().body(this.sizeService.updateSize(size));
    }

}
