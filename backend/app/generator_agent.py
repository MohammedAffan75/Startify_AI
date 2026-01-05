"""GeneratorAgent: generates branding and content using AI models."""
from typing import Dict, Any, List
import re
from collections import Counter

# Optional: HuggingFace text generation
try:
    from transformers import pipeline
    text_generator = pipeline("text-generation", model="gpt2")
    GENERATOR_AVAILABLE = True
except Exception as e:
    print(f"Text generator not available: {e}")
    GENERATOR_AVAILABLE = False


# Prompt templates for different content types
BRAND_NAME_PROMPT = """Generate creative brand names for a {industry} business targeting {audience}.
Brand names:
1."""

SLOGAN_PROMPT = """Create catchy slogans for a {industry} app for {audience}.
Slogans:
1."""

LOGO_PROMPT_TEMPLATE = """Logo design prompt for {industry} brand: modern, minimalist logo featuring"""

AD_COPY_PROMPT = """Write a short social media ad for a {industry} app targeting {audience} with features: {features}.
Ad:"""

PITCH_PROBLEM_PROMPT = """Problem statement for {industry} startup targeting {audience}:
The problem:"""

PITCH_SOLUTION_PROMPT = """Solution for {industry} app with features {features}:
Our solution:"""


def generate_branding_and_content(idea_struct: dict, research_results: dict) -> dict:
    """Generate comprehensive branding and content for a startup idea.
    
    Args:
        idea_struct: Parsed idea structure with industry, target_audience, features
        research_results: Research data with competitors, trends, opportunities, risks
        
    Returns:
        Dictionary containing:
        - brand_names: List of 10 brand name options
        - slogans: List of 5 slogan options
        - logo_prompts: List of 5 logo generation prompts
        - ad_copies: List of 5 social media ad texts
        - pitch_sections: Dict with pitch deck sections
    """
    industry = idea_struct.get("industry", "tech")
    audience = idea_struct.get("target_audience", "general public")
    features = ", ".join(idea_struct.get("features", ["innovative features"]))
    
    # Generate brand names
    brand_names = _generate_brand_names(industry, audience)
    
    # Generate slogans
    slogans = _generate_slogans(industry, audience, features)
    
    # Generate logo prompts
    logo_prompts = _generate_logo_prompts(industry, audience)
    
    # Generate ad copies
    ad_copies = _generate_ad_copies(industry, audience, features)
    
    # Generate pitch sections
    pitch_sections = _generate_pitch_sections(idea_struct, research_results)
    
    return {
        "brand_names": brand_names,
        "slogans": slogans,
        "logo_prompts": logo_prompts,
        "ad_copies": ad_copies,
        "pitch_sections": pitch_sections
    }


def _generate_brand_names(industry: str, audience: str) -> List[str]:
    """Generate brand name options."""
    prompt = BRAND_NAME_PROMPT.format(industry=industry, audience=audience)
    
    if GENERATOR_AVAILABLE:
        try:
            results = text_generator(prompt, max_length=100, num_return_sequences=3, temperature=0.9)
            generated_names = []
            for result in results:
                text = result["generated_text"].replace(prompt, "").strip()
                names = _extract_list_items(text)
                generated_names.extend(names)
            
            # Filter and score
            filtered_names = _filter_and_score_names(generated_names, industry)
            if len(filtered_names) >= 10:
                return filtered_names[:10]
        except Exception as e:
            print(f"Brand name generation error: {e}")
    
    # Enhanced fallback: rule-based generation with variety
    industry_cap = industry.capitalize()
    audience_first = audience.split()[0].capitalize() if audience else "Smart"
    
    # Extract key words from audience for more variety
    audience_words = [w.capitalize() for w in audience.split() if len(w) > 3][:2]
    
    base_words = [industry_cap, audience_first] + audience_words
    suffixes = ["ly", "ify", "Hub", "Pro", "Go", "Now", "App", "Plus", "Zone", "Spot"]
    prefixes = ["My", "Get", "The", "Quick", "Easy", "Smart", "Pro"]
    
    fallback_names = []
    
    # Pattern 1: Base + Suffix
    for base in base_words[:3]:
        for suffix in suffixes[:4]:
            fallback_names.append(f"{base}{suffix}")
    
    # Pattern 2: Prefix + Base
    for prefix in prefixes[:3]:
        for base in base_words[:2]:
            fallback_names.append(f"{prefix}{base}")
    
    # Pattern 3: Compound names
    if len(base_words) >= 2:
        fallback_names.append(f"{base_words[0]}{base_words[1]}")
        fallback_names.append(f"{base_words[1]}{base_words[0]}")
    
    # Remove duplicates and return top 10
    unique_names = list(dict.fromkeys(fallback_names))
    return unique_names[:10]


