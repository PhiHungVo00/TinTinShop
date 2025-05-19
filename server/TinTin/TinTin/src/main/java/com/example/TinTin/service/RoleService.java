package com.example.TinTin.service;

import com.example.TinTin.domain.Permission;
import com.example.TinTin.domain.Role;
import com.example.TinTin.domain.response.ResultPaginationDTO;
import com.example.TinTin.repository.PermissionRepository;
import com.example.TinTin.repository.RoleRepository;
import com.example.TinTin.util.error.DuplicateResourceException;
import com.example.TinTin.util.error.NotFoundException;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public boolean checkDuplicatedRole(Role role){
        if(role.getId()==null){
            return this.roleRepository.existsByName(role.getName());
        }
        return this.roleRepository.existsByNameAndIdNot(role.getName(), role.getId());
    }

    public Role createRole(Role role) throws BadRequestException {
        if(checkDuplicatedRole(role)){
            throw new DuplicateResourceException("Role has already existed");
        }
        if (role.getPermissions() == null) {
            throw new BadRequestException("Permissions must be provided");
        }
        List<Long> ids = role.getPermissions().stream().map(Permission::getId).collect(Collectors.toList());
        List<Permission> permissions = this.permissionRepository.findAllByIdIn(ids);
        role.setPermissions(permissions);

        return roleRepository.save(role);
    }

    public Role updateRole(Role role) throws BadRequestException{
        Optional<Role> roleOptional = this.roleRepository.findById(role.getId());
        if(!roleOptional.isPresent()){
            throw new NotFoundException("Role not found with id: " + role.getId());
        }
        if(checkDuplicatedRole(role)){
            throw new DuplicateResourceException("Role has already existed");
        }
        Role currentRole = roleOptional.get();
        if (role.getPermissions() == null) {
            throw new BadRequestException("Permissions must be provided");
        }
        List<Long> ids = role.getPermissions().stream().map(Permission::getId).collect(Collectors.toList());
        List<Permission> permissions = this.permissionRepository.findAllByIdIn(ids);
        currentRole.setPermissions(permissions);
        currentRole.setName(role.getName());
        currentRole.setDescription(role.getDescription());
        currentRole.setActive(role.getActive());
        return roleRepository.save(currentRole);
    }

    public ResultPaginationDTO<List<Role>> getRoles(Specification<Role> spec, Pageable pageable){
        Page<Role> rolesPage = this.roleRepository.findAll(spec, pageable);
        ResultPaginationDTO<List<Role>> paginationDTO = new ResultPaginationDTO<>();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setTotal((int) rolesPage.getTotalElements());
        meta.setPages(rolesPage.getTotalPages());
        meta.setPageSize(rolesPage.getSize());

        paginationDTO.setMeta(meta);
        paginationDTO.setResult(rolesPage.getContent());
        return paginationDTO;
    }

    public void deleteRole(Long id){
        Role role = this.roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Role not found with id: " + id));
        this.roleRepository.delete(role);
    }

    public Optional<Role> getRoleById(Long id){
        return this.roleRepository.findById(id);

    }
}
