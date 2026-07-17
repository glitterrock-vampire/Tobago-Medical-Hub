import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

export default function About() {
  return (
    <PublicLayout>
      <div className="py-20 bg-secondary/5 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">About Dr. Thea Quaccoo</h1>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Dedicated to bringing high-quality, compassionate healthcare to the community of Tobago East.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden bg-primary/5 aspect-[4/5] border border-primary/10 relative flex flex-col items-center justify-center"
          >
            {/* Placeholder for Dr. Quaccoo's photo */}
            <div className="text-center p-8">
               <Stethoscope className="w-32 h-32 text-primary opacity-20 mx-auto mb-6" />
               <p className="text-sm text-primary/60 font-medium uppercase tracking-widest">Medical Director</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg prose-headings:font-serif prose-headings:font-normal prose-headings:text-primary prose-p:text-muted-foreground prose-p:leading-relaxed"
          >
            <h2>A Commitment to Community</h2>
            <p>
              Dr. Thea Quaccoo established Tobago East Medical Services with a singular vision: to ensure that the residents of Roxborough and the wider Tobago East area have access to reliable, high-quality, and deeply personal medical care.
            </p>
            
            <p>
              With extensive experience in general practice and a profound understanding of community health dynamics, Dr. Quaccoo treats the whole person, not just the symptoms. Her clinic is built on the foundation of trust, empathy, and uncompromising medical standards.
            </p>

            <h2>Our Philosophy</h2>
            <p>
              We believe that true healing begins with listening. In our fast-paced modern world, medical care can often feel transactional. At TEMS, we slow down. We take the time to understand your medical history, your current concerns, and your health goals.
            </p>

            <blockquote className="border-l-2 border-secondary pl-6 italic text-foreground my-8">
              "Healthcare is a partnership. My role is to empower my patients with knowledge, provide expert medical guidance, and support them at every step of their health journey."
            </blockquote>

            <p>
              Whether you are coming in for a routine check-up, managing a chronic condition, or requiring an urgent home visit, Dr. Quaccoo and her team are here to provide the support you need, right here at home.
            </p>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
