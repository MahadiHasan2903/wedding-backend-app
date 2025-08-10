import { Language } from '../enum/message.enum';
export interface TranslatedMessageContent {
    originalLanguage: Language;
    translationEn: string;
    translationFr: string;
    translationEs: string;
}
export declare class GoogleTranslateService {
    private translator;
    constructor();
    translateMessage(text: string): Promise<TranslatedMessageContent>;
}
