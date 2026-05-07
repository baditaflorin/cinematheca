export type ColorGrade = {
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  lut: "none" | "print-warm" | "cool-night" | "festival-safe";
};

export type RestorationRecipe = {
  upscale: "off" | "2x" | "4x";
  interpolation: "off" | "rife-2x";
  deblur: boolean;
  denoise: boolean;
  colorize: boolean;
};

export const defaultColorGrade: ColorGrade = {
  exposure: 0,
  contrast: 1,
  saturation: 1,
  temperature: 0,
  lut: "festival-safe"
};

export const defaultRestorationRecipe: RestorationRecipe = {
  upscale: "2x",
  interpolation: "off",
  deblur: true,
  denoise: true,
  colorize: false
};

export function buildColorFilter(grade: ColorGrade): string {
  const brightness = (grade.exposure / 100).toFixed(2);
  const contrast = grade.contrast.toFixed(2);
  const saturation = grade.saturation.toFixed(2);
  const temperature = grade.temperature;
  const balance =
    temperature === 0
      ? ""
      : `,colorbalance=rs=${(temperature / 200).toFixed(2)}:bs=${(-temperature / 200).toFixed(2)}`;

  return `eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}${balance}`;
}

export function buildCssPreviewFilter(grade: ColorGrade): string {
  const brightness = 1 + grade.exposure / 100;
  const sepia = grade.temperature > 0 ? Math.min(0.18, grade.temperature / 400) : 0;
  const hue = grade.temperature < 0 ? Math.max(-12, grade.temperature / 6) : 0;

  return `brightness(${brightness}) contrast(${grade.contrast}) saturate(${grade.saturation}) sepia(${sepia}) hue-rotate(${hue}deg)`;
}

export function buildPictureRecipe(
  grade: ColorGrade,
  restoration: RestorationRecipe
): string[] {
  const steps = [
    `Apply color filter: ${buildColorFilter(grade)}.`,
    `Use OCIO/LUT intent: ${grade.lut}.`,
    `Upscale setting: ${restoration.upscale}.`,
    `Frame interpolation: ${restoration.interpolation}.`
  ];

  if (restoration.deblur) {
    steps.push("Run NAFNet ONNX deblur adapter when available.");
  }
  if (restoration.denoise) {
    steps.push(
      "Run RNNoise audio denoise and Real-ESRGAN picture cleanup where available."
    );
  }
  if (restoration.colorize) {
    steps.push("Run DeOldify ONNX colorization as an explicit restoration pass.");
  }

  return steps;
}
