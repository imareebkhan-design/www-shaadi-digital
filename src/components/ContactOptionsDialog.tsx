import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageCircle, FileText } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const WA_NUMBER = "917838189916";
const WA_MESSAGE = encodeURIComponent("Hi, I'm interested in the Midnight Blue custom wedding invitation. Can you help me?");

interface ContactOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactOptionsDialog = ({ open, onOpenChange }: ContactOptionsDialogProps) => {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const waLink = isMobile
    ? `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`
    : `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${WA_MESSAGE}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please fill in your name and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_requests" as any).insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim() || null,
        template_id: "midnight-blue",
      } as any);
      if (error) throw error;
      toast.success("We've received your request! We'll get back to you soon. 🙏");
      setForm({ name: "", phone: "", message: "" });
      setShowForm(false);
      onOpenChange(false);
    } catch {
      // Fallback: open WhatsApp with form data
      const fallbackMsg = encodeURIComponent(
        `Hi, I'm ${form.name} (${form.phone}). I'm interested in the Midnight Blue custom invitation. ${form.message}`
      );
      const fallbackLink = isMobile
        ? `https://wa.me/${WA_NUMBER}?text=${fallbackMsg}`
        : `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${fallbackMsg}`;
      window.open(fallbackLink, "_blank");
      toast.info("We've opened WhatsApp for you instead. 💬");
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (val: boolean) => {
    if (!val) setShowForm(false);
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-secondary/20">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-foreground">Get in Touch</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Midnight Blue is a custom-crafted design. Our team will personally set it up for you.
          </DialogDescription>
        </DialogHeader>

        {!showForm ? (
          <div className="flex flex-col gap-3 mt-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-4 rounded-none border border-secondary/30 bg-[hsl(142,70%,30%)]/10 hover:bg-[hsl(142,70%,30%)]/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-[hsl(142,70%,40%)] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-body text-sm font-semibold text-foreground block">Connect on WhatsApp</span>
                <span className="text-xs text-muted-foreground">Chat with us instantly</span>
              </div>
            </a>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-3 px-5 py-4 rounded-none border border-secondary/30 bg-secondary/5 hover:bg-secondary/10 transition-colors group text-left"
            >
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <span className="font-body text-sm font-semibold text-foreground block">Fill Out a Form</span>
                <span className="text-xs text-muted-foreground">We'll call you back</span>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div>
              <Label htmlFor="contact-name" className="text-xs font-medium text-foreground">Your Name *</Label>
              <Input
                id="contact-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Priya Sharma"
                className="mt-1 rounded-none"
              />
            </div>
            <div>
              <Label htmlFor="contact-phone" className="text-xs font-medium text-foreground">Phone Number *</Label>
              <Input
                id="contact-phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="mt-1 rounded-none"
              />
            </div>
            <div>
              <Label htmlFor="contact-message" className="text-xs font-medium text-foreground">Message (optional)</Label>
              <Textarea
                id="contact-message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Tell us about your wedding..."
                rows={3}
                className="mt-1 rounded-none resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="rounded-none flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-none flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactOptionsDialog;
