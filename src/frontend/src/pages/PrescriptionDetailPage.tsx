import { createActor } from "@/backend";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/shared/Button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Patient, Prescription, StaffMember } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Pill, Printer } from "lucide-react";

interface PrescriptionDetailPageProps {
  prescriptionId: bigint;
  onBack?: () => void;
}

export default function PrescriptionDetailPage({
  prescriptionId,
  onBack,
}: PrescriptionDetailPageProps) {
  const { actor, isFetching } = useActor(createActor);

  const { data: prescription, isLoading } = useQuery<Prescription | null>({
    queryKey: ["prescription", prescriptionId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPrescription(prescriptionId);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPatients();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: staffList = [] } = useQuery<StaffMember[]>({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStaffMembers();
    },
    enabled: !!actor && !isFetching,
  });

  const patient = patients.find(
    (p) => p.id.toString() === prescription?.patient_id.toString(),
  );
  const doctor = staffList.find(
    (s) => s.id.toString() === prescription?.dentist_id.toString(),
  );

  const formatDate = (ts: bigint) => {
    try {
      return format(new Date(Number(ts / 1_000_000n)), "dd MMMM yyyy");
    } catch {
      return "—";
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        data-ocid="prescription-detail.loading_state"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Prescription not found.
      </div>
    );
  }

  return (
    <>
      {/* Screen view */}
      <div className="space-y-6 p-6 print:hidden">
        <PageHeader
          title="Prescription Detail"
          breadcrumbs={[
            { label: "Prescriptions", onClick: onBack },
            { label: `Rx #${prescription.id}` },
          ]}
          actions={
            <div className="flex items-center gap-2">
              {onBack && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  data-ocid="prescription-detail.back_button"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                onClick={() => window.print()}
                data-ocid="prescription-detail.print_button"
              >
                <Printer className="h-4 w-4" />
                Print Prescription
              </Button>
            </div>
          }
        />

        {/* Prescription header card */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="h-10 w-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
              <Pill className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-foreground">
                Prescription #{prescription.id.toString()}
              </h2>
              <p className="text-xs text-muted-foreground">
                {formatDate(prescription.created_at)} ·{" "}
                <span
                  className={
                    prescription.is_active ? "text-success" : "text-destructive"
                  }
                >
                  {prescription.is_active ? "Active" : "Deactivated"}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Patient
              </p>
              <p className="text-sm font-medium text-foreground">
                {patient
                  ? `${patient.first_name} ${patient.last_name}`
                  : `#${prescription.patient_id}`}
              </p>
              {patient && (
                <p className="text-xs text-muted-foreground">{patient.phone}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Dentist
              </p>
              <p className="text-sm font-medium text-accent">
                {doctor ? doctor.name : `Dr. #${prescription.dentist_id}`}
              </p>
              {doctor && (
                <p className="text-xs text-muted-foreground">
                  {doctor.qualification || doctor.role}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Date
              </p>
              <p className="text-sm font-medium text-foreground">
                {formatDate(prescription.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Medications table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              Medications ({prescription.medications.length})
            </h3>
          </div>
          <div className="overflow-auto" data-ocid="prescription-detail.table">
            <table className="w-full text-sm">
              <thead className="bg-muted/20">
                <tr>
                  {[
                    "#",
                    "Medication",
                    "Dosage",
                    "Frequency",
                    "Duration",
                    "Notes",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prescription.medications.map((med, i) => (
                  <tr
                    key={`${med.name}-${i}`}
                    className="border-t border-border/50 hover:bg-muted/10 transition-colors"
                    data-ocid={`prescription-detail.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs tabular-nums">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {med.name}
                    </td>
                    <td className="px-4 py-3 text-foreground">{med.dosage}</td>
                    <td className="px-4 py-3 text-foreground">
                      {med.frequency}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {med.duration}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {med.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Print-only layout */}
      <div className="hidden print:block p-8 bg-white text-black font-body">
        {/* Clinic header */}
        <div className="border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold font-display">DentaCare Pro</h1>
          <p className="text-sm text-gray-600">
            Multi-Clinic Dental Management
          </p>
        </div>

        {/* Prescription title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold uppercase tracking-widest">
            Prescription
          </h2>
          <p className="text-sm text-gray-500">
            Rx #{prescription.id.toString()} ·{" "}
            {formatDate(prescription.created_at)}
          </p>
        </div>

        {/* Patient & Doctor info */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Patient
            </p>
            <p className="font-semibold">
              {patient
                ? `${patient.first_name} ${patient.last_name}`
                : `Patient #${prescription.patient_id}`}
            </p>
            {patient && (
              <>
                <p className="text-sm text-gray-600">{patient.phone}</p>
                <p className="text-sm text-gray-600">{patient.address}</p>
              </>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Prescribed By
            </p>
            <p className="font-semibold">
              {doctor ? doctor.name : `Dr. #${prescription.dentist_id}`}
            </p>
            {doctor && (
              <p className="text-sm text-gray-600">{doctor.qualification}</p>
            )}
          </div>
        </div>

        {/* Medications */}
        <table className="w-full border-collapse border border-gray-300 text-sm mb-8">
          <thead>
            <tr className="bg-gray-100">
              {[
                "#",
                "Medication",
                "Dosage",
                "Frequency",
                "Duration",
                "Notes",
              ].map((h) => (
                <th
                  key={h}
                  className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prescription.medications.map((med, i) => (
              <tr key={`print-${med.name}-${i}`}>
                <td className="border border-gray-300 px-3 py-2">{i + 1}</td>
                <td className="border border-gray-300 px-3 py-2 font-medium">
                  {med.name}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {med.dosage}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {med.frequency}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {med.duration}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {med.notes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signature line */}
        <div className="flex justify-end mt-12">
          <div className="text-center">
            <div className="border-t border-black w-48 pt-2">
              <p className="font-semibold">
                {doctor ? doctor.name : "Doctor's Signature"}
              </p>
              {doctor && (
                <p className="text-xs text-gray-500">{doctor.qualification}</p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-400 text-center">
          This is a computer-generated prescription. Valid only with doctor's
          seal/signature.
        </p>
      </div>
    </>
  );
}
