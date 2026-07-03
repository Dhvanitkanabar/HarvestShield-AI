import os
import sys

# Pre-create models directory
os.makedirs("app/models/bin", exist_ok=True)
os.makedirs("app/pipelines", exist_ok=True)
os.makedirs("scripts", exist_ok=True)
os.makedirs("tests", exist_ok=True)

with open("app/__init__.py", "w") as f:
    pass

with open("app/models/__init__.py", "w") as f:
    pass

with open("app/pipelines/__init__.py", "w") as f:
    pass
