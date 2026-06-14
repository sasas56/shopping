package com.shopping.order.controller;

import com.shopping.order.common.Result;
import com.shopping.order.dto.OrderCreateRequest;
import com.shopping.order.dto.OrderUpdateRequest;
import com.shopping.order.dto.OrderVO;
import com.shopping.order.dto.PageResult;
import com.shopping.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /** 分页查询订单列表 */
    @GetMapping
    public Result<PageResult<OrderVO>> listOrders(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.success(orderService.listOrders(userId, status, page, size));
    }

    /** 根据ID查询订单详情 */
    @GetMapping("/{id}")
    public Result<OrderVO> getOrder(@PathVariable Long id) {
        return Result.success(orderService.getOrderById(id));
    }

    /** 创建订单 */
    @PostMapping
    public Result<OrderVO> createOrder(@Valid @RequestBody OrderCreateRequest request) {
        return Result.success(orderService.createOrder(request));
    }

    /** 更新订单（主要用于状态流转） */
    @PutMapping("/{id}")
    public Result<OrderVO> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderUpdateRequest request) {
        return Result.success(orderService.updateOrder(id, request));
    }

    /** 删除订单 */
    @DeleteMapping("/{id}")
    public Result<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return Result.success();
    }
}
