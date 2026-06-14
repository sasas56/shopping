package com.shopping.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderUpdateRequest {

  /** pending / paid / shipped / completed / cancelled */
  @NotBlank(message = "订单状态不能为空")
  private String status;
}
