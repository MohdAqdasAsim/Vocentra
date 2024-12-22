from transformers import MBartForConditionalGeneration, MBart50Tokenizer

class MBartModel:
    def __init__(self):
        model_name = "facebook/mbart-large-50-many-to-many-mmt"
        self.tokenizer = MBart50Tokenizer.from_pretrained(model_name)
        self.model = MBartForConditionalGeneration.from_pretrained(model_name)

    def translate(self, text, src_lang, tgt_lang):
        """Translate text from src_lang to tgt_lang."""
        self.tokenizer.src_lang = src_lang
        encoded_text = self.tokenizer(text, return_tensors="pt")
        generated_tokens = self.model.generate(
            **encoded_text, forced_bos_token_id=self.tokenizer.lang_code_to_id[tgt_lang]
        )
        return self.tokenizer.decode(generated_tokens[0], skip_special_tokens=True)