package com.liemab21.niederschlag;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InitData {
    @Autowired
    private Repository dataRepository;

    @PostConstruct
    public void createDataFromFile(){
        try {
            DataFetcher dataFetcher = new DataFetcher();


            InputStream inputStream = this.getClass().getResourceAsStream("/daten.json");
            ObjectMapper objectMapper = new ObjectMapper();
            List<Modle> data = objectMapper.readerForListOf(Modle.class).readValue(inputStream);
            dataRepository.saveAll(data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
