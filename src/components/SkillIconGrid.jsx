function SkillIconGrid({ items }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const id = item?.toString().trim().toLowerCase();
        if (!id) return null;
        const src = `https://skillicons.dev/icons?i=${encodeURIComponent(id)}&theme=dark`;
        return (
          <div
            key={item}
            className="flex items-center gap-2 rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2 shadow-sm"
          >
            <img
              src={src}
              alt={id}
              loading="lazy"
              className="h-6 w-6 shrink-0"
            />
            <span className="text-sm font-medium text-foreground/80 capitalize">{item}</span>
          </div>
        );
      })}
    </div>
  );
}

export default SkillIconGrid;
