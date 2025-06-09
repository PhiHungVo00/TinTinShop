package com.example.TinTin.controller;

import com.example.TinTin.domain.Category;
import com.example.TinTin.service.CategoryService;
import com.example.TinTin.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CategoryController {

    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/categories")
    @ApiMessage("Create new category")
    @PreAuthorize("hasAuthority('CATEGORY_CREATE')")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.categoryService.createCategory(category));

    }

    @GetMapping("/categories")
    @ApiMessage("Get list categories")
    @PreAuthorize("hasAuthority('CATEGORY_READ')")
    public ResponseEntity<List<Category>> getAllCategory(@Filter Specification<Category> spec){
        return ResponseEntity.ok().body(this.categoryService.getListOfCategories(spec));
    }

    @DeleteMapping("/categories/{id}")
    @ApiMessage("Delete a category")
    @PreAuthorize("hasAuthority('CATEGORY_DELETE')")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Long id){
        this.categoryService.deleteCategory(id);
        return ResponseEntity.ok().body(null);
    }

    @PutMapping("/categories")
    @ApiMessage("Update a category")
    @PreAuthorize("hasAuthority('CATEGORY_UPDATE')")
    public ResponseEntity<Category> updateCategory(@Valid @RequestBody Category category){
        return ResponseEntity.ok().body(this.categoryService.updateCategory(category));
    }

    @GetMapping("/categories/{id}")
    @ApiMessage("Get category by ID")
    @PreAuthorize("hasAuthority('CATEGORY_READ')")
    public ResponseEntity<Category> getCategoryById(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(this.categoryService.getCategoryById(id));
    }


}
