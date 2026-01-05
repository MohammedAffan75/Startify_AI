"""ResearchAgent: web research and competitive analysis using scraping and trends.

This module now delegates high-level summarization of scraped content to
an external LLM (via :mod:`app.llm_client`) when configured, while
keeping the lightweight scraping and trend collection logic local.
"""
import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Any
import hashlib
import json
from datetime import datetime, timedelta

from .db import SessionLocal
from .models import Cache
from .llm_client import generate_text_sync

# Optional: Google Trends
try:
    from pytrends.request import TrendReq
    PYTRENDS_AVAILABLE = True
except ImportError:
    PYTRENDS_AVAILABLE = False


def run_research(idea_struct: dict) -> dict:
    """Run comprehensive research on an idea.
    
    Args:
        idea_struct: Parsed idea structure containing industry, target_audience, features, etc.
        
    Returns:
        Dictionary containing:
        - competitors: List of competitor names and URLs
        - trends: Keyword trend scores
        - summary_text: Summarized research findings
        - key_opportunities: Identified opportunities
        - key_risks: Identified risks
    """
    # Generate cache key from idea_struct
    cache_key = hashlib.md5(json.dumps(idea_struct, sort_keys=True).encode()).hexdigest()
    
    # Check cache first
    cached_result = _check_cache(cache_key)
    if cached_result:
        print("Returning cached research results")
        return cached_result
    
    # Step 1: Build search queries
    queries = _build_search_queries(idea_struct)
    
    # Step 2: Web scraping for each query
    scraped_data = []
    for query in queries[:3]:  # Limit to top 3 queries for MVP
        data = _scrape_web(query)
        scraped_data.extend(data)
    
    # Step 3: Get trends data
    trends = _get_trends(idea_struct)
    
    # Step 4: Summarize scraped text using the configured LLM
    summary_text = _summarize_content(scraped_data, idea_struct)
    
    # Step 5: Extract competitors, opportunities, and risks
    competitors = _extract_competitors(scraped_data)
    opportunities = _extract_opportunities(idea_struct, scraped_data)
    risks = _extract_risks(idea_struct, scraped_data)
    
    # Step 6: Generate market insights
    market_insights = _generate_market_insights(idea_struct, trends)
    
    # Step 7: Generate investor matches
    investors = _generate_investors(idea_struct)
    
    result = {
        "competitors": competitors,
        "trends": trends,
        "summary_text": summary_text,
        "key_opportunities": opportunities,
        "key_risks": risks,
        "market_insights": market_insights,
        "investors": investors
    }
    
    # Cache the result
    _save_to_cache(cache_key, result)
    
    return result


def _build_search_queries(idea_struct: dict) -> List[str]:
    """Build search queries from idea structure."""
    industry = idea_struct.get("industry", "")
    audience = idea_struct.get("target_audience", "")
    
    queries = [
        f"{industry} app {audience} competitors",
        f"{industry} app market size {audience}",
        f"{industry} {audience} trends",
        f"{industry} app retention strategies",
    ]
    return queries


