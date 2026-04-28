"use client";

import { useState, useTransition } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { extractFromJobDescription } from "@/lib/ai";
import type { AiExtractResult } from "@/lib/validation";

export function AiExtractInput({
  onApply,
  onClose,
}: {
  onApply: (data: AiExtractResult) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();

  function handleExtract() {
    if (text.trim().length < 30) {
      toast.error("Paste a longer job description (at least 30 characters)");
      return;
    }
    startTransition(async () => {
      const res = await extractFromJobDescription(text);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      onApply(res.data);
      setText("");
      onClose();
    });
  }

  return (
    <Card className="border-dashed">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Autofill from job description
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close AI autofill"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste a job posting below. We&apos;ll extract company, role, location,
          salary, and a short summary.
        </p>
        <Textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the job description here…"
          disabled={pending}
        />
        <div className="flex justify-end">
          <Button type="button" onClick={handleExtract} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Extract fields
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
