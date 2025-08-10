import { Injectable } from '@nestjs/common';
import { Translate } from '@google-cloud/translate/build/src/v2';
import { Language } from '../enum/message.enum';

export interface TranslatedMessageContent {
  originalLanguage: Language;
  translationEn: string;
  translationFr: string;
  translationEs: string;
}

@Injectable()
export class GoogleTranslateService {
  private translator: Translate;

  constructor() {
    this.translator = new Translate();
  }

  async translateMessage(text: string): Promise<TranslatedMessageContent> {
    const [detection] = await this.translator.detect(text);
    const originalLanguage = detection.language as Language;

    const [translationEn] = await this.translator.translate(text, 'en');
    const [translationFr] = await this.translator.translate(text, 'fr');
    const [translationEs] = await this.translator.translate(text, 'es');

    return {
      originalLanguage,
      translationEn,
      translationFr,
      translationEs,
    };
  }
}
