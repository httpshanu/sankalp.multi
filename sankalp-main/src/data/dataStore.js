// Centralized localStorage data manager for SANKALP
import { MOCK_FACILITIES, MOCK_PATIENTS, MOCK_USERS } from './mockData';

const KEYS = {
  patients: 'sankalp_patients_v2',
  babies: 'sankalp_babies',
  followups: 'sankalp_followups',
  counselling: 'sankalp_counselling',
  remarks: 'sankalp_remarks',
  audit: 'sankalp_audit',
  assessments: 'sankalp_assessments',
  notifications: 'sankalp_notifications',
  users: 'sankalp_users',
  facilities: 'sankalp_facilities',
};

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

function loadObj(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveObj(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export function initializeDemoData() {
  try {
    if (load(KEYS.patients).length > 0) return;

    const reviewPatient = {
      id: 'QA-2026-0001',
      patient_id: 'QA-2026-0001',
      status: 'submitted_to_admin',
      supervisor_id: 'sup1',
      supervisor_name: 'Dr. Arpita Sharma',
      nurse_id: 'nur1',
      nurse_name: 'Nurse Kavita Devi',
      facility_name: 'CHC-Bhadrabad',
      district: 'Haridwar',
      block_name: 'Bhadrabad',
      facility_type: 'public',
      date_of_admission: '2026-07-05',
      created_at: '2026-07-05T08:30:00.000Z',
      updated_at: '2026-07-05T09:00:00.000Z',
      submitted_to_admin_at: '2026-07-05T09:00:00.000Z',
      mother_name: 'Automation Test Mother',
      father_name: 'Automation Test Father',
      mother_mobile: '9876543210',
      alternative_mobile: '9876543211',
      verified_mobile: 'motherNumber',
      contact_verification_status: 'verified',
      village: 'Test Village',
      rural_urban: 'rural',
      asha_name: 'Test ASHA',
      asha_mobile: '9812345678',
      anm_name: 'Test ANM',
      anm_mobile: '9812345679',
      assessor_name: 'Nurse Kavita Devi',
      mother_age: 26,
      gravida: 2,
      para: 1,
      lmp: '2025-10-01',
      hrp_status: 'no',
      registration_remarks: 'Seeded QA case ready for admin review.',
      baby_count: 1,
      handover_status: 'submitted_to_admin',
    };

    save(KEYS.patients, [reviewPatient, ...MOCK_PATIENTS]);
    save(KEYS.babies, [{
      id: 'QA-2026-0001_B1',
      patient_id: 'QA-2026-0001',
      baby_id: 'SANKALP-2026-CHCBH-0001-B1',
      baby_number: 1,
      gender: 'female',
      uhid: 'QA-UHID-0001',
      gestational_age: 38,
      birth_weight: 2800,
      outcome_of_delivery: 'live_birth',
      baby_condition: 'normal',
      baby_location: 'with_mother',
      baby_classification: 'Full Term + Normal Birth Weight',
    }]);
    save(KEYS.users, MOCK_USERS);
    save(KEYS.facilities, MOCK_FACILITIES);
  } catch {}
}

// ── Notifications ───────────────────────────────────────────────
export function getNotificationsByUser(userId) {
  return load(KEYS.notifications).filter(n => n.user_id === userId);
}

export function addNotification(notification) {
  const all = load(KEYS.notifications);
  all.push({ ...notification, created_at: new Date().toISOString(), read: false });
  save(KEYS.notifications, all);
}

export function markNotificationRead(notificationId) {
  const all = load(KEYS.notifications);
  const idx = all.findIndex(n => n.id === notificationId);
  if (idx >= 0) {
    all[idx].read = true;
    save(KEYS.notifications, all);
  }
}

export function markAllNotificationsRead(userId) {
  const all = load(KEYS.notifications);
  all.forEach(n => { if (n.user_id === userId) n.read = true; });
  save(KEYS.notifications, all);
}

export function getUnreadNotificationCount(userId) {
  return load(KEYS.notifications).filter(n => n.user_id === userId && !n.read).length;
}

// ── Patients ──────────────────────────────────────────────────
export function getAllPatients() { return load(KEYS.patients); }

export function getPatientById(id) {
  return getAllPatients().find(p => p.id === id) || null;
}

export function getPatientsBySupervisor(supervisorId) {
  return getAllPatients().filter(p => p.supervisor_id === supervisorId);
}

export function getPatientsByCounsellor(counsellorId) {
  return getAllPatients().filter(p => p.counsellor_id === counsellorId);
}

export function getPatientsByNurse(nurseId) {
  return getAllPatients().filter(p => p.nurse_id === nurseId);
}

export function upsertPatient(patient) {
  const all = getAllPatients();
  const idx = all.findIndex(p => p.id === patient.id);
  const now = new Date().toISOString();
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...patient, updated_at: now };
  } else {
    all.push({ ...patient, created_at: now, updated_at: now });
  }
  save(KEYS.patients, all);
  return patient;
}

