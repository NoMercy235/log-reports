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

#### Template varibales for 'Body':

- `%%WEATHER%%` 
    - If you want to use the weather report, include `%%WEATHER%%` inside the `html` template from the environment.
      Instructions for getting the keys can be found at [weather-app](https://github.com/NoMercy235/weather-app).


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
        service: 'email provider', // gmail, yahoo, etc
        port: 587, // for secure connection or 25 for unsecure
        from: 'What will be displayed in the from field',
        email: 'test@example.com',
        password: 'super-secure-pass',
        to: 'destination@example.com',
        // Eventually, there will be custom fields here such as %%NAME%%, %%DATE%% or something like that for these following three fields.
        subject: 'Subject',
        body: 'Plain text',
        html: 'Html text.', // file path not implemented yet.
        sendEmail: 'true/false', // helper so you're not spammed with emails in development.
        debounceTime: 1000, // time (in milliseconds) to wait for changes over the watched location
    },
    // Both paths have to already exist
    watchPath: '/path/to/watch/location',
    resultPath: '/path/to/result',
    clearResult: 'boolean. If true, the resulted file will be cleared',
    weatherApp: {
        address: 'address for which to get the weather',
        keys: {
            googleApiKey: 'google api key',
            forecastApiKey: 'forecast api key',
        }
    },
}
```

License
-------

MIT
