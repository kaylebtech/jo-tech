"use client";

import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/constants";
import { useWhatsappNumber } from "@/components/providers/whatsapp-provider";

export function WhatsAppButton({
  message = "Hi Jo Tech! I'd like to ask about a product.",
  className = "",
}: {
  message?: string;
  className?: string;
}) {
  const whatsappNumber = useWhatsappNumber();

  return (
    <motion.a
      href={whatsappLink(message, whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-[0_8px_30px_rgba(0,0,0,0.18)] ring-4 ring-success/20 sm:h-16 sm:w-16 ${className}`}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-30" />
      <MessageCircle className="relative size-7" strokeWidth={2.25} />
    </motion.a>
  );
}
