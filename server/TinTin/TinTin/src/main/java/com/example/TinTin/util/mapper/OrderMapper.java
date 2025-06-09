package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.Order;
import com.example.TinTin.domain.response.order.OrderResponseDTO;

public class OrderMapper {

    public static OrderResponseDTO toOrderResponseDTO(Order order) {
        if (order == null) return null;

        OrderResponseDTO orderResponseDTO = new OrderResponseDTO();
        orderResponseDTO.setId(order.getId());
        orderResponseDTO.setUserId(order.getUser().getId());
        orderResponseDTO.setCouponId(order.getCoupon()!= null ? order.getCoupon().getId() : null);
        orderResponseDTO.setAddressUser(AddressUserMapper.toAddressResponseDto(order.getAddressUser()));
        orderResponseDTO.setNote(order.getNote());
        orderResponseDTO.setStatus(order.getStatus());
        orderResponseDTO.setTotalPrice(order.getTotalPrice());
        orderResponseDTO.setFinalPrice(order.getFinalPrice());
        orderResponseDTO.setCreatedAt(order.getCreatedAt());
        orderResponseDTO.setUpdatedAt(order.getUpdatedAt());
        orderResponseDTO.setOrderDetails(order.getOrderDetails().stream().map(OrderDetailMapper::toOrderDetailResponseDTO).toList());

        return orderResponseDTO;
    }
}
