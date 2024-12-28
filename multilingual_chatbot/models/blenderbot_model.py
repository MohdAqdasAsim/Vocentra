from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

class BlenderbotModel:
    def __init__(self):
        # Use BlenderBot model
        model_name = "facebook/blenderbot_small-90M"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name,load_in_8bit=True, device_map="auto")
        
        # Use GPU if available
        if torch.cuda.is_available():
            self.model = self.model.to('cuda')
            
        # In-memory session tracking for greetings and farewells
        self.sessions = {}

    def generate_response(self, chat_id, prompt, max_length=150):
        """
        Generate a response based on the input prompt, adding greetings and farewells.
        """
        try:
            response_messages = []

            # Initialize session if not already created
            if chat_id not in self.sessions:
                self.sessions[chat_id] = {"greeted": False}

            # Add greeting for new session
            if not self.sessions[chat_id]["greeted"]:
                response_messages.append("Hello! How can I assist you today?")
                self.sessions[chat_id]["greeted"] = True

            # Tokenize the input prompt
            inputs = self.tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)

            # Move to GPU if available
            if torch.cuda.is_available():
                inputs = {k: v.to('cuda') for k, v in inputs.items()}

            # Generate response with sampling
            outputs = self.model.generate(
                **inputs,
                max_length=max_length,
                do_sample=True,
                temperature=0.7,
                top_p=0.9,
                repetition_penalty=1.2,
                pad_token_id=self.tokenizer.pad_token_id
            )

            # Decode the output tokens
            chatbot_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
            response_messages.append(chatbot_response)

            # Add farewell if user ends the conversation
            if prompt.strip().lower() in ["bye", "goodbye", "exit", "quit"]:
                response_messages.append("Goodbye! Have a great day!")
                del self.sessions[chat_id]  # End session

            return " ".join(response_messages)

        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")
