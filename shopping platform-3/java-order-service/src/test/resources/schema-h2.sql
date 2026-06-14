CREATE TABLE IF NOT EXISTS t_order (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT       NOT NULL,
    address_id      BIGINT       NOT NULL,
    total_amount    DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status          VARCHAR(20)  NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pay_time        TIMESTAMP    NULL,
    ship_time       TIMESTAMP    NULL,
    complete_time   TIMESTAMP    NULL
);

CREATE TABLE IF NOT EXISTS t_order_item (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT         NOT NULL,
    product_id  BIGINT         NOT NULL,
    quantity    INT            NOT NULL DEFAULT 1,
    price       DECIMAL(10, 2) NOT NULL
);
