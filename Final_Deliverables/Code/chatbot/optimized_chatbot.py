import os
from groq import Groq
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from pinecone import Pinecone
from functools import lru_cache
import asyncio
import re
import traceback
from pymongo import MongoClient

# Product cache
product_cache = {}

class OptimizedChatbot:
    def __init__(self):
        self.groq_client = Groq(api_key="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")
        self.vector_store = None
        self.conversation_history = {}  # Store conversation history
        self.max_history = 5  # Max number of conversation pairs to remember
        self.initialize_vector_store()
        self.load_product_cache()
        
    def initialize_vector_store(self):
        pc = Pinecone("pcsk_iAgUU_FXUSfemuBAKgQTBG1eKLxZyoxA9RfUMgdpQJNkF8H1dYSaQtRbRAauDzviDsQ8w")
        index_name = "llms-project"
        
        embeddings = HuggingFaceEmbeddings()
        index = pc.Index(index_name)
        self.vector_store = PineconeVectorStore(index=index, embedding=embeddings)
    
    def load_product_cache(self):
        # Preload common product details
        global product_cache
        
        client = MongoClient("mongodb+srv://JB:Ahmad123@shopsavvy.xaqy1.mongodb.net/?retryWrites=true&w=majority&appName=ShopSavvy")
        db = client["test"]
        collection = db["productdata"]
        
        products = collection.find({}, {"_id": 1, "detailed_description": 1})
        for product in products:
            product_cache[str(product["_id"])] = {
                "description": product.get("detailed_description", "")
            }
    
    def extract_search_terms(self, llm_response):
        pattern = r"\[SEARCH_TERMS\](.*?)\[/SEARCH_TERMS\]"
        match = re.search(pattern, llm_response, re.DOTALL)
        if match:
            terms = match.group(1).strip()
            if terms:
                return [term.strip() for term in terms.split(",")]
        return []
    
    def extract_response_template(self, llm_response):
        pattern = r"\[RESPONSE_TEMPLATE\](.*?)\[/RESPONSE_TEMPLATE\]"
        match = re.search(pattern, llm_response, re.DOTALL)
        if match:
            return match.group(1).strip()
        
        # If we can't find the template tags, check if there's content after the search terms section
        search_pattern = r"\[/SEARCH_TERMS\](.*)"
        search_match = re.search(search_pattern, llm_response, re.DOTALL)
        if search_match and search_match.group(1).strip():
            # Return everything after the search terms section if it exists
            return search_match.group(1).strip()
        
        # Only use default as a last resort
        return "I'm your fashion assistant. How can I help you with style advice today?"
        
    def is_greeting(self, message):
        """Check if the message is a greeting."""
        greetings = ["hello", "hi", "hey", "greetings", "howdy", "sup", "good morning", "good afternoon", "good evening"]
        message_lower = message.lower()
        return any(greeting in message_lower for greeting in greetings)
    
    def is_fashion_query(self, message):
        """More robust check if the message is related to fashion."""
        fashion_terms = [
            "outfit", "style", "wear", "fashion", "dress", "clothes", 
            "shirt", "pant", "shoe", "boot", "jacket", "sweater", "jeans",
            "accessory", "match", "color", "look", "top", "bottom", "skirt",
            "hat", "scarf", "hoodie", "suit", "tie", "formal", "casual",
            "professional", "party", "office", "date", "occasion","items"
        ]
        message_lower = message.lower()
        
        # Check for fashion terms
        if any(term in message_lower for term in fashion_terms):
            return True
            
        # Check for fashion question patterns
        fashion_patterns = [
            r"what (should|can|would) (i|one) wear",
            r"how (to|do i|should i|can i) (style|match|pair)",
            r"recommend .* (clothes|outfits|styles)",
            r"looking for .* (style|outfit|clothes)",
            r"need help .* (dressing|outfit|clothes)"
        ]
        
        for pattern in fashion_patterns:
            if re.search(pattern, message_lower):
                return True
                
        return False
    
    @lru_cache(maxsize=100)
    def cached_vector_search(self, query_text, product_type=None):
        # Optimize search with caching
        filter_dict = {"type": product_type} if product_type else None
        
        retriever = self.vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={
                "k": 2,  # Increased from 1 to 3 to get more variety
                "filter": filter_dict
            }
        )
        return retriever.get_relevant_documents(query_text)
    
    def update_conversation_history(self, user_message, bot_response):
        """Update the conversation history with the latest exchange and extract context."""
        # Check if we need to remove older exchanges
        if len(self.conversation_history) >= self.max_history * 2:
            # Remove the oldest exchange
            oldest_keys = sorted([k for k in self.conversation_history.keys() if k.startswith('user_') or k.startswith('bot_')])[:2]
            for key in oldest_keys:
                self.conversation_history.pop(key, None)
        
        # Add the new exchange
        idx = len([k for k in self.conversation_history.keys() if k.startswith('user_')])
        self.conversation_history[f"user_{idx}"] = user_message
        self.conversation_history[f"bot_{idx}"] = bot_response
        
        # Extract and save fashion preferences from user messages
        if "preferences" not in self.conversation_history:
            self.conversation_history["preferences"] = {}
        
        # Extract color preferences
        color = extract_color(user_message)
        if color:
            self.conversation_history["preferences"]["color"] = color
        
        # Extract item preferences
        item = extract_main_item(user_message)
        if item and item != "outfit":
            self.conversation_history["preferences"]["item"] = item
    
    def get_formatted_history(self):
        """Get conversation history formatted for prompt inclusion."""
        history_text = ""
        user_keys = sorted([k for k in self.conversation_history.keys() if k.startswith('user_')])
        
        for user_key in user_keys:
            idx = user_key.split('_')[1]
            bot_key = f"bot_{idx}"
            if bot_key in self.conversation_history:
                history_text += f"User: {self.conversation_history[user_key]}\n"
                history_text += f"Assistant: {self.conversation_history[bot_key]}\n\n"
        return history_text
    
    async def generate_search_terms(self, user_message):
        # Include conversation history in the prompt
        history = self.get_formatted_history()

        prompt = f"""
        <Prompt>
        <Context>
            You are a virtual fashion assistant on an e-commerce platform. You specialize in clothing recommendations based on user queries. 
            The platform includes a wide variety of clothing items such as tops (shirts, sweatshirts, dresses), bottoms (jeans, joggers, skirts), and shoes (boots, sneakers, flats).
            
            Conversation history:
            {history if history else "No prior conversation."}

            When responding, reference only relevant parts of the history. Focus your advice on user intent without unnecessary details or repetition.

            <Rules>
            - If the message is about what to wear, how to style something, or fashion advice, extract meaningful search terms and create a stylish yet practical recommendation.
            - If it’s a greeting (e.g., "hello", "hi"), return a short friendly welcome. No need for search terms or fashion suggestions.
            - If it’s not related to fashion (e.g., weather, tech), respond politely and redirect to fashion topics. Avoid hallucinations or product mentions.
            - Use phrases like “You can pair the [user’s item] with…” to personalize recommendations.
            - Clearly explain how the recommended items match in terms of style, color, and fabric.
            - If no specific item is mentioned, suggest versatile pieces suitable for various outfits with justifications.
            </Rules>
        </Context>

        <Instructions>
            - <Task>
            Classify the input as either a fashion query, greeting, or unrelated message.
            </Task>
            - <Response>
            If it’s a fashion query:
                - Extract 3–5 search terms that help find matching products.
                - Create a natural-sounding template response with styling advice.
                - Use {{products}} as a placeholder where product results will be inserted.

            If it’s a greeting:
                - Create a short, warm welcome message.
                - Do not include search terms.

            If it’s unrelated:
                - Create a polite redirection message.
                - Do not include search terms.
            </Response>
        </Instructions>

        <Query>
            <UserMessage>{user_message}</UserMessage>
        </Query>

        <Answer>
            Format your output like this:

            [SEARCH_TERMS]
            term1, term2, term3
            [/SEARCH_TERMS]

            [RESPONSE_TEMPLATE]
            Your conversational response here. If a fashion query, include styling advice with a {{products}} placeholder.
            [/RESPONSE_TEMPLATE]
        </Answer>

        <Examples>
            - For: "what can I wear with blue jeans?"
            [SEARCH_TERMS]
            white top blue jeans, black shirt blue jeans, denim jacket blue jeans
            [/SEARCH_TERMS]

            [RESPONSE_TEMPLATE]
            Blue jeans are super versatile! You can pair them with classic white tops or try a fitted black shirt for a sharper look.

            {{products}}

            Each of these adds a different vibe—from casual to polished—while letting the jeans remain your staple piece.
            [/RESPONSE_TEMPLATE]

            - For: "hi there"
            [SEARCH_TERMS]
            [/SEARCH_TERMS]

            [RESPONSE_TEMPLATE]
            Hey there! I'm your fashion assistant here to help you style outfits and discover new wardrobe ideas. How can I help today?
            [/RESPONSE_TEMPLATE]

            - For: "what's the weather in Lahore?"
            [SEARCH_TERMS]
            [/SEARCH_TERMS]

            [RESPONSE_TEMPLATE]
            I'm here to help you with fashion advice! Let me know what you’re planning to wear or shop for, and I’ll help you style it.
            [/RESPONSE_TEMPLATE]
        </Examples>
        </Prompt>
        """
        
        chat_completion = self.groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
        )
        
        response = chat_completion.choices[0].message.content
        return response
    
    async def search_products(self, search_terms):
        if not search_terms:
            return []
            
        # Perform parallel vector searches
        tasks = []
        for term in search_terms:
            product_type = extract_product_type(term)
            tasks.append(asyncio.create_task(
                self.async_vector_search(term, product_type)
            ))
        
        results = await asyncio.gather(*tasks)
        product_ids = []
        
        for docs in results:
            for doc in docs:
                if 'mongo_id' in doc.metadata:
                    product_ids.append(doc.metadata['mongo_id'])
        
        return product_ids
    
    async def async_vector_search(self, query, product_type=None):
        # Async wrapper for vector search
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None, self.cached_vector_search, query, product_type
        )
    
    def fill_response_template(self, template, product_ids):
        # Handle non-fashion queries or greetings
        if not product_ids:
            return template
            
        # Fill template with actual product descriptions
        products = []
        
        for product_id in product_ids:
            if product_id in product_cache:
                products.append(product_cache[product_id]["description"])
            else:
                # Fallback to DB lookup if needed
                client = MongoClient("mongodb+srv://JB:Ahmad123@shopsavvy.xaqy1.mongodb.net/?retryWrites=true&w=majority&appName=ShopSavvy")
                db = client["test"]
                collection = db["productdata"]
                product_data = collection.find_one({"_id": product_id})
                if product_data and "detailed_description" in product_data:
                    products.append(product_data["detailed_description"])
                    # Update cache
                    product_cache[product_id] = {"description": product_data["detailed_description"]}
                else:
                    products.append(f"Product {product_id}")
        
        # More robust template filling
        if "{products}" in template:
            if products:
                products_text = "\n".join([f"- {p}" for p in products])
                template = template.replace("{products}", products_text)
            else:
                template = template.replace("{products}", "No specific products found. Please try a more specific fashion query.")
        
        # Check for individual product placeholders
        for i in range(min(len(products), 5)):  # Support up to product5
            placeholder = f"{{product{i+1}}}"
            if placeholder in template and i < len(products):
                template = template.replace(placeholder, products[i])
        
        return template
    
    def is_valid_response(self, response):
        """Check if the response is valid and helpful."""
        # Check if the response still contains unfilled placeholders
        if "{products}" in response:
            return False
            
        # Check if response is too short
        if len(response.split()) < 5:
            return False
            
        return True
    
    async def process_chat(self, user_message):
        try:
            print(f"Processing user message: {user_message}")
            
            # Step 1: Generate search terms and response template
            llm_response = await self.generate_search_terms(user_message)
            print(f"LLM Response: {llm_response}")
            
            # Step 2: Extract search terms and template
            search_terms = self.extract_search_terms(llm_response)
            response_template = self.extract_response_template(llm_response)
            print(f"Extracted search terms: {search_terms}")
            print(f"Extracted template: {response_template}")
            
            # Step 3: Search for products if we have search terms (skip greeting check)
            product_ids = []
            if search_terms:  # Simply check if we have search terms
                print("Search terms found, searching for products...")
                product_ids = await self.search_products(search_terms)
                print(f"Found product IDs: {product_ids}")
            else:
                print("No search terms found")
            
            # Step 4: Fill template with product details
            final_response = self.fill_response_template(response_template, product_ids)
            print(f"Final response: {final_response}")
            
            # Step 5: Validate the response and fix any issues
            if not self.is_valid_response(final_response):
                print("Invalid response detected, using improved fallback")
                if "{products}" in final_response:
                    # Replace unfilled product placeholder with appropriate text
                    if product_ids:
                        products_text = "\n".join([f"- {product_cache.get(pid, {}).get('description', f'Product {pid}')}" for pid in product_ids[:3]])
                        final_response = final_response.replace("{products}", products_text)
                    else:
                        final_response = final_response.replace("{products}", "a variety of complementary pieces")
                
                # If response is still too short after fixing placeholders
                if len(final_response.split()) < 5:
                    if search_terms:
                        # Create a better fallback that uses the search terms
                        items = [term.split()[-1] for term in search_terms if len(term.split()) > 1]
                        item_text = ", ".join(items[:3]) if items else "items"
                        final_response = f"Based on your query, I'd recommend styling with {item_text}. Here are some specific suggestions:\n\n" + "\n".join([f"- {product_cache.get(pid, {}).get('description', f'A stylish option that complements your look')}" for pid in product_ids[:3]])
                    else:
                        # Generic fashion response as last resort
                        final_response = "I can help you find the perfect outfit combinations. What specific items or styles are you interested in?"
            
            # Update conversation history
            self.update_conversation_history(user_message, final_response)
            
            return {"response": final_response, "ids": product_ids}
        except Exception as e:
            print(f"Error in process_chat: {str(e)}")
            print(traceback.format_exc())
            error_response = "I'm sorry, I'm having trouble processing your request right now. Could you try rephrasing your question?"
            return {"response": error_response, "ids": [], "error": str(e)}
# Helper functions
def extract_product_type(search_term):
    # Extract product type from search term (e.g., "black pants" -> "pants")
    common_types = ["shirt", "pants", "dress", "shoes", "boots", "jacket", "sweater", 
                    "top", "jeans", "skirt", "hat", "accessory", "scarf", "shorts"]
    for type in common_types:
        if type in search_term.lower():
            return type
    return None

def extract_main_item(query):
    # Extract the main item the user is asking about
    common_items = ["shirt", "pants", "dress", "shoes", "boots", "jacket", "sweater", 
                   "top", "jeans", "skirt", "hat", "accessory", "scarf", "shorts"]
    for item in common_items:
        if item in query.lower():
            return item
    return "outfit"

def extract_color(query):
    # Extract mentioned colors
    common_colors = ["black", "white", "red", "blue", "green", "yellow", "purple", 
                    "pink", "brown", "gray", "grey", "orange", "navy", "olive", "beige"]
    for color in common_colors:
        if color in query.lower():
            return color
    return None

