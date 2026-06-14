-- 电商订单模块表结构（MySQL 8.0+）
-- 字符集：utf8mb4

CREATE DATABASE IF NOT EXISTS shopping_order
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE shopping_order;

-- 订单主表
CREATE TABLE IF NOT EXISTS t_order (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
    user_id         BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    address_id      BIGINT UNSIGNED NOT NULL COMMENT '收货地址ID',
    total_amount    DECIMAL(10, 2)  NOT NULL DEFAULT 0.00 COMMENT '订单总金额',
    status          VARCHAR(20)     NOT NULL DEFAULT 'pending' COMMENT '订单状态: pending/paid/shipped/completed/cancelled',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    pay_time        DATETIME        NULL COMMENT '支付时间',
    ship_time       DATETIME        NULL COMMENT '发货时间',
    complete_time   DATETIME        NULL COMMENT '完成时间',
  PRIMARY KEY (id),
  KEY idx_order_user_id (user_id),
  KEY idx_order_status (status),
  KEY idx_order_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单主表';

-- 订单明细表
CREATE TABLE IF NOT EXISTS t_order_item (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '明细ID',
    order_id    BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
    product_id  BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
    quantity    INT UNSIGNED    NOT NULL DEFAULT 1 COMMENT '购买数量',
    price       DECIMAL(10, 2)  NOT NULL COMMENT '成交单价',
  PRIMARY KEY (id),
  KEY idx_order_item_order_id (order_id),
  KEY idx_order_item_product_id (product_id),
  CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES t_order (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

-- 初始化测试数据
INSERT INTO t_order (id, user_id, address_id, total_amount, status, created_at) VALUES
(1, 1, 1, 59.80, 'pending', '2024-06-01 10:00:00'),
(2, 1, 1, 29.90, 'paid', '2024-06-02 14:30:00');

INSERT INTO t_order_item (id, order_id, product_id, quantity, price) VALUES
(1, 1, 1, 2, 29.90),
(2, 2, 1, 1, 29.90);
