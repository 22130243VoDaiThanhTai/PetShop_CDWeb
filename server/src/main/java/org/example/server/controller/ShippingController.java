package org.example.server.controller;

import org.example.server.config.GhnProperties;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.math.BigDecimal;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    private final GhnProperties ghn;

    public ShippingController(GhnProperties ghn) {
        this.ghn = ghn;
    }

    private String callGhnGet(String urlStr) throws Exception {
        URL url = new URI(urlStr).toURL();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Token", ghn.getToken());
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(10000);
        return readResponse(conn);
    }


    private String callGhnPost(String urlStr, String body) throws Exception {
        URL url = new URI(urlStr).toURL();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Token", ghn.getToken());
        conn.setRequestProperty("ShopId", ghn.getShopId());
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(10000);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.getBytes(StandardCharsets.UTF_8));
        }

        return readResponse(conn);
    }


    private String readResponse(HttpURLConnection conn) throws Exception {
        int statusCode = conn.getResponseCode();
        InputStream stream = (statusCode >= 200 && statusCode < 300)
                ? conn.getInputStream()
                : conn.getErrorStream();

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
            return sb.toString();
        }
    }

    @GetMapping("/provinces")
    public ResponseEntity<String> getProvinces() {
        try {
            String response = callGhnGet(ghn.getUrl().getProvince());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/districts")
    public ResponseEntity<String> getDistricts(@RequestParam("province_id") int provinceId) {
        try {
            String urlStr = ghn.getUrl().getDistrict() + "?province_id=" + provinceId;
            String response = callGhnGet(urlStr);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/wards")
    public ResponseEntity<String> getWards(@RequestParam("district_id") int districtId) {
        try {
            String urlStr = ghn.getUrl().getWard() + "?district_id=" + districtId;
            String response = callGhnGet(urlStr);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/fee")
    public ResponseEntity<String> calculateFee(@RequestBody Map<String, Object> body) {
        try {
            Object districtIdObj = body.get("district_id");
            Object wardCodeObj   = body.get("ward_code");

            if (districtIdObj == null || wardCodeObj == null) {
                return ResponseEntity.badRequest()
                        .body("{\"status\":\"error\",\"message\":\"Thiếu district_id hoặc ward_code\"}");
            }

            int districtId = Integer.parseInt(districtIdObj.toString());
            String wardCode = wardCodeObj.toString();

            int weight = body.containsKey("weight")
                    ? Integer.parseInt(body.get("weight").toString())
                    : 800;

            String requestBody = String.format(
                    "{\"service_type_id\":2,\"to_district_id\":%d,\"to_ward_code\":\"%s\",\"weight\":%d}",
                    districtId, wardCode, weight
            );

            String ghnResponse = callGhnPost(ghn.getUrl().getFee(), requestBody);

            int totalIndex = ghnResponse.indexOf("\"total\":");
            if (totalIndex == -1) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body("{\"status\":\"error\",\"message\":\"Không đọc được phí từ GHN\"}");
            }

            int commaIndex = ghnResponse.indexOf(",", totalIndex);
            if (commaIndex == -1) commaIndex = ghnResponse.indexOf("}", totalIndex);

            String feeStr = ghnResponse.substring(totalIndex + 8, commaIndex).trim();
            new BigDecimal(feeStr);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"status\":\"success\",\"fee\":" + feeStr + "}");

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body("{\"status\":\"error\",\"message\":\"Tham số không hợp lệ\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}