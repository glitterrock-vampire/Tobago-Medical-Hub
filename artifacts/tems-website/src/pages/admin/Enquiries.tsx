import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListEnquiries } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";

export default function Enquiries() {
  const { data: enquiries, isLoading } = useListEnquiries();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary">Web Enquiries</h1>
        <p className="text-muted-foreground mt-1">Messages sent through the public contact form.</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-card border rounded-xl" />)}
          </div>
        ) : enquiries?.length === 0 ? (
          <div className="bg-card border rounded-xl p-12 text-center text-muted-foreground">
            No enquiries received yet.
          </div>
        ) : (
          enquiries?.map((enquiry) => (
            <div key={enquiry.id} className={`bg-card border rounded-xl p-6 shadow-sm ${!enquiry.isRead ? 'border-l-4 border-l-primary' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    {enquiry.name}
                    {!enquiry.isRead && <span className="w-2 h-2 rounded-full bg-primary inline-block" />}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {enquiry.email}</span>
                    {enquiry.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {enquiry.phone}</span>}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {format(new Date(enquiry.createdAt), "MMM d, yyyy • h:mm a")}
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-md text-foreground/80 text-sm whitespace-pre-wrap leading-relaxed">
                {enquiry.message}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
