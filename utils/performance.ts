export const measureDuration = async (action: () => Promise<void>): Promise<number> => {
  const startedAt = Date.now();

  await action();

  return Date.now() - startedAt;
};

const calculateP95 = (samples: number[]): number => {
  const sortedSamples = [...samples].sort((a, b) => a - b);
  const p95Index = Math.ceil(0.95 * sortedSamples.length) - 1;

  return sortedSamples[p95Index] ?? 0;
};

export const measureP95 = async (
  sampleCount: number,
  action: (sampleIndex: number) => Promise<void>,
): Promise<number> => {
  const samples: number[] = [];

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    samples.push(await measureDuration(() => action(sampleIndex)));
  }

  return calculateP95(samples);
};
