package com.shopping.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderCreateRequest {

    @NotNull(message = "用户ID不能为空")
    private Long userId;

    @NotNull(message = "收货地址ID不能为空")
    private Long addressId;

    @NotEmpty(message = "订单明细不能为空")
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {

        @NotNull(message = "商品ID不能为空")
        private Long productId;

        @NotNull(message = "购买数量不能为空")
        @Min(value = 1, message = "购买数量至少为1")
        private Integer quantity;

        @NotNull(message = "商品单价不能为空")
        private BigDecimal price;
    }
}
