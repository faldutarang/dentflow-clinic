import { n as useActor, p as useQuery, o as useQueryClient, q as createActor } from "./index-CRusxQeF.js";
import { u as useMutation } from "./useMutation-C_my6RdQ.js";
function useTreatments(patientId = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["treatments", (patientId == null ? void 0 : patientId.toString()) ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTreatments(patientId);
    },
    enabled: !!actor && !isFetching
  });
}
function useTreatment(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["treatment", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getTreatment(id);
    },
    enabled: !!actor && !isFetching && !!id
  });
}
function useCreateTreatment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.createTreatment(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["treatments"] });
    }
  });
}
function useUpdateTreatment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTreatment(id, input);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["treatments"] });
      qc.invalidateQueries({ queryKey: ["treatment", id.toString()] });
    }
  });
}
export {
  useCreateTreatment as a,
  useUpdateTreatment as b,
  useTreatment as c,
  useTreatments as u
};
