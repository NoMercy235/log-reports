Log Reports
==================================

The purpose of this project is to provide daily reports of whatever happens to some files located in a specified folder.

- [x] Fully configurable email
- [ ] Parsing variables in templates for the email
- [ ] Watch over a folder and take actions for each change made.

Getting Started
---------------

```sh
# clone it
SSH: git@github.com:NoMercy235/log-reports.git
HTTPS: git clone https://github.com/NoMercy235/log-reports.git

# Navigate to it
cd log-reports

# Install dependencies
npm install

# Start development:
npm start
```

Create a `env.js` file in the root directory with the following template:

```javascript
{
    "mail": {
        "service": "email provider", // gmail, yahoo, etc
        "port": 587, // for secure connection or 25 for unsecure
        "from": "What will be displayed in the from field",
        "email": "test@example.com",
        "password": "super-secure-pass",
        "to": "destination@example.com",
        "subject": "Subject",
        "body": "Plain text",
        "html": "Html text. Can be inline or path to file (in which case it has to be prepended by file://path/to/file",
    }
}
```

License
-------

MIT
