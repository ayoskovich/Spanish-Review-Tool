# review-spanish

A django app to help me review spanish words.


## Quickstart

Set the `DJANGO_SPANISH_REVIEW_SECRET` environment variable on your machine and then run:

```sh
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Dev notes

This app uses the users session in order to connect items that are created, and to simulate a new session you can just go in to devtools and delete the "" cookie and reload!

```
Application > Storage > Cookies > this site > "sessionid" > Delete
```