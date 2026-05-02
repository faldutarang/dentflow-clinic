import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface InvoiceInput {
    patient_id: PatientId;
    items: Array<InvoiceItem>;
}
export type Timestamp = bigint;
export interface ToothProcedure {
    status: ProcedureStatus;
    dentist_id: DentistId;
    notes: string;
    completed_at?: Timestamp;
    procedure_type: string;
    tooth_number: bigint;
}
export interface InventoryItemInput {
    cost_price: number;
    supplier: string;
    name: string;
    unit: string;
    reorder_level: number;
    stock: number;
    expiry_date?: string;
    category: string;
}
export type EntityId = bigint;
export interface Document {
    id: EntityId;
    blob: ExternalBlob;
    mime_type: string;
    clinic_id: ClinicId;
    filename: string;
    owner_id: EntityId;
    uploaded_at: Timestamp;
    uploaded_by: Principal;
    owner_type: string;
}
export type DentistId = bigint;
export interface WorkingHours {
    close_time: string;
    days_open: Array<string>;
    open_time: string;
}
export type PatientId = bigint;
export interface Patient {
    id: PatientId;
    updated_at: Timestamp;
    created_at: Timestamp;
    email: string;
    clinic_id: ClinicId;
    blood_group: BloodGroup;
    address: string;
    gender: Gender;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone: string;
    medical_history: string;
    allergies: Array<string>;
}
export interface InventoryItem {
    id: ItemId;
    updated_at: Timestamp;
    cost_price: number;
    supplier: string;
    name: string;
    unit: string;
    reorder_level: number;
    clinic_id: ClinicId;
    stock: number;
    expiry_date?: string;
    category: string;
}
export interface TreatmentInput {
    patient_id: PatientId;
    title: string;
    procedures: Array<ToothProcedure>;
    dentist_id: DentistId;
    notes: string;
    estimated_cost: number;
}
export interface ToothEntry {
    status: ToothStatus;
    dentist_id: DentistId;
    last_updated: Timestamp;
    procedure_type?: string;
    tooth_number: bigint;
}
export type ItemId = bigint;
export interface ClinicSettings {
    gst_number: string;
    name: string;
    email: string;
    clinic_id: ClinicId;
    address: string;
    working_hours: WorkingHours;
    phone: string;
}
export interface Treatment {
    id: TreatmentId;
    status: TreatmentStatus;
    patient_id: PatientId;
    title: string;
    updated_at: Timestamp;
    procedures: Array<ToothProcedure>;
    dentist_id: DentistId;
    created_at: Timestamp;
    clinic_id: ClinicId;
    notes: string;
    estimated_cost: number;
}
export type PrescriptionId = bigint;
export interface ToothChart {
    id: EntityId;
    patient_id: PatientId;
    teeth: Array<ToothEntry>;
    created_at: Timestamp;
    clinic_id: ClinicId;
    treatment_id?: TreatmentId;
}
export type StaffId = bigint;
export interface PrescriptionInput {
    patient_id: PatientId;
    dentist_id: DentistId;
    medications: Array<Medication>;
    treatment_id?: TreatmentId;
}
export interface InvoiceItem {
    gst_rate: number;
    description: string;
    amount: number;
}
export interface Attendance {
    id: EntityId;
    status: AttendanceStatus;
    date: string;
    staff_id: EntityId;
    clinic_id: ClinicId;
    check_out?: Timestamp;
    check_in?: Timestamp;
}
export interface Payment {
    method: PaymentMethod;
    date: Timestamp;
    reference: string;
    amount: number;
}
export type LabOrderId = bigint;
export type TreatmentId = bigint;
export interface Invoice {
    id: InvoiceId;
    status: InvoiceStatus;
    patient_id: PatientId;
    total: number;
    created_at: Timestamp;
    clinic_id: ClinicId;
    gst_total: number;
    payment_history: Array<Payment>;
    items: Array<InvoiceItem>;
    subtotal: number;
}
export interface LabOrderInput {
    patient_id: PatientId;
    specifications: string;
    lab_name: string;
    cost: number;
    treatment_id?: TreatmentId;
    notes: string;
    due_date: string;
    procedure_type: string;
}
export interface StaffMember {
    id: StaffId;
    hire_date: string;
    license_number: string;
    principal: Principal;
    name: string;
    role: StaffRole;
    email: string;
    clinic_id: ClinicId;
    is_active: boolean;
    phone: string;
    qualification: string;
}
export interface LabOrder {
    id: LabOrderId;
    status: LabOrderStatus;
    patient_id: PatientId;
    specifications: string;
    lab_name: string;
    cost: number;
    created_at: Timestamp;
    clinic_id: ClinicId;
    completed_date?: string;
    treatment_id?: TreatmentId;
    notes: string;
    due_date: string;
    procedure_type: string;
}
export interface PatientInput {
    email: string;
    blood_group: BloodGroup;
    address: string;
    gender: Gender;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone: string;
    medical_history: string;
    allergies: Array<string>;
}
export type ClinicId = bigint;
export type InvoiceId = bigint;
export interface StaffInput {
    hire_date: string;
    license_number: string;
    principal: Principal;
    name: string;
    role: StaffRole;
    email: string;
    phone: string;
    qualification: string;
}
export interface Prescription {
    id: PrescriptionId;
    patient_id: PatientId;
    dentist_id: DentistId;
    created_at: Timestamp;
    clinic_id: ClinicId;
    medications: Array<Medication>;
    treatment_id?: TreatmentId;
    is_active: boolean;
}
export interface Medication {
    duration: string;
    dosage: string;
    name: string;
    notes: string;
    frequency: string;
}
export enum AttendanceStatus {
    halfDay = "halfDay",
    present = "present",
    absent = "absent"
}
export enum BloodGroup {
    abNeg = "abNeg",
    abPos = "abPos",
    aNeg = "aNeg",
    aPos = "aPos",
    bNeg = "bNeg",
    bPos = "bPos",
    oNeg = "oNeg",
    oPos = "oPos",
    unknown_ = "unknown"
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum InvoiceStatus {
    cancelled = "cancelled",
    paid = "paid",
    issued = "issued",
    partiallyPaid = "partiallyPaid",
    draft = "draft"
}
export enum LabOrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum PaymentMethod {
    upi = "upi",
    other = "other",
    card = "card",
    cash = "cash",
    cheque = "cheque",
    netBanking = "netBanking"
}
export enum ProcedureStatus {
    cancelled = "cancelled",
    completed = "completed",
    planned = "planned",
    inProgress = "inProgress"
}
export enum StaffRole {
    admin = "admin",
    doctor = "doctor",
    receptionist = "receptionist"
}
export enum ToothStatus {
    missing = "missing",
    other = "other",
    implant = "implant",
    healthy = "healthy",
    filled = "filled",
    extracted = "extracted",
    decayed = "decayed",
    crowned = "crowned"
}
export enum TreatmentStatus {
    active = "active",
    cancelled = "cancelled",
    completed = "completed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adjustInventoryStock(id: EntityId, delta: number): Promise<InventoryItem | null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelInvoice(id: EntityId): Promise<boolean>;
    createInventoryItem(input: InventoryItemInput): Promise<InventoryItem>;
    createInvoice(input: InvoiceInput): Promise<Invoice>;
    createLabOrder(input: LabOrderInput): Promise<LabOrder>;
    createPatient(input: PatientInput): Promise<Patient>;
    createPrescription(input: PrescriptionInput): Promise<Prescription>;
    createStaffMember(input: StaffInput): Promise<StaffMember>;
    createTreatment(input: TreatmentInput): Promise<Treatment>;
    deactivatePrescription(id: EntityId): Promise<boolean>;
    deactivateStaffMember(id: EntityId): Promise<boolean>;
    deleteDocument(id: EntityId): Promise<boolean>;
    deleteInventoryItem(id: EntityId): Promise<boolean>;
    deleteLabOrder(id: EntityId): Promise<boolean>;
    deletePatient(id: EntityId): Promise<boolean>;
    deletePrescription(id: EntityId): Promise<boolean>;
    deleteTreatment(id: EntityId): Promise<boolean>;
    getAttendanceByDate(staff_id: EntityId, date: string): Promise<Attendance | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClinicSettings(): Promise<ClinicSettings | null>;
    getDocument(id: EntityId): Promise<Document | null>;
    getExpiryAlerts(days_ahead: bigint): Promise<Array<InventoryItem>>;
    getInventoryItem(id: EntityId): Promise<InventoryItem | null>;
    getInvoice(id: EntityId): Promise<Invoice | null>;
    getLabOrder(id: EntityId): Promise<LabOrder | null>;
    getLowStockAlerts(): Promise<Array<InventoryItem>>;
    getPatient(id: EntityId): Promise<Patient | null>;
    getPrescription(id: EntityId): Promise<Prescription | null>;
    getStaffByPrincipal(p: Principal): Promise<StaffMember | null>;
    getStaffMember(id: EntityId): Promise<StaffMember | null>;
    getToothChart(patient_id: EntityId): Promise<ToothChart | null>;
    getTreatment(id: EntityId): Promise<Treatment | null>;
    isCallerAdmin(): Promise<boolean>;
    listAttendance(staff_id: EntityId | null, from_date: string | null, to_date: string | null): Promise<Array<Attendance>>;
    listDocuments(owner_id: EntityId, owner_type: string): Promise<Array<Document>>;
    listInventoryItems(): Promise<Array<InventoryItem>>;
    listInvoices(patient_id: EntityId | null): Promise<Array<Invoice>>;
    listLabOrders(patient_id: EntityId | null): Promise<Array<LabOrder>>;
    listPatients(): Promise<Array<Patient>>;
    listPrescriptions(patient_id: EntityId | null): Promise<Array<Prescription>>;
    listStaffMembers(): Promise<Array<StaffMember>>;
    listTreatments(patient_id: EntityId | null): Promise<Array<Treatment>>;
    recordAttendance(staff_id: EntityId, date: string, check_in: Timestamp | null, check_out: Timestamp | null, status: AttendanceStatus): Promise<Attendance>;
    recordPayment(id: EntityId, payment: Payment): Promise<Invoice | null>;
    searchPatients(q: string): Promise<Array<Patient>>;
    updateClinicSettings(settings: ClinicSettings): Promise<ClinicSettings>;
    updateInventoryItem(id: EntityId, input: InventoryItemInput): Promise<InventoryItem | null>;
    updateInvoice(id: EntityId, input: InvoiceInput): Promise<Invoice | null>;
    updateLabOrderStatus(id: EntityId, status: LabOrderStatus, completed_date: string | null): Promise<LabOrder | null>;
    updatePatient(id: EntityId, input: PatientInput): Promise<Patient | null>;
    updateStaffMember(id: EntityId, input: StaffInput): Promise<StaffMember | null>;
    updateTreatment(id: EntityId, input: TreatmentInput): Promise<Treatment | null>;
    uploadDocument(owner_id: EntityId, owner_type: string, filename: string, mime_type: string, blob: ExternalBlob): Promise<Document>;
    upsertToothChart(patient_id: EntityId, treatment_id: EntityId | null, teeth: Array<ToothEntry>): Promise<ToothChart>;
}
