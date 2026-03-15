"use client";

import { useCallback, useId, useState } from "react";
import {
  amountToRupees,
  formatDisplayWithIndianCommas,
  parseAmountInput,
  rupeesToHumanReadable,
  suggestCroreIfOver99Lakh,
  type AmountUnit,
} from "@/lib/amountUtils";

export interface PropertyAmountInputProps {
  /** Current display value (e.g. "65" or "1.25"). */
  value: string;
  /** Lakhs or Crores. */
  unit: AmountUnit;
  /** Called when display value or unit changes. Parent can derive rupees via amountToRupees(parseAmountInput(value), unit). */
  onChange: (displayValue: string, unit: AmountUnit) => void;
  label?: string;
  placeholder?: string;
  /** Optional id for the input; one is generated if not provided. */
  id?: string;
  /** Optional class for the wrapper. */
  className?: string;
  /** Input and select class names. */
  inputClassName?: string;
  selectClassName?: string;
  /** Minimum value in the selected unit (e.g. 0). */
  min?: number;
  /** Show the "Consider switching to Crores" hint when value in Lakhs > 99. */
  showCroreSuggestion?: boolean;
  /** Disabled state. */
  disabled?: boolean;
}

/**
 * Property amount input: unit toggle (Lakhs/Crores), Indian comma formatting as you type,
 * live human-readable feedback below, and optional suggestion to switch to Crores when > 99 Lakhs.
 * Underlying state should be normalized to full rupees when saving.
 */
export function PropertyAmountInput({
  value,
  unit,
  onChange,
  label,
  placeholder = "e.g. 65",
  id: providedId,
  className = "",
  inputClassName = "",
  selectClassName = "",
  min = 0,
  showCroreSuggestion = true,
  disabled = false,
}: PropertyAmountInputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  const num = parseAmountInput(value);
  const isValid = value.trim() === "" || Number.isFinite(num);
  const rupees = isValid && Number.isFinite(num) ? amountToRupees(num, unit) : 0;
  const humanReadable = value.trim() !== "" && isValid ? rupeesToHumanReadable(rupees) : null;
  const { suggestCrore, valueInCrores } = suggestCroreIfOver99Lakh(num, unit);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const parsed = parseAmountInput(raw);
      if (raw.trim() === "") {
        onChange("", unit);
        return;
      }
      if (Number.isNaN(parsed)) return;
      const formatted = formatDisplayWithIndianCommas(raw);
      onChange(formatted, unit);
    },
    [unit, onChange]
  );

  const handleUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newUnit = e.target.value as AmountUnit;
      onChange(value, newUnit);
    },
    [value, onChange]
  );

  const switchToCrores = useCallback(() => {
    const croreStr = valueInCrores % 1 === 0 ? String(valueInCrores) : valueInCrores.toFixed(2).replace(/\.?0+$/, "");
    onChange(croreStr, "crore");
  }, [valueInCrores, onChange]);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm ${inputClassName}`}
          aria-invalid={!isValid}
          aria-describedby={humanReadable ? `${id}-feedback` : undefined}
        />
        <select
          value={unit}
          onChange={handleUnitChange}
          disabled={disabled}
          className={`rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm min-w-[6rem] ${selectClassName}`}
          aria-label="Amount unit"
        >
          <option value="lakh">Lakhs</option>
          <option value="crore">Crores</option>
        </select>
      </div>
      {humanReadable && (
        <p id={`${id}-feedback`} className="mt-1.5 text-xs text-gray-500" role="status">
          You entered: {humanReadable}
        </p>
      )}
      {showCroreSuggestion && suggestCrore && (
        <p className="mt-1.5 text-xs text-amber-700 flex items-center gap-2 flex-wrap">
          <span>Consider using Crores for values ≥ 1 Crore.</span>
          <button
            type="button"
            onClick={switchToCrores}
            className="underline font-medium hover:no-underline"
          >
            Switch to Crores ({valueInCrores % 1 === 0 ? valueInCrores : valueInCrores.toFixed(2)})
          </button>
        </p>
      )}
    </div>
  );
}
