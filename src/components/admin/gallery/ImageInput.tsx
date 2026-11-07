"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { ImagePlus, Link2, Loader2 } from "lucide-react";
import { useT } from "@/src/lib/i18n";
import { compressImage } from "@/src/lib/image";
import { cn } from "@/src/lib/utils";
import { abtn, inputClass } from "../ui";

/** Add a photo by pasting a link or uploading files (downscaled to fit browser storage). */
export function ImageInput({ onAdd }: { onAdd: (src: string) => void }) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const addUrl = () => {
    const v = url.trim();
    if (!/^https?:\/\/\S+$/i.test(v))
      return toast.error(t("Paste a full image link starting with https://"));
    onAdd(v);
    setUrl("");
  };
  const addFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 10);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    try {
      for (const f of files) onAdd(await compressImage(f));
    } catch {
      toast.error(t("That file couldn't be read as an image."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative min-w-56 flex-1">
        <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder={t("Paste image link (https://…)")}
          aria-label={t("Image link")}
          className={cn(inputClass, "pl-9")}
        />
      </div>
      <button type="button" onClick={addUrl} className={abtn.outline}>
        {t("Add link")}
      </button>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className={abtn.outline}
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ImagePlus className="size-4" />
        )}{" "}
        {t("Upload")}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={addFiles}
      />
    </div>
  );
}
