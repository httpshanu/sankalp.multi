import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useLanguage } from '../../context/useLanguage';
import { getAllPatients, getAllBabies, getFollowupsByPatient } from '../../data/dataStore';
import { Download, FileText, FileSpreadsheet, Calendar, Baby, Heart, Phone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import * as XLSX from 'xlsx';

export default function Reports() {
  const { t } = useLanguage();
  const [exporting, setExporting] = useState(null);

  const REPORT_TYPES = [
    { id: 'monthly', label: t('monthlyReport'), desc: t('monthlyReportDesc'), icon: Calendar, color: 'bg-blue-500' },
    { id: 'supervisor', label: t('supervisorReport'), desc: t('supervisorReportDesc'), icon: FileText, color: 'bg-violet-500' },
    { id: 'counsellor', label: t('counsellorReport'), desc: t('counsellorReportDesc'), icon: FileText, color: 'bg-pink-500' },
    { id: 'facility', label: t('facilityReport'), desc: t('facilityReportDesc'), icon: FileText, color: 'bg-teal-500' },
    { id: 'government', label: t('governmentReport'), desc: t('governmentReportDesc'), icon: FileSpreadsheet, color: 'bg-rose-500' },
    { id: 'followup', label: t('followupCallReport'), desc: t('followupCallReportDesc'), icon: Phone, color: 'bg-amber-500' },
    { id: 'kmc', label: t('kmcReport'), desc: t('kmcReportDesc'), icon: Baby, color: 'bg-emerald-500' },
    { id: 'lbw', label: t('lbwReport'), desc: t('lbwReportDesc'), icon: Heart, color: 'bg-orange-500' },
    { id: 'preterm', label: t('pretermReport'), desc: t('pretermReportDesc'), icon: Baby, color: 'bg-indigo-500' },
  ];

  const generateExcel = (reportType) => {
    setExporting(reportType);
    const patients = getAllPatients();
    const babies = getAllBabies();

    let rows = [];
    let filename = '';

    if (reportType === 'followup') {
      // Follow-up report: one row per follow-up per patient
      filename = 'SANKALP_Followup_Report.xlsx';
      patients.forEach(p => {
        const fups = getFollowupsByPatient(p.id);
        fups.forEach(fu => {
          rows.push({
            'Patient ID': p.patient_id,
            'Mother Name': p.mother_name,
            'Facility': p.facility_name,
            'Supervisor': p.supervisor_name,
            'Follow-up Day': `Day ${fu.followup_day}`,
            'Due Date': fu.due_date,
            'Call Status': fu.call_status,
            'Call Attempts': fu.call_attempt_count,
            'Called Number': fu.called_number,
            'BF Status': fu.breastfeeding_status,
            'Feeding Pattern': fu.feeding_pattern,
            'KMC Status': fu.kmc_status,
            'Danger Signs': fu.danger_signs_present ? 'Yes' : fu.danger_signs_present === false ? 'No' : '',
            'Remarks': fu.remarks,
          });
        });
      });
    } else if (reportType === 'kmc') {
      filename = 'SANKALP_KMC_Report.xlsx';
      const kmcBabies = babies.filter(b => b.kmc_eligible || b.kmc_initiated);
      kmcBabies.forEach(b => {
        rows.push({
          'Patient ID': b.patient_id,
          'Baby ID': b.baby_id,
          'Gender': b.gender,
          'Birth Weight (g)': b.birth_weight,
          'Gestational Age (wks)': b.gestational_age,
          'Classification': b.baby_classification,
          'KMC Eligible': b.kmc_eligible ? 'Yes' : 'No',
          'KMC Initiated': b.kmc_initiated ? 'Yes' : 'No',
          'KMC Duration': b.kmc_duration,
          'KMC Acceptance': b.kmc_acceptance,
        });
      });
    } else {
      // General report: one row per baby with mother details repeated
      filename = `SANKALP_${reportType}_Report.xlsx`;
      patients.forEach(p => {
        const patientBabies = babies.filter(b => b.patient_id === p.id);
        if (patientBabies.length === 0) {
          // Patient with no baby records
          rows.push({
            'Patient ID': p.patient_id,
            'Mother Name': p.mother_name,
            'Father Name': p.father_name,
            'Mother Mobile': p.mother_mobile,
            'Alternative Mobile': p.alternative_mobile,
            'Village': p.village,
            'District': p.district,
            'Block': p.block_name,
            'Facility': p.facility_name,
            'Counsellor': p.counsellor_name,
            'Supervisor': p.supervisor_name,
            'Baby Count': p.baby_count || 0,
            'Status': p.status,
            'Created': p.created_at,
          });
        } else {
          patientBabies.forEach(b => {
            const fups = getFollowupsByPatient(p.id);
            rows.push({
              'Patient ID': p.patient_id,
              'Mother Name': p.mother_name,
              'Father Name': p.father_name,
              'Mother Mobile': p.mother_mobile,
              'Alternative Mobile': p.alternative_mobile,
              'Village': p.village,
              'District': p.district,
              'Block': p.block_name,
              'Facility': p.facility_name,
              'Counsellor': p.counsellor_name,
              'Supervisor': p.supervisor_name,
              'Baby ID': b.baby_id,
              'Baby Number': b.baby_number,
              'Gender': b.gender,
              'UHID': b.uhid,
              'Gestational Age (wks)': b.gestational_age,
              'Birth Weight (g)': b.birth_weight,
              'Classification': b.baby_classification,
              'Outcome': b.outcome_of_delivery,
              'Baby Condition': b.baby_condition,
              'Baby Location': b.baby_location,
              'Record Status': p.status,
              'Day 1 Call': fups.find(f => f.followup_day === 1)?.call_status || '',
              'Day 7 Call': fups.find(f => f.followup_day === 7)?.call_status || '',
              'Day 14 Call': fups.find(f => f.followup_day === 14)?.call_status || '',
              'Day 21 Call': fups.find(f => f.followup_day === 21)?.call_status || '',
              'Day 29 Call': fups.find(f => f.followup_day === 29)?.call_status || '',
              'Created': p.created_at,
            });
          });
        }
      });
    }

    if (rows.length === 0) {
      rows.push({ Message: 'No data available for this report' });
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    // Auto-width columns
    const colWidths = Object.keys(rows[0] || {}).map(key => ({
      wch: Math.max(key.length, ...rows.map(r => String(r[key] || '').length).slice(0, 10)) + 2
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, filename);
    setExporting(null);
  };

  const generatePDF = (reportType) => {
    setExporting(reportType);
    const patients = getAllPatients();
    const filename = `SANKALP_${reportType}_Report.pdf`;

    // Create a simple PDF-like HTML for download
    let content = `<html><head><title>SANKALP ${reportType} Report</title>
    <style>
      body{font-family:Arial,sans-serif;padding:20px;color:#1e293b}
      table{width:100%;border-collapse:collapse;margin-top:15px}
      th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}
      th{background:#0F4C75;color:white}
      tr:nth-child(even){background:#f2f2f2}
      .logo-container {display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0F4C75;padding-bottom:15px;margin-bottom:20px}
      .report-title {font-size:18px;font-weight:bold;color:#0F4C75;margin:10px 0 5px 0}
      .meta-text {font-size:12px;color:#64748b;margin:0 0 15px 0}
    </style>
    </head><body>
    <div class="logo-container">
      <img src="${window.location.origin}/assets/icmr-logo.png" alt="Indian Council of Medical Research" style="height:50px;width:auto;object-fit:contain" />
      <div style="text-align:center">
        <h1 style="color:#0F4C75;margin:0;font-size:20px;font-weight:bold">SANKALP</h1>
        <p style="margin:2px 0 0 0;font-size:10px;color:#475569;font-weight:600">Bedside Counselling & Neonatal Follow-up Management System</p>
      </div>
      <img src="${window.location.origin}/assets/sankalp-logo.png" alt="SANKALP Mother and Child Health Programme" style="height:50px;width:auto;object-fit:contain" />
    </div>
    <div class="report-title">${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</div>
    <p class="meta-text">
      <strong>Generated:</strong> ${new Date().toLocaleString('en-IN')} &nbsp;|&nbsp; 
      <strong>Total Records:</strong> ${patients.length}
    </p>
    <table><tr><th>Patient ID</th><th>Mother Name</th><th>Facility</th><th>Status</th><th>Supervisor</th></tr>`;

    patients.forEach(p => {
      content += `<tr><td>${p.patient_id || ''}</td><td>${p.mother_name || ''}</td><td>${p.facility_name || ''}</td><td>${p.status || ''}</td><td>${p.supervisor_name || ''}</td></tr>`;
    });

    content += '</table></body></html>';

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace('.pdf', '.html');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExporting(null);
  };

  // Monthly data for chart
  const monthlyMap = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString('en', { month: 'short' });
    monthlyMap[key] = 0;
  }
  getAllPatients().forEach(p => {
    if (p.created_at) {
      const key = new Date(p.created_at).toLocaleString('en', { month: 'short' });
      if (key in monthlyMap) monthlyMap[key]++;
    }
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, entries]) => ({ month, entries }));

  return (
    <AppLayout title={t('reports')}>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">{t('reportsExports')}</h1>
        <p className="text-slate-500 text-sm">{t('reportsDesc')}</p>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {REPORT_TYPES.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.color} flex-shrink-0`}>
                <r.icon size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{r.label}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{r.desc}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => generatePDF(r.id)}
                    disabled={exporting === r.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#0F4C75] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Download size={12} /> PDF
                  </button>
                  <button
                    onClick={() => generateExcel(r.id)}
                    disabled={exporting === r.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Download size={12} /> Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Summary Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">{t('monthlySummaryPreview')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="entries" name={t('totalEntries')} fill="#0F4C75" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Report Summary</h3>
          <div className="space-y-3">
            {REPORT_TYPES.slice(0, 6).map(r => (
              <div key={r.id} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{r.label}</span>
                <span className="text-xs text-slate-500">Export available</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
