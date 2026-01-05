from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from .models import GenerateRequest, GenerateResponse, JobStatus, DownloadResponse, Idea
from .db import (
    SessionLocal, 
    save_user_if_not_exists, 
    create_idea, 
    update_idea_status, 
    save_output
)
from sqlalchemy.orm import Session
import uuid
import os
import traceback

router = APIRouter(prefix="/api")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Save user if not exists
    user_id = save_user_if_not_exists(request.email)
    
    # Create idea record
    idea_id = create_idea(user_id, request.idea)
    
    # Use idea_id as job_id for simplicity
    job_id = str(idea_id)
    
    # Start background processing
    background_tasks.add_task(process_idea_job, job_id, idea_id, request.email)
    
    return GenerateResponse(job_id=job_id, status="processing")


@router.get("/status/{job_id}", response_model=JobStatus)
async def get_status(job_id: str, db: Session = Depends(get_db)):
    # job_id is the idea_id
    try:
        idea_id = int(job_id)
        idea = db.query(Idea).filter(Idea.id == idea_id).first()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job_id")
    
    if not idea:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Map idea status to job status
    progress_map = {
        "pending": 10,
        "processing": 50,
        "completed": 100,
        "failed": 0
    }
    
    return JobStatus(
        job_id=job_id, 
        status=idea.status, 
        progress=progress_map.get(idea.status, 50)
    )


@router.get("/download/{job_id}", response_model=DownloadResponse)
async def download(job_id: str, db: Session = Depends(get_db)):
    # Check if zip file exists
    from .assembler import create_downloadable_zip
    
    try:
        zip_path = create_downloadable_zip(job_id)
        # In production, serve the file or return a signed URL
        return DownloadResponse(url=f"/files/{job_id}.zip")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Output not ready or not found")


@router.get("/results/{job_id}")
async def get_results(job_id: str, db: Session = Depends(get_db)):
    """Get the full generated results for a completed job."""
    try:
        idea_id = int(job_id)
        idea = db.query(Idea).filter(Idea.id == idea_id).first()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job_id")
    
    if not idea:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if idea.status != "completed":
        raise HTTPException(status_code=400, detail=f"Job not completed yet. Current status: {idea.status}")
    
    # Get the outputs from database
    from .models import Output
    outputs = db.query(Output).filter(Output.idea_id == idea_id).all()
    
    # Find the content output (should have branding_content)
    results = {
        "job_id": job_id,
        "status": idea.status,
        "idea": {
            "raw": idea.idea_text,
            "parsed": idea.parsed_json
        },
        "brand_names": [],
        "slogans": [],
        "logo_prompts": [],
        "ad_copies": [],
        "pitch_sections": {},
        "download_url": f"/files/{job_id}.zip"
    }
    
    # Extract content from outputs
    for output in outputs:
        if output.output_type == "pptx" and output.content_json:
            content = output.content_json
            results["brand_names"] = content.get("brand_names", [])
            results["slogans"] = content.get("slogans", [])
            results["logo_prompts"] = content.get("logo_prompts", [])
            results["ad_copies"] = content.get("ad_copies", [])
            results["pitch_sections"] = content.get("pitch_sections", {})
        elif output.output_type == "research" and output.content_json:
            # Include research results (market insights, competitors)
            research = output.content_json
            results["market_insights"] = research.get("market_insights", {})
            results["competitors"] = research.get("competitors", [])
            results["investors"] = research.get("investors", [])
    
    return results


def process_idea_job(job_id: str, idea_id: int, email: str):
    """Background workflow to process an idea through the complete pipeline.
    
    Args:
        job_id: Unique job identifier (UUID)
        idea_id: Database ID of the idea record
        email: User email
    """
    db = SessionLocal()
    
    try:
        print(f"[Job {job_id}] Starting processing for idea {idea_id}")
        
        # Step 1: Update status to processing
        update_idea_status(idea_id, "processing")
        print(f"[Job {job_id}] Status updated to processing")
        
        # Step 2: Fetch idea and parse
        idea = db.query(Idea).filter(Idea.id == idea_id).first()
        if not idea:
            raise ValueError(f"Idea {idea_id} not found")
        
        print(f"[Job {job_id}] Parsing idea text...")
        from .nlp_parser import parse_idea
        parsed_idea = parse_idea(idea.idea_text)
        
        # Save parsed data to idea record
        idea.parsed_json = parsed_idea
        db.commit()
        print(f"[Job {job_id}] Idea parsed: {parsed_idea.get('industry', 'unknown')} industry")
        
        # Step 3: Run research agent
        print(f"[Job {job_id}] Running research agent...")
        from .research_agent import run_research
        research_results = run_research(parsed_idea)
        print(f"[Job {job_id}] Research completed: {len(research_results.get('competitors', []))} competitors found")
        
        # Step 4: Run generator agent
        print(f"[Job {job_id}] Generating branding and content...")
        from .generator_agent import generate_branding_and_content
        branding_content = generate_branding_and_content(parsed_idea, research_results)
        print(f"[Job {job_id}] Generated {len(branding_content.get('brand_names', []))} brand names")
        
        # Step 5: Assemble outputs
        print(f"[Job {job_id}] Assembling output package...")
        from .assembler import assemble_package, create_downloadable_zip
        
        output_dir = os.path.join("outputs", job_id)
        pptx_path = assemble_package(parsed_idea, research_results, branding_content, output_dir)
        print(f"[Job {job_id}] PPTX created at {pptx_path}")
        
        # Create zip file
        zip_path = create_downloadable_zip(job_id)
        print(f"[Job {job_id}] Zip file created at {zip_path}")
        
        # Step 6: Save outputs to DB
        print(f"[Job {job_id}] Saving outputs to database...")
        
        # Save research output
        save_output(
            idea_id=idea_id,
            output_type="research",
            content=research_results,
            file_path=None
        )
        
        # Save PPTX output
        save_output(
            idea_id=idea_id,
            output_type="pptx",
            content=branding_content,
            file_path=pptx_path
        )
        
        # Save ZIP output
        save_output(
            idea_id=idea_id,
            output_type="zip",
            content={"job_id": job_id},
            file_path=zip_path
        )
        
        print(f"[Job {job_id}] Outputs saved to database")
        
        # Step 7: Update status to completed
        update_idea_status(idea_id, "completed")
        print(f"[Job {job_id}] Processing completed successfully!")
        
    except Exception as e:
        print(f"[Job {job_id}] ERROR: {str(e)}")
        print(f"[Job {job_id}] Traceback: {traceback.format_exc()}")
        
        # Update status to failed
        try:
            update_idea_status(idea_id, "failed")
        except:
            pass
        
    finally:
        db.close()
