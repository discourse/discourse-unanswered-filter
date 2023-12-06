export default function migrate(settings) {
  if (
    settings.has("show_only_for_staff") &&
    settings.get("show_only_for_staff")
  ) {
    settings.set("limit_to_groups", 1);
  }
  return settings;
}
