"""
Helper: copy sarvaha_new.pptx over the original after PowerPoint is closed.
Run this after closing PowerPoint.
"""
import shutil
import os

src = r"C:\Users\Poloj\Downloads\sarvaha_new.pptx"
dst = r"C:\Users\Poloj\Downloads\sarvaha.pptx"

if not os.path.exists(src):
    print(f"Source file not found: {src}")
else:
    try:
        # Remove the old file
        if os.path.exists(dst):
            os.remove(dst)
        # Copy new to old
        shutil.copy2(src, dst)
        print(f"Successfully replaced {dst}")
        # Optionally remove the _new file
        os.remove(src)
        print(f"Removed {src}")
    except PermissionError as e:
        print(f"Permission denied: {e}")
        print("Make sure PowerPoint is not open with the file, then try again.")
    except Exception as e:
        print(f"Error: {e}")
