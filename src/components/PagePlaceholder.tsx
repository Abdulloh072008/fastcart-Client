// Temporary scaffold placeholder so the routing skeleton renders end-to-end.
// Each page is replaced by its real implementation in the relevant phase.
export default function PagePlaceholder({ title }: { title: string }) {
  return (
    <section className="py-10">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        This page is part of the FastCart scaffold and will be built out in a
        later phase.
      </p>
    </section>
  )
}
