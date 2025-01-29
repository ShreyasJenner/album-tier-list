if not exist venv python -m venv spotipy-venv
call spotipy-venv\Scripts\activate.bat
pip install -r req.txt

start cmd /k python scripts\\input.py  REM Opens a new terminal window for input
pause  REM Keep the main batch script open

python scripts\\query.py
start "" "https://shreyasjenner.github.io/"
pause
