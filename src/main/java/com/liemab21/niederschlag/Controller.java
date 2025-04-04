package com.liemab21.niederschlag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class Controller {
    @Autowired
    private Repository repository;

    @GetMapping("/")
    public ResponseEntity<List<DataDTO>> getAll(){
        List<Modle> objects = repository.findAll();
        List<DataDTO> dtos = new ArrayList<>();

        dtos = objects.stream()
                .map(DataDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity
                .status(!dtos.isEmpty() ? HttpStatus.OK : HttpStatus.NO_CONTENT)
                .header("Content-Type", "application/json")
                .body(dtos);
    }
}
