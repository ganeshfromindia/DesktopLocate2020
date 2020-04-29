// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  base_url: 'http://localhost:8071/', 
  production: false,
  snapToRoadUrl : 'https://roads.googleapis.com/v1/snapToRoads?path=',
  apiKey : '&key=AIzaSyAhBskN2Nm9cbEihwCEE4CWE2R-8iGyCTA',
  googleBaseUrl : 'https://maps.googleapis.com/maps/api/geocode/json?',
  MAP_API_KEY : 'AIzaSyDi5O_ZKHS7Tfh5Z8bbPDVe4AzD1BdWhUA'
};
