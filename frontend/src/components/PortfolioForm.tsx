"use client";

import { useState } from "react";

export type PortfolioFormValues = {
  title: string;
  description: string;
  image_url: string;
};

type Props = {
  initial?: PortfolioFormValues;
  submitLabel?: string;
  onSubmit: (values: PortfolioFormValues) => Promise<void>;
};

export default function PortfolioForm({ initial, submitLabel = "Salvar", onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim() || !imageUrl.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ title, description, image_url: imageUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <label className="text-xs uppercase tracking-widest text-ink/60">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-ink/20 bg-paper-warm px-3 py-2 outline-none focus:border-ink"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs uppercase tracking-widest text-ink/60">Descrição</label>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-ink/20 bg-paper-warm px-3 py-2 outline-none focus:border-ink"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs uppercase tracking-widest text-ink/60">URL da imagem</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-ink/20 bg-paper-warm px-3 py-2 outline-none focus:border-ink"
        />
        {imageUrl && (
          <div className="mt-2 aspect-[4/5] max-w-xs overflow-hidden border border-ink/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Pré-visualização" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="border border-ink bg-ink px-6 py-3 text-sm uppercase tracking-widest text-paper transition hover:bg-paper hover:text-ink disabled:opacity-50"
      >
        {loading ? "Salvando…" : submitLabel}
      </button>
    </form>
  );
}
