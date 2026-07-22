import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Camera,
  Clock,
  FileText,
  HeartPulse,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { EKG } from "@/components/shared/EKG";
import heroMedicalCenter from "@assets/tobago-medical-center-hero.jpg";
import drPhoto from "@assets/0_PHOTO-2026-07-16-23-05-10_1784263561449.jpg";
import clinicRoom from "@assets/2_IMG_1142_1784263581387.jpg";

const quickInfo = [
  { icon: MapPin, label: "Kendal, Tobago", value: "Serving Tobago East" },
  { icon: Clock, label: "Flexible hours", value: "No fixed closed day" },
  { icon: Phone, label: "1 (868) 320-5811", value: "Call to confirm availability" },
];

const servicePreview = [
  {
    icon: Stethoscope,
    title: "General Care",
    text: "Consultations, follow-ups, prescriptions, chronic disease reviews, and home visits.",
  },
  {
    icon: BadgeCheck,
    title: "Medical Certificates",
    text: "Driver's licence, food badge, firearm, school, and university medicals.",
  },
  {
    icon: Camera,
    title: "Photos & Printing",
    text: "Passport photos plus black and white or colour document printing.",
  },
];

export default function Home() {
  return (
    <PublicLayout>
      <section className="relative flex min-h-[720px] items-center overflow-hidden bg-primary">
        <img
          src={heroMedicalCenter}
          alt="Tobago Medical Center"
          className="absolute inset-0 h-full w-full object-cover object-[58%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/92 via-primary/58 to-primary/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-primary/55" />
        <svg
          className="heartbeat-overlay"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="heartbeat-glow"
            d="M0 170 H165 L205 170 L245 55 L300 245 L345 150 L380 170 H570 L610 170 L640 125 L680 205 L720 170 H1200"
          />
          <path
            className="heartbeat-line"
            d="M0 170 H165 L205 170 L245 55 L300 245 L345 150 L380 170 H570 L610 170 L640 125 L680 205 L720 170 H1200"
          />
        </svg>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="grid min-h-[720px] items-center gap-10 py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(330px,0.5fr)]">
            <div className="max-w-3xl text-left drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
                  <ShieldCheck className="h-4 w-4" />
                  General practice care in Kendal, Tobago
                </div>
                <h1 className="mb-6 text-5xl font-serif leading-tight text-white md:text-7xl">
                  Thoughtful medical care, close to home.
                </h1>
                <p className="mb-8 max-w-2xl font-sans text-xl leading-relaxed text-white/88">
                  Led by Dr. Thea Quaccoo, Tobago East Medical Services supports everyday health needs, required medicals, home visits, passport photos, and document services for the Tobago East community.
                </p>
                <div className="mb-10 w-44 text-white/65 sm:w-56">
                  <EKG className="h-12" />
                </div>
                <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                  <Button size="lg" asChild className="h-12 w-full text-base sm:w-auto">
                    <Link href="/book">Book an Appointment</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-12 w-full border-white/70 bg-white/10 text-base text-white hover:bg-white hover:text-primary sm:w-auto"
                  >
                    <Link href="/services">Our Services</Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="hidden rounded-lg border border-white/20 bg-white/14 p-5 text-white shadow-2xl backdrop-blur-md lg:block"
            >
              <div className="mb-5 flex items-center gap-3 border-b border-white/20 pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white/18">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/62">Clinic Desk</p>
                  <h2 className="text-2xl font-serif">Plan Your Visit</h2>
                </div>
              </div>
              <div className="space-y-4">
                {quickInfo.map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <item.icon className="mt-1 h-5 w-5 shrink-0 text-white/76" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm leading-6 text-white/70">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-white/90"
              >
                Contact the clinic
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-px overflow-hidden md:grid-cols-3">
            {quickInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-4 bg-card py-6 md:px-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                Care and practical services
              </p>
              <h2 className="text-4xl font-serif text-primary md:text-5xl">
                More than a consultation room.
              </h2>
            </div>
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/services">
                See all services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {servicePreview.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-lg border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-2xl font-serif text-foreground">{service.title}</h3>
                <p className="leading-7 text-muted-foreground">{service.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-lg border border-primary/10 bg-primary/5 p-5 text-sm text-primary md:grid-cols-3">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-5 w-5" />
              <span>Food badge: $100, or $80 each for groups of 8+</span>
            </div>
            <div className="flex items-center gap-3">
              <Camera className="h-5 w-5" />
              <span>Passport photos: 2 for $25 or 4 for $45</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <span>Printing: black and white $2, colour from $4</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative min-h-[460px]"
            >
              <div className="absolute left-0 top-0 h-[78%] w-[78%] overflow-hidden rounded-lg border border-secondary/20 bg-muted">
                <img
                  src={drPhoto}
                  alt="Dr. Thea Quaccoo"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="absolute bottom-0 right-0 h-[46%] w-[54%] overflow-hidden rounded-lg border-4 border-card bg-muted shadow-lg">
                <img
                  src={clinicRoom}
                  alt="Clinic interior"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-6 left-6 rounded-md bg-primary px-4 py-3 text-white shadow-lg">
                <p className="font-serif text-xl">Dr. Thea Quaccoo</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/65">General Practitioner</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                A steady hand for everyday health
              </p>
              <h2 className="mb-6 text-4xl font-serif text-primary md:text-5xl">
                Care that feels personal, practical, and close.
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-foreground/80">
                At Tobago East Medical Services, healthcare is more than treating symptoms. It is listening carefully, helping patients understand their options, and making routine medical needs easier to handle.
              </p>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                Dr. Thea Quaccoo brings years of experience and a deep commitment to the community. Her approach combines medical expertise with traditional bedside manner, ensuring every patient feels heard, respected, and truly cared for.
              </p>
              <div className="mb-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Flexible appointments",
                  "Home visits available",
                  "Required medicals handled",
                  "Photos and document printing",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-medium text-foreground/78">
                    <HeartPulse className="h-4 w-4 text-secondary" />
                    {item}
                  </div>
                ))}
              </div>
              <Button variant="link" asChild className="group px-0 text-base">
                <Link href="/about">
                  Learn more about our clinic
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                Ready when you are
              </p>
              <h2 className="text-3xl font-serif md:text-4xl">Book a visit or ask about a service.</h2>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button size="lg" variant="secondary" asChild className="h-12">
                <Link href="/book">Request Appointment</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 border-white/50 bg-transparent text-white hover:bg-white hover:text-primary"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
