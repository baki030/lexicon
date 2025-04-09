import streamlit as st
import pandas as pd
import re # For variable substitution
from datetime import datetime

# --- Page Configuration (Optional but Recommended) ---
st.set_page_config(
    page_title="Prompt Engineering Playground",
    layout="wide" # Use full width
)

# --- Helper Functions (Similar to the JS logic) ---

def parse_variables(variable_string):
    """Parses key=value lines into a dictionary."""
    variables = {}
    lines = variable_string.strip().split('\n')
    for line in lines:
        parts = line.split('=', 1) # Split only on the first '='
        if len(parts) == 2:
            key = parts[0].strip()
            value = parts[1].strip()
            if key:
                variables[key] = value
    return variables

def process_prompt(template, variables):
    """Substitutes variables into the prompt template."""
    processed = template
    for key, value in variables.items():
        # Use regex for safer replacement (handles potential special chars in key)
        placeholder = "{" + re.escape(key) + "}"
        processed = re.sub(placeholder, value, processed)
    return processed

def simulate_ai_response(processed_prompt):
    """Simulates an AI response (in a real app, this would be an API call)."""
    if not processed_prompt.strip():
        return "(No prompt provided or variables missing)"
    # Simple simulation
    return f"--- AI Simulation Result ---\n\n{processed_prompt}"

# --- Initialize Session State ---
# Session state persists variables across reruns within a single user session.
# It does NOT persist if the user closes the browser tab or the app restarts.

# Initialize history list if it doesn't exist
if 'prompt_history' not in st.session_state:
    st.session_state.prompt_history = []

# Initialize variables to store the *current* run's data before saving
if 'current_run_data' not in st.session_state:
    st.session_state.current_run_data = None

if 'show_rating_save' not in st.session_state:
    st.session_state.show_rating_save = False # Controls visibility of rating/save

# --- App Layout ---

st.title("🚀 Prompt Engineering Playground")
st.markdown("Test different prompt structures and track their simulated results.")

# --- Input Section ---
st.header("1. Define Prompt & Variables")

col1, col2 = st.columns(2) # Create two columns for inputs

with col1:
    prompt_template = st.text_area(
        "Prompt Template (use {variable_name})",
        height=200,
        placeholder="Example: Write a short story about a {character} who lives in {location}.",
        key="prompt_template_input" # Assign a key for potential state access
    )

with col2:
    variable_string = st.text_area(
        "Variables (one per line: key=value)",
        height=200,
        placeholder="Example:\ncharacter=brave knight\nlocation=a dragon's lair",
        key="variables_input"
    )

if st.button("Run Prompt", key="run_button"):
    variables = parse_variables(variable_string)
    processed_prompt = process_prompt(prompt_template, variables)
    simulated_output = simulate_ai_response(processed_prompt)

    # Store data for the current run in session state
    st.session_state.current_run_data = {
        "id": datetime.now().strftime("%Y%m%d%H%M%S%f"), # Unique ID
        "prompt": prompt_template,
        "variables": variable_string, # Store original string
        "output": simulated_output,
        "rating": None,
        "timestamp": datetime.now()
    }
    st.session_state.show_rating_save = True # Allow rating/saving
    # Clear the rating input from previous runs explicitly if needed
    # Streamlit usually handles this well with keys, but belt-and-suspenders:
    if 'rating_input' in st.session_state:
         del st.session_state['rating_input'] # Force widget reset on next render if needed


# --- Output & Rating Section ---
st.header("2. Simulated Output & Rating")

if st.session_state.current_run_data:
    st.text_area(
        "Generated Output:",
        value=st.session_state.current_run_data["output"],
        height=250,
        disabled=True, # Make it read-only
        key="output_display"
    )

    # Show rating and save button only after running and if not yet saved
    if st.session_state.show_rating_save:
        rating = st.number_input(
            "Rate Result (1-5):",
            min_value=1,
            max_value=5,
            step=1,
            key="rating_input" # Use a key
        )

        if st.button("Save to History", key="save_button"):
            if st.session_state.current_run_data and rating:
                # Update the rating in the stored data
                st.session_state.current_run_data["rating"] = rating
                # Append the completed run data to the history
                st.session_state.prompt_history.append(st.session_state.current_run_data)
                # Reset state for the next run
                st.session_state.current_run_data = None
                st.session_state.show_rating_save = False
                # Clear inputs by rerunning (Streamlit's default behavior often suffices)
                # or explicitly: st.experimental_rerun()
                st.success("Saved to history!") # Show confirmation
                st.experimental_rerun() # Force rerun to update history display immediately
            else:
                st.warning("Cannot save. Did you run a prompt and provide a rating?")

# --- History Section ---
st.header("3. Prompt History")

if st.session_state.prompt_history:
    # Convert history list of dicts to DataFrame for better display
    history_df = pd.DataFrame(st.session_state.prompt_history)

    # Reorder columns for readability
    history_df = history_df[[
        "rating", "prompt", "variables", "output", "timestamp", "id"
    ]]

    # Format timestamp for display (optional)
    history_df['timestamp'] = history_df['timestamp'].dt.strftime('%Y-%m-%d %H:%M:%S')

    # Sort by Rating (descending) by default - st.dataframe allows user sorting too
    history_df_display = history_df.sort_values(by="rating", ascending=False).reset_index(drop=True)

    st.dataframe(
        history_df_display,
        # Use container width ensures the table uses the available horizontal space
        use_container_width=True,
         column_config={ # Optional: Customize column display
            "id": None, # Hide the ID column
            "prompt": st.column_config.TextColumn("Prompt Template", width="medium"),
            "variables": st.column_config.TextColumn("Variables", width="small"),
            "output": st.column_config.TextColumn("Output", width="large"),
            "rating": st.column_config.NumberColumn("Rating ⭐", width="small", format="%d ⭐"),
            "timestamp": st.column_config.DatetimeColumn("Timestamp", width="small")
        }
        )

    # Optional: Add a button to clear history
    if st.button("Clear History", key="clear_history"):
        st.session_state.prompt_history = []
        st.session_state.current_run_data = None # Also clear any pending run
        st.session_state.show_rating_save = False
        st.experimental_rerun()

else:
    st.info("No history yet. Run a prompt and save it!")


# --- Persistence Note ---
st.sidebar.markdown("---")
st.sidebar.subheader("⚠️ Persistence Note")
st.sidebar.info(
    "History is stored in **Session State** and will be **lost** "
    "if you close the browser tab or the app restarts.\n\n"
    "For true persistence, you would need to save the history "
    "to a file (CSV, JSON) or a database on the server."
)