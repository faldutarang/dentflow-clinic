import { n as useActor, p as useQuery, o as useQueryClient, q as createActor } from "./index-CRusxQeF.js";
import { u as useMutation } from "./useMutation-C_my6RdQ.js";
function usePatients() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPatients();
    },
    enabled: !!actor && !isFetching
  });
}
function usePatient(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["patient", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getPatient(id);
    },
    enabled: !!actor && !isFetching && !!id
  });
}
function useSearchPatients(query) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["patients", "search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchPatients(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0
  });
}
function useCreatePatient() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPatient(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] });
    }
  });
}
function useUpdatePatient() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePatient(id, input);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["patient", id.toString()] });
    }
  });
}
export {
  useSearchPatients as a,
  usePatient as b,
  useCreatePatient as c,
  useUpdatePatient as d,
  usePatients as u
};
