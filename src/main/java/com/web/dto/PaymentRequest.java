package com.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    private int amount;
    private String orderName;
    private String orderId;
    private String successUrl;
    private String cancelUrl;
    private String failUrl;
    // 기타 필드

    public PaymentRequest(int amount, String orderName, String orderId, String successUrl, String cancelUrl, String failUrl) {
        this.amount = amount;
        this.orderName = orderName;
        this.orderId = orderId;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
        this.failUrl = failUrl;
    }
}
