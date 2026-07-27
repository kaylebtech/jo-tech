"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from "@/components/ui/field";
import { createStaffSchema, type CreateStaffInput } from "@/lib/validations/staff";
import { createStaffAccount } from "@/lib/actions/staff";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function NewStaffDialog() {
  const [open, setOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStaffInput>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: { name: "", email: "", password: "", role: "STAFF" },
  });

  const onSubmit = async (data: CreateStaffInput) => {
    try {
      await createStaffAccount(data);
      setCreatedCredentials({ email: data.email, password: data.password });
      toast.success("Account created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      reset();
      setCreatedCredentials(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button className="rounded-full" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        New Account
      </Button>
      <DialogContent>
        {createdCredentials ? (
          <>
            <DialogHeader>
              <DialogTitle>Account created</DialogTitle>
            </DialogHeader>
            <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-sm">
              <p className="text-muted-foreground">
                Share these credentials with them directly (e.g. WhatsApp or in person) — this password
                won&apos;t be shown again.
              </p>
              <p className="mt-3">
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-mono font-medium">{createdCredentials.email}</span>
              </p>
              <p className="mt-1">
                <span className="text-muted-foreground">Password:</span>{" "}
                <span className="font-mono font-medium">{createdCredentials.password}</span>
              </p>
            </div>
            <DialogFooter className="mt-4">
              <Button className="rounded-full" onClick={() => handleOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>New Staff Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldGroup>
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="staff-name">Full Name</FieldLabel>
                  <Input id="staff-name" {...register("name")} />
                  <FieldError errors={[errors.name]} />
                </Field>

                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="staff-email">Email</FieldLabel>
                  <Input id="staff-email" type="email" {...register("email")} />
                  <FieldError errors={[errors.email]} />
                </Field>

                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="staff-password">Password</FieldLabel>
                  <div className="flex gap-2">
                    <Input id="staff-password" {...register("password")} />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Generate password"
                      onClick={() => setValue("password", generatePassword(), { shouldValidate: true })}
                    >
                      <Dices className="size-4" />
                    </Button>
                  </div>
                  <FieldDescription>At least 8 characters. You'll give this to the staff member yourself.</FieldDescription>
                  <FieldError errors={[errors.password]} />
                </Field>

                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STAFF">Staff — day-to-day CMS access</SelectItem>
                          <SelectItem value="SUPER_ADMIN">Super Admin — full access</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </FieldGroup>

              <DialogFooter className="mt-6">
                <Button type="submit" className="rounded-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  Create Account
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
