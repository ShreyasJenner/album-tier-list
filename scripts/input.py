import os

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
filename = os.path.join(script_dir, "env.py")  # Ensures env.py is written in the same directory

def write_variables_to_file():
    # Get user input for variables
    vars_dict = {
        "CLIENT_ID": input("Enter value for client id: ") or os.getenv("CLIENT_ID", ""),
        "CLIENT_SECRET": input("Enter value for client secret: ") or os.getenv("CLIENT_SECRET", ""),
        "REDIRECT_URI": "http://localhost:3000",  # Fixed value
        "SCOPE": "user-library-read"  # Fixed value
    }

    print("Store the following link as a redirect URI: http://localhost:3000")
    print("Scope is set to: user-library-read")
    a = input("Press Enter once done")

    # Write the variables to a new Python file inside the script's directory
    with open(filename, "w", encoding="utf-8") as f:
        for var_name, var_value in vars_dict.items():
            f.write(f'{var_name} = {repr(var_value)}\n')

    print(f"Variables written to {filename}")

if __name__ == "__main__":
    write_variables_to_file()
