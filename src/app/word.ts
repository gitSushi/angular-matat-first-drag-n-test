export interface Word {
  id: number,
  parendId: number,
  value: string,
  words?: Word[]
}