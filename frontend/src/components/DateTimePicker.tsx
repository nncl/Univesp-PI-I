"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-day-picker/dist/style.css";

const SLOT_START_HOUR = 9;
const SLOT_END_HOUR = 19;
const SLOT_STEP_MIN = 30;

function buildSlots(date: Date): Date[] {
  const out: Date[] = [];
  const now = new Date();
  for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_STEP_MIN) {
      const slot = new Date(date);
      slot.setHours(h, m, 0, 0);
      if (slot > now) out.push(slot);
    }
  }
  return out;
}

// react-day-picker v8 ships its aria labels in English only.
const dayPickerLabels = {
  labelPrevious: () => "Ir para o mês anterior",
  labelNext: () => "Ir para o próximo mês",
  labelMonthDropdown: () => "Mês",
  labelYearDropdown: () => "Ano",
  labelWeekday: (day: Date) => format(day, "EEEE", { locale: ptBR }),
  labelWeekNumber: (n: number) => `Semana ${n}`,
  labelDay: (day: Date) => format(day, "PPPP", { locale: ptBR }),
};

function fmtTime(d: Date): string {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

type Props = {
  value: Date | null;
  onChange: (next: Date | null) => void;
};

export default function DateTimePicker({ value, onChange }: Props) {
  const [day, setDay] = useState<Date | undefined>(value ?? undefined);

  const slots = useMemo(() => (day ? buildSlots(day) : []), [day]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSunday = day?.getDay() === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 font-sans text-xs uppercase tracking-widest text-ink/60">
          Escolha uma data
        </h2>
        <DayPicker
          mode="single"
          locale={ptBR}
          labels={dayPickerLabels}
          selected={day}
          onSelect={(d) => {
            setDay(d);
            onChange(null);
          }}
          disabled={[{ before: today }, { dayOfWeek: [0] }]}
          fromYear={today.getFullYear()}
          toYear={today.getFullYear() + 1}
        />
      </div>

      {day && !isSunday && (
        <div>
          <h2
            id="horarios-titulo"
            className="mb-3 font-sans text-xs uppercase tracking-widest text-ink/60"
          >
            Horário disponível
          </h2>
          {slots.length === 0 ? (
            <p className="text-sm text-ink/60">
              Sem horários disponíveis nesta data. Selecione outro dia.
            </p>
          ) : (
            <div
              role="group"
              aria-label="Horários disponíveis"
              className="grid grid-cols-3 gap-2 sm:grid-cols-4"
            >
              {slots.map((slot) => {
                const selected = value && slot.getTime() === value.getTime();
                return (
                  <button
                    key={slot.toISOString()}
                    type="button"
                    aria-pressed={Boolean(selected)}
                    onClick={() => onChange(slot)}
                    className={`border px-3 py-2 text-sm tracking-wide transition ${
                      selected
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/20 hover:border-ink"
                    }`}
                  >
                    {fmtTime(slot)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
