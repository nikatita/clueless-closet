import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { itemsApi } from '../api/items'

export function useItems(filters = {}) {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: () => itemsApi.getAll(filters),
  })
}

export function useItem(id) {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => itemsApi.getOne(id),
    enabled: !!id,
  })
}

export function useCreateItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemData, imageFile }) => itemsApi.create(itemData, imageFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })
}

export function useUpdateItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, itemData }) => itemsApi.update(id, itemData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['items', id] })
    },
  })
}

export function useDeleteItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => itemsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })
}
