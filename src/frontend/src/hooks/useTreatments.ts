import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EntityId, Treatment, TreatmentInput } from "../types";

export function useTreatments(patientId: EntityId | null = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Treatment[]>({
    queryKey: ["treatments", patientId?.toString() ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTreatments(patientId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTreatment(id: EntityId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Treatment | null>({
    queryKey: ["treatment", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getTreatment(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateTreatment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TreatmentInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createTreatment(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["treatments"] });
    },
  });
}

export function useUpdateTreatment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: EntityId; input: TreatmentInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTreatment(id, input);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["treatments"] });
      qc.invalidateQueries({ queryKey: ["treatment", id.toString()] });
    },
  });
}

export function useDeleteTreatment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: EntityId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteTreatment(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["treatments"] });
    },
  });
}
