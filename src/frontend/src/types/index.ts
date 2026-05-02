// Re-export all backend types for convenient imports throughout the app
export type {
  Patient,
  PatientInput,
  PatientId,
  Treatment,
  TreatmentInput,
  TreatmentId,
  ToothChart,
  ToothEntry,
  ToothProcedure,
  Invoice,
  InvoiceInput,
  InvoiceItem,
  InvoiceId,
  Payment,
  InventoryItem,
  InventoryItemInput,
  ItemId,
  StaffMember,
  StaffInput,
  StaffId,
  Attendance,
  Prescription,
  PrescriptionInput,
  PrescriptionId,
  LabOrder,
  LabOrderInput,
  LabOrderId,
  Document,
  Medication,
  EntityId,
  Timestamp,
  ClinicId,
  DentistId,
} from "../backend";

export {
  AttendanceStatus,
  BloodGroup,
  Gender,
  InvoiceStatus,
  LabOrderStatus,
  PaymentMethod,
  ProcedureStatus,
  StaffRole,
  ToothStatus,
  TreatmentStatus,
  UserRole,
} from "../backend";

// App-level types
export type DentalRole = "admin" | "doctor" | "receptionist";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: DentalRole[];
}
