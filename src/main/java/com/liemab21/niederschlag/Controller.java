package com.liemab21.niederschlag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class Controller {
    @Autowired
    private Repository repository;

    @GetMapping("/")
    public ResponseEntity<Iterable> getAll(){
        return ResponseEntity.ok(repository.findAll());
    }
}
