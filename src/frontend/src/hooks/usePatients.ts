import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EntityId, Patient, PatientInput } from "../types";

export function usePatients() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPatients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePatient(id: EntityId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Patient | null>({
    queryKey: ["patient", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getPatient(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSearchPatients(query: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Patient[]>({
    queryKey: ["patients", "search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchPatients(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useCreatePatient() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PatientInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPatient(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useUpdatePatient() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: EntityId; input: PatientInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePatient(id, input);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["patient", id.toString()] });
    },
  });
}

export function useDeletePatient() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: EntityId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePatient(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
