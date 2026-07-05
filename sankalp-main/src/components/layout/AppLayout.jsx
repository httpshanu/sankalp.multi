import Sidebar from './Sidebar';
import Topbar from './Topbar';
import OrganizationLogos from './OrganizationLogos';

export default function AppLayout({ title, children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Print only header */}
          <div className="hidden print:block w-full">
            <OrganizationLogos variant="print" />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
