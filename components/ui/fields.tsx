import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: ReactNode;
  errors?: string[];
  optional?: boolean;
}

const control =
  "block w-full min-h-11 rounded-sm border-[1.5px] border-edge bg-white px-3 py-2 text-base text-ink " +
  "placeholder:text-muted/70 aria-[invalid=true]:border-danger aria-[invalid=true]:border-2";

/** Ids for the hint and error elements so inputs can point aria-describedby at them. */
function describedBy({ id, hint, errors }: Pick<FieldShellProps, "id" | "hint" | "errors">) {
  return [hint ? `${id}-hint` : null, errors?.length ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

function Shell({ id, label, hint, errors, optional, children }: FieldShellProps & { children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {errors?.length ? (
        <p id={`${id}-error`} className="text-sm font-medium text-danger">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = FieldShellProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

export function TextField({ id, label, hint, errors, optional, ...input }: TextFieldProps) {
  return (
    <Shell {...{ id, label, hint, errors, optional }}>
      <input
        id={id}
        className={control}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={describedBy({ id, hint, errors })}
        {...input}
      />
    </Shell>
  );
}

type TextAreaFieldProps = FieldShellProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;

export function TextAreaField({ id, label, hint, errors, optional, ...input }: TextAreaFieldProps) {
  return (
    <Shell {...{ id, label, hint, errors, optional }}>
      <textarea
        id={id}
        className={`${control} min-h-24 resize-y`}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={describedBy({ id, hint, errors })}
        {...input}
      />
    </Shell>
  );
}

type SelectFieldProps = FieldShellProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className"> & {
    options: readonly { value: string; label: string }[];
  };

export function SelectField({ id, label, hint, errors, optional, options, ...input }: SelectFieldProps) {
  return (
    <Shell {...{ id, label, hint, errors, optional }}>
      <select
        id={id}
        className={control}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={describedBy({ id, hint, errors })}
        {...input}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Shell>
  );
}

/** Polite live region for action results; keep it mounted so screen readers announce changes. */
export function FormMessage({ ok, message }: { ok?: boolean; message?: string }) {
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`min-h-6 text-sm font-medium ${ok ? "text-success" : "text-danger"}`}
    >
      {message}
    </p>
  );
}
