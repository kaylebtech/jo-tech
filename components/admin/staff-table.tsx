"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteStaffAccount } from "@/lib/actions/staff";

const dateFormatter = new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" });

type StaffRow = { id: string; name: string | null; email: string; role: "SUPER_ADMIN" | "STAFF"; createdAt: Date };

export function StaffTable({ staff, currentUserId }: { staff: StaffRow[]; currentUserId: string }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<StaffRow | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {member.name ?? "—"}
                  {member.id === currentUserId && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                </TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={member.role === "SUPER_ADMIN" ? "outline" : "secondary"}
                    className={member.role === "SUPER_ADMIN" ? "border-primary/30 bg-primary/10 text-primary" : ""}
                  >
                    {member.role === "SUPER_ADMIN" ? "Super Admin" : "Staff"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{dateFormatter.format(member.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {member.id !== currentUserId && (
                    <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => setDeleteTarget(member)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Remove ${deleteTarget?.name ?? deleteTarget?.email}?`}
        description="They'll immediately lose access to the admin dashboard."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteStaffAccount(deleteTarget.id);
          toast.success("Account removed");
          router.refresh();
        }}
      />
    </>
  );
}
