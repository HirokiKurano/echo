export function openGlanceWindow() {
  const url = `${window.location.origin}/widget?glance=1`;
  const popup = window.open(
    url,
    "spark-glance",
    "width=390,height=680,resizable=yes,scrollbars=yes",
  );

  if (!popup) {
    window.location.href = url;
  }
}
