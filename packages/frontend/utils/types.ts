export interface Image {
  id: string;
  promptid: string;
  width: 512;
  height: 640;
  upscaled_width: 2048;
  upscaled_height: 2560;
  userid: string;
}

export interface Prompt {
  id: string;
  prompt: string;
  negativePrompt: string;
  timestamp: string;
  grid: boolean;
  seed: string;
  c: number;
  model: string;
  width: number;
  height: number;
  initImage: string | null;
  initImageStrength: string | number | null;
  is_private: boolean;
  images: Image[];
}

export interface SearchResponse {
  nextCursor: number;
  prompts: Prompt[];
  images: Image[];
  count: number;
  baseURL: string;
}
