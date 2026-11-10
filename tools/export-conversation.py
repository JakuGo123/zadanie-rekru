"""Export visible conversation and tool records from one user-selected Codex JSONL.

Usage: python tools/export-conversation.py PATH_TO_SESSION.jsonl
No system/developer messages or hidden reasoning are exported.
"""
import argparse
from collections import Counter
from datetime import datetime, timezone
import json
from pathlib import Path
import re

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('session', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
redactions = Counter()


def scrub(text):
    # The journal may quote the profile name outside an absolute path.
    profile = root.parts[2] if len(root.parts) > 2 and root.parts[1].lower() == 'users' else None
    if profile:
        text, count = re.subn(re.escape(profile), '<LOCAL_USER>', text, flags=re.IGNORECASE)
        redactions['local_user_name'] += count
    patterns = [
        ('local_profile', r'(?i)(?:[A-Z]:[/\\]+Users[/\\]+)[^/\\\s"<>]+', '<USER_HOME>'),
        ('thread_identifier', r'\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b', '<ID>'),
        ('api_key', r'\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b', '<REDACTED_API_KEY>'),
        ('github_token', r'\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b', '<REDACTED_TOKEN>'),
        ('bearer', r'(?i)\bBearer\s+[A-Za-z0-9_.~-]{20,}', 'Bearer <REDACTED>'),
        ('jwt', r'\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\b', '<REDACTED_JWT>'),
        ('inline_image', r'data:image/[^;\s]+;base64,[A-Za-z0-9+/=]+', '<BINARY_IMAGE_OMITTED>'),
    ]
    for name, pattern, replacement in patterns:
        text, count = re.subn(pattern, replacement, text)
        redactions[name] += count
    return text


def clean(value, key=''):
    if key in ('encrypted_content', 'signature'):
        return '<INTERNAL_DATA_OMITTED>'
    if isinstance(value, dict):
        if value.get('type') in ('input_image', 'image', 'image_url'):
            return {'type': 'image_reference', 'note': 'Binary image omitted; supplied references are in docs/reference.'}
        return {k: clean(v, k) for k, v in value.items()}
    if isinstance(value, list):
        return [clean(item) for item in value]
    return scrub(value) if isinstance(value, str) else value


records = []
source_types = Counter()
inventory_calls = set()
last_timestamp = None
for line in args.session.open(encoding='utf-8'):
    try:
        entry = json.loads(line)
    except json.JSONDecodeError:
        continue  # The live journal can have an unfinished last line.
    if entry.get('type') != 'response_item':
        continue
    payload = entry.get('payload', {})
    kind = payload.get('type')
    if kind == 'function_call':
        arguments = str(payload.get('arguments', payload.get('input', '')))
        if 'cua.getState(' in arguments:
            inventory_calls.add(payload.get('call_id'))
    if kind in ('function_call_output', 'custom_tool_call_output') and payload.get('call_id') in inventory_calls:
        payload = {**payload, 'output': '[Removed unrelated local app/window inventory for privacy.]'}
        redactions['unrelated_app_inventory'] += 1
    if kind == 'message':
        if payload.get('role') not in ('user', 'assistant') or payload.get('channel') == 'analysis' or payload.get('phase') == 'analysis':
            continue
        text = ''.join(part.get('text', '') for part in payload.get('content', []))
        if text.lstrip().startswith(('<environment_context>', '<external_codex_apps_')):
            continue
    elif kind not in ('function_call', 'function_call_output', 'custom_tool_call', 'custom_tool_call_output', 'tool_result'):
        continue
    last_timestamp = entry.get('timestamp')
    records.append({'timestamp': last_timestamp, **clean(payload)})
    source_types[kind] += 1

document = {
    'schema_version': 1,
    'project': 'SOLLUX — zadanie rekrutacyjne',
    'exported_at_utc': datetime.now(timezone.utc).isoformat(),
    'last_included_record_at': last_timestamp,
    'source': 'Actual local Codex JSONL journal for this conversation',
    'scope': 'Visible user/assistant messages and available tool calls/results; excludes system/developer instructions, hidden reasoning and environment snapshots.',
    'binary_attachments': ['reference/landing-page.png', 'reference/wytyczne.png'],
    'skills': ['sites:sites', 'computer-use:computer-use (read)', 'openai-docs (read)'],
    'mcp_used': ['mcp__cua_repl'],
    'tools_used': ['functions.exec', 'exec_command', 'apply_patch', 'view_image', 'web.run'],
    'subagents_used': False,
    'record_counts': dict(source_types),
    'redactions': dict(redactions),
    'records': records,
}
destination = root / 'docs' / 'ai-conversation.json'
destination.write_text(json.dumps(document, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Exported {len(records)} records to {destination.name}; redactions: {dict(redactions)}')
