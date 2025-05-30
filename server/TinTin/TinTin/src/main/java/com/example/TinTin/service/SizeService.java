package com.example.TinTin.service;

import com.example.TinTin.domain.Size;
import com.example.TinTin.repository.SizeRepository;
import com.example.TinTin.util.error.DuplicateResourceException;
import com.example.TinTin.util.error.IdInvalidException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SizeService {

    private final SizeRepository sizeRepository;
    public SizeService(SizeRepository sizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    public Size createSize(Size size) {

        if(this.sizeRepository.existsByName(size.getName())) {
            throw new DuplicateResourceException("Size with name " + size.getName() + " already exists.");
        } else {
            return this.sizeRepository.save(size);
        }

    }

    public List<Size> getAllSizes(){
        return this.sizeRepository.findAll();
    }

    public Size updateSize(Size size){
        Size existingSize = this.sizeRepository.findById(size.getId())
                .orElseThrow(() -> new IdInvalidException("Size not found with id: " + size.getId()));

        if (this.sizeRepository.existsByName(size.getName()) && !existingSize.getName().equals(size.getName())) {
            throw new DuplicateResourceException("Size with name " + size.getName() + " already exists.");
        }

        existingSize.setName(size.getName());
        existingSize.setDescription(size.getDescription());
        return this.sizeRepository.save(existingSize);
    }
}
