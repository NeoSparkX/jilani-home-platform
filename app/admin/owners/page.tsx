import OwnersClient from "@/components/admin/owners/OwnersClient";

export default function OwnersPage() {
  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">Directory Management</p>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Owner <span className="text-blue-600">Contacts</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Manage property owners and their contact information.</p>
        </div>
      </div>
      
      <OwnersClient />
    </div>
  );
}
