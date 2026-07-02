package com.cluelesscloset;

import com.cluelesscloset.ClothingItemDTO;
import com.cluelesscloset.ClothingItem;
import com.cluelesscloset.ClothingItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ClothingItemController {

    private final ClothingItemService service;

    private static final Long STUB_USER_ID = 1L;

    @GetMapping
    public ResponseEntity<List<ClothingItemDTO.Response>> getAllItems(
            @RequestParam(required = false) ClothingItem.Category category,
            @RequestParam(required = false) String search) {

        Long userId = STUB_USER_ID;

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(service.search(userId, search));
        }
        if (category != null) {
            return ResponseEntity.ok(service.getItemsByCategory(userId, category));
        }
        return ResponseEntity.ok(service.getAllItems(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClothingItemDTO.Response> getItem(@PathVariable Long id) {
        return ResponseEntity.ok(service.getItem(id, STUB_USER_ID));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ClothingItemDTO.Response> createItem(
            @RequestPart("item") @Valid ClothingItemDTO.Request request,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        ClothingItemDTO.Response created = service.createItem(STUB_USER_ID, request, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClothingItemDTO.Response> updateItem(
            @PathVariable Long id,
            @RequestBody @Valid ClothingItemDTO.Request request) {

        return ResponseEntity.ok(service.updateItem(id, STUB_USER_ID, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        service.deleteItem(id, STUB_USER_ID);
        return ResponseEntity.noContent().build();
    }
}
