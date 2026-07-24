"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FAQFormDialog, type EditableFAQ } from "@/components/admin/faq-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteFAQ } from "@/lib/actions/faqs";

export function FAQsTable({ faqs }: { faqs: EditableFAQ[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EditableFAQ | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EditableFAQ | null>(null);

  const refresh = () => router.refresh();

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          className="rounded-full"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          New FAQ
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="max-w-md font-medium">{faq.question}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{faq.category ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit"
                    onClick={() => {
                      setEditing(faq);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteTarget(faq)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {faqs.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No FAQs yet.</p>}
      </div>

      <FAQFormDialog open={formOpen} onOpenChange={setFormOpen} faq={editing} onSaved={refresh} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this FAQ?"
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteFAQ(deleteTarget.id);
          toast.success("FAQ deleted");
          refresh();
        }}
      />
    </>
  );
}
