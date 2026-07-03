package com.cluelesscloset;
import com.cluelesscloset.ClothingItemDTO;
import com.cluelesscloset.ResourceNotFoundException;
import com.cluelesscloset.UnauthorizedException;
import com.cluelesscloset.ClothingItem;
import com.cluelesscloset.ClothingItemRepository;
import com.cluelesscloset.ClothingItemService;
import com.cluelesscloset.CloudinaryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class ClothingItemServiceTest {

    @Mock
    private ClothingItemRepository repository;
    @Mock
    private CloudinaryService cloudinaryService;
    @InjectMocks
    private ClothingItemService service;

    private ClothingItem sampleItem;

    @BeforeEach
    void setUp() {
        sampleItem = ClothingItem.builder()
                .id(1L)
                .userId(42L)
                .name("White Blazer")
                .category(ClothingItem.Category.OUTERWEAR)
                .color("White")
                .brand("Zara")
                .cvProcessed(false)
                .build();
    }

    @Test
    void getAllItems_returnsOnlyCurrentUsersItems() {
        when(repository.findByUserId(42L)).thenReturn(List.of(sampleItem));

        List<ClothingItemDTO.Response> result = service.getAllItems(42L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("White Blazer");
    }

    @Test
    void getItem_throwsNotFound_whenItemDoesNotExist() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getItem(99L, 42L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getItem_throwsUnauthorized_whenItemOwnedByAnotherUser() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleItem));

        // User 99 tries to access item owned by user 42
        assertThatThrownBy(() -> service.getItem(1L, 99L))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void createItem_savesItemAndReturnsResponse() {
        ClothingItemDTO.Request request = ClothingItemDTO.Request.builder()
                .name("Plaid Skirt")
                .category(ClothingItem.Category.BOTTOM)
                .color("Yellow")
                .build();

        when(repository.save(any(ClothingItem.class))).thenAnswer(inv -> {
            ClothingItem saved = inv.getArgument(0);
            saved = ClothingItem.builder()
                    .id(2L).userId(42L).name(saved.getName())
                    .category(saved.getCategory()).color(saved.getColor())
                    .cvProcessed(false).build();
            return saved;
        });

        ClothingItemDTO.Response response = service.createItem(42L, request, null);

        assertThat(response.getName()).isEqualTo("Plaid Skirt");
        assertThat(response.getCategory()).isEqualTo(ClothingItem.Category.BOTTOM);
        verify(repository, times(1)).save(any());
    }

    @Test
    void deleteItem_deletesWhenOwnerRequests() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleItem));

        service.deleteItem(1L, 42L);

        verify(repository).delete(sampleItem);
    }
}
