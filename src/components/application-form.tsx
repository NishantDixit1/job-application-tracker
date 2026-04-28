"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  applicationSchema,
  STATUSES,
  STATUS_LABELS,
  type ApplicationInput,
} from "@/lib/validation";
import {
  createApplication,
  updateApplication,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AiExtractInput } from "@/components/ai-extract-input";

type Mode =
  | { kind: "create" }
  | { kind: "edit"; id: string };

type Defaults = Partial<ApplicationInput>;

export function ApplicationForm({
  mode,
  defaults,
}: {
  mode: Mode;
  defaults?: Defaults;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: defaults?.company ?? "",
      role: defaults?.role ?? "",
      status: defaults?.status ?? "APPLIED",
      jobUrl: defaults?.jobUrl ?? "",
      location: defaults?.location ?? "",
      salary: defaults?.salary ?? "",
      notes: defaults?.notes ?? "",
    },
  });

  const [aiOpen, setAiOpen] = useState(mode.kind === "create");

  function onSubmit(values: ApplicationInput) {
    startTransition(async () => {
      const res =
        mode.kind === "create"
          ? await createApplication(values)
          : await updateApplication(mode.id, values);

      if (res && res.ok === false) {
        toast.error(res.error);
        return;
      }
      if (mode.kind === "edit") {
        toast.success("Application updated");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      {aiOpen ? (
        <AiExtractInput
          onApply={(extracted) => {
            if (extracted.company) form.setValue("company", extracted.company);
            if (extracted.role) form.setValue("role", extracted.role);
            if (extracted.location)
              form.setValue("location", extracted.location);
            if (extracted.salary) form.setValue("salary", extracted.salary);
            if (extracted.notes) form.setValue("notes", extracted.notes);
            toast.success("Form filled from job description");
          }}
          onClose={() => setAiOpen(false)}
        />
      ) : mode.kind === "create" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAiOpen(true)}
        >
          ✨ Autofill from job description
        </Button>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company *</FormLabel>
                  <FormControl>
                    <Input placeholder="Stripe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Frontend Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Remote · San Francisco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input placeholder="$160k – $200k" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    rows={6}
                    placeholder="Recruiter, interview rounds, follow-ups…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : mode.kind === "create" ? (
                "Save application"
              ) : (
                "Update"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
