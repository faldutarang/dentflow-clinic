import { n as useActor, p as useQuery, o as useQueryClient, q as createActor } from "./index-CRusxQeF.js";
import { u as useMutation } from "./useMutation-C_my6RdQ.js";
function useInventoryItems() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInventoryItems();
    },
    enabled: !!actor && !isFetching
  });
}
function useLowStockAlerts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLowStockAlerts();
    },
    enabled: !!actor && !isFetching
  });
}
function useExpiryAlerts(daysAhead = 30) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["inventory", "expiry", daysAhead],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExpiryAlerts(BigInt(daysAhead));
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateInventoryItem() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.createInventoryItem(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
    }
  });
}
function useUpdateInventoryItem() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateInventoryItem(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
    }
  });
}
function useAdjustStock() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, delta }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adjustInventoryStock(id, delta);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
    }
  });
}
function useDeleteInventoryItem() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteInventoryItem(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
    }
  });
}
export {
  useExpiryAlerts as a,
  useInventoryItems as b,
  useCreateInventoryItem as c,
  useUpdateInventoryItem as d,
  useAdjustStock as e,
  useDeleteInventoryItem as f,
  useLowStockAlerts as u
};
