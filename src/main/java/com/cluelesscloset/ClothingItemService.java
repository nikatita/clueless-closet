package com.cluelesscloset;

import com.cluelesscloset.ClothingItemDTO;
import com.cluelesscloset.ResourceNotFoundException;
import com.cluelesscloset.UnauthorizedException;
import com.cluelesscloset.ClothingItem;
import com.cluelesscloset.ClothingItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClothingItemService {

    private final ClothingItemRepository repository;
    private final CloudinaryService cloudinaryService;

    public List<ClothingItemDTO.Response> getAllItems(Long userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(ClothingItemDTO.Response::from)
                .toList();
    }

    public List<ClothingItemDTO.Response> getItemsByCategory(
            Long userId, ClothingItem.Category category) {
        return repository.findByUserIdAndCategory(userId, category)
                .stream()
                .map(ClothingItemDTO.Response::from)
                .toList();
    }

    public ClothingItemDTO.Response getItem(Long itemId, Long userId) {
        ClothingItem item = findOwnedItem(itemId, userId);
        return ClothingItemDTO.Response.from(item);
    }

    public List<ClothingItemDTO.Response> search(Long userId, String query) {
        return repository.searchByUserIdAndQuery(userId, query)
                .stream()
                .map(ClothingItemDTO.Response::from)
                .toList();
    }

    @Transactional
    public ClothingItemDTO.Response createItem(
            Long userId,
            ClothingItemDTO.Request request,
            MultipartFile image) {

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.upload(image);
            log.info("Uploaded image for user {} → {}", userId, imageUrl);
        }

        ClothingItem item = ClothingItem.builder()
                .userId(userId)
                .name(request.getName())
                .category(request.getCategory())
                .color(request.getColor())
                .brand(request.getBrand())
                .imageUrl(imageUrl)
                .tags(request.getTags() != null ? request.getTags() : List.of())
                .cvProcessed(false)
                .build();

        ClothingItem saved = repository.save(item);

        return ClothingItemDTO.Response.from(saved);
    }

    @Transactional
    public ClothingItemDTO.Response updateItem(
            Long itemId, Long userId, ClothingItemDTO.Request request) {

        ClothingItem item = findOwnedItem(itemId, userId);

        item.setName(request.getName());
        item.setCategory(request.getCategory());
        item.setColor(request.getColor());
        item.setBrand(request.getBrand());
        if (request.getTags() != null) {
            item.getTags().clear();
            item.getTags().addAll(request.getTags());
        }

        return ClothingItemDTO.Response.from(repository.save(item));
    }

    @Transactional
    public void deleteItem(Long itemId, Long userId) {
        ClothingItem item = findOwnedItem(itemId, userId);
        repository.delete(item);
        log.info("Deleted item {} for user {}", itemId, userId);
    }

    private ClothingItem findOwnedItem(Long itemId, Long userId) {
        ClothingItem item = repository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item not found: " + itemId));

        if (!item.getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't own this item");
        }
        return item;
    }
}
