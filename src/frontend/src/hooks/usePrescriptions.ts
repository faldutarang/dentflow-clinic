import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EntityId, Prescription, PrescriptionInput } from "../types";

export function usePrescriptions(patientId: EntityId | null = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Prescription[]>({
    queryKey: ["prescriptions", patientId?.toString() ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPrescriptions(patientId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePrescription(id: EntityId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Prescription | null>({
    queryKey: ["prescription", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getPrescription(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreatePrescription() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PrescriptionInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPrescription(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });
}

export function useDeactivatePrescription() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: EntityId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deactivatePrescription(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });
}
