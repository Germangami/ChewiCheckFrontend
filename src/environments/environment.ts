export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  googleMapsApiKey: process.env['GOOGLE_MAPS_API_KEY'],
  googleCalendar: {
    clientId: process.env['GOOGLE_CLIENT_ID'],
    redirectUri: 'http://localhost:4201',
    serviceAccountPath: 'assets/service-account.json',
    calendarId: 'primary',
    timeZone: 'Europe/Moscow',
    apiKey: process.env['GOOGLE_API_KEY']
  }
}; 