package com.shopping.order.service;

import com.shopping.order.dto.OrderCreateRequest;
import com.shopping.order.dto.OrderUpdateRequest;
import com.shopping.order.dto.OrderVO;
import com.shopping.order.dto.PageResult;

public interface OrderService {

    PageResult<OrderVO> listOrders(Long userId, String status, int page, int size);

    OrderVO getOrderById(Long id);

    OrderVO createOrder(OrderCreateRequest request);

    OrderVO updateOrder(Long id, OrderUpdateRequest request);

    void deleteOrder(Long id);
}
