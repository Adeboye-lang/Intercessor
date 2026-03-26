interface AdminDatabaseNoticeProps {
  heading: string;
  body: string;
}

export default function AdminDatabaseNotice({
  heading,
  body,
}: AdminDatabaseNoticeProps) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-8 shadow-sm">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
          Database Setup Needed
        </p>
        <h1 className="mb-3 text-3xl font-serif text-brand-dark">{heading}</h1>
        <p className="text-sm leading-7 text-brand-dark/75">{body}</p>
      </div>
    </div>
  );
}
