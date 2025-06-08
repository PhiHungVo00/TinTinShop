package com.example.TinTin.service;

import com.example.TinTin.domain.Category;
import com.example.TinTin.repository.CategoryRepository;
import com.example.TinTin.util.error.DuplicateResourceException;
import com.example.TinTin.util.error.IdInvalidException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category createCategory(Category category) {
        Category existingActive = categoryRepository.findByNameAndActive(category.getName(), true);
        if (existingActive != null) {
            throw new DuplicateResourceException("Category with name " + category.getName() + " already exists.");
        }

        Category existingInactive = categoryRepository.findByNameAndActive(category.getName(), false);
        if (existingInactive != null) {
            existingInactive.setActive(true);
            return categoryRepository.save(existingInactive);
        }

        return categoryRepository.save(category);
    }

    public List<Category> getListOfCategories(Specification<Category> spec) {
        return categoryRepository.findAll(spec);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
        if (!category.getActive()) {
            throw new IllegalStateException("Category is already inactive");
        }
        category.setActive(false);
        categoryRepository.save(category);
    }

    public Category updateCategory(Category category) {
        Category existingCategory = categoryRepository.findById(category.getId())
                .orElseThrow(() -> new IdInvalidException("Category not found with id: " + category.getId()));

        String trimmedName = category.getName().trim();
        Category existingCategoryByName = categoryRepository.findByNameAndActive(trimmedName, true);

        if (existingCategoryByName != null && !existingCategoryByName.getId().equals(existingCategory.getId())) {
            throw new DuplicateResourceException("Category with name " + trimmedName + " already exists.");
        }

        existingCategory.setName(trimmedName);
        existingCategory.setDescription(category.getDescription());
        existingCategory.setActive(category.getActive());

        return categoryRepository.save(existingCategory);
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Category not found with id: " + id));
    }

}
