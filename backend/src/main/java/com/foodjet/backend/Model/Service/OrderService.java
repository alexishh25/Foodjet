package com.foodjet.backend.Model.Service;

import com.foodjet.backend.Model.Entity.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order createOrder(Order order);
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Integer id);
    Order updateOrderStatus(Integer id, String status);
}