def _generate_slogans(industry: str, audience: str, features: str) -> List[str]:
    """Generate slogan options."""
    prompt = SLOGAN_PROMPT.format(industry=industry, audience=audience)
    
    if GENERATOR_AVAILABLE:
        try:
            results = text_generator(prompt, max_length=80, num_return_sequences=2, temperature=0.8)
            generated_slogans = []
            for result in results:
                text = result["generated_text"].replace(prompt, "").strip()
                slogans = _extract_list_items(text)
                generated_slogans.extend(slogans)
            
            # Filter and score
            filtered_slogans = _filter_and_score_text(generated_slogans, min_words=3, max_words=8)
            if len(filtered_slogans) >= 5:
                return filtered_slogans[:5]
        except Exception as e:
            print(f"Slogan generation error: {e}")
    
    # Enhanced fallback slogans with variety
    feature_list = features.split(",") if features else []
    first_feature = feature_list[0].strip() if feature_list else "innovation"
    
    templates = [
        f"Empowering {audience} with {industry} solutions",
        f"Your trusted {industry} partner",
        f"Transforming {industry} for {audience}",
        f"Smart {industry}, Better life",
        f"Innovation meets {industry}",
        f"Where {audience} meets {industry}",
        f"{industry.capitalize()} made simple for {audience}",
        f"Revolutionizing {industry}, one {audience.split()[0] if audience else 'user'} at a time",
        f"The future of {industry} is here",
        f"{first_feature.capitalize()} powered {industry}"
    ]
    
    return templates[:5]


def _generate_logo_prompts(industry: str, audience: str) -> List[str]:
    """Generate logo design prompts for image generation."""
    base_prompt = LOGO_PROMPT_TEMPLATE.format(industry=industry)
    
    variations = [
        f"{base_prompt} {industry} elements, clean lines, professional color palette",
        f"{base_prompt} abstract shapes, vibrant colors, modern typography",
        f"{base_prompt} geometric patterns, gradient colors, tech-inspired",
        f"{base_prompt} nature-inspired elements, organic shapes, earthy tones",
        f"{base_prompt} bold typography, minimalist icon, monochrome design"
    ]
    
    return variations


def _generate_ad_copies(industry: str, audience: str, features: str) -> List[str]:
    """Generate social media ad copy."""
    prompt = AD_COPY_PROMPT.format(industry=industry, audience=audience, features=features)
    
    if GENERATOR_AVAILABLE:
        try:
            results = text_generator(prompt, max_length=100, num_return_sequences=2, temperature=0.7)
            generated_ads = []
            for result in results:
                text = result["generated_text"].replace(prompt, "").strip()
                # Take first complete sentence
                sentences = text.split(".")
                if sentences:
                    ad = sentences[0].strip() + "."
                    if len(ad.split()) <= 30:  # Keep it short
                        generated_ads.append(ad)
            
            if len(generated_ads) >= 5:
                return generated_ads[:5]
        except Exception as e:
            print(f"Ad copy generation error: {e}")
    
    # Enhanced fallback ad copies with variety
    feature_list = features.split(",") if features else ["innovative features"]
    features_text = ", ".join([f.strip() for f in feature_list[:2]])
    
    templates = [
        f"Discover the future of {industry}! Perfect for {audience}. Download now!",
        f"Transform your {industry} experience with {features_text}. Built for {audience}. Try it free!",
        f"Join thousands of {audience} using our {industry} app. {feature_list[0].strip().capitalize()} included!",
        f"The smart way to {industry}. Trusted by {audience} everywhere.",
        f"Revolutionize your {industry} journey with {features_text}. Made for {audience}. Get started today!",
        f"Say goodbye to old {industry} methods. {audience.capitalize()} deserve better. Try us now!",
        f"Why settle for less? Get {features_text} in one {industry} app. Perfect for {audience}."
    ]
    
    return templates[:5]


