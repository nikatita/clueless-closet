package com.cluelesscloset;

import com.cluelesscloset.ClothingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClothingItemRepository extends JpaRepository<ClothingItem, Long> {

        List<ClothingItem> findByUserId(Long userId);

        List<ClothingItem> findByUserIdAndCategory(Long userId, ClothingItem.Category category);

        List<ClothingItem> findByUserIdAndColorIgnoreCase(Long userId, String color);

        Optional<ClothingItem> findByIdAndUserId(Long id, Long userId);

        List<ClothingItem> findByUserIdAndCvProcessedFalse(Long userId);

        @Query("SELECT c FROM ClothingItem c WHERE c.userId = :userId AND " +
                        "(LOWER(c.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
                        "LOWER(c.brand) LIKE LOWER(CONCAT('%', :q, '%')))")
        List<ClothingItem> searchByUserIdAndQuery(@Param("userId") Long userId,
                        @Param("q") String query);

        long countByUserIdAndCategory(Long userId, ClothingItem.Category category);
}
