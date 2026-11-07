import { Mail, NotebookPen, Phone, User, Users } from "lucide-react";
import type { Booking } from "@/src/types";
import { InfoRow, Panel } from "../ui";

export function CustomerPanel({ b }: { b: Booking }) {
  return (
    <Panel title="Customer" icon={User}>
      <dl>
        <InfoRow icon={User} label="Name">
          {b.customer.name}
        </InfoRow>
        {b.customer.phone && (
          <InfoRow icon={Phone} label="Phone">
            <a
              href={`tel:${b.customer.phone}`}
              className="font-medium text-indigo-700 hover:underline"
            >
              {b.customer.phone}
            </a>
          </InfoRow>
        )}
        {b.customer.email && (
          <InfoRow icon={Mail} label="Email">
            <a
              href={`mailto:${b.customer.email}`}
              className="break-all font-medium text-indigo-700 hover:underline"
            >
              {b.customer.email}
            </a>
          </InfoRow>
        )}
        {b.customer.team && (
          <InfoRow icon={Users} label="Team">
            {b.customer.team}
          </InfoRow>
        )}
        {b.note && (
          <InfoRow icon={NotebookPen} label="Note">
            {b.note}
          </InfoRow>
        )}
      </dl>
    </Panel>
  );
}
