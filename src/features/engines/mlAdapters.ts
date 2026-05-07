export type MlCapability = {
  webGpu: boolean;
  wasm: boolean;
  message: string;
};

export function probeMlCapability(): MlCapability {
  const webGpu = "gpu" in navigator;
  const wasm = typeof WebAssembly !== "undefined";

  return {
    webGpu,
    wasm,
    message: webGpu
      ? "WebGPU is available for local ONNX/transformer adapters."
      : "WebGPU is unavailable; local ML adapters may fall back to WASM or stay disabled."
  };
}
