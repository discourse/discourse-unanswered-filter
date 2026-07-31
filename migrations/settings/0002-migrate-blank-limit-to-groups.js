export default function migrate(settings) {
  if (
    settings.has("limit_to_groups") &&
    !String(settings.get("limit_to_groups") ?? "").trim()
  ) {
    settings.set("limit_to_groups", "4|5");
  }

  return settings;
}
