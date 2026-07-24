"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { updateInquiryStatus, deleteInquiry } from "@/lib/actions/inquiries";

const dateFormatter = new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" });

type InquiryRow = {
  id: string;
  type: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  message: string | null;
  status: string;
  createdAt: Date;
  product: { name: string; slug: string } | null;
};

export function InquiriesTable({ inquiries }: { inquiries: InquiryRow[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<InquiryRow | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell>
                  <p className="font-medium text-foreground">{inquiry.customerName}</p>
                  <p className="text-xs text-muted-foreground">{inquiry.customerPhone}</p>
                </TableCell>
                <TableCell className="capitalize text-muted-foreground">{inquiry.type.toLowerCase()}</TableCell>
                <TableCell className="text-muted-foreground">{inquiry.product?.name ?? "General"}</TableCell>
                <TableCell className="text-muted-foreground">{dateFormatter.format(inquiry.createdAt)}</TableCell>
                <TableCell>
                  <Select
                    value={inquiry.status}
                    onValueChange={async (value) => {
                      if (!value) return;
                      await updateInquiryStatus(inquiry.id, value as "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED");
                      toast.success("Status updated");
                      router.refresh();
                    }}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="CONTACTED">Contacted</SelectItem>
                      <SelectItem value="CONVERTED">Converted</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteTarget(inquiry)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {inquiries.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No inquiries yet.</p>}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this inquiry?"
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteInquiry(deleteTarget.id);
          toast.success("Inquiry deleted");
          router.refresh();
        }}
      />
    </>
  );
}
