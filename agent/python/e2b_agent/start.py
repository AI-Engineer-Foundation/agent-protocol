import uvicorn

if __name__ == "__main__":
    uvicorn.run("agent:app", 
                host="0.0.0.0",
                port=8000,
                # reload=False,
                # debug=False,
                workers=1,
            )
    
