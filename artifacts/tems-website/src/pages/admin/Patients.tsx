import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListPatients } from "@workspace/api-client-react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Patients() {
  const [search, setSearch] = useState("");
  const { data: patients, isLoading } = useListPatients({ search });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary">Patients Directory</h1>
          <p className="text-muted-foreground mt-1">View and manage patient records.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search patients..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead>Last Visit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="animate-pulse flex space-x-4 justify-center">
                    <div className="h-4 w-48 bg-muted rounded"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : patients?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              patients?.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{patient.phone}</div>
                    <div className="text-xs text-muted-foreground">{patient.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm max-w-[200px] truncate" title={patient.address || "N/A"}>
                      {patient.address || <span className="text-muted-foreground italic">Not provided</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                      {patient.totalAppointments}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {patient.lastVisit ? format(new Date(patient.lastVisit), "MMM d, yyyy") : "No visits yet"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
