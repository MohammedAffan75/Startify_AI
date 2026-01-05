"""NLP parsing utilities for idea extraction using spaCy with regex fallback."""
import re
from typing import Dict, List, Any
import sys

# Try to load spaCy
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
        SPACY_AVAILABLE = True
        print("✓ spaCy loaded successfully")
    except OSError:
        print("⚠ spaCy model not found, downloading...")
        import subprocess
        subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"], check=True)
        nlp = spacy.load("en_core_web_sm")
        SPACY_AVAILABLE = True
        print("✓ spaCy model downloaded and loaded")
except Exception as e:
    print(f"⚠ spaCy not available: {e}")
    print("→ Falling back to regex-based parsing")
    SPACY_AVAILABLE = False
    nlp = None


def parse_idea(idea_text: str) -> Dict[str, Any]:
    """Parse an idea text and extract structured information.
    
    Args:
        idea_text: The raw idea description text
        
    Returns:
        Dictionary containing:
        - industry: Detected industry/domain
        - target_audience: Identified target audience
        - features: List of features/capabilities
        - entities: Named entities found
        - raw: Original text
        
    Example:
        >>> parse_idea("smart grocery app for rural areas with delivery and digital payments")
        {
            "industry": "grocery",
            "target_audience": "rural areas",
            "features": ["delivery", "digital payments"],
            "entities": [...],
            "raw": "smart grocery app for rural areas with delivery and digital payments"
        }
    """
    if SPACY_AVAILABLE and nlp:
        # Use spaCy for advanced NLP parsing
        doc = nlp(idea_text)
        
        # Extract industry - look for nouns that indicate domain/industry
        industry = "general"
        industry_keywords = ["app", "platform", "service", "system", "tool", "software"]
        
        # First try to find industry from noun compounds
        for token in doc:
            if token.pos_ == "NOUN" and token.text.lower() not in industry_keywords:
                # Check if it's part of a compound (e.g., "fitness app")
                if any(child.text.lower() in industry_keywords for child in token.children):
                    industry = token.text.lower()
                    break
                # Check if the noun is before an app-related word
                if token.i < len(doc) - 1 and doc[token.i + 1].text.lower() in industry_keywords:
                    industry = token.text.lower()
                    break
        
        # Extract target audience - look for prepositional phrases with "for"
        target_audience = "general public"
        for token in doc:
            if token.text.lower() == "for" and token.pos_ == "ADP":
                # Get the noun phrase following "for"
                audience_tokens = []
                head = token.head
                for child in head.children:
                    if child.i > token.i and child.pos_ in ["NOUN", "ADJ", "PROPN"]:
                        audience_tokens.append(child.text)
                if audience_tokens:
                    target_audience = " ".join(audience_tokens)
                    break
        
        # Also check noun chunks for more complete audience description
        if target_audience == "general public":
            for chunk in doc.noun_chunks:
                chunk_text = chunk.text.lower()
                if any(prep in idea_text.lower()[:chunk.start_char] for prep in ["for "]):
                    if chunk.start_char > idea_text.lower().find("for "):
                        target_audience = chunk.text
                        break
        
        # Extract features - look for objects and complements after "with", "including"
        features = []
        feature_indicators = ["with", "including", "featuring", "offers", "provides"]
        
        for token in doc:
            if token.text.lower() in feature_indicators:
                # Get noun phrases after the indicator
                for child in token.children:
                    if child.pos_ in ["NOUN", "PROPN"]:
                        feature_tokens = [child.text]
                        # Get compound nouns
                        for subchild in child.children:
                            if subchild.dep_ in ["compound", "amod"]:
                                feature_tokens.insert(0, subchild.text)
                        feature = " ".join(feature_tokens)
                        if feature and feature not in features:
                            features.append(feature)
        
        # Extract named entities
        entities = [
            {
                "text": ent.text,
                "label": ent.label_,
                "start": ent.start_char,
                "end": ent.end_char
            }
            for ent in doc.ents
        ]
        
        print(f"✓ spaCy parsing complete: industry={industry}, audience={target_audience}, features={len(features)}")
        
    else:
        # Fallback to regex-based parsing
        print("→ Using regex-based parsing (spaCy unavailable)")
        text_lower = idea_text.lower()
        words = idea_text.split()
        
        # Extract industry - look for domain keywords
        industry = "general"
        industry_patterns = [
            r'(\w+)\s+(?:app|platform|service|system|tool|software)',
            r'(?:app|platform|service)\s+for\s+(\w+)',
        ]
        
        for pattern in industry_patterns:
            match = re.search(pattern, text_lower)
            if match:
                industry = match.group(1)
                break
        
        # If no pattern matched, extract first meaningful noun
        if industry == "general":
            skip_words = {"app", "platform", "service", "system", "tool", "software", "a", "an", "the", "for", "with", "and", "smart", "ai"}
            for word in text_lower.split():
                clean_word = re.sub(r'[^a-z]', '', word)
                if clean_word not in skip_words and len(clean_word) > 3:
                    industry = clean_word
                    break
        
        # Extract target audience - look for "for X" pattern
        target_audience = "general public"
        for_match = re.search(r'for\s+([\w\s]+?)(?:\s+with|\s+and|\s+including|$)', text_lower)
        if for_match:
            target_audience = for_match.group(1).strip()
        
        # Extract features - look for "with X", "and X", "including X" patterns
        features = []
        feature_patterns = [
            r'with\s+([\w\s]+?)(?:\s+and|\s+including|$)',
            r'including\s+([\w\s]+?)(?:\s+and|\s+with|$)',
            r'and\s+([\w\s]+?)(?:\s+with|\s+including|$)',
        ]
        
        for pattern in feature_patterns:
            matches = re.finditer(pattern, text_lower)
            for match in matches:
                feature = match.group(1).strip()
                if feature and len(feature) > 2 and feature not in features:
                    features.append(feature)
        
        # Extract simple entities (capitalized words)
        entities = []
        for i, word in enumerate(words):
            if word[0].isupper() and len(word) > 1:
                entities.append({
                    "text": word,
                    "label": "ENTITY",
                    "start": idea_text.find(word),
                    "end": idea_text.find(word) + len(word)
                })
    
    return {
        "industry": industry,
        "target_audience": target_audience,
        "features": features,
        "entities": entities,
        "raw": idea_text
    }


# Example usage and test
if __name__ == "__main__":
    test_idea = "smart grocery app for rural areas with delivery and digital payments"
    result = parse_idea(test_idea)
    print("Parsed idea:")
    print(f"  Industry: {result['industry']}")
    print(f"  Target Audience: {result['target_audience']}")
    print(f"  Features: {result['features']}")
    print(f"  Entities: {result['entities']}")
    print(f"  Raw: {result['raw']}")
