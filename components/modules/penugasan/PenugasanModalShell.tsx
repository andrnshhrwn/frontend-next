import type { ReactNode } from "react";
import { BaseModal } from "@/components/ui/BaseModal";

interface PenugasanModalShellProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  preventClose?: boolean;
}

export default function PenugasanModalShell({
  title,
  subtitle,
  onClose,
  children,
  footer,
  wide = false,
  preventClose = false,
}: PenugasanModalShellProps) {
  return (
    <BaseModal
      isOpen={true}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth={wide ? "2xl" : "md"}
      footer={
        footer ? (
          <div className="flex justify-end gap-2">{footer}</div>
        ) : undefined
      }
      preventClose={preventClose}
    >
      {children}
    </BaseModal>
  );
}
