import { getStatusColor } from '../../lib/utils';
import { useLanguage } from '../../context/useLanguage';

export default function StatusBadge({ status }) {
  const { t } = useLanguage();
  const c = getStatusColor(status);
  const labels = {
    draft: t('draft'),
    submitted: t('submitted'),
    returned: t('returned'),
    approved: t('approved'),
    closed: t('closed'),
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
      {labels[status] || status}
    </span>
  );
}
