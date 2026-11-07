/** Red line under a field; renders nothing without a message. */
export function FieldError({ message }: { message?: string | false }) {
  return message ? (
    <p className="mt-1.5 text-xs text-rose-600">{message}</p>
  ) : null;
}
