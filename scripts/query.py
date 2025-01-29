import spotipy
import os
import requests
import re
from spotipy.oauth2 import SpotifyOAuth
import env

# Set your Spotify API credentials and required scopes
CLIENT_ID = env.CLIENT_ID
CLIENT_SECRET = env.CLIENT_SECRET
REDIRECT_URI = env.REDIRECT_URI
SCOPE = env.SCOPE

# Authenticate using SpotifyOAuth
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=CLIENT_ID,
                                               client_secret=CLIENT_SECRET,
                                               redirect_uri=REDIRECT_URI,
                                               scope=SCOPE))

# Create a directory for the images in the script's location
script_dir = os.path.dirname(os.path.abspath(__file__))  # Ensures correct directory
output_directory = os.path.join(script_dir, 'album_images')
os.makedirs(output_directory, exist_ok=True)
print("Wait")

# Function to fetch all albums in user's library
def get_user_albums():
    results = sp.current_user_saved_albums(limit=50)
    albums = results['items']
    
    while results['next']:
        results = sp.next(results)
        albums.extend(results['items'])
    
    return albums

# Function to sanitize filenames (cross-platform)
def sanitize_filename(name):
    return re.sub(r'[<>:"/\\|?*]', '_', name)  # Removes illegal characters

# Function to download images
def download_album_image(album, artist):
    image_url = album['images'][1]['url'] if album['images'] else None
    if image_url:
        # Create a safe filename
        album_name = sanitize_filename(album['name'])
        artist_name = sanitize_filename(artist)
        filename = f"{artist_name} - {album_name}.jpg"
        file_path = os.path.join(output_directory, filename)
        
        # Download and save the image
        response = requests.get(image_url)
        if response.status_code == 200:
            with open(file_path, 'wb') as f:
                f.write(response.content)
            print(f"Downloaded: {file_path}")
        else:
            print(f"Failed to download image for {album['name']} by {artist}")

# Main execution
def main():
    user_albums = get_user_albums()
    
    for item in user_albums:
        album = item['album']
        artist_names = ', '.join(artist['name'] for artist in album['artists'])
        
        print(f"Processing Album: {album['name']} by {artist_names}")
        download_album_image(album, artist_names)

    # Print album details
    for item in user_albums:
        album = item['album']
        print(f"Album Name: {album['name']}, Artist(s): {[artist['name'] for artist in album['artists']]}, Release Date: {album['release_date']}")

if __name__ == "__main__":
    main()
