package com.shopping.order.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderVO {

    private Long id;

    private Long userId;

    private Long addressId;

    private BigDecimal totalAmount;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime payTime;

    private LocalDateTime shipTime;

    private LocalDateTime completeTime;

    private List<OrderItemVO> items;

    @Data
    public static class OrderItemVO {

        private Long id;

        private Long orderId;

        private Long productId;

        private Integer quantity;

        private BigDecimal price;
    }
}
