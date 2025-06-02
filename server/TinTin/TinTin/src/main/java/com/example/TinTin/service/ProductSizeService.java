package com.example.TinTin.service;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.ProductSize;
import com.example.TinTin.domain.Size;
import com.example.TinTin.domain.request.product_size.ProductSizeRequestDTO;
import com.example.TinTin.domain.response.productSize.ProductSizeResponseDTO;
import com.example.TinTin.repository.ProductRepository;
import com.example.TinTin.repository.ProductSizeRepository;
import com.example.TinTin.repository.SizeRepository;
import com.example.TinTin.util.error.BusinessException;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.mapper.ProductSizeMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductSizeService {

    private final ProductSizeRepository productSizeRepository;
    private final ProductRepository productRepository;
    private final SizeRepository sizeRepository;

    public ProductSizeService(
            ProductSizeRepository productSizeRepository,
            ProductRepository productRepository,
            SizeRepository sizeRepository) {
        this.productSizeRepository = productSizeRepository;
        this.productRepository = productRepository;
        this.sizeRepository = sizeRepository;
    }

    public Product getProductIfExists(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IdInvalidException("Product not found with id: " + productId));
        if(!product.getActive()) {
            throw new IdInvalidException("Product is inactive with id: " + productId);
        }
        return product;
    }

    public Size getSizeIfExists(Long sizeId) {
        Size size = sizeRepository.findById(sizeId)
                .orElseThrow(() -> new IdInvalidException("Size not found with id: " + sizeId));
        return size;
    }

    public ProductSizeResponseDTO createProductSizeVariant(Long productId, ProductSizeRequestDTO productSizeRequestDTO) {
        Product product = getProductIfExists(productId);
        Size size = getSizeIfExists(productSizeRequestDTO.getSizeId());
        if (productSizeRepository.existsByProductAndSize(product, size)) {
            throw new IdInvalidException("Product size variant already exists for product id: " + productId + " and size id: " + size.getId());
        }
        if (productSizeRequestDTO.getPrice() < 0) {
            throw new BusinessException("The product price must not be negative.");
        }
        if (productSizeRequestDTO.getStockQuantity() < 0) {
            throw new BusinessException("The inventory quantity cannot be negative.");
        }
        ProductSize variant = new ProductSize();
        ProductSizeMapper.updateEntityFromRequestDTO(productSizeRequestDTO, variant, product, size);
        return ProductSizeMapper.toResponseDTO(productSizeRepository.save(variant));
    }

    public List<ProductSizeResponseDTO> getProductSizeVariantById(Long productId) {
        Product product = getProductIfExists(productId);
        List<ProductSize> variants = productSizeRepository.findAllByProduct(product);
        return variants.stream()
                .map(ProductSizeMapper::toResponseDTO)
                .toList();
    }

    public ProductSizeResponseDTO updateProductSizeVariant(Long id, ProductSizeRequestDTO productSizeRequestDTO) {
        ProductSize existingVariant = productSizeRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Product size variant not found with id: " + id));
        if (productSizeRequestDTO.getPrice() < 0) {
            throw new BusinessException("The product price must not be negative.");
        }

        if (productSizeRequestDTO.getStockQuantity() < 0) {
            throw new BusinessException("The inventory quantity cannot be negative.");
        }
        existingVariant.setPrice(productSizeRequestDTO.getPrice());
        existingVariant.setStockQuantity(productSizeRequestDTO.getStockQuantity());
        existingVariant.setStatus(productSizeRequestDTO.getStatus());
        return ProductSizeMapper.toResponseDTO(productSizeRepository.save(existingVariant));
    }




}
