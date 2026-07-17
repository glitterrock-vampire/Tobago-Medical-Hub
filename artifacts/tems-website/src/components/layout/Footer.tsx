import { Link } from "wouter";
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";
import { EKG } from "@/components/shared/EKG";

export function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              <span className="font-serif font-bold text-lg text-primary tracking-tight">
                Tobago East Medical
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dr. Thea Quaccoo providing dedicated, compassionate, and expert care to the community of Tobago East.
            </p>
            <div className="w-24 text-primary opacity-50">
              <EKG />
            </div>
          </div>
          
          <div>
            <h3 className="font-serif font-medium mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Dr. Quaccoo</Link></li>
              <li><Link href="/book" className="hover:text-primary transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-medium mb-4 text-lg">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-secondary" />
                <span>Roxborough, Tobago<br/>Trinidad & Tobago</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary" />
                <span>(868) 555-0192</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" />
                <span>care@tems.tt</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-medium mb-4 text-lg">Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between"><span>Mon - Fri:</span> <span>8:00 AM - 4:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday:</span> <span>9:00 AM - 1:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday:</span> <span>Closed</span></li>
              <li className="mt-4 pt-4 border-t text-xs text-primary font-medium">Home visits available by appointment</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Tobago East Medical Services. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="/admin" className="hover:text-primary transition-colors">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
