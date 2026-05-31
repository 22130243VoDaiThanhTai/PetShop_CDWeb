package org.example.server.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "api.ghn")
public class GhnProperties {

    private String token;
    private String shopId;
    private Url url = new Url();


    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getShopId() { return shopId; }
    public void setShopId(String shopId) { this.shopId = shopId; }

    public Url getUrl() { return url; }
    public void setUrl(Url url) { this.url = url; }

    public static class Url {
        private String province;
        private String district;
        private String ward;
        private String fee;

        public String getProvince() { return province; }
        public void setProvince(String province) { this.province = province; }

        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }

        public String getWard() { return ward; }
        public void setWard(String ward) { this.ward = ward; }

        public String getFee() { return fee; }
        public void setFee(String fee) { this.fee = fee; }
    }
}