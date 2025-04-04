package com.liemab21.niederschlag;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

public class DataDTO {
    private Long id;
    private String nuts1;
    private int districtCode;
    private int refYear;
    private int refDate;
    private String p;

    public DataDTO(Long id, String nuts1, int districtCode, int refYear, int refDate, String p) {
        this.id = id;
        this.nuts1 = nuts1;
        this.districtCode = districtCode;
        this.refYear = refYear;
        this.refDate = refDate;
        this.p = p;
    }

    public DataDTO(Modle modle) {
        this.id = modle.getId();
        this.nuts1 = modle.getNuts1();
        this.districtCode = modle.getDistrictCode();
        this.refYear = modle.getRefYear();
        this.refDate = modle.getRefDate();
        this.p = modle.getP();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNuts1() {
        return nuts1;
    }

    public void setNuts1(String nuts1) {
        this.nuts1 = nuts1;
    }

    public int getDistrictCode() {
        return districtCode;
    }

    public void setDistrictCode(int districtCode) {
        this.districtCode = districtCode;
    }

    public int getRefYear() {
        return refYear;
    }

    public void setRefYear(int refYear) {
        this.refYear = refYear;
    }

    public int getRefDate() {
        return refDate;
    }

    public void setRefDate(int refDate) {
        this.refDate = refDate;
    }

    public String getP() {
        return p;
    }

    public void setP(String p) {
        this.p = p;
    }
}
