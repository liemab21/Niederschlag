package com.liemab21.niederschlag;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Entity
@RequiredArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Modle {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonProperty("NUTS")
    private String nuts1;

    @JsonProperty("DISTRICT_CODE")
    private int districtCode;

    @JsonProperty("REF_YEAR")
    private int refYear;

    @JsonProperty("REF_DATE")
    private int refDate;

    @JsonProperty("P")
    private String p;

    @JsonProperty("P_MAX")
    private String p_max;

    @JsonProperty("P_MIN")
    private String p_min;
}
