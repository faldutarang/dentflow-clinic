import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Attendance,
  AttendanceStatus,
  EntityId,
  StaffInput,
  StaffMember,
} from "../types";

export function useStaffMembers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StaffMember[]>({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStaffMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStaffMember(id: EntityId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StaffMember | null>({
    queryKey: ["staff", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getStaffMember(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: StaffInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createStaffMember(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useUpdateStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: EntityId; input: StaffInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateStaffMember(id, input);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: ["staff", id.toString()] });
    },
  });
}

export function useDeactivateStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: EntityId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deactivateStaffMember(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useAttendance(
  staffId: EntityId | null = null,
  fromDate: string | null = null,
  toDate: string | null = null,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Attendance[]>({
    queryKey: ["attendance", staffId?.toString(), fromDate, toDate],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAttendance(staffId, fromDate, toDate);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordAttendance() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      staffId: EntityId;
      date: string;
      checkIn: bigint | null;
      checkOut: bigint | null;
      status: AttendanceStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.recordAttendance(
        params.staffId,
        params.date,
        params.checkIn,
        params.checkOut,
        params.status,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
