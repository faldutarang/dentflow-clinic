import { n as useActor, p as useQuery, o as useQueryClient, q as createActor } from "./index-CRusxQeF.js";
import { u as useMutation } from "./useMutation-C_my6RdQ.js";
function useStaffMembers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStaffMembers();
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.createStaffMember(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
    }
  });
}
function useUpdateStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateStaffMember(id, input);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: ["staff", id.toString()] });
    }
  });
}
function useDeactivateStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deactivateStaffMember(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
    }
  });
}
function useRecordAttendance() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Not connected");
      return actor.recordAttendance(
        params.staffId,
        params.date,
        params.checkIn,
        params.checkOut,
        params.status
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
    }
  });
}
export {
  useCreateStaff as a,
  useUpdateStaff as b,
  useDeactivateStaff as c,
  useRecordAttendance as d,
  useStaffMembers as u
};
