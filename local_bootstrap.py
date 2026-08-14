"""Shared local-env bootstrap for Mignum (does not affect other projects)."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load_env_files() -> None:
    """Load `.env` then override with `.env.local` (local-only; not used on Liara)."""

    def _load(path: Path, override: bool) -> None:
        if not path.is_file():
            return
        for raw in path.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if not key:
                continue
            if override or key not in os.environ:
                os.environ[key] = val

    _load(ROOT / ".env", override=False)
    _load(ROOT / ".env.local", override=True)


def ensure_project_venv() -> None:
    """
    Re-exec with project `.venv` when available.
    Creates `.venv` + installs deps on first run if missing.
    """
    if os.name == "nt":
        venv_python = ROOT / ".venv" / "Scripts" / "python.exe"
        venv_pip = ROOT / ".venv" / "Scripts" / "pip.exe"
    else:
        venv_python = ROOT / ".venv" / "bin" / "python"
        venv_pip = ROOT / ".venv" / "bin" / "pip"

    if not venv_python.is_file():
        print("[mignum] Creating .venv (first run)...")
        subprocess.run([sys.executable, "-m", "venv", str(ROOT / ".venv")], check=True, cwd=ROOT)
        req = ROOT / "requirements.txt"
        if req.is_file() and venv_pip.is_file():
            print("[mignum] Installing Python dependencies...")
            subprocess.run(
                [str(venv_pip), "install", "-q", "-r", str(req)],
                check=False,
                cwd=ROOT,
            )

    if not venv_python.is_file():
        return

    try:
        if Path(sys.executable).resolve() == venv_python.resolve():
            return
    except OSError:
        return

    os.execv(str(venv_python), [str(venv_python), str(ROOT / "manage.py"), *sys.argv[1:]])


def default_runserver_addrport() -> None:
    """Use :8010 by default so :8000 stays free for other projects (e.g. Business-OS)."""
    if len(sys.argv) < 2 or sys.argv[1] != "runserver":
        return

    def looks_like_addrport(arg: str) -> bool:
        if arg.startswith("-"):
            return False
        if arg.isdigit():
            return True
        if ":" in arg:
            return True
        if arg.startswith(("localhost", "127.", "0.0.0.0")):
            return True
        return False

    if not any(looks_like_addrport(a) for a in sys.argv[2:]):
        sys.argv.append("127.0.0.1:8010")


def ensure_local_postgres() -> None:
    """Ensure dedicated mignum-postgres container exists/runs when USE_LOCAL_DB=True."""
    if os.environ.get("USE_LOCAL_DB", "").lower() not in {"1", "true", "yes", "on"}:
        return
    if len(sys.argv) < 2 or sys.argv[1] not in {"runserver", "migrate", "shell"}:
        return

    container = os.environ.get("LOCAL_DB_CONTAINER", "mignum-postgres")
    port = os.environ.get("LOCAL_DB_PORT", "55434")
    try:
        listed = subprocess.run(
            ["docker", "ps", "-a", "--format", "{{.Names}}"],
            check=False,
            capture_output=True,
            text=True,
            timeout=20,
        )
        names = {line.strip() for line in (listed.stdout or "").splitlines()}
        if container not in names:
            subprocess.run(
                [
                    "docker",
                    "run",
                    "-d",
                    "--name",
                    container,
                    "-e",
                    "POSTGRES_USER=mignum",
                    "-e",
                    "POSTGRES_PASSWORD=mignum_local",
                    "-e",
                    "POSTGRES_DB=mignum",
                    "-p",
                    f"{port}:5432",
                    "postgres:16",
                ],
                check=False,
                capture_output=True,
                text=True,
                timeout=120,
            )
        else:
            subprocess.run(
                ["docker", "start", container],
                check=False,
                capture_output=True,
                text=True,
                timeout=20,
            )
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        pass


def ensure_local_migrations() -> None:
    """Apply migrations automatically in local dev (idempotent)."""
    if os.environ.get("USE_LOCAL_DB", "").lower() not in {"1", "true", "yes", "on"}:
        return
    if len(sys.argv) < 2 or sys.argv[1] != "runserver":
        return

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "main.settings")
    try:
        import django

        django.setup()
        from django.core.management import call_command

        call_command("migrate", "--noinput", verbosity=0)
    except Exception as exc:
        print(f"[mignum] migrate skipped: {exc}")


def print_dev_banner() -> None:
    """Friendly URLs when starting the dev server."""
    if len(sys.argv) < 2 or sys.argv[1] != "runserver":
        return

    print("")
    print("=" * 52)
    print("  Mignum backend  →  http://127.0.0.1:8010/")
    print("  Admin           →  http://127.0.0.1:8010/admin/")
    print("  Frontend (CRA)  →  http://localhost:3000/")
    print("  (cd frontend && npm start)")
    print("=" * 52)
    print("")
