package com.example.warehouse.persistence.entity;

public enum OrderStatus {
    CREATED,
    AWAITING_APPROVAL,
    APPROVED,
    DECLINED,
    UNDER_DELIVERY,
    FULFILLED,
    CANCELED
}