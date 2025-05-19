package com.example.TinTin.service;

import com.example.TinTin.domain.Permission;
import com.example.TinTin.domain.response.ResultPaginationDTO;
import com.example.TinTin.repository.PermissionRepository;
import com.example.TinTin.util.error.DuplicateResourceException;
import com.example.TinTin.util.error.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;
    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public boolean checkDuplicated(Permission permission) {
        if (permission.getId() == null) {
            return permissionRepository.existsByApiPathAndMethodAndModule(

                    permission.getApiPath(),
                    permission.getMethod(),
                    permission.getModule()
            );
        } else {
            return permissionRepository.existsByApiPathAndMethodAndModuleAndIdNot(

                    permission.getApiPath(),
                    permission.getMethod(),
                    permission.getModule(),
                    permission.getId()
            );
        }
    }



    public Permission createPermission(Permission permission){
        if(checkDuplicated(permission)){
            throw new DuplicateResourceException("Permission has already existed");
        }
        return permissionRepository.save(permission);
    }

    public Permission updatePermission(Permission permission){
        Optional<Permission> permissionOptional = this.permissionRepository.findById(permission.getId());
        if(!permissionOptional.isPresent()){
            throw new NotFoundException("Permission not found with id: " + permission.getId());
        }
        if(checkDuplicated(permission)){
            throw new DuplicateResourceException("Permission has already existed");
        }
        Permission currentPermission = permissionOptional.get();
        currentPermission.setName(permission.getName());
        currentPermission.setApiPath(permission.getApiPath());
        currentPermission.setMethod(permission.getMethod());
        currentPermission.setModule(permission.getModule());
        return permissionRepository.save(currentPermission);
    }

    public ResultPaginationDTO<List<Permission>> getPermissions(Specification<Permission> spec, Pageable pageable){
        Page<Permission> permissionsPage = this.permissionRepository.findAll(spec, pageable);
        ResultPaginationDTO<List<Permission>> paginationDTO = new ResultPaginationDTO<>();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setTotal((int) permissionsPage.getTotalElements());
        meta.setPages(permissionsPage.getTotalPages());
        meta.setPageSize(permissionsPage.getSize());

        paginationDTO.setMeta(meta);
        paginationDTO.setResult(permissionsPage.getContent());

        return paginationDTO;
    }

    public void deletePermission(Long id){
        Permission permission = this.permissionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Permission not found with id: " + id));
        permission.getRoles().forEach(role -> role.getPermissions().remove(permission));
        this.permissionRepository.delete(permission);
    }
}
