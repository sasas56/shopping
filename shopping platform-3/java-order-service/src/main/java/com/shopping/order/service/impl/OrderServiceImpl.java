package com.shopping.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.shopping.order.dto.OrderCreateRequest;
import com.shopping.order.dto.OrderUpdateRequest;
import com.shopping.order.dto.OrderVO;
import com.shopping.order.dto.PageResult;
import com.shopping.order.entity.Order;
import com.shopping.order.entity.OrderItem;
import com.shopping.order.exception.BusinessException;
import com.shopping.order.mapper.OrderItemMapper;
import com.shopping.order.mapper.OrderMapper;
import com.shopping.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final Set<String> VALID_STATUSES = Set.of(
            "pending", "paid", "shipped", "completed", "cancelled"
    );

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;

    @Override
    public PageResult<OrderVO> listOrders(Long userId, String status, int page, int size) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        if (userId != null) {
            wrapper.eq(Order::getUserId, userId);
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(Order::getStatus, status);
        }
        wrapper.orderByDesc(Order::getCreatedAt);

        Page<Order> orderPage = orderMapper.selectPage(new Page<>(page, size), wrapper);
        List<OrderVO> items = orderPage.getRecords().stream()
                .map(this::toVOWithItems)
                .toList();

        return new PageResult<>(items, orderPage.getTotal(), orderPage.getCurrent(), orderPage.getSize());
    }

    @Override
    public OrderVO getOrderById(Long id) {
        Order order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException(404, "订单不存在");
        }
        return toVOWithItems(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OrderVO createOrder(OrderCreateRequest request) {
        BigDecimal totalAmount = request.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setAddressId(request.getAddressId());
        order.setTotalAmount(totalAmount);
        order.setStatus("pending");
        order.setCreatedAt(LocalDateTime.now());
        orderMapper.insert(order);

        for (OrderCreateRequest.OrderItemRequest itemRequest : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrderId(order.getId());
            item.setProductId(itemRequest.getProductId());
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(itemRequest.getPrice());
            orderItemMapper.insert(item);
        }

        return getOrderById(order.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OrderVO updateOrder(Long id, OrderUpdateRequest request) {
        Order order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException(404, "订单不存在");
        }

        String newStatus = request.getStatus();
        if (!VALID_STATUSES.contains(newStatus)) {
            throw new BusinessException("无效的订单状态: " + newStatus);
        }

        applyStatusTransition(order, newStatus);
        orderMapper.updateById(order);
        return getOrderById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteOrder(Long id) {
        Order order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException(404, "订单不存在");
        }

        orderItemMapper.delete(new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, id));
        orderMapper.deleteById(id);
    }

    private void applyStatusTransition(Order order, String newStatus) {
        String currentStatus = order.getStatus();
        if (currentStatus.equals(newStatus)) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        switch (newStatus) {
            case "paid" -> {
                if (!"pending".equals(currentStatus)) {
                    throw new BusinessException("仅待支付订单可标记为已支付");
                }
                order.setPayTime(now);
            }
            case "shipped" -> {
                if (!"paid".equals(currentStatus)) {
                    throw new BusinessException("仅已支付订单可标记为已发货");
                }
                order.setShipTime(now);
            }
            case "completed" -> {
                if (!"shipped".equals(currentStatus)) {
                    throw new BusinessException("仅已发货订单可标记为已完成");
                }
                order.setCompleteTime(now);
            }
            case "cancelled" -> {
                if (!"pending".equals(currentStatus)) {
                    throw new BusinessException("仅待支付订单可取消");
                }
            }
            default -> throw new BusinessException("无效的订单状态: " + newStatus);
        }
        order.setStatus(newStatus);
    }

    private OrderVO toVOWithItems(Order order) {
        OrderVO vo = toVO(order);
        List<OrderItem> items = orderItemMapper.selectList(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, order.getId())
        );
        vo.setItems(items.stream().map(this::toItemVO).toList());
        return vo;
    }

    private OrderVO toVO(Order order) {
        OrderVO vo = new OrderVO();
        vo.setId(order.getId());
        vo.setUserId(order.getUserId());
        vo.setAddressId(order.getAddressId());
        vo.setTotalAmount(order.getTotalAmount());
        vo.setStatus(order.getStatus());
        vo.setCreatedAt(order.getCreatedAt());
        vo.setPayTime(order.getPayTime());
        vo.setShipTime(order.getShipTime());
        vo.setCompleteTime(order.getCompleteTime());
        return vo;
    }

    private OrderVO.OrderItemVO toItemVO(OrderItem item) {
        OrderVO.OrderItemVO vo = new OrderVO.OrderItemVO();
        vo.setId(item.getId());
        vo.setOrderId(item.getOrderId());
        vo.setProductId(item.getProductId());
        vo.setQuantity(item.getQuantity());
        vo.setPrice(item.getPrice());
        return vo;
    }
}
