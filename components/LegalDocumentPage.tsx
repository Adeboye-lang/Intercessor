type LegalDocumentPageProps = {
  title: string;
  content: string;
};

export default function LegalDocumentPage({
  title,
  content,
}: LegalDocumentPageProps) {
  return (
    <div className="relative overflow-hidden bg-[#FAF9F6] text-[#3D532D]">
      <div className="absolute inset-0 bg-sacred-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#C5A059]/10 via-[#FAF9F6]/40 to-transparent pointer-events-none" />

      <div className="relative container mx-auto max-w-4xl px-6 md:px-12 py-16 md:py-24">
        <div className="mb-12 border-b border-[#3D532D]/10 pb-10">
          <span className="inline-flex items-center border border-[#C5A059]/30 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.35em] text-[#C5A059]">
            Legal
          </span>
          <h1 className="mt-6 font-serif text-5xl md:text-6xl leading-tight tracking-tight text-[#3D532D]">
            {title}
          </h1>
        </div>

        <article className="bg-white/85 backdrop-blur-sm border border-[#3D532D]/10 px-6 py-8 md:px-10 md:py-12 shadow-sm">
          <div className="whitespace-pre-wrap font-serif text-base leading-8 text-[#3D532D]/90">
            {content}
          </div>
        </article>
      </div>
    </div>
  );
}
