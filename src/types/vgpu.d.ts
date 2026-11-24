/// <reference types="@vgpu/wgsl/wgsl-types" />
/// <reference types="@webgpu/types" />

declare module "../scripts/black-hole/noise-volume.mjs" {
  import type { Gpu, Texture } from "vgpu";
  export const NOISE_VOLUME_SIZE: number;
  export function createNoiseVolume(
    gpu: Gpu,
    size?: number,
    label?: string,
  ): Texture;
  export function noiseVolumeSampler(
    vgpu: typeof import("vgpu"),
    gpu: Gpu,
  ): GPUSampler;
}
