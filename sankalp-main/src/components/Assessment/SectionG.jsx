export default function SectionG({ data = {}, onChange, t }) {
  const d = data;
  const update = (key, val) => onChange({ ...d, [key]: val });

  const monitored = ['bfObserved', 'goodAttachment', 'feeding8to12', 'urinationAdequate', 'stoolPassed', 'weightMonitored'];
  const days = ['day1', 'day2', 'day3'];

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">📊 {t('dailyMonitoring')}</h3>
      <p className="text-slate-500 text-sm mb-5">Day 1–3 monitoring checklist</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-3 border border-slate-200">Observation</th>
              {days.map(d => (
                <th key={d} className="text-center text-xs font-semibold text-slate-400 uppercase px-4 py-3 border border-slate-200">{t(d)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monitored.map(k => (
              <tr key={k} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{t(k)}</td>
                {days.map(dy => (
                  <td key={dy} className="text-center border border-slate-200">
                    <button type="button" onClick={() => {
                      const current = d[k]?.[dy];
                      const newVal = current === true ? false : current === false ? undefined : true;
                      update(k, { ...d[k], [dy]: newVal });
                    }} className={`w-8 h-8 rounded-lg inline-flex items-center justify-center text-sm font-bold transition-all ${
                      d[k]?.[dy] === true ? 'bg-emerald-500 text-white' :
                      d[k]?.[dy] === false ? 'bg-rose-100 text-rose-600' :
                      'bg-white text-slate-300 border border-slate-200 hover:border-slate-300'
                    }`}>
                      {d[k]?.[dy] === true ? '✓' : d[k]?.[dy] === false ? '✗' : '—'}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
