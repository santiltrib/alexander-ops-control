# Alexander Ops Control

Static protected dashboard prototype.

## Security Model

- The deploy package does not contain the raw backlog JSON.
- Dashboard data is stored as an encrypted browser-side envelope in `data/current_backlog_2026-06-29.enc.json`.
- The access key is not stored in this repository.
- This is an interim prototype. Shared editing, users, roles, audit log, and integrations require a backend.

## Deployment

This repository is designed for GitHub Pages or another static host.

## Local Preview

```bash
python3 -m http.server 8787
```

Then open `http://127.0.0.1:8787/`.