export function updatePatientStatus(id, status, userId, userName, userRole) {
  const all = getAllPatients();
  const idx = all.findIndex(p => p.id === id);
  if (idx >= 0) {
    const old = all[idx].status;
    all[idx].status = status;
    all[idx].updated_at = new Date().toISOString();
    if (status === 'submitted_to_supervisor') all[idx].submitted_at = new Date().toISOString();
    if (status === 'submitted_again') all[idx].submitted_again_at = new Date().toISOString();
    if (status === 'submitted_to_admin') all[idx].submitted_to_admin_at = new Date().toISOString();
    if (status === 'approved') all[idx].approved_at = new Date().toISOString();
    if (status === 'closed') all[idx].closed_at = new Date().toISOString();
    save(KEYS.patients, all);
    addAuditLog({
      user_id: userId, user_name: userName, role: userRole,
      action: `status_changed_${status}`, record_id: id,
      old_value: old, new_value: status,
    });
  }
}

// ── Babies ────────────────────────────────────────────────────
export function getBabiesByPatient(patientId) {
  return load(KEYS.babies).filter(b => b.patient_id === patientId);
}

export function getAllBabies() { return load(KEYS.babies); }

export function upsertBaby(baby) {
  const all = load(KEYS.babies);
  const idx = all.findIndex(b => b.id === baby.id);
  const now = new Date().toISOString();
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...baby, updated_at: now };
  } else {
    all.push({ ...baby, created_at: now, updated_at: now });
  }
  save(KEYS.babies, all);
  return baby;
}

// ── Followups ─────────────────────────────────────────────────
export function getFollowupsByPatient(patientId) {
  return load(KEYS.followups).filter(f => f.patient_id === patientId);
}

export function getFollowupsBySupervisor(supervisorId) {
  const patients = getPatientsBySupervisor(supervisorId);
  const patientIds = new Set(patients.map(p => p.id));
  return load(KEYS.followups).filter(f => patientIds.has(f.patient_id));
}

export function getFollowupsByNurse(nurseId) {
  const patients = getPatientsByNurse(nurseId);
  const patientIds = new Set(patients.map(p => p.id));
  return load(KEYS.followups).filter(f => patientIds.has(f.patient_id));
}

export function upsertFollowup(followup) {
  const all = load(KEYS.followups);
  const idx = all.findIndex(f => f.id === followup.id);
  const now = new Date().toISOString();
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...followup, updated_at: now };
  } else {
    all.push({ ...followup, created_at: now, updated_at: now });
  }
  save(KEYS.followups, all);
  return followup;
}

