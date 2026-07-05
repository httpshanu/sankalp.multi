import { CheckItem, SegmentButton } from './shared';

const HBNC_DAYS = ['day1', 'day3', 'day7', 'day14', 'day21', 'day28'];

export default function SectionJ({ data = {}, onChange, t }) {
  const d = data;
  const update = (key, val) => onChange({ ...d, [key]: val });

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">📋 {t('postDischargePlan')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('postDischargeDesc')}</p>

      <div className="space-y-4">
        <CheckItem
          label={t('followupScheduled')}
          checked={d.followupScheduled}
          onChange={v => update('followupScheduled', v)}
        />

        {d.followupScheduled && (
          <div className="ml-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('followupDate')}</label>
            <input
              type="date"
              value={d.followupDate || ''}
              onChange={e => update('followupDate', e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        )}

        <CheckItem
          label={t('ashaInformed')}
          checked={d.ashaInformed}
          onChange={v => update('ashaInformed', v)}
        />

        <div>
          <CheckItem
            label={t('hbncVisitPlanned')}
            checked={d.hbncVisitPlanned}
            onChange={v => update('hbncVisitPlanned', v)}
          />
          {d.hbncVisitPlanned && (
            <div className="mt-2 ml-4">
              <p className="text-sm font-medium text-slate-600 mb-1">{t('selectDay')}</p>
              <SegmentButton
                options={HBNC_DAYS}
                value={d.hbncDay}
                onChange={v => update('hbncDay', v)}
                t={t}
              />
            </div>
          )}
        </div>

        <CheckItem
          label={t('motherKnowsDangerSigns')}
          checked={d.motherKnowsDangerSigns}
          onChange={v => update('motherKnowsDangerSigns', v)}
        />

        <CheckItem
          label={t('immunizationCardProvided')}
          checked={d.immunizationCardProvided}
          onChange={v => update('immunizationCardProvided', v)}
        />

        <CheckItem
          label={t('emergencyContact')}
          checked={d.emergencyContact}
          onChange={v => update('emergencyContact', v)}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('postDischargeNotes')}</label>
          <textarea
            rows={4}
            value={d.postDischargeNotes || ''}
            onChange={e => update('postDischargeNotes', e.target.value)}
            placeholder={t('postDischargePlanPlaceholder')}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-y"
          />
        </div>
      </div>
    </div>
  );
}
