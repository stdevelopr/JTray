from app import app

proc = app.app
if __name__ == "__main__":
    proc.run(debug=True)