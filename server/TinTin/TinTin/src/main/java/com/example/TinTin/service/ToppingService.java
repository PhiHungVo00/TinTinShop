package com.example.TinTin.service;

import com.example.TinTin.domain.Topping;
import com.example.TinTin.repository.ToppingRepository;
import com.example.TinTin.util.constrant.ToppingStatusEnum;
import com.example.TinTin.util.error.DuplicateResourceException;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.error.NotFoundException;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ToppingService {

    private final ToppingRepository toppingRepository;
    public ToppingService(ToppingRepository toppingRepository) {
        this.toppingRepository = toppingRepository;
    }

    public Topping createTopping(Topping topping) {
        if(this.toppingRepository.existsByNameAndStatus(topping.getName(), ToppingStatusEnum.ACTIVE)) {
            throw new DuplicateResourceException("Topping with name " + topping.getName() + " already exists.");
        }
        return toppingRepository.save(topping);
    }

    public Topping getToppingById(Long id) {
        return toppingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Topping not found with id: " + id));
    }

    public List<Topping> getAllToppings(Specification<Topping> spec) {
        return toppingRepository.findAll(spec);
    }

    public Topping updateTopping(Topping topping) {

        if (topping.getId() == null) {
            throw new IdInvalidException("Topping ID cannot be null for update operation");
        }

        if (topping.getName() == null || topping.getName().trim().isEmpty()) {
            throw new IdInvalidException("Topping name cannot be null or empty");
        }
        if (topping.getPrice() == null || topping.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IdInvalidException("Topping price cannot be null or negative");
        }
        if (topping.getStatus() == null) {
            throw new IdInvalidException("Topping status cannot be null");
        }

        Topping existingTopping = toppingRepository.findById(topping.getId())
                .orElseThrow(() -> new NotFoundException("Topping not found with ID: " + topping.getId()));

        Topping existingToppingName = toppingRepository.findByNameAndStatus(topping.getName(), ToppingStatusEnum.ACTIVE);
        if (existingToppingName != null && !existingToppingName.getId().equals(topping.getId())) {
            throw new DuplicateResourceException("Topping with name '" + topping.getName() + "' already exists and is ACTIVE");
        }

        existingTopping.setName(topping.getName());
        existingTopping.setPrice(topping.getPrice());
        existingTopping.setStatus(topping.getStatus());
        existingTopping.setDescription(topping.getDescription());
        existingTopping.setImage(topping.getImage());

        return toppingRepository.save(existingTopping);
    }

    public void deleteTopping(Long id) {
        if(id == null) {
            throw new IdInvalidException("Topping ID cannot be null for delete operation");
        }
        Topping topping = toppingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Topping not found with id: " + id));
        topping.setStatus(ToppingStatusEnum.DELETED);
        toppingRepository.save(topping);

    }

}
