"""Test script to verify backend generates varied outputs for different ideas."""
import sys
sys.path.insert(0, 'backend')

# Test idea parsing
print("=" * 60)
print("TESTING IDEA VARIATION")
print("=" * 60)

# Mock parsed ideas (simulating what NLP parser would return)
idea1 = {
    "industry": "grocery",
    "target_audience": "rural areas",
    "features": ["delivery", "digital payments"],
    "raw": "smart grocery app for rural areas with delivery and digital payments"
}

idea2 = {
    "industry": "fitness",
    "target_audience": "elderly people",
    "features": ["health monitoring", "step tracking"],
    "raw": "fitness tracking app for elderly people with health monitoring"
}

idea3 = {
    "industry": "education",
    "target_audience": "college students",
    "features": ["video lectures", "quiz system"],
    "raw": "online learning platform for college students with video lectures"
}

# Test generator
from app.generator_agent import _generate_brand_names, _generate_slogans, _generate_ad_copies

print("\n📝 IDEA 1: Grocery app for rural areas")
print("-" * 60)
print("Brand Names:", _generate_brand_names(idea1["industry"], idea1["target_audience"])[:5])
print("Slogans:", _generate_slogans(idea1["industry"], idea1["target_audience"], ", ".join(idea1["features"]))[:3])

print("\n📝 IDEA 2: Fitness app for elderly")
print("-" * 60)
print("Brand Names:", _generate_brand_names(idea2["industry"], idea2["target_audience"])[:5])
print("Slogans:", _generate_slogans(idea2["industry"], idea2["target_audience"], ", ".join(idea2["features"]))[:3])

print("\n📝 IDEA 3: Education platform for students")
print("-" * 60)
print("Brand Names:", _generate_brand_names(idea3["industry"], idea3["target_audience"])[:5])
print("Slogans:", _generate_slogans(idea3["industry"], idea3["target_audience"], ", ".join(idea3["features"]))[:3])

# Test research opportunities/risks
from app.research_agent import _extract_opportunities, _extract_risks

print("\n\n🔍 RESEARCH OUTPUTS")
print("=" * 60)

print("\nIDEA 1 - Opportunities:")
print(_extract_opportunities(idea1, []))

print("\nIDEA 2 - Opportunities:")
print(_extract_opportunities(idea2, []))

print("\nIDEA 1 - Risks:")
print(_extract_risks(idea1, []))

print("\nIDEA 2 - Risks:")
print(_extract_risks(idea2, []))

print("\n✅ TEST COMPLETE - Check if outputs vary based on idea!")