export function generateFollowups(patientId, dischargeDate) {
  const days = [1, 7, 14, 21, 29];
  const baseDate = new Date(dischargeDate);
  const followups = days.map((day, i) => {
    const due = new Date(baseDate);
    due.setDate(due.getDate() + day);
    return {
      id: `${patientId}_FU${day}`,
      patient_id: patientId,
      followup_day: day,
      due_date: due.toISOString().split('T')[0],
      call_status: 'pending',
      call_attempt_count: 0,
      call_datetime: null,
      called_number: null,
      breastfeeding_status: null,
      feeding_pattern: null,
      kmc_status: null,
      danger_signs_present: null,
      referral_required: null,
      referral_done: null,
      remarks: '',
      completed_by: null,
      completed_at: null,
      // Sepsis screening fields
      sepsis_signs: {
        all_limbs_limp: false,
        feeding_less_or_stopped: false,
        cry_weak_or_stopped: false,
        distended_abdomen_or_vomiting: false,
        cold_to_touch_or_fever: false,
        chest_indrawing: false,
        respiratory_rate_above_60: false,
        pus_on_umbilicus: false,
      },
      sepsis_signs_answered: false,
      positive_danger_sign_count: 0,
      high_risk_alert: false,
      immediate_referral_required: false,
      referral_advised: false,
      baby_referred: false,
      referral_facility: '',
      referral_date_time: '',
      action_taken: '',
      current_baby_status: '',
      supervisor_note: '',
      // Supervisor review
      supervisor_review_status: 'pending',
      supervisor_note: '',
      supervisor_work_assessment: '',
      supervisor_remarks: '',
      reviewed_by: '',
      review_date_time: '',
      // Vaccination (Day 29 only)
      dpt1_received: false,
      dpt1_date: '',
      dpt1_age_days: '',
      manual_age_correction: '',
      anm_name: '',
      anm_observations: '',
      anm_signature_url: '',
    };
  });
  followups.forEach(f => upsertFollowup(f));
  return followups;
}

// ── Counselling Sections ──────────────────────────────────────
export function getCounsellingData(patientId) {
  return loadObj(`${KEYS.counselling}_${patientId}`);
}

export function saveCounsellingData(patientId, data) {
  saveObj(`${KEYS.counselling}_${patientId}`, data);
}

// ── Assessment Data (legacy compat) ───────────────────────────
export function getAssessmentData(patientId) {
  return loadObj(`${KEYS.assessments}_${patientId}`);
}

export function saveAssessmentData(patientId, data) {
  saveObj(`${KEYS.assessments}_${patientId}`, data);
}

// ── Remarks ───────────────────────────────────────────────────
export function getRemarksByPatient(patientId) {
  return load(KEYS.remarks).filter(r => r.patient_id === patientId);
}

export function addRemark(remark) {
  const all = load(KEYS.remarks);
  all.push({ ...remark, created_at: new Date().toISOString() });
  save(KEYS.remarks, all);
}

// ── Audit Logs ────────────────────────────────────────────────
export function addAuditLog(log) {
  const all = load(KEYS.audit);
  all.push({ ...log, timestamp: new Date().toISOString() });
  save(KEYS.audit, all);
}

