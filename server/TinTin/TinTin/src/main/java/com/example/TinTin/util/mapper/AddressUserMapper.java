package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.AddressUser;
import com.example.TinTin.domain.response.address.AddressResponseDto;

import java.time.Instant;

public class AddressUserMapper {

    public static AddressResponseDto toAddressResponseDto(AddressUser addressUser){
        AddressResponseDto addressResponseDto = new AddressResponseDto();
        addressResponseDto.setId(addressUser.getId());
        addressResponseDto.setAddressLine(addressUser.getAddressLine());
        addressResponseDto.setWard(addressUser.getWard());
        addressResponseDto.setDistrict(addressUser.getDistrict());
        addressResponseDto.setProvince(addressUser.getProvince());
        addressResponseDto.setReceiverName(addressUser.getReceiverName());
        addressResponseDto.setReceiverPhone(addressUser.getReceiverPhone());
        addressResponseDto.setDescription(addressUser.getDescription());
        addressResponseDto.setDefaultAddress(addressUser.isDefaultAddress());
        addressResponseDto.setCreatedAt(addressUser.getCreatedAt());
        addressResponseDto.setUpdatedAt(addressUser.getUpdatedAt());
        addressResponseDto.setCreatedBy(addressUser.getCreatedBy());
        addressResponseDto.setUpdatedBy(addressUser.getUpdatedBy());
        return addressResponseDto;
    }
}
