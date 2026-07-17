import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAppointmentStats } from "@workspace/api-client-react";
import { 
  Users, 
  CalendarDays, 
  Clock, 
  CheckCircle2 
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetAppointmentStats();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-muted rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-card rounded-xl border" />)}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here is today's overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Today's Appointments</h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif text-foreground">{stats?.totalToday || 0}</div>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Requests</h3>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif text-foreground">{stats?.totalPending || 0}</div>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Confirmed (Week)</h3>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif text-foreground">{stats?.totalConfirmed || 0}</div>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total This Month</h3>
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif text-foreground">{stats?.totalThisMonth || 0}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="md:col-span-2 bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-serif font-medium text-lg">Recent Appointments</h3>
          </div>
          <div className="divide-y">
            {stats?.recentAppointments?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No recent appointments found.</div>
            ) : (
              stats?.recentAppointments?.map(apt => (
                <div key={apt.id} className="p-4 px-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{apt.patientName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      {format(new Date(apt.preferredDate), "MMM d, yyyy")} • {apt.preferredTime}
                      {apt.isHomeVisit && <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">Home Visit</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-2">{apt.serviceName}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* By Service Breakdown */}
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b">
            <h3 className="font-serif font-medium text-lg">Services Breakdown</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            {stats?.byService?.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm">No data available</div>
            ) : (
              <div className="space-y-4">
                {stats?.byService?.map(item => (
                  <div key={item.serviceName} className="flex items-center justify-between">
                    <span className="text-sm text-foreground/80">{item.serviceName}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </AdminLayout>
  );
}
