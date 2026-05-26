export type ScoreRule = {
  fieldName: string;
  weight: number;
  thresholdRange: number[];
  enabled: boolean;
};