# input_script.py

# Function to write variables to another Python file
def write_variables_to_file():
    filename = "env.py"
    
    # Get user input for variables
    vars_dict = {}
    
    var_value = input(f"Enter value for client id: ")
    vars_dict["CLIENT_ID"] = var_value
    var_value = input(f"Enter value for client secret: ")
    vars_dict["CLIENT_SECRET"] = var_value
    print("Store the following link as a redirect uri: http://localhost:3000")
    vars_dict["REDIRECT_URI"] = 'http://localhost:3000'
    print("Scope is set to: user-library-read")
    vars_dict["SCOPE"] = 'user-library-read'
    
    # Write the variables to a new Python file
    with open(filename, 'w') as f:
        for var_name, var_value in vars_dict.items():
            f.write(f"{var_name}={repr(var_value)}\n")

    print(f"Variables written to {filename}")

if __name__ == "__main__":
    write_variables_to_file()
