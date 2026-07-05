import { useState } from 'react';
import { Phone, PhoneCall, Clock, AlertTriangle, CheckCircle2, Copy, ExternalLink, Monitor, Users as UsersIcon, Bell, X } from 'lucide-react';
import { getCallStatusColor } from '../data/dataStore';
import FollowupCallModal, { SepsisFollowupModal } from './FollowupCallModal';

export default function FollowupTracker({ followups, sepsisVisits, patient }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSepsis, setIsSepsis] = useState(false);

  const handleCopyNumber = (number) => {
    navigator.clipboard.writeText(number);
  };

  // Determine if item is a sepsis visit
  const isSepsisVisit = (item) => {
    return item && !!item.visitDay && ![1, 7, 14, 21, 29].includes(item.visitDay);
  };

  // Function to get status for regular follow-ups
  const getFollowupDueStatus = (followup) => {
    if (followup.call_status === 'connected' || followup.completed_at) return 'completed';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(followup.due_date);
    due.setHours(0, 0, 0, 0);
    if (due < today) return 'overdue';
    if (due.getTime() === today.getTime()) return 'due_today';
    return 'pending';
  };

  // Function to get status for sepsis visits
  const getSepsisVisitStatus = (visit) => {
    if (!visit) return 'upcoming';
    const { actualDate, visitCompleted, expectedDate } = visit;
    const today = new Date().toISOString().split('T')[0];
    if (visitCompleted) return 'completed';
    if (!actualDate && expectedDate < today) return 'overdue';
    if (!actualDate && expectedDate === today) return 'due_today';
    if (!actualDate && expectedDate > today) return 'upcoming';
    return 'pending';
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Get all items combined and sorted by date
  const getAllItems = () => {
    const items = [];

    // Add regular follow-ups
    followups.forEach(followup => {
      items.push({
        type: 'followup',
        id: followup.id,
        followup: followup,
        date: followup.due_date,
        day: followup.followup_day,
        label: `Day ${followup.followup_day} Follow-up`,
        getStatus: () => getFollowupDueStatus(followup),
        getStatusColor: (status) => {
          const statusColor = status === 'completed' ? 'border-emerald-300 bg-emerald-50' :
            status === 'overdue' ? 'border-red-300 bg-red-50' :
            status === 'due_today' ? 'border-yellow-300 bg-yellow-50' :
            'border-slate-200 bg-white';
          return statusColor;
        },
        getCallStatusColor: () => getCallStatusColor(followup.call_status)
      });
    });

    // Add sepsis visits
    sepsisVisits.forEach(visit => {
      if (visit) {
        items.push({
          type: 'sepsis',
          id: visit.id || `sepsis_${visit.patient_id}_${visit.visit_day}`,
          visit: visit,
          date: visit.expectedDate,
          day: visit.visitDay,
          label: `Day ${visit.visitDay} Sepsis Screening`,
          getStatus: () => getSepsisVisitStatus(visit),
          getStatusColor: (status) => {
            const hasSign = visit.sepsisSigns && Object.values(visit.sepsisSigns || {}).some(v => v === true);
            const baseStatus = getSepsisVisitStatus(visit);

            // If sepsis detected, override to high risk (dark red)
            if (hasSign && baseStatus !== 'completed') {
              return 'border-red-800 bg-red-50';
            }

            return baseStatus === 'completed' ? 'border-emerald-300 bg-emerald-50' :
              baseStatus === 'overdue' ? 'border-red-300 bg-red-50' :
              baseStatus === 'due_today' ? 'border-yellow-300 bg-yellow-50' :
              'border-slate-200 bg-white';
          }
        });
      }
    });

    // Sort by date (putting items with same date together, sepsis first for overlap)
    return items.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      // For same date, put sepsis first
      if (a.type === 'sepsis' && b.type === 'followup') return -1;
      if (a.type === 'followup' && b.type === 'sepsis') return 1;
      return 0;
    });
  };

  return (
    <div>
      <h3 className="font-semibold text-slate-800 mb-3">Follow-up Schedule</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {getAllItems().map((item, index) => {
          const status = item.getStatus();
          const statusColor = item.getStatusColor(status);

          return (
            <div
              key={item.id}
              className={`rounded-xl border-2 p-4 transition-all hover:shadow-md ${statusColor} cursor-pointer`}
              onClick={() => {
                setSelectedItem(item);
                setIsSepsis(item.type === 'sepsis');
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-800">{item.label}</span>
                {status === 'completed' && <CheckCircle2 size={16} className="text-emerald-500" />}
                {status === 'overdue' && <AlertTriangle size={16} className="text-red-500" />}
                {status === 'due_today' && <Clock size={16} className="text-yellow-500" />}
                {(status === 'pending' || status === 'upcoming') && <Clock size={16} className="text-slate-400" />}
              </div>

              <p className="text-xs text-slate-500 mb-2">Due: {formatDate(item.date)}</p>

              {/* Status Badge */}
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-3`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  status.includes('completed') ? 'bg-emerald-500' :
                  status.includes('overdue') ? 'bg-red-500' :
                  status.includes('due_today') || status === 'pending' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <span className="text-xs">
                  {status === 'completed' ? 'Completed' :
                  status === 'overdue' ? 'Overdue' :
                  status === 'due_today' ? 'Due Today' :
                  status === 'pending' ? 'Pending' :
                  'Upcoming'}
                </span>
              </div>

              {/* Item-specific details */}
              {item.type === 'followup' && (
                <>
                  {/* Call Buttons */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {patient?.mother_mobile && (
                      <a href={`tel:${patient.mother_mobile}`} className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors">
                        <Phone size={10} /> Mother
                      </a>
                    )}
                    {patient?.alternative_mobile && (
                      <a href={`tel:${patient.alternative_mobile}`} className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors">
                        <Phone size={10} /> Alt
                      </a>
                    )}
                    {patient?.mother_mobile && (
                      <button onClick={() => handleCopyNumber(patient.mother_mobile)} className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                        <Copy size={10} /> Copy
                      </button>
                    )}
                  </div>

                  {/* Call Details */}
                  {item.followup.call_datetime && (
                    <p className="text-xs text-slate-400 mb-1">Called: {new Date(item.followup.call_datetime).toLocaleString('en-IN')}</p>
                  )}
                  {item.followup.breastfeeding_status && (
                    <p className="text-xs text-slate-500">BF: {item.followup.breastfeeding_status}</p>
                  )}
                  {item.followup.referral_required !== null && (
                    <p className="text-xs text-slate-500">
                      Referral: {item.followup.referral_required ? 'Yes' : 'No'}
                      {item.followup.referral_required && item.followup.referral_done !== null ? ` (${item.followup.referral_done ? 'Done' : 'Not Done'})` : ''}
                    </p>
                  )}
                </>
              )}

              {item.type === 'sepsis' && (
                <>
                  {/* Sepsis Risk Badge if any signs positive */}
                  {item.visit.sepsisSigns && Object.values(item.visit.sepsisSigns || {}).some(v => v === true) && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3">
                      <p className="text-sm font-medium text-red-800 flex items-center gap-1">
                        <AlertTriangle size={12} className="text-red-500" /> Sepsis Risk Detected
                      </p>
                    </div>
                  )}

                  <Grid>
                    <Field label={"Actual Date"} value={formatDate(item.visit.actualDate)} />
                    <Field label={"Visit Completed"} value={item.visit.visitCreated ? 'Yes' : 'No'} />
                    <Field label={"Visit Type"} value={item.visit.visitType || '—'} />
                    <Field label={"Conducted By"} value={item.visit.conductedBy || '—'} />
                  </Grid>

                  {/* Remarks */}
                  <div className="mb-2">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Visit Remarks</p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 rounded p-2">{item.visit.remarks || '—'}</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for editing selected item */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">{isSepsis ? `Day ${selectedItem.visit.visitDay} Sepsis Screening` : `Day ${selectedItem.followup.followup_day} Follow-up`}</h2>
              <button onClick={() => {
                setSelectedItem(null);
                setIsSepsis(false);
              }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
              {isSepsis ? (
                <SepsisFollowupModal
                  visit={selectedItem.visit}
                  patient={patient}
                  onClose={() => {
                    setSelectedItem(null);
                    setIsSepsis(false);
                  }}
                  onSave={() => {
                    setSelectedItem(null);
                    setIsSepsis(false);
                  }}
                />
              ) : (
                <FollowupCallModal
                  followup={selectedItem.followup}
                  patient={patient}
                  onClose={() => {
                    setSelectedItem(null);
                    setIsSepsis(false);
                  }}
                  onSave={() => {
                    setSelectedItem(null);
                    setIsSepsis(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for displaying fields (same as in AssessmentReadOnly)
function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value !== undefined && value !== null && value !== '' ? String(value) : '—'}</p>
    </div>
  );
}

// Helper component for grid layout
function Grid({ children }) {
  return <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>;
}
