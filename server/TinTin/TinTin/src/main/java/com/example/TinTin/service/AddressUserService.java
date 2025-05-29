package com.example.TinTin.service;

import com.example.TinTin.domain.AddressUser;
import com.example.TinTin.domain.User;
import com.example.TinTin.domain.response.address.AddressResponseDto;
import com.example.TinTin.repository.AddressUserRepository;
import com.example.TinTin.repository.UserRepository;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.mapper.AddressUserMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class AddressUserService {

    private final AddressUserRepository addressUserRepository;
    private final UserRepository userRepository;
    public AddressUserService(AddressUserRepository addressUserRepository, UserRepository userRepository) {
        this.addressUserRepository = addressUserRepository;
        this.userRepository = userRepository;
    }

    public AddressResponseDto createAddressUser(AddressUser addressUser) {
        if(addressUser.getUser()==null||addressUser.getUser().getId()==null) throw new IdInvalidException("User id is empty or null");

            User user = this.userRepository.findById(addressUser.getUser().getId()).orElseThrow(() -> new IdInvalidException("User id invalid"));
            addressUser.setUser(user);
            this.addressUserRepository.save(addressUser);
            if(addressUser.isDefaultAddress()) {
                updateDefaultAddressUser(addressUser);
            }

        return AddressUserMapper.toAddressResponseDto(addressUser);
    }

    public void updateDefaultAddressUser(AddressUser newDefaultAddress) {
        List<AddressUser> addressList = addressUserRepository.findAllByUser(newDefaultAddress.getUser());

        boolean isChanged = false;
        for (AddressUser address : addressList) {
            boolean shouldBeDefault = address.getId().equals(newDefaultAddress.getId());
            if (address.isDefaultAddress() != shouldBeDefault) {
                address.setDefaultAddress(shouldBeDefault);
                isChanged = true;
            }
        }

        if (isChanged) {
            addressUserRepository.saveAll(addressList);
        }
    }


    public List<AddressResponseDto> getAllAddressUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IdInvalidException("User id is invalid"));

        List<AddressUser> addressUsers = addressUserRepository.findAllByUser(user);

        return addressUsers.stream()
                .map(AddressUserMapper::toAddressResponseDto)
                .toList();
    }


    public AddressResponseDto updateAddressUser(AddressUser addressUser) {
        Long userId = Optional.ofNullable(addressUser.getUser())
                .map(User::getId)
                .orElseThrow(() -> new IdInvalidException("User id is empty or null"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IdInvalidException("User id invalid"));

        AddressUser addressUserDB = addressUserRepository.findById(addressUser.getId())
                .orElseThrow(() -> new IdInvalidException("Address id is invalid"));

        addressUserDB.setUser(user);
        addressUserDB.setAddressLine(addressUser.getAddressLine());
        addressUserDB.setWard(addressUser.getWard());
        addressUserDB.setDistrict(addressUser.getDistrict());
        addressUserDB.setProvince(addressUser.getProvince());
        addressUserDB.setReceiverName(addressUser.getReceiverName());
        addressUserDB.setReceiverPhone(addressUser.getReceiverPhone());
        addressUserDB.setDescription(addressUser.getDescription());
        addressUserDB.setDefaultAddress(addressUser.isDefaultAddress());

        if (addressUser.isDefaultAddress()) {
            updateDefaultAddressUser(addressUserDB);
        }

        addressUserRepository.save(addressUserDB);
        return AddressUserMapper.toAddressResponseDto(addressUserDB);
    }


    public void deleteAddressUser(Long id){
        AddressUser addressUser = this.addressUserRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Address not found with id: " + id ));
        System.out.println(addressUser);
        this.addressUserRepository.delete(addressUser);
    }

    public AddressResponseDto getAddressUser(Long id){
        Optional<AddressUser> addressUserOptional = this.addressUserRepository.findById(id);
        if(addressUserOptional.isPresent()){
            return AddressUserMapper.toAddressResponseDto(addressUserOptional.get());
        }else{
            throw new IdInvalidException("Address id is invalid");
        }
    }

}
