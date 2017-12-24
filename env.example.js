module.exports = {
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
        html: 'Html text. Can be inline or path to file (in which case it has to be prepended by file://path/to/file', // file path not implemented yet.
        sendEmail: 'true/false', // helper so you're not spammed with emails in development.
        debounceTime: 1000, // time (in milliseconds) to wait for changes over the watched location
    },
    // Both paths have to already exist
    watchPath: '/path/to/watch/location',
    resultPath: '/path/to/result',
    clearResult: 'boolean. If true, the resulted file will be cleared',
};