"""Package the reviewable project without temporary files or Git metadata."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
output = root / 'submission' / 'sollux-rekrutacja.zip'
output.parent.mkdir(exist_ok=True)
files = [root / name for name in ('index.html', 'styles.css', 'app.js', 'shader.js', 'README.md', '.gitignore')]
for directory in ('assets', 'docs', 'tools'):
    files.extend(p for p in (root / directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for path in sorted(files):
        archive.write(path, Path('sollux-rekrutacja') / path.relative_to(root))
print(f'Created {output.name}: {len(files)} files, {output.stat().st_size:,} bytes')
