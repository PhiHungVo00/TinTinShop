package com.example.TinTin.domain.request.product_size;

import com.example.TinTin.util.constrant.ProductSizeStatusEnum;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductSizeRequestDTO {
    @NotNull(message = "Size ID cannot be null")
    private Long sizeId;

    private Long price;
    private Integer stockQuantity;
    private ProductSizeStatusEnum status;


}

