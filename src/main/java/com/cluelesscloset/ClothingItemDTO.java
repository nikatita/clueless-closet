package com.cluelesscloset;

import com.cluelesscloset.ClothingItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

public class ClothingItemDTO {

    @Data
    @Builder
    public static class Request {

        @NotBlank(message = "Name is required")
        private String name;

        @NotNull(message = "Category is required")
        private ClothingItem.Category category;

        private String color;
        private String brand;
        private List<String> tags;
    }

    @Data
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private ClothingItem.Category category;
        private String color;
        private String brand;
        private String imageUrl;
        private List<String> tags;
        private String cvCategory;
        private String cvPattern;
        private Boolean cvProcessed;
        private LocalDateTime createdAt;

        public static Response from(ClothingItem item) {
            return Response.builder()
                    .id(item.getId())
                    .name(item.getName())
                    .category(item.getCategory())
                    .color(item.getColor())
                    .brand(item.getBrand())
                    .imageUrl(item.getImageUrl())
                    .tags(item.getTags())
                    .cvCategory(item.getCvCategory())
                    .cvPattern(item.getCvPattern())
                    .cvProcessed(item.getCvProcessed())
                    .createdAt(item.getCreatedAt())
                    .build();
        }
    }
}
