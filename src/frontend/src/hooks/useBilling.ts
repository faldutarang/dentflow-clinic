import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EntityId, Invoice, InvoiceInput, Payment } from "../types";

export function useInvoices(patientId: EntityId | null = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Invoice[]>({
    queryKey: ["invoices", patientId?.toString() ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInvoices(patientId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInvoice(id: EntityId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Invoice | null>({
    queryKey: ["invoice", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getInvoice(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateInvoice() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: InvoiceInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createInvoice(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useRecordPayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payment }: { id: EntityId; payment: Payment }) => {
      if (!actor) throw new Error("Not connected");
      return actor.recordPayment(id, payment);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice", id.toString()] });
    },
  });
}

export function useCancelInvoice() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: EntityId) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelInvoice(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
