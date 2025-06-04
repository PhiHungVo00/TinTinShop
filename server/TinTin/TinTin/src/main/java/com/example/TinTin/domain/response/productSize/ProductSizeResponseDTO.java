package com.example.TinTin.domain.response.productSize;

import com.example.TinTin.util.constrant.ProductSizeStatusEnum;
import com.example.TinTin.util.constrant.SizeEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductSizeResponseDTO {
    private Long id;
    private Long productId;
    private Long sizeId;
    private SizeEnum sizeName;
    private BigDecimal price;
    private Integer stockQuantity;
    private ProductSizeStatusEnum status;
    private Instant createdAt;
    private Instant updatedAt;


}

