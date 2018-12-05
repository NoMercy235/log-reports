const moment = require('moment');

const NR_OF_HOURS = 8;

function createHeader () {
  return `
    <tr style="color: white; border: 1px solid lightgray; font-weight: bold;">
        <td style="background-color: forestgreen; text-align: center;">Day</td>
        <td style="background-color: forestgreen;">2:00</td>
        <td style="background-color: forestgreen;">5:00</td>
        <td style="background-color: forestgreen;">8:00</td>
        <td style="background-color: forestgreen;">11:00</td>
        <td style="background-color: forestgreen;">14:00</td>
        <td style="background-color: forestgreen;">17:00</td>
        <td style="background-color: forestgreen;">20:00</td>
        <td style="background-color: forestgreen;">23:00</td>
    </tr>
  `;
}

function createRow (metadata) {
  const bgColor = metadata.index % 2 === 1 ? 'background-color: #f2f2f2;' : '';
  let row = `
    <tr style="border: 1px solid lightgray; border-top: 0; ${bgColor}">
        <td style="text-align: center;">${metadata.date}</td>
        %%TEMPS%%
    </tr>
  `;

  row = row.replace(/%%TEMPS%%/, '%%TEMP%%'.repeat(metadata.status.length));

  metadata.status.forEach(status => {
    if (Object.keys(status).length === 0) {
      row = row.replace(/%%TEMP%%/, '<td></td>');
      return;
    }
    row = row.replace(
      /%%TEMP%%/,
      `<td>
            ${status.temp}&deg;&nbsp;C<br />
            &#9780;&nbsp;${status.wind}&nbsp;km/h<br />
            ${status.weather}
       </td>`
    );
  });

  return row;
}

function getTemplate (weatherApp) {
  const geocode = weatherApp.geocode;
  const weather = weatherApp.weather;

  let html = `
    <p style="font-size: large">Weather report for <b>${geocode.formattedAddress}</b>:</p>
    <table style="width: 100%; font-size: large; border-collapse: collapse;">
        %%WEATHER_HEADER%%
        %%WEATHER_ROWS%%
    </table>
  `;

  html = html.replace(/%%WEATHER_HEADER%%/, createHeader());
  html = html.replace(/%%WEATHER_ROWS%%/, '%%WEATHER_ROW%%'.repeat(weather.length));

  weather.forEach((day, index) => {
    let metadata = {
      date: moment(day.date).format('dddd'),
      status: day.values.map(hour => {
        // Conversion from m/s to km/h
        const windSpeed = hour.wind.speed * (3600 / 1000);

        return {
          temp: Math.round(hour.main.temp),
          wind: Math.round(windSpeed),
          weather: hour.weather.map(w => w.main + ' - ' + w.description).join(', ')
        };
      }),
      index: index,
    };
    if (metadata.status.length !== NR_OF_HOURS) {
      metadata.status = (new Array(NR_OF_HOURS - metadata.status.length)).fill({}).concat(metadata.status);
    }
    html = html.replace(/%%WEATHER_ROW%%/, createRow(metadata));
  });

  return html;
}

module.exports = {
  getTemplate: getTemplate,
};
