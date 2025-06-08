package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.OrderDetail;
import com.example.TinTin.domain.response.order_detail.OrderDetailResponseDTO;

import java.util.List;

public class OrderDetailMapper {

    public static OrderDetailResponseDTO toOrderDetailResponseDTO(OrderDetail orderDetail) {
        if (orderDetail == null) return null;

        OrderDetailResponseDTO orderDetailResponseDTO = new OrderDetailResponseDTO();
        orderDetailResponseDTO.setId(orderDetail.getId());
        orderDetailResponseDTO.setProductSizeId(orderDetail.getProductSize().getId());
        orderDetailResponseDTO.setQuantity(orderDetail.getQuantity());
        orderDetailResponseDTO.setPrice(orderDetail.getPrice());
        List<Long> toppingIds = orderDetail.getToppings().stream()
                .map(topping -> topping.getId())
                .toList();
        orderDetailResponseDTO.setToppingIds(toppingIds);
        return orderDetailResponseDTO;
    }
}
