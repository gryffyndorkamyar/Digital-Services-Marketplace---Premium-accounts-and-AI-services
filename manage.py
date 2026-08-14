#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

from local_bootstrap import (
    default_runserver_addrport,
    ensure_local_migrations,
    ensure_local_postgres,
    ensure_project_venv,
    load_env_files,
    print_dev_banner,
)


def main():
    """Run administrative tasks."""
    load_env_files()
    ensure_project_venv()
    default_runserver_addrport()
    ensure_local_postgres()
    ensure_local_migrations()
    print_dev_banner()

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "main.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