export function getAuditLogs(filters = {}) {
  let logs = load(KEYS.audit);
  if (filters.record_id) logs = logs.filter(l => l.record_id === filters.record_id);
  if (filters.user_id) logs = logs.filter(l => l.user_id === filters.user_id);
  if (filters.action) logs = logs.filter(l => l.action === filters.action);
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ── Baby ID Generator ─────────────────────────────────────────
export function generateBabyId(patientId, babyNumber, facilityCode) {
  const year = new Date().getFullYear();
  const patientNum = patientId.replace(/[^0-9]/g, '').slice(-4);
  return `SANKALP-${year}-${facilityCode}-${patientNum}-B${babyNumber}`;
}

// ── Baby Classification ───────────────────────────────────────
export function classifyBaby(gestationalAge, birthWeight) {
  const ga = Number(gestationalAge);
  const bw = Number(birthWeight);
  if (isNaN(ga) || isNaN(bw)) return null;
  const isPreterm = ga < 37;
  const isLBW = bw < 2500;
  if (isPreterm && isLBW) return 'Preterm + Low Birth Weight';
  if (isPreterm && !isLBW) return 'Preterm + Normal Birth Weight';
  if (!isPreterm && isLBW) return 'Full Term + Low Birth Weight';
  return 'Full Term + Normal Birth Weight';
}

// ── KMC Eligibility ───────────────────────────────────────────
export function isKmcEligible(outcome, birthWeight, gestationalAge, babyCondition) {
  if (outcome === 'still_birth') return false;
  const bw = Number(birthWeight);
  const ga = Number(gestationalAge);
  if (bw < 2500 || ga < 37 || babyCondition === 'sick') return true;
  return false;
}

// ── Follow-up Date Calculator ─────────────────────────────────
export function calculateFollowupDates(baseDate) {
  const days = [1, 7, 14, 21, 29];
  const base = new Date(baseDate);
  return days.map(day => {
    const d = new Date(base);
    d.setDate(d.getDate() + day);
    return { day, date: d.toISOString().split('T')[0] };
  });
}

// ── Call Status Colors ────────────────────────────────────────
export function getCallStatusColor(status) {
  const map = {
    connected: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Connected' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Pending' },
    due_today: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Due Today' },
    not_yet_called: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Not Yet Called' },
    invalid_number: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Invalid Number' },
    wrong_number: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Wrong Number' },
    not_connected: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Not Connected' },
    switched_off: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Switched Off' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Completed' },
    overdue: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Overdue' },
  };
  return map[status] || map.pending;
}

// ── Record Status Colors ──────────────────────────────────────
export function getRecordStatusColor(status) {
  const map = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    submitted: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    returned: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    submitted_again: { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
    approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    closed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  };
  return map[status] || map.draft;
}

// ── Edit Permission ───────────────────────────────────────────
export function canEditRecord(status, userRole) {
  if (status === 'approved' || status === 'closed') return false;
  if (userRole === 'nurse') return status === 'draft' || status === 'with_nurse' || status === 'returned';
  if (userRole === 'supervisor') return status === 'submitted_to_supervisor' || status === 'with_supervisor' || status === 'returned';
  if (userRole === 'admin') return status === 'submitted_to_admin';
  if (status === 'draft' || status === 'returned') return true;
  return false;
}

// ── Handover Status ───────────────────────────────────────────
export const HANDOVER_STATUSES = [
  'not_started',
  'in_progress_by_nurse',
  'handed_over_to_supervisor',
  'in_progress_by_supervisor',
  'submitted_to_admin',
  'returned',
  'approved',
  'closed',
];

// ── Districts of Uttarakhand ──────────────────────────────────
export const UTTARAKHAND_DISTRICTS = [
  'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun',
  'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh',
  'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi',
];

// ── Blocks of Haridwar ────────────────────────────────────────
export const HARIDWAR_BLOCKS = [
  'Bhadrabad', 'Jwalapur', 'Laksar', 'Khanpur', 'Roorkee',
  'Manglaur', 'Nagla', 'Shivalik Nagar', 'Khalpur', 'Narsan',
];

// ── Facility List ─────────────────────────────────────────────
export const FACILITY_LIST = [
  { code: 'DHCRW', name: 'DH-CRW' },
  { code: 'CHCBH', name: 'CHC-Bhadrabad' },
  { code: 'CHCJW', name: 'CHC-Jwalapur' },
  { code: 'PHCLD', name: 'PHC-Laaldhan' },
  { code: 'SDHRO', name: 'SDH-Roorkee' },
  { code: 'CHCLK', name: 'CHC-Laksar' },
  { code: 'CHCKP', name: 'CHC-Khanpur' },
  { code: 'MCNNW', name: 'MCN New Wing' },
  { code: 'MCNW1', name: 'MCN Wing-1' },
  { code: 'OTHER', name: 'Others' },
];

// ── Facility Code Lookup ──────────────────────────────────────
export function getFacilityCode(facilityName) {
  const f = FACILITY_LIST.find(fl => fl.name === facilityName);
  return f ? f.code : 'OTH';
}

