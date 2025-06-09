package com.example.TinTin.service;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.response.product.ProductResponseDto;
import com.example.TinTin.repository.CategoryRepository;
import com.example.TinTin.repository.ProductRepository;
import com.example.TinTin.repository.RatingRepository;
import com.example.TinTin.util.error.DuplicateResourceException;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.mapper.ProductMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final RatingRepository ratingRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, RatingRepository ratingRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.ratingRepository = ratingRepository;
    }

    private Product validateAndSetCategory(Product product) {
        if (product.getCategory() != null) {
            Long categoryId = product.getCategory().getId();
            if (categoryId == null) {
                throw new IdInvalidException("Category id is null");
            }
            product.setCategory(
                    categoryRepository.findById(categoryId)
                            .orElseThrow(() -> new IdInvalidException("Category not found with id: " + categoryId))
            );
        }
        return product;
    }

    public ProductResponseDto createProduct(Product product) {
        String trimmedName = product.getName().trim();

        if (productRepository.existsByName(trimmedName)) {
            throw new DuplicateResourceException("Product with name " + trimmedName + " already exists.");
        }

        product.setName(trimmedName);
        validateAndSetCategory(product);
        product.setActive(true);

        Product savedProduct = productRepository.save(product);
        ProductResponseDto dto = ProductMapper.toProductResponseDto(savedProduct);
        Double avg = ratingRepository.findAverageScoreByProductId(savedProduct.getId());
        dto.setAverageRating(avg != null ? avg : 0);
        return dto;
    }

    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Product not found with id: " + id));
        ProductResponseDto dto = ProductMapper.toProductResponseDto(product);
        Double avg = ratingRepository.findAverageScoreByProductId(product.getId());
        dto.setAverageRating(avg != null ? avg : 0);
        return dto;
    }

    public ProductResponseDto updateProduct(Product product) {
        Product existingProduct = productRepository.findById(product.getId())
                .orElseThrow(() -> new IdInvalidException("Product not found with id: " + product.getId()));

        String trimmedName = product.getName().trim();

        if (productRepository.existsByNameAndIdNot(trimmedName, product.getId())) {
            throw new DuplicateResourceException("Product with name " + trimmedName + " already exists.");
        }

        product.setName(trimmedName);
        validateAndSetCategory(product);

        existingProduct.setName(product.getName());
        existingProduct.setActive(product.getActive());
        existingProduct.setImage(product.getImage());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setCategory(product.getCategory());

        Product savedProduct = productRepository.save(existingProduct);
        ProductResponseDto dto = ProductMapper.toProductResponseDto(savedProduct);
        Double avg = ratingRepository.findAverageScoreByProductId(savedProduct.getId());
        dto.setAverageRating(avg != null ? avg : 0);
        return dto;
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Product not found with id: " + id));
        if (!product.getActive()) {
            throw new IllegalStateException("Product is already inactive");
        }
        product.setActive(false);
        productRepository.save(product);
    }

    public List<ProductResponseDto> getAllProducts(Specification<Product> spec) {
        List<Product> products = productRepository.findAll(spec);
        return products.stream()
                .map(p -> {
                    ProductResponseDto dto = ProductMapper.toProductResponseDto(p);
                    Double avg = ratingRepository.findAverageScoreByProductId(p.getId());
                    dto.setAverageRating(avg != null ? avg : 0);
                    return dto;
                })
                .toList();

    }
}
