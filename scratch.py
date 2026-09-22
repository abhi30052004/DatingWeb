import requests

def test_admin():
    # Login
    print("Logging in...")
    r = requests.post("http://localhost:8000/api/admin/login", json={"username": "admin", "password": "admin123"})
    if r.status_code != 200:
        print("Login failed:", r.status_code, r.text)
        return
    token = r.json().get("access_token")
    print("Got token")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Stats
    print("Fetching stats...")
    r = requests.get("http://localhost:8000/api/admin/stats", headers=headers)
    if r.status_code != 200:
        print("Stats failed:", r.status_code, r.text)
    else:
        print("Stats:", r.json())
        
    # Users
    print("Fetching users...")
    r = requests.get("http://localhost:8000/api/admin/users", headers=headers)
    if r.status_code != 200:
        print("Users failed:", r.status_code, r.text)
    else:
        print("Users count:", len(r.json()))

if __name__ == "__main__":
    test_admin()
