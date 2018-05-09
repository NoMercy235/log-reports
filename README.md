Log Reports
==================================

The purpose of this project is to provide daily reports of whatever happens to some files located in a specified folder.

- [x] Fully configurable email
- [x] Parsing variables in templates for the email
- [x] Watch over a folder and send email for each update action.
- [x] Send weather report over the email.
- [ ] Use a crawler to get user-specific information that might be of interest.

#### Template variables for `Subject`:

- `%%DATE%%` - provides the date in `YYYY-MM-DD HH:mm:ss` format

#### Template variables for `HTML`:

- `%%WEATHER%%` 
    - If you want to use the weather report. Instructions for getting the keys can be found at [weather-app](https://github.com/NoMercy235/weather-app).


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
    mail: {
        service: 'string: email provider', // gmail, yahoo, etc
        port: 'number: 587 for secure connection or 25 for unsecure',
        from: 'string: What will be displayed in the from field',
        email: 'string: Email to authenticate with',
        password: 'string: Password to authenticate with',
        to: 'string: Destination email',
        subject: 'string',
        body: 'string',
        html: 'string', 
        sendEmail: 'boolean', // helper so you're not spammed with emails in development.
        debounceTime: 'number', // time (in milliseconds) to wait for changes over the watched location
    },
    // Both paths have to already exist
    watchPath: 'string: /path/to/watch/location',
    resultPath: 'string: /path/to/result',
    clearResult: 'string: after|before|disabled - cleared the resulted logs at the specified point in time',
    weatherApp: {
        address: 'string: address for which to get the weather',
        keys: {
            googleApiKey: 'string: google api key',
            forecastApiKey: 'string: forecast api key',
        },
        options: {
            limit: 'number: number of days to get the forecast for. Must be within 1 and 5.',
            type: 'string: one of ["forecast", "weather"]'
        }
    },
}
```

License
-------

MIT
