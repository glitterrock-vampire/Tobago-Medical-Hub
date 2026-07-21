import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateAppointment, useListServices } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { defaultServices, servicePrices } from "@/lib/default-services";

const bookSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Valid phone number is required"),
  serviceId: z.coerce.number().positive("Please select a service"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  isHomeVisit: z.boolean().default(false),
  address: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => {
  if (data.isHomeVisit && (!data.address || data.address.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Address is required for home visits",
  path: ["address"]
});

export default function Book() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createAppointment = useCreateAppointment();
  const { data: services } = useListServices();
  const serviceList = Array.isArray(services) ? services : defaultServices;
  
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      serviceId: 0,
      preferredDate: "",
      preferredTime: "Morning",
      isHomeVisit: false,
      address: "",
      notes: "",
    },
  });

  const isHomeVisit = form.watch("isHomeVisit");
  const selectedServiceId = form.watch("serviceId");
  const selectedService = serviceList.find(s => s.id === selectedServiceId);

  function onSubmit(values: z.infer<typeof bookSchema>) {
    createAppointment.mutate({ data: values }, {
      onSuccess: () => {
        toast({
          title: "Appointment Request Sent",
          description: "We will contact you shortly to confirm your booking.",
        });
        setLocation("/");
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to submit booking. Please try again.",
        });
      }
    });
  }

  return (
    <PublicLayout>
      <div className="py-20 bg-secondary/5 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Book an Appointment</h1>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Request a visit with Dr. Quaccoo. Please note this is a request; our team will contact you to confirm the exact date and time.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-2xl mx-auto bg-card border rounded-2xl p-8 md:p-10 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Patient Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-medium border-b pb-2">Patient Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jane@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(868) 555-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Service & Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-medium border-b pb-2">Appointment Details</h3>
                
                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Visit / Service</FormLabel>
                      <Select 
                        onValueChange={(val) => field.onChange(parseInt(val, 10))} 
                        value={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceList.map(service => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date</FormLabel>
                        <FormControl>
                          <Input type="date" min={new Date().toISOString().split('T')[0]} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time of Day</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Morning">Morning</SelectItem>
                            <SelectItem value="Afternoon">Afternoon</SelectItem>
                            <SelectItem value="Evening">Evening</SelectItem>
                            <SelectItem value="Flexible">Flexible / first available</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {selectedService?.isHomeVisitAvailable && (
                  <FormField
                    control={form.control}
                    name="isHomeVisit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm mt-4 bg-muted/30">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Request Home Visit</FormLabel>
                          <FormDescription>
                            This service allows for home visits. Subject to doctor availability.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {selectedService && servicePrices[selectedService.id] && (
                  <div className="rounded-md border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
                    {servicePrices[selectedService.id]}
                  </div>
                )}

                {isHomeVisit && (
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide your full address in Tobago East..." 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific symptoms or concerns you'd like to mention beforehand?" 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={createAppointment.isPending}>
                {createAppointment.isPending ? "Submitting Request..." : "Request Appointment"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </PublicLayout>
  );
}
