const moment = require('moment');

const dateTemplate = `
<h2>Day: %%DATE%%</h2>
`;

const hourTemplate = `
<p>Time: %%TIME%%</p>
<ul>
    <li>Degrees: <b>%%TEMP%%&#176;</b></li>
    <li>Wind: <b>%%WIND_SPEED%%</b> m/s</li>
    <li>Humidity: <b>%%HUMIDITY%%%</b></li>
    <li>Sky: <b>%%SKY%%</b></li>
</ul>
`;

function getTemplate (weatherApp) {
    const geocode = weatherApp.geocode;
    const weather = weatherApp.weather;

    let html = `<p>Weather report for <b>${geocode.formattedAddress}</b>:</p>`;

    weather.forEach(day => {
        html += dateTemplate.replace(/%%DATE%%/, moment(day.date).format('dddd'));
        html += `
<div style="width: 100%">
    %%HOUR_TEMPLATE_PLACEHOLDER%%
</div>
`;

        let nrOfDays = '';
        for ( let i = 0; i < day.values.length; i ++ ) {
            nrOfDays += '<div style="width: 33%; display: inline-block">%%HOUR_TEMPLATE%%</div>';
        }
        html = html.replace(/%%HOUR_TEMPLATE_PLACEHOLDER%%/, nrOfDays);

        day.values.forEach(hour => {
            html = html.replace(/%%HOUR_TEMPLATE%%/,
                hourTemplate
                    .replace(/%%TIME%%/, moment.unix(hour.dt).format('HH:mm'))
                    .replace(/%%TEMP%%/, '' + Math.round(hour.main.temp))
                    .replace(/%%WIND_SPEED%%/, '' + Math.round(hour.wind.speed))
                    .replace(/%%HUMIDITY%%/, '' + Math.round(hour.main.humidity))
                    .replace(/%%SKY%%/, hour.weather.map(w => w.main + ' - ' + w.description).join(', '))
            );
        });
    });

    return html;
}

module.exports = {
    getTemplate: getTemplate,
};
