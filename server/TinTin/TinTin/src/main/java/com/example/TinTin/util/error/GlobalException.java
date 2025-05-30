package com.example.TinTin.util.error;

import com.example.TinTin.domain.response.RestResponse;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(value = {
            UsernameNotFoundException.class,
            BadCredentialsException.class,
            ChangeSetPersister.NotFoundException.class,
            DuplicateResourceException.class,
            NotFoundException.class,
            IdInvalidException.class,
            IllegalStateException.class,
            IllegalArgumentException.class,
            HttpMessageNotReadableException.class
    })
    public ResponseEntity<RestResponse<Object>> handleIdException(Exception ex) {
        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setError(ex.getMessage());
        res.setMessage("Exception occured ....");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

//    @ExceptionHandler(value = {
//            NoResourceFoundException.class
//    })
//    public ResponseEntity<RestResponse<Object>> handleNoResourceFoundException(Exception ex) {
//        RestResponse<Object> res = new RestResponse<Object>();
//        res.setStatusCode(HttpStatus.NOT_FOUND.value());
//        res.setError(ex.getMessage());
//        res.setMessage("404 Not Found. URL may not exist...");
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
//    }

    @ExceptionHandler(MethodArgumentNotValidException.class
          )
    public ResponseEntity<RestResponse<Object>> validationError(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        final List<FieldError> fieldErrors = bindingResult.getFieldErrors();

        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setError(ex.getBody().getDetail());
        List<String> errs = fieldErrors.stream().map(f->f.getDefaultMessage()).collect(Collectors.toList());
        res.setMessage(errs.size()>1?errs:errs.get(0));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);

    }

    @ExceptionHandler(value = {
            StorageException.class
    })
    public ResponseEntity<RestResponse<Object>> handleStorageException(Exception ex) {
        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setError(ex.getMessage());
        res.setMessage("Can not upload file. Something went wrong");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }
}

