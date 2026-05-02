import { n as useActor, p as useQuery, o as useQueryClient, q as createActor } from "./index-CRusxQeF.js";
import { u as useMutation } from "./useMutation-C_my6RdQ.js";
function usePrescriptions(patientId = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["prescriptions", (patientId == null ? void 0 : patientId.toString()) ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPrescriptions(patientId);
    },
    enabled: !!actor && !isFetching
  });
}
function useDeactivatePrescription() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deactivatePrescription(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prescriptions"] });
    }
  });
}
export {
  useDeactivatePrescription as a,
  usePrescriptions as u
};
