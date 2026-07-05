// Utility helpers

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function getStatusColor(status) {
  const map = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', border: 'border-gray-200' },
    with_nurse: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', border: 'border-purple-200' },
    submitted_to_supervisor: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', border: 'border-blue-200' },
    returned: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
    submitted_again: { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', border: 'border-indigo-200' },
    with_supervisor: { bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500', border: 'border-sky-200' },
    submitted_to_admin: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', border: 'border-blue-200' },
    approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
    closed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', border: 'border-slate-200' },
  };
  return map[status] || map.draft;
}

export function getRiskColor(risk) {
  const map = {
    low: { bg: 'bg-green-100', text: 'text-green-700' },
    moderate: { bg: 'bg-amber-100', text: 'text-amber-700' },
    high: { bg: 'bg-rose-100', text: 'text-rose-700' },
  };
  return map[risk] || map.low;
}

export function canEdit(status) {
  return status === 'draft' || status === 'returned' || status === 'with_nurse';
}

export function canEditByRole(status, role) {
  if (role === 'nurse') return status === 'draft' || status === 'with_nurse' || status === 'returned';
  if (role === 'supervisor') return status === 'submitted_to_supervisor' || status === 'with_supervisor';
  if (role === 'admin') return status === 'submitted_to_admin';
  return false;
}

export function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── localStorage Persistence Helpers ──────────────────────────

const STORAGE_KEY = 'sankalp_patients';

export function loadPatients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePatients(patients) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  } catch {}
}

export function getPatientById(id) {
  const all = loadPatients();
  return all.find(p => p.id === id) || null;
}

export function upsertPatient(patient) {
  const all = loadPatients();
  const idx = all.findIndex(p => p.id === patient.id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...patient, updatedAt: new Date().toISOString() };
  } else {
    all.push({ ...patient, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  savePatients(all);
  return patient;
}

export function getAssessmentData(patientId) {
  try {
    const raw = localStorage.getItem(`sankalp_assessment_${patientId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAssessmentData(patientId, data) {
  try {
    localStorage.setItem(`sankalp_assessment_${patientId}`, JSON.stringify(data));
  } catch {}
}

export function generatePatientId() {
  const year = new Date().getFullYear();
  const all = loadPatients();
  const facilityCode = 'CHC';
  const count = all.filter(p => p.patient_id && p.patient_id.includes(`SANKALP-${year}`)).length + 1;
  return `SANKALP-${year}-${facilityCode}-${String(count).padStart(4, '0')}`;
}
