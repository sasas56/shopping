package com.shopping.order;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private static Long createdOrderId;

    @Test
    @Order(1)
    void createOrder_shouldReturn201WithOrderData() throws Exception {
        String body = """
                {
                  "userId": 1,
                  "addressId": 1,
                  "items": [
                    { "productId": 1, "quantity": 2, "price": 29.90 },
                    { "productId": 2, "quantity": 1, "price": 19.90 }
                  ]
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.status").value("pending"))
                .andExpect(jsonPath("$.data.totalAmount").value(79.70))
                .andExpect(jsonPath("$.data.items.length()").value(2))
                .andReturn();

        JsonNode root = new com.fasterxml.jackson.databind.ObjectMapper()
                .readTree(result.getResponse().getContentAsString());
        createdOrderId = root.path("data").path("id").asLong();
        assertThat(createdOrderId).isPositive();
    }

    @Test
    @Order(2)
    void getOrderById_shouldReturnOrderDetail() throws Exception {
        mockMvc.perform(get("/api/orders/{id}", createdOrderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").value(createdOrderId))
                .andExpect(jsonPath("$.data.items.length()").value(2));
    }

    @Test
    @Order(3)
    void listOrders_shouldReturnPagedResult() throws Exception {
        mockMvc.perform(get("/api/orders")
                        .param("userId", "1")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.items.length()").value(1));
    }

    @Test
    @Order(4)
    void updateOrderStatus_toPaid_shouldSucceed() throws Exception {
        mockMvc.perform(put("/api/orders/{id}", createdOrderId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"paid\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.status").value("paid"))
                .andExpect(jsonPath("$.data.payTime").exists());
    }

    @Test
    @Order(5)
    void updateOrderStatus_toShipped_shouldSucceed() throws Exception {
        mockMvc.perform(put("/api/orders/{id}", createdOrderId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"shipped\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("shipped"))
                .andExpect(jsonPath("$.data.shipTime").exists());
    }

    @Test
    @Order(6)
    void updateOrderStatus_toCompleted_shouldSucceed() throws Exception {
        mockMvc.perform(put("/api/orders/{id}", createdOrderId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"completed\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("completed"))
                .andExpect(jsonPath("$.data.completeTime").exists());
    }

    @Test
    @Order(7)
    void getOrderById_notFound_shouldReturn400() throws Exception {
        mockMvc.perform(get("/api/orders/{id}", 99999))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.message").value("订单不存在"));
    }

    @Test
    @Order(8)
    void createOrder_invalidRequest_shouldReturn400() throws Exception {
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\":1}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    @Order(9)
    void deleteOrder_shouldSucceed() throws Exception {
        mockMvc.perform(delete("/api/orders/{id}", createdOrderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));

        mockMvc.perform(get("/api/orders/{id}", createdOrderId))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(404));
    }
}
