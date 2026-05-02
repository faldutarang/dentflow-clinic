import { n as useActor, p as useQuery, q as createActor } from "./index-CRusxQeF.js";
function useLabOrders(patientId = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["labOrders", (patientId == null ? void 0 : patientId.toString()) ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listLabOrders(patientId);
    },
    enabled: !!actor && !isFetching
  });
}
export {
  useLabOrders as u
};
