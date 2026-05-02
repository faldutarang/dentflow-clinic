import { n as useActor, p as useQuery, o as useQueryClient, q as createActor } from "./index-CRusxQeF.js";
import { u as useMutation } from "./useMutation-C_my6RdQ.js";
function useInvoices(patientId = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["invoices", (patientId == null ? void 0 : patientId.toString()) ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInvoices(patientId);
    },
    enabled: !!actor && !isFetching
  });
}
function useInvoice(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["invoice", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getInvoice(id);
    },
    enabled: !!actor && !isFetching && !!id
  });
}
function useCreateInvoice() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.createInvoice(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    }
  });
}
function useRecordPayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payment }) => {
      if (!actor) throw new Error("Not connected");
      return actor.recordPayment(id, payment);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice", id.toString()] });
    }
  });
}
function useCancelInvoice() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelInvoice(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    }
  });
}
export {
  useCreateInvoice as a,
  useCancelInvoice as b,
  useInvoice as c,
  useRecordPayment as d,
  useInvoices as u
};
