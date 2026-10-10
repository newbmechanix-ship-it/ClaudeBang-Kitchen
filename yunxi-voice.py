"""Optional original Mandarin voice. No account or stored credentials are read."""
import asyncio
import json
import sys
from pathlib import Path
import edge_tts

async def main():
    data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    await edge_tts.Communicate(data["speech"], "zh-CN-YunxiNeural", rate="+0%", pitch="+0Hz").save(data["output"])

if __name__ == "__main__":
    asyncio.run(main())