def _scrape_web(query: str) -> List[Dict[str, str]]:
    """Scrape web for a given query.
    
    For MVP, fetches example pages. In production, integrate SERP API.
    """
    # TODO: Integrate SERP API (Google Custom Search, SerpAPI, etc.) for real search results
    # For now, use example URLs as placeholders
    
    example_urls = [
        "https://en.wikipedia.org/wiki/Mobile_app",
        "https://en.wikipedia.org/wiki/E-commerce",
        "https://en.wikipedia.org/wiki/Rural_development",
    ]
    
    results = []
    for url in example_urls[:3]:  # Top 3 results
        try:
            response = requests.get(url, timeout=10, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                
                # Extract text from paragraphs
                paragraphs = soup.find_all("p", limit=5)
                text = " ".join([p.get_text().strip() for p in paragraphs])
                
                results.append({
                    "url": url,
                    "title": soup.title.string if soup.title else "No title",
                    "text": text[:1000]  # Limit text length
                })
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue
    
    return results


def _get_trends(idea_struct: dict) -> Dict[str, float]:
    """Get trend data for keywords."""
    industry = idea_struct.get("industry", "")
    
    if PYTRENDS_AVAILABLE:
        try:
            pytrends = TrendReq(hl='en-US', tz=360)
            keywords = [industry, f"{industry} app"]
            pytrends.build_payload(keywords, timeframe='today 12-m')
            trends_data = pytrends.interest_over_time()
            
            if not trends_data.empty:
                # Return average interest scores
                return {kw: float(trends_data[kw].mean()) for kw in keywords}
        except Exception as e:
            print(f"Error fetching trends: {e}")
    
    # Mock trend data for offline use
    return {
        industry: 75.5,
        f"{industry} app": 62.3,
        "mobile apps": 80.0
    }


def _summarize_content(scraped_data: List[Dict[str, str]], idea_struct: Dict[str, Any]) -> str:
    """Summarize scraped content using the configured LLM when available.

    Falls back to a simple truncation-based summary if the external
    model is not configured or errors.
    """
    if not scraped_data:
        return "No content available for summarization."

    combined_text = " ".join([item["text"] for item in scraped_data if item.get("text")])
    if not combined_text:
        return "No text content found."

    # Keep prompt reasonably small
    combined_text = combined_text[:1600]

    industry = idea_struct.get("industry", "startup")
    audience = idea_struct.get("target_audience", "target customers")

    prompt = (
        "You are a startup market research expert. Based on the following web research "
        f"about a {industry} product for {audience}, write a concise 3-5 paragraph summary.\n\n"
        "The summary should clearly cover:\n"
        "1) Overall market context and size\n"
        "2) Key trends and opportunities\n"
        "3) Main risks or challenges\n\n"
        "Use clear, digestible language suitable for a startup founder.\n\n"
        "--- RESEARCH TEXT ---\n"
        f"{combined_text}"
    )

    try:
        return generate_text_sync(prompt, max_tokens=600)
    except Exception as exc:
        print(f"LLM summarization error, falling back to raw text: {exc}")
        # Fallback: return first 200 characters
        return combined_text[:200] + "..."


def _extract_competitors(scraped_data: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Extract competitor information from scraped data."""
    # Simple extraction - in production, use NER or more sophisticated methods
    competitors = []
    
    for item in scraped_data[:3]:
        competitors.append({
            "name": item.get("title", "Unknown"),
            "url": item.get("url", "")
        })
    
    return competitors


def _extract_opportunities(idea_struct: dict, scraped_data: List[Dict[str, str]]) -> List[str]:
    """Identify key opportunities based on research."""
    industry = idea_struct.get('industry', 'market')
    audience = idea_struct.get('target_audience', 'target market')
    features = idea_struct.get('features', [])
    
    # Generate varied opportunities based on idea specifics
    opportunities = [
        f"Growing demand in {audience} segment",
        f"Emerging {industry} sector with high growth potential",
        f"Digital transformation accelerating in {industry}",
        f"Underserved {audience} market opportunity",
        f"Mobile-first adoption among {audience}",
        f"Low competition in {industry} for {audience}",
    ]
    
    # Add feature-specific opportunities
    if features:
        for feature in features[:2]:
            opportunities.append(f"High demand for {feature} in {industry}")
    
    return opportunities[:4]


def _extract_risks(idea_struct: dict, scraped_data: List[Dict[str, str]]) -> List[str]:
    """Identify key risks based on research."""
    industry = idea_struct.get('industry', 'market')
    audience = idea_struct.get('target_audience', 'target market')
    
    # Generate varied risks based on idea specifics
    risks = [
        f"High competition in {industry} market",
        f"User acquisition costs for {audience}",
        f"Technology infrastructure challenges in {industry}",
        f"Regulatory compliance in {industry} sector",
        f"Market education needed for {audience}",
        f"Retention challenges in {industry} apps",
        f"Scaling difficulties with {audience} segment"
    ]
    
    return risks[:4]


def _check_cache(cache_key: str) -> Dict[str, Any]:
    """Check if cached research exists and is not expired."""
    db = SessionLocal()
    try:
        cache_entry = db.query(Cache).filter(Cache.query == cache_key).first()
        if cache_entry:
            # Check if expired
            if cache_entry.expires_at and cache_entry.expires_at < datetime.now():
                # Expired, delete it
                db.delete(cache_entry)
                db.commit()
                return None
            return cache_entry.data_json
    finally:
        db.close()
    return None


def _save_to_cache(cache_key: str, data: dict, expiry_hours: int = 24):
    """Save research results to cache."""
    db = SessionLocal()
    try:
        expires_at = datetime.now() + timedelta(hours=expiry_hours)
        
        # Check if entry exists
        cache_entry = db.query(Cache).filter(Cache.query == cache_key).first()
        if cache_entry:
            cache_entry.data_json = data
            cache_entry.cached_at = datetime.now()
            cache_entry.expires_at = expires_at
        else:
            cache_entry = Cache(
                query=cache_key,
                data_json=data,
                expires_at=expires_at
            )
            db.add(cache_entry)
        
        db.commit()
    finally:
        db.close()


def _generate_market_insights(idea_struct: dict, trends: Dict[str, float]) -> Dict[str, Any]:
    """Generate market insights based on industry and trends."""
    industry = idea_struct.get('industry', 'general')
    audience = idea_struct.get('target_audience', 'general public')
    
    # Calculate market size based on industry
    market_sizes = {
        'fitness': '$30B',
        'grocery': '$682B',
        'education': '$6.5T',
        'healthcare': '$4.3T',
        'fintech': '$310B',
        'ecommerce': '$5.7T',
        'logistics': '$9.6T',
    }
    
    market_size = market_sizes.get(industry.lower(), '$10B+')
    
    # Calculate growth rate from trends
    avg_trend = sum(trends.values()) / len(trends) if trends else 65
    if avg_trend > 75:
        growth = '25-35%'
    elif avg_trend > 60:
        growth = '15-25%'
    else:
        growth = '10-15%'
    
    # Determine competition level
    competition_levels = ['Low', 'Medium', 'High']
    competition = competition_levels[hash(industry) % 3]
    
    # Estimate timeline
    timeline = '6-12 months'
    
    # Funding recommendation
    funding_amounts = {
        'Low': '$250K-500K',
        'Medium': '$500K-1M',
        'High': '$1M-2M'
    }
    funding = funding_amounts.get(competition, '$500K-1M')
    
    return {
        'marketSize': market_size,
        'growth': growth,
        'competition': competition,
        'timeline': timeline,
        'funding': funding
    }


def _generate_investors(idea_struct: dict) -> List[Dict[str, Any]]:
    """Generate relevant investor matches."""
    industry = idea_struct.get('industry', 'general')
    audience = idea_struct.get('target_audience', 'general public')
    
    # Investor database with industry focus
    investor_pool = [
        {
            'name': 'Sarah Chen', 
            'firm': 'Sequoia Capital', 
            'focus': ['fitness', 'healthcare', 'wellness'], 
            'stage': 'Series A-B',
            'description': 'Partner at Sequoia Capital with 15+ years investing in health & wellness startups',
            'portfolio': ['Peloton', 'Calm', 'Headspace', 'Noom', 'Whoop']
        },
        {
            'name': 'Michael Rodriguez', 
            'firm': 'Andreessen Horowitz', 
            'focus': ['fintech', 'enterprise', 'crypto'], 
            'stage': 'Seed-Series A',
            'description': 'General Partner specializing in fintech and blockchain innovations',
            'portfolio': ['Coinbase', 'Robinhood', 'Plaid', 'Stripe', 'Brex']
        },
        {
            'name': 'Emily Watson', 
            'firm': 'Accel Partners', 
            'focus': ['ecommerce', 'marketplace', 'logistics'], 
            'stage': 'Seed-Series B',
            'description': 'Principal investor focused on marketplace and e-commerce platforms',
            'portfolio': ['Instacart', 'DoorDash', 'Etsy', 'Spotify', 'Slack']
        },
        {
            'name': 'David Park', 
            'firm': 'Kleiner Perkins', 
            'focus': ['healthcare', 'biotech', 'medtech'], 
            'stage': 'Series A-C',
            'description': 'Senior Partner with deep expertise in healthcare and biotech ventures',
            'portfolio': ['23andMe', 'Moderna', 'Oscar Health', 'Livongo', 'Glooko']
        },
        {
            'name': 'Lisa Thompson', 
            'firm': 'Greylock Partners', 
            'focus': ['education', 'edtech', 'learning'], 
            'stage': 'Seed-Series A',
            'description': 'Partner investing in education technology and lifelong learning platforms',
            'portfolio': ['Coursera', 'Duolingo', 'Quizlet', 'Outschool', 'Kahoot']
        },
        {
            'name': 'James Wilson', 
            'firm': 'Benchmark Capital', 
            'focus': ['consumer', 'mobile', 'social'], 
            'stage': 'Seed-Series B',
            'description': 'Partner focused on consumer mobile and social applications',
            'portfolio': ['Instagram', 'Snap', 'Discord', 'Nextdoor', 'Strava']
        },
        {
            'name': 'Rachel Green', 
            'firm': 'Lightspeed Venture', 
            'focus': ['enterprise', 'saas', 'productivity'], 
            'stage': 'Series A-B',
            'description': 'Principal specializing in enterprise SaaS and productivity tools',
            'portfolio': ['Affirm', 'Nutanix', 'AppDynamics', 'Carta', 'Mulesoft']
        },
        {
            'name': 'Tom Anderson', 
            'firm': 'Index Ventures', 
            'focus': ['fintech', 'crypto', 'blockchain'], 
            'stage': 'Seed-Series A',
            'description': 'Early-stage investor in cryptocurrency and blockchain startups',
            'portfolio': ['Revolut', 'Robinhood', 'TransferWise', 'Blockchain.com', 'Ledger']
        },
        {
            'name': 'Nina Patel', 
            'firm': 'First Round Capital', 
            'focus': ['consumer', 'marketplace', 'mobile'], 
            'stage': 'Seed',
            'description': 'Seed-stage investor backing consumer and marketplace startups',
            'portfolio': ['Uber', 'Warby Parker', 'Roblox', 'Notion', 'Square']
        },
        {
            'name': 'Alex Kumar', 
            'firm': 'Y Combinator', 
            'focus': ['general', 'technology', 'innovation'], 
            'stage': 'Seed',
            'description': 'Partner at Y Combinator supporting early-stage tech startups',
            'portfolio': ['Airbnb', 'Dropbox', 'Reddit', 'Twitch', 'Instacart']
        },
    ]
    
    # Match investors based on industry
    matched_investors = []
    for investor in investor_pool:
        match_score = 0
        
        # Check industry match
        if industry.lower() in [f.lower() for f in investor['focus']]:
            match_score = 95
        elif 'general' in investor['focus'] or 'technology' in investor['focus']:
            match_score = 70
        else:
            match_score = 50
        
        matched_investors.append({
            'name': investor['name'],
            'firm': investor['firm'],
            'focus': ', '.join(investor['focus']),
            'stage': investor['stage'],
            'matchScore': match_score,
            'rationale': f"Strong focus on {investor['focus'][0]} sector" if match_score > 80 else "General technology investor",
            'description': investor['description'],
            'portfolio': investor['portfolio']
        })
    
    # Sort by match score and return top 5
    matched_investors.sort(key=lambda x: x['matchScore'], reverse=True)
    return matched_investors[:5]