def _generate_pitch_sections(idea_struct: dict, research_results: dict) -> Dict[str, str]:
    """Generate pitch deck sections."""
    industry = idea_struct.get("industry", "tech")
    audience = idea_struct.get("target_audience", "general public")
    features = ", ".join(idea_struct.get("features", ["innovative features"]))
    
    opportunities = research_results.get("key_opportunities", [])
    risks = research_results.get("key_risks", [])
    trends = research_results.get("trends", {})
    
    # Problem statement
    problem = f"""Current {industry} solutions fail to adequately serve {audience}. 
Key challenges include limited accessibility, high costs, and lack of tailored features. 
This creates a significant gap in the market for a dedicated solution."""
    
    # Solution
    solution = f"""Our {industry} platform addresses these challenges by providing {features}. 
Designed specifically for {audience}, we offer an intuitive, affordable, and comprehensive solution 
that meets their unique needs."""
    
    # Value proposition
    value_prop = f"""We deliver unmatched value through:
- Tailored features for {audience}
- {features}
- Competitive pricing and accessibility
- User-centric design and experience"""
    
    # Business model
    business_model = f"""Revenue streams:
1. Freemium model with premium features
2. Subscription tiers for {audience}
3. B2B partnerships and enterprise solutions
4. In-app purchases and value-added services"""
    
    # Market size estimate
    avg_trend = sum(trends.values()) / len(trends) if trends else 70.0
    market_size = f"""Target market: {audience} in {industry} sector
Market interest score: {avg_trend:.1f}/100 (based on trend analysis)
Addressable market: Growing segment with strong digital adoption
Key opportunities: {', '.join(opportunities[:3]) if opportunities else 'Significant growth potential'}"""
    
    # Go-to-market strategy
    gtm = f"""Phase 1: Launch MVP targeting early adopters in {audience}
Phase 2: Digital marketing campaigns (social media, content marketing)
Phase 3: Strategic partnerships and community building
Phase 4: Scale operations and expand feature set
Key channels: App stores, social media, word-of-mouth, partnerships"""
    
    # Team requirements
    team_reqs = f"""Core team needed:
- Technical Lead (Full-stack development, {industry} domain expertise)
- Product Manager (User experience, {audience} insights)
- Marketing Lead (Growth hacking, digital marketing)
- Designer (UI/UX, branding)
- Business Development (Partnerships, sales)"""
    
    return {
        "problem": problem,
        "solution": solution,
        "value_proposition": value_prop,
        "business_model": business_model,
        "market_size_estimate": market_size,
        "go_to_market": gtm,
        "team_reqs": team_reqs
    }


def _extract_list_items(text: str) -> List[str]:
    """Extract list items from generated text."""
    # Match numbered lists or bullet points
    pattern = r'(?:^|\n)\s*(?:\d+\.|[-•*])\s*(.+?)(?=\n|$)'
    matches = re.findall(pattern, text, re.MULTILINE)
    
    items = []
    for match in matches:
        item = match.strip()
        # Clean up common artifacts
        item = re.sub(r'["\']', '', item)
        item = re.sub(r'\s+', ' ', item)
        if len(item) > 3 and len(item) < 50:  # Reasonable length
            items.append(item)
    
    return items


def _filter_and_score_names(names: List[str], industry: str) -> List[str]:
    """Filter and score brand names."""
    # Remove duplicates
    unique_names = list(set(names))
    
    scored_names = []
    for name in unique_names:
        score = 0
        
        # Length score (prefer 6-12 characters)
        if 6 <= len(name) <= 12:
            score += 3
        elif 4 <= len(name) <= 15:
            score += 1
        
        # Keyword match
        if industry.lower() in name.lower():
            score += 2
        
        # Pronounceability (simple heuristic: vowel ratio)
        vowels = sum(1 for c in name.lower() if c in 'aeiou')
        vowel_ratio = vowels / len(name) if len(name) > 0 else 0
        if 0.3 <= vowel_ratio <= 0.5:
            score += 2
        
        # No special characters
        if name.isalnum():
            score += 1
        
        scored_names.append((name, score))
    
    # Sort by score descending
    scored_names.sort(key=lambda x: x[1], reverse=True)
    
    return [name for name, score in scored_names]


def _filter_and_score_text(texts: List[str], min_words: int = 3, max_words: int = 15) -> List[str]:
    """Filter and score text snippets."""
    # Remove duplicates
    unique_texts = list(set(texts))
    
    scored_texts = []
    for text in unique_texts:
        word_count = len(text.split())
        
        # Filter by word count
        if min_words <= word_count <= max_words:
            score = 10 - abs(word_count - (min_words + max_words) // 2)
            scored_texts.append((text, score))
    
    # Sort by score descending
    scored_texts.sort(key=lambda x: x[1], reverse=True)
    
    return [text for text, score in scored_texts]
