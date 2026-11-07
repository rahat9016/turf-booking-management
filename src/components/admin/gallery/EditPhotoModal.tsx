"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useT } from "@/src/lib/i18n";
import { updateGalleryImage } from "@/src/lib/store";
import type { GalleryImage } from "@/src/types";
import { abtn, Field, inputClass, Modal, ModalActions } from "../ui";

export function EditPhotoModal({
  image,
  onClose,
}: {
  image: GalleryImage;
  onClose: () => void;
}) {
  const t = useT();
  const [title, setTitle] = useState(image.title);
  return (
    <Modal open onClose={onClose} title={t("Edit photo")}>
      {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
      <img
        src={image.src}
        alt=""
        className="aspect-video w-full rounded-lg object-cover"
      />
      <div className="mt-4 space-y-3">
        <Field label="Caption">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </Field>
        <ModalActions>
          <button onClick={onClose} className={abtn.outline}>
            {t("Cancel")}
          </button>
          <button
            onClick={() => {
              updateGalleryImage(image.id, { title: title.trim() });
              toast.success(t("Photo updated"));
              onClose();
            }}
            className={abtn.primary}
          >
            {t("Save")}
          </button>
        </ModalActions>
      </div>
    </Modal>
  );
}
