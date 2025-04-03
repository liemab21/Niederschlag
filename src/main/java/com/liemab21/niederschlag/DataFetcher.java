package com.liemab21.niederschlag;

import java.io.IOException;
import java.io.File;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class DataFetcher {

    private static final String API_URL =
            "https://dataset.api.hub.geosphere.at/v1/station/daily/weather_station_daily?parameters=SLP_MIN,SLP_MAX";
    private static final String OUTPUT_FILE = System.getProperty("user.home") + File.separator + "geosphere_data.json";


    public static void main(String[] args) {
        try {
            HttpClient httpClient = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(response.body());

                objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(OUTPUT_FILE), jsonNode);
                System.out.println("Data successfully written to " + OUTPUT_FILE);
            } else {
                System.err.println("Failed to fetch data. HTTP Status Code: " + response.statusCode());
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