// ── Patient Count ─────────────────────────────────────────────
export function getNextPatientNumber() {
  const year = new Date().getFullYear();
  const all = getAllPatients();
  const yearPatients = all.filter(p => p.patient_id && p.patient_id.includes(String(year)));
  return yearPatients.length + 1;
}

// ── Stats Helpers ─────────────────────────────────────────────
export function getDashboardStats() {
  const patients = getAllPatients();
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = patients.filter(p => p.created_at && p.created_at.startsWith(today));

  return {
    total: patients.length,
    today: todayEntries.length,
    pending_review: patients.filter(p => p.status === 'submitted_to_admin').length,
    with_supervisor: patients.filter(p => p.status === 'with_supervisor' || p.status === 'submitted_to_supervisor').length,
    with_nurse: patients.filter(p => p.status === 'draft' || p.status === 'with_nurse').length,
    approved: patients.filter(p => p.status === 'approved').length,
    returned: patients.filter(p => p.status === 'returned').length,
    closed: patients.filter(p => p.status === 'closed').length,
    drafts: patients.filter(p => p.status === 'draft').length,
  };
}

export function getSupervisorStats(supervisorId) {
  const patients = getPatientsBySupervisor(supervisorId);
  return {
    total: patients.length,
    pending: patients.filter(p => p.status === 'submitted_to_supervisor').length,
    in_progress: patients.filter(p => p.status === 'with_supervisor').length,
    submitted_to_admin: patients.filter(p => p.status === 'submitted_to_admin').length,
    returned: patients.filter(p => p.status === 'returned').length,
    approved: patients.filter(p => p.status === 'approved').length,
    closed: patients.filter(p => p.status === 'closed').length,
  };
}

export function getNurseStats(nurseId) {
  const patients = getPatientsByNurse(nurseId);
  return {
    total: patients.length,
    drafts: patients.filter(p => p.status === 'draft' || p.status === 'with_nurse').length,
    handed_over: patients.filter(p => p.status === 'submitted_to_supervisor').length,
    returned: patients.filter(p => p.status === 'returned').length,
  };
}

export function getSepsisStats() {
  const patients = getAllPatients();
  const today = new Date().toISOString().split('T')[0];
  const visits = patients.flatMap(p => p.sepsis_visits || p.sepsisVisits || []);

  return {
    totalVisits: visits.length,
    dueToday: visits.filter(v => !v.visitCompleted && (v.expectedDate || v.expected_date) === today).length,
    overdue: visits.filter(v => !v.visitCompleted && (v.expectedDate || v.expected_date) < today).length,
    highRisk: visits.filter(v => Object.values(v.sepsisSigns || v.sepsis_signs || {}).some(Boolean)).length,
  };
}

// ── Users Management ────────────────────────────────────────────
export function getAllUsers() {
  return load(KEYS.users);
}

export function upsertUser(user) {
  const all = getAllUsers();
  const idx = all.findIndex(u => u.id === user.id);
  const now = new Date().toISOString();
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...user, updated_at: now };
  } else {
    all.push({ ...user, created_at: now, updated_at: now });
  }
  save(KEYS.users, all);
  return user;
}

export function deleteUser(userId) {
  const all = getAllUsers();
  const filtered = all.filter(u => u.id !== userId);
  save(KEYS.users, filtered);
}

// ── Facilities Management ────────────────────────────────────────
export function getAllFacilities() {
  return load(KEYS.facilities);
}

export function upsertFacility(facility) {
  const all = getAllFacilities();
  const idx = all.findIndex(f => f.id === facility.id);
  const now = new Date().toISOString();
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...facility, updated_at: now };
  } else {
    all.push({ ...facility, created_at: now, updated_at: now });
  }
  save(KEYS.facilities, all);
  return facility;
}

export function deleteFacility(facilityId) {
  const all = getAllFacilities();
  const filtered = all.filter(f => f.id !== facilityId);
  save(KEYS.facilities, filtered);
}
