import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, HeartPulse, UserRound, ArrowRight } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { EKG } from "@/components/shared/EKG";
import drPhoto from "@assets/0_PHOTO-2026-07-16-23-05-10_1784263561449.jpg";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 -z-10" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif text-primary mb-6 leading-tight">
                Compassionate Care <br/>in Tobago East
              </h1>
              <p className="text-xl text-foreground/80 mb-10 leading-relaxed font-sans max-w-2xl mx-auto">
                Led by Dr. Thea Quaccoo, Tobago East Medical Services provides expert, personal healthcare tailored to you and your family.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild className="w-full sm:w-auto text-base h-12">
                  <Link href="/book">Book an Appointment</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base h-12">
                  <Link href="/services">Our Services</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-full opacity-[0.03] text-primary pointer-events-none -z-10 -translate-y-1/2 overflow-hidden flex">
           <EKG className="w-full min-w-[800px] h-32" />
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-card border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: UserRound,
                title: "Personalized Approach",
                desc: "We take the time to listen, understand, and tailor medical treatments specifically to your individual needs."
              },
              {
                icon: MapPin,
                title: "Community Focused",
                desc: "Located right here in Roxborough, dedicated to the health and wellness of the Tobago East community."
              },
              {
                icon: HeartPulse,
                title: "Home Visits Available",
                desc: "For those who are unable to travel, Dr. Quaccoo offers scheduled home visits for compassionate care where you are."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl aspect-square relative overflow-hidden border border-secondary/20"
            >
              <img
                src={drPhoto}
                alt="Dr. Thea Quaccoo"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/80 to-transparent p-6">
                <h3 className="text-2xl font-serif text-white">Dr. Thea Quaccoo</h3>
                <p className="text-white/70 text-sm font-medium tracking-wider uppercase">Medical Director</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif text-primary mb-6">Care that feels like home.</h2>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                At Tobago East Medical Services, we believe healthcare is more than just treating symptoms—it's about understanding the person behind them.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Dr. Thea Quaccoo brings years of experience and a deep commitment to the community. Her approach combines modern medical expertise with traditional bedside manner, ensuring every patient feels heard, respected, and truly cared for.
              </p>
              <Button variant="link" asChild className="px-0 text-base group">
                <Link href="/about">
                  Learn more about our clinic
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
