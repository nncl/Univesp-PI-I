"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DateTimePicker from "@/components/DateTimePicker";
import { api, ApiError } from "@/lib/api";
import { formatPhone, isValidBrPhone } from "@/lib/format";

export default function AgendaPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tattooSize, setTattooSize] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [when, setWhen] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !description.trim() || !phone.trim()) {
      setError("Preencha nome, WhatsApp e descrição.");
      return;
    }
    if (!isValidBrPhone(phone)) {
      setError("Telefone inválido. Use o formato (DD) 9XXXX-XXXX.");
      return;
    }
    if (!when) {
      setError("Escolha uma data e horário.");
      return;
    }
    if (when <= new Date()) {
      setError("A data/hora escolhida deve ser no futuro.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.createContact({
        name: name.trim(),
        phone: phone.trim(),
        tattoo_size: tattooSize.trim() || undefined,
        description: description.trim(),
        suggested_date: when.toISOString(),
        email: email.trim() || undefined,
      });
      setSuccessMessage(result.message);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Falha ao enviar. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (successMessage) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1 className="font-serif text-4xl md:text-5xl">Solicitação enviada</h1>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">{successMessage}</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <header className="mb-12 max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-widest text-ink/60">Agendar</p>
          <h1 className="font-serif text-4xl md:text-5xl">Solicite um orçamento</h1>
          <p className="text-ink/70">
            Preencha os dados ao lado e escolha uma data — retornarei pelo WhatsApp.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid gap-12 md:grid-cols-2 md:items-start"
          noValidate
        >
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-ink/60">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-ink/20 bg-paper-warm px-3 py-2 outline-none focus:border-ink"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-ink/60">
                Tamanho da tatuagem (opcional)
              </label>
              <input
                type="text"
                value={tattooSize}
                onChange={(e) => setTattooSize(e.target.value)}
                placeholder="ex.: 10x4 cm"
                className="w-full border border-ink/20 bg-paper-warm px-3 py-2 outline-none focus:border-ink"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-ink/60">WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(19) 99999-9999"
                className="w-full border border-ink/20 bg-paper-warm px-3 py-2 outline-none focus:border-ink"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-ink/60">
                E-mail (opcional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-ink/20 bg-paper-warm px-3 py-2 outline-none focus:border-ink"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-ink/60">
                Descreva sua ideia
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-ink/20 bg-paper-warm px-3 py-2 outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="space-y-6">
            <DateTimePicker value={when} onChange={setWhen} />
            {when && (
              <p className="text-sm text-ink/70">
                Selecionado:{" "}
                <strong>
                  {when.toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })}
                </strong>
              </p>
            )}
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full border border-ink bg-ink px-6 py-3 text-sm uppercase tracking-widest text-paper transition hover:bg-paper hover:text-ink disabled:opacity-50"
            >
              {submitting ? "Enviando…" : "Enviar solicitação"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
