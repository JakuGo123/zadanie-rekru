"""One-shot helper: include the pending final assistant reply, then rebuild ZIP.

Started only for this delivery; no service, startup entry or scheduled task.
Usage: python tools/finalize-export.py PATH_TO_SESSION.jsonl
"""
import json
from pathlib import Path
import subprocess
import sys
import time

session = Path(sys.argv[1])
root = Path(__file__).resolve().parents[1]
deadline = time.monotonic() + 900
found = False
with session.open(encoding='utf-8') as stream:
    stream.seek(0, 2)
    while time.monotonic() < deadline:
        offset = stream.tell()
        line = stream.readline()
        if not line or not line.endswith('\n'):
            stream.seek(offset)
            time.sleep(1)
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError:
            continue
        payload = item.get('payload', {})
        if (item.get('type') == 'response_item' and payload.get('type') == 'message'
                and payload.get('role') == 'assistant'
                and (payload.get('channel') == 'final' or payload.get('phase') == 'final_answer')):
            found = True
            break

if found:
    subprocess.run([sys.executable, str(root / 'tools/export-conversation.py'), str(session)], check=True)
    subprocess.run([sys.executable, str(root / 'tools/package.py')], check=True)
    (root / '.work/finalize-status.json').write_text(json.dumps({'final_reply_included': True}), encoding='utf-8')
else:
    (root / '.work/finalize-status.json').write_text(json.dumps({'final_reply_included': False, 'reason': 'No final reply before the 15-minute timeout; snapshot remains available.'}), encoding='utf-8')
