package com.example.TinTin.controller;

import com.example.TinTin.domain.Topping;
import com.example.TinTin.service.ToppingService;
import com.example.TinTin.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ToppingController {

    private final ToppingService toppingService;
    public ToppingController(ToppingService toppingService) {
        this.toppingService = toppingService;
    }

    @PostMapping("/toppings")
    @ApiMessage("Create new topping")
    public ResponseEntity<Topping> createTopping(@Valid @RequestBody Topping topping){
        Topping createdTopping = this.toppingService.createTopping(topping);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTopping);
    }

    @GetMapping("/toppings/{id}")
    @ApiMessage("Get topping by id")
    public ResponseEntity<Topping> getToppingById(@PathVariable("id") long id) {
        Topping topping = this.toppingService.getToppingById(id);
        return ResponseEntity.status(HttpStatus.OK).body(topping);
    }

    @GetMapping("/toppings")
    @ApiMessage("Get all toppings")
    public ResponseEntity<List<Topping>> getAllToppings(@Filter Specification<Topping> spec) {
        List<Topping> toppings = this.toppingService.getAllToppings(spec);
        return ResponseEntity.status(HttpStatus.OK).body(toppings);
    }

    @PutMapping("/toppings")
    @ApiMessage("Update topping")
    public ResponseEntity<Topping> updateTopping(@Valid @RequestBody Topping topping) {
        Topping updatedTopping = this.toppingService.updateTopping(topping);
        return ResponseEntity.status(HttpStatus.OK).body(updatedTopping);
    }

    @DeleteMapping("/toppings/{id}")
    @ApiMessage("Delete topping by id")
    public ResponseEntity<Void> deleteTopping(@PathVariable("id") long id) {
        this.toppingService.deleteTopping(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
