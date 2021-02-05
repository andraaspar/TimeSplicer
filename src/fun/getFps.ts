export function getFps() {
  return app?.project?.activeItem?.frameRate ?? 25;
}
