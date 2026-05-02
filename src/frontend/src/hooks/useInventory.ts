import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EntityId, InventoryItem, InventoryItemInput } from "../types";

export function useInventoryItems() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InventoryItem[]>({
    queryKey: ["inventory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInventoryItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLowStockAlerts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InventoryItem[]>({
    queryKey: ["inventory", "low-stock"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLowStockAlerts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useExpiryAlerts(daysAhead = 30) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InventoryItem[]>({
    queryKey: ["inventory", "expiry", daysAhead],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExpiryAlerts(BigInt(daysAhead));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateInventoryItem() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: InventoryItemInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createInventoryItem(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useUpdateInventoryItem() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: EntityId; input: InventoryItemInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateInventoryItem(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useAdjustStock() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, delta }: { id: EntityId; delta: number }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adjustInventoryStock(id, delta);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useDeleteInventoryItem() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: EntityId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteInventoryItem(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}
