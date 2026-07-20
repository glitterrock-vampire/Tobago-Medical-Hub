import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Stethoscope, Activity, Heart, Eye } from "lucide-react";
import { defaultServices } from "@/lib/default-services";

export default function Services() {
  const { data: services, isLoading } = useListServices();
  const serviceList = Array.isArray(services) ? services : defaultServices;

  const getIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'general': return <Activity className="w-6 h-6" />;
      case 'specialist': return <Heart className="w-6 h-6" />;
      case 'checkup': return <Eye className="w-6 h-6" />;
      default: return <Stethoscope className="w-6 h-6" />;
    }
  };

  return (
    <PublicLayout>
      <div className="py-20 bg-secondary/5 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Our Services</h1>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Comprehensive medical care tailored to your needs. From routine checkups to specialized treatments, we are here for your health journey.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card border rounded-2xl p-6 h-48" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceList.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-2xl p-8 hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-primary">
                  {getIcon(service.category)}
                </div>
                
                <div className="mb-4 inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-xl">
                  {getIcon(service.category)}
                </div>
                
                <h3 className="text-xl font-serif font-medium mb-3">{service.name}</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="flex flex-col gap-2 mt-auto text-sm text-foreground/70 font-medium">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>Duration</span>
                    <span>~{service.durationMinutes} mins</span>
                  </div>
                  {service.isHomeVisitAvailable && (
                    <div className="flex items-center text-secondary py-1">
                      * Home visit available
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center bg-primary/5 rounded-3xl p-12 border border-primary/10">
          <h2 className="text-3xl font-serif text-primary mb-4">Ready for your visit?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Schedule an appointment today. If you need a service not listed here, please contact us to discuss how we can assist you.
          </p>
          <Button size="lg" asChild>
            <Link href="/book">Book an Appointment</Link>
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
