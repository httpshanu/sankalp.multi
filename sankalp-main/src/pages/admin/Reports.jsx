import AppLayout from '../../components/layout/AppLayout';
import { useLanguage } from '../../context/useLanguage';
import { MOCK_MONTHLY_DATA, MOCK_SUPERVISOR_DATA } from '../../data/mockData';
import { Download, FileText, FileSpreadsheet, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Reports() {
  const { t } = useLanguage();

  const REPORT_TYPES = [
    { id: 'monthly', label: t('monthlyReport'), desc: t('monthlyReportDesc'), icon: Calendar, color: 'bg-blue-500' },
    { id: 'supervisor', label: t('supervisorReport'), desc: t('supervisorReportDesc'), icon: FileText, color: 'bg-violet-500' },
    { id: 'facility', label: t('facilityReport'), desc: t('facilityReportDesc'), icon: FileText, color: 'bg-teal-500' },
    { id: 'government', label: t('governmentReport'), desc: t('governmentReportDesc'), icon: FileSpreadsheet, color: 'bg-rose-500' },
  ];

  const handleDownload = (type, reportLabel) => {
    let filename, blob;
    
    if (type === 'pdf') {
      filename = `${reportLabel.replace(/\s+/g, '_')}_Report.pdf`;
      // A minimal valid blank PDF in base64
      const pdfBase64 = "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1LBSK0osSQTzN4tQc3fQc3RSOXJ0UvPzcdL383NR8o3S9yBwjR8MII0tDAwAAAP//AwBg2QnRCmVuZHN0cmVhbQplbmRvYmoKCjMgMCBvYmoKNDUKZW5kb2JqCgo0IDAgb2JqCjw8L1R5cGUvUGFnZS9NZWRpYUJveFswIDAgNTk1IDg0Ml0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDUgMCBSPj4+Pi9Db250ZW50cyAyIDAgUi9QYXJlbnQgNiAwIFI+PgplbmRvYmoKCjUgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCgo2IDAgb2JqCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzQgMCBSXT4+CmVuZG9iagoKNyAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgNiAwIFI+PgplbmRvYmoKCjEgMCBvYmoKPDwvUHJvZHVjZXIoaUxhdGV4KS9DcmVhdG9yKFRleHQpL0NyZWF0aW9uRGF0ZShEOjIwMjExMTE1MTIwNDAwKjAwJzAwJykgPj4KZW5kb2JqCgp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDA0MDYgMDAwMDAgbiAKMDAwMDAwMDAxOSAwMDAwMCBuIAowMDAwMDAwMTM1IDAwMDAwIG4gCjAwMDAwMDAxNTcgMDAwMDAgbiAKMDAwMDAwMDI3MyAwMDAwMCBuIAowMDAwMDAwMzYxIDAwMDAwIG4gCjAwMDAwMDA0MTggMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDgvUm9vdCA3IDAgUi9JbmZvIDEgMCBSPj4Kc3RhcnR4cmVmCjUwMwolJUVPRgo=";
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: 'application/pdf' });
    } else {
      // Create a CSV instead of a corrupted XLSX, since Excel opens CSVs natively
      filename = `${reportLabel.replace(/\s+/g, '_')}_Report.csv`;
      const csvContent = `Report Type,Status\n${reportLabel},Mock Data Generated`;
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout title={t('reports')}>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">{t('reportsExports')}</h1>
        <p className="text-slate-500 text-sm">{t('reportsDesc')}</p>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {REPORT_TYPES.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.color} flex-shrink-0`}>
                <r.icon size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{r.label}</h3>
                <p className="text-slate-400 text-sm mt-0.5">{r.desc}</p>
                <div className="flex gap-2 mt-3">
                  <select className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                    <option>October 2023</option>
                    <option>September 2023</option>
                    <option>August 2023</option>
                  </select>
                  <button 
                    onClick={() => handleDownload('pdf', r.label)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#0F4C75] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Download size={12} /> PDF
                  </button>
                  <button 
                    onClick={() => handleDownload('excel', r.label)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Download size={12} /> Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">{t('monthlySummaryPreview')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="entries" name={t('totalEntries')} fill="#0F4C75" radius={[4,4,0,0]} />
              <Bar dataKey="approved" name={t('approved')} fill="#10B981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">{t('supervisorCaseload')}</h3>
          <div className="space-y-3">
            {MOCK_SUPERVISOR_DATA.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{s.name}</span>
                  <span className="text-slate-500 font-medium">{s.cases} {t('cases')}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div className="h-2 bg-[#0F4C75] rounded-full" style={{ width: `${(s.cases / 70) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
