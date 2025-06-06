package com.example.TinTin.service;

import com.example.TinTin.domain.Order;
import com.example.TinTin.domain.OrderDetail;
import com.example.TinTin.domain.ProductSize;
import com.example.TinTin.domain.Topping;
import com.example.TinTin.domain.request.order.OrderRequestDTO;
import com.example.TinTin.domain.response.order_detail.OrderDetailResponseDTO;
import com.example.TinTin.repository.OrderDetailRepository;
import com.example.TinTin.repository.OrderRepository;
import com.example.TinTin.repository.ProductSizeRepository;
import com.example.TinTin.repository.ToppingRepository;
import com.example.TinTin.util.constrant.ToppingStatusEnum;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.mapper.OrderDetailMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderDetailService {

    private final ProductSizeRepository productSizeRepository;
    private final ToppingRepository toppingRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository;

    public OrderDetailService(OrderDetailRepository orderDetailRepository,
                              ProductSizeRepository productSizeRepository,
                              ToppingRepository toppingRepository,
                              OrderRepository orderRepository) {
        this.orderDetailRepository = orderDetailRepository;
        this.productSizeRepository = productSizeRepository;
        this.toppingRepository = toppingRepository;
        this.orderRepository = orderRepository;
    }

    public OrderDetail createOrderDetail(OrderRequestDTO.OrderDetailDTO orderDetailDTO) {
        // Validate input
        if (orderDetailDTO == null) {
            throw new IllegalArgumentException("OrderDetailDTO cannot be null");
        }
        if (orderDetailDTO.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        // Find and validate product size
        ProductSize productSize = productSizeRepository.findById(orderDetailDTO.getProductSizeId())
                .orElseThrow(() -> new IdInvalidException("Product size not found with id: " + orderDetailDTO.getProductSizeId()));

        if (!productSize.getProduct().getActive()) {
            throw new IdInvalidException("Product is not active with id: " + productSize.getProduct().getId());
        }

        if (productSize.getStockQuantity() < orderDetailDTO.getQuantity()) {
            throw new IdInvalidException("Insufficient stock. Available: " + productSize.getStockQuantity() +
                    ", Requested: " + orderDetailDTO.getQuantity());
        }

        // Calculate base price (multiply by quantity once)
        BigDecimal price = productSize.getPrice().multiply(BigDecimal.valueOf(orderDetailDTO.getQuantity()));

        // Process toppings
        List<Long> toppingIds = orderDetailDTO.getToppingIds();
        List<Topping> toppings = new ArrayList<>();

        if (toppingIds != null && !toppingIds.isEmpty()) {
            for (Long toppingId : toppingIds) {
                if (toppingId == null) {
                    continue; // Skip null topping IDs
                }

                Topping topping = toppingRepository.findById(toppingId)
                        .orElseThrow(() -> new IdInvalidException("Topping not found with id: " + toppingId));

                if (!ToppingStatusEnum.ACTIVE.equals(topping.getStatus())) {
                    throw new IdInvalidException("Topping is not active with id: " + toppingId);
                }

                toppings.add(topping);
                // Add topping price multiplied by quantity
                price = price.add(topping.getPrice().multiply(BigDecimal.valueOf(orderDetailDTO.getQuantity())));
            }
        }

        // Create and populate order detail
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setProductSize(productSize);
        orderDetail.setToppings(toppings);
        orderDetail.setQuantity(orderDetailDTO.getQuantity());
        orderDetail.setPrice(price);

        // Save order detail first
        OrderDetail savedOrderDetail = orderDetailRepository.save(orderDetail);

        // Update stock quantity after successful order detail creation
        productSize.setStockQuantity(productSize.getStockQuantity() - orderDetailDTO.getQuantity());
        productSizeRepository.save(productSize);

        return savedOrderDetail;
    }

    public void saveAll(List<OrderDetail> orderDetails) {
        orderDetails.forEach(orderDetail -> orderDetailRepository.save(orderDetail));

    }

    public void returnStockQuantity(OrderDetail orderDetail) {
        Long productSizeId = orderDetail.getProductSize().getId();
        ProductSize productSize = productSizeRepository.findById(productSizeId)
                .orElseThrow(() -> new IdInvalidException("Product size not found with id: " + productSizeId));
        // return stock quantity based on the order detail quantity
        productSize.setStockQuantity(productSize.getStockQuantity() + orderDetail.getQuantity());
        productSizeRepository.save(productSize);
    }

    public List<OrderDetailResponseDTO> getOrderDetailsByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IdInvalidException("Order not found with id: " + orderId));
        List<OrderDetail> orderDetails = orderDetailRepository.findAllByOrder(order);
        return orderDetails.stream()
                .map(OrderDetailMapper::toOrderDetailResponseDTO)
                .toList();
    }
}
