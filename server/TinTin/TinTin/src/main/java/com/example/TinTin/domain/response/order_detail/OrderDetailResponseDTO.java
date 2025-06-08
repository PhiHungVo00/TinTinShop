package com.example.TinTin.domain.response.order_detail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailResponseDTO {

    private Long id;
    private Long productSizeId;
    private Integer quantity;
    private BigDecimal price;
    private List<Long> toppingIds;


}