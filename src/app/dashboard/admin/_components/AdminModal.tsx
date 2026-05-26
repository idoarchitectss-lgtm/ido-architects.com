"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Nội dung form bên trong modal */
  children: React.ReactNode;
  /** Chiều rộng: "sm" | "md" | "lg" | "xl" — default "md" */
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClass: Record<NonNullable<AdminModalProps["size"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

export default function AdminModal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: AdminModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={`${sizeClass[size]} bg-white`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
