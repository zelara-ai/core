import { ImportedStatement, OcrFormat } from './types';

export interface ReportParser {
  parse(data: ArrayBuffer, format: OcrFormat): Promise<ImportedStatement>;
}
