package com.example.TinTin.service;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.ProductSize;
import com.example.TinTin.domain.Size;
import com.example.TinTin.domain.request.product_size.ProductSizeRequestDTO;
import com.example.TinTin.domain.response.productSize.ProductSizeResponseDTO;
import com.example.TinTin.repository.ProductRepository;
import com.example.TinTin.repository.ProductSizeRepository;
import com.example.TinTin.repository.SizeRepository;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.mapper.ProductSizeMapper;
import org.springframework.stereotype.Service;

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
        ProductSize variant = new ProductSize();
        ProductSizeMapper.updateEntityFromRequestDTO(productSizeRequestDTO, variant, product, size);
        return ProductSizeMapper.toResponseDTO(productSizeRepository.save(variant));
    }




}
