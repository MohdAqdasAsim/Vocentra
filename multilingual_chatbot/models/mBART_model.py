from transformers import MBartForConditionalGeneration, MBart50Tokenizer
import torch

class MBartModel:
    def __init__(self):
        model_name = "facebook/mbart-large-50-many-to-many-mmt"
        self.tokenizer = MBart50Tokenizer.from_pretrained(model_name)
        self.model = MBartForConditionalGeneration.from_pretrained(model_name)
        
        # Use GPU if available
        if torch.cuda.is_available():
            self.model = self.model.to('cuda')

        # Extended language mapping
        self.lang_map = {
            "ar": "ar_AR",
            "cs": "cs_CZ",
            "de": "de_DE",
            "en": "en_XX",
            "es": "es_XX",
            "et": "et_EE",
            "fi": "fi_FI",
            "fr": "fr_XX",
            "gu": "gu_IN",
            "hi": "hi_IN",
            "it": "it_IT",
            "ja": "ja_XX",
            "kk": "kk_KZ",
            "ko": "ko_KR",
            "lt": "lt_LT",
            "lv": "lv_LV",
            "my": "my_MM",
            "ne": "ne_NP",
            "nl": "nl_XX",
            "ro": "ro_RO",
            "ru": "ru_RU",
            "si": "si_LK",
            "tr": "tr_TR",
            "vi": "vi_VN",
            "zh": "zh_CN",
            "af": "af_ZA",
            "az": "az_AZ",
            "bn": "bn_IN",
            "fa": "fa_IR",
            "he": "he_IL",
            "hr": "hr_HR",
            "id": "id_ID",
            "ka": "ka_GE",
            "km": "km_KH",
            "mk": "mk_MK",
            "ml": "ml_IN",
            "mn": "mn_MN",
            "mr": "mr_IN",
            "pl": "pl_PL",
            "ps": "ps_AF",
            "pt": "pt_XX",
            "sv": "sv_SE",
            "sw": "sw_KE",
            "ta": "ta_IN",
            "te": "te_IN",
            "th": "th_TH",
            "tl": "tl_XX",
            "uk": "uk_UA",
            "ur": "ur_PK",
            "xh": "xh_ZA",
            "gl": "gl_ES",
            "sl": "sl_SI"
        }


    def preprocess_text(self, text):
        """
        Clean and prepare text for translation
        """
        # Remove multiple spaces
        text = ' '.join(text.split())
        # Ensure text ends with proper punctuation
        if text and text[-1] not in '.!?':
            text += '.'
        return text

    def translate(self, text, src_lang, tgt_lang):
        """
        Translate text from src_lang to tgt_lang.
        """
        # Input validation
        if not text.strip():
            raise ValueError("Input text cannot be empty")
            
        # Validate languages
        if src_lang not in self.lang_map or tgt_lang not in self.lang_map:
            raise ValueError(
                f"Invalid language code. Supported languages: {list(self.lang_map.keys())}"
            )

        try:
            # Preprocess text
            text = self.preprocess_text(text)
            
            # Map language codes
            src_lang_code = self.lang_map[src_lang]
            tgt_lang_code = self.lang_map[tgt_lang]
            
            # Set source language
            self.tokenizer.src_lang = src_lang_code
            
            # Encode with padding
            encoded = self.tokenizer(text, 
                                   return_tensors="pt", 
                                   padding=True, 
                                   truncation=True, 
                                   max_length=512)
            
            # Move to GPU if available
            if torch.cuda.is_available():
                encoded = {k: v.to('cuda') for k, v in encoded.items()}
            
            # Generate translation with improved parameters
            generated = self.model.generate(
                **encoded,
                forced_bos_token_id=self.tokenizer.lang_code_to_id[tgt_lang_code],
                max_length=512,
                num_beams=5,
                length_penalty=1.0,
                early_stopping=True,
                do_sample=False,  # Deterministic output
                temperature=1.0,
                top_p=0.95,
                repetition_penalty=1.2
            )
            
            # Decode the translation
            translated = self.tokenizer.decode(generated[0], 
                                            skip_special_tokens=True,
                                            clean_up_tokenization_spaces=True)
            
            # Log for debugging
            print(f"Debug - Source ({src_lang}): {text}")
            print(f"Debug - Target ({tgt_lang}): {translated}")
            
            return translated
            
        except Exception as e:
            raise Exception(f"Translation error: {str(e)}")

    def __del__(self):
        """
        Clean up GPU memory
        """
        if torch.cuda.is_available():
            torch.cuda.empty_cache()