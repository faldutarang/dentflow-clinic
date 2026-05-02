import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  EntityId,
  LabOrder,
  LabOrderInput,
  LabOrderStatus,
} from "../types";

export function useLabOrders(patientId: EntityId | null = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LabOrder[]>({
    queryKey: ["labOrders", patientId?.toString() ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listLabOrders(patientId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLabOrder(id: EntityId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LabOrder | null>({
    queryKey: ["labOrder", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getLabOrder(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateLabOrder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LabOrderInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createLabOrder(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["labOrders"] });
    },
  });
}

export function useUpdateLabOrderStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      completedDate,
    }: {
      id: EntityId;
      status: LabOrderStatus;
      completedDate: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateLabOrderStatus(id, status, completedDate);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["labOrders"] });
      qc.invalidateQueries({ queryKey: ["labOrder", id.toString()] });
    },
  });
}

export function useDeleteLabOrder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: EntityId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteLabOrder(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["labOrders"] });
    },
  });
}
