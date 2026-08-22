import React from "react";
import { Save, Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  saving: boolean;
  isAdmin: boolean;
  saveLabel?: string;
  cancelLabel?: string;
}

export function FormActions({
  onCancel,
  saving,
  isAdmin,
  saveLabel = "SAVE_RECORD",
  cancelLabel = "CANCEL"
}: FormActionsProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-white/5">
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving || !isAdmin}
          className="flex items-center gap-2 bg-[#64ffda]/10 hover:bg-[#64ffda]/20 border border-[#64ffda] disabled:bg-white/5 disabled:border-white/5 text-[#64ffda] disabled:text-[#8892b0] px-6 py-3 rounded-xl font-mono text-xs tracking-wider transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#64ffda]" />
              WRITING...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {saveLabel}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-mono text-xs tracking-wider transition"
        >
          {cancelLabel}
        </button>
      </div>
      
      {!isAdmin && (
        <p className="text-[10px] text-amber-500 font-mono">
          ⚠ Write permission restricted: Save action is disabled under guest/viewer credentials.
        </p>
      )}
    </div>
  );
}
