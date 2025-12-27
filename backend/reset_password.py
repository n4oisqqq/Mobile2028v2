import asyncio
import os
import asyncpg
from pathlib import Path
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load env variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Setup pwd context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def reset_password():
    database_url = os.environ.get('DATABASE_URL')
    email = "mdrrmo4516@gmail.com"
    new_password = "password123"
    
    hashed_password = pwd_context.hash(new_password)
    
    try:
        conn = await asyncpg.connect(database_url)
        result = await conn.execute(
            "UPDATE users SET password = $1 WHERE email = $2",
            hashed_password, email
        )
        print(f"Update result: {result}")
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(reset_password())
