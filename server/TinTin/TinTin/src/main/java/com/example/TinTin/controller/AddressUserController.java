package com.example.TinTin.controller;

import com.example.TinTin.domain.AddressUser;
import com.example.TinTin.domain.response.address.AddressResponseDto;
import com.example.TinTin.service.AddressUserService;
import com.example.TinTin.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AddressUserController {

    private final AddressUserService addressUserService;
    public AddressUserController(AddressUserService addressUserService) {
        this.addressUserService = addressUserService;
    }

    @PostMapping("/addresses-user")
    @ApiMessage("Create new address user")
    public ResponseEntity<AddressResponseDto> createAddressUser(@Valid @RequestBody AddressUser addressUser){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.addressUserService.createAddressUser(addressUser));

    }

    @GetMapping("/addresses-user/users/{id}")
    @ApiMessage("get all address of user")
    public ResponseEntity<List<AddressResponseDto>> getAllAddress(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(this.addressUserService.getAllAddressUser(id));
    }

    @PutMapping("/addresses-user")
    @ApiMessage("Update address")
    public ResponseEntity<AddressResponseDto> updateAddress(@Valid @RequestBody AddressUser addressUser){
        return ResponseEntity.status(HttpStatus.OK).body(this.addressUserService.updateAddressUser(addressUser));
    }

    @DeleteMapping("/addresses-user/{id}")
    @ApiMessage("Delete a address")
    public ResponseEntity<Void> deleteAddress(@PathVariable("id") Long id){
        this.addressUserService.deleteAddressUser(id);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/addresses-user/{id}")
    @ApiMessage("Get address by id")
    public ResponseEntity<AddressResponseDto> getAddressById(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(this.addressUserService.getAddressUser(id));
    }

}
