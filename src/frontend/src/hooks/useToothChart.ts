import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EntityId, ToothChart, ToothEntry } from "../types";

export function useToothChart(patientId: EntityId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ToothChart | null>({
    queryKey: ["toothChart", patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return null;
      return actor.getToothChart(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

export function useUpsertToothChart() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      patientId,
      treatmentId,
      teeth,
    }: {
      patientId: EntityId;
      treatmentId: EntityId | null;
      teeth: ToothEntry[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.upsertToothChart(patientId, treatmentId, teeth);
    },
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: ["toothChart", patientId.toString()] });
    },
  });
}
