"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useT } from "@/src/lib/i18n";
import { addGalleryImage } from "@/src/lib/store";
import { Field, inputClass, Modal } from "../ui";
import { ImageInput } from "./ImageInput";

/** Caption first, then a link or upload adds the photo straight away. */
export function AddPhotoModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  const [title, setTitle] = useState("");
  return (
    <Modal open onClose={onClose} title={t("Add photos")}>
      <div className="space-y-3">
        <Field label="Caption">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("e.g. Friday night league")}
            className={inputClass}
          />
        </Field>
        <div className="border-t border-neutral-100 pt-3">
          <ImageInput
            onAdd={(src) => {
              addGalleryImage({ src, title: title.trim(), visible: true });
              toast.success(t("Photo added to the gallery"));
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
