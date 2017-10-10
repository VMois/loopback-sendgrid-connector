# loopback-sendgrid-connector
Loopback connector for SendGrid. Inspired by [loopback-connector-sendgrid](https://github.com/Cellarise/loopback-connector-sendgrid)

## Installation
`npm install loopback-sendgrid-connector --save`

## Documentation - Coming soon
### Configuration
#### SendGrid API key

Three steps to add connector to your app:
1) Get SendGrid API key,
2) Add configutation to datasource.json,
3) Add configuration to model-config.json

##### 1. API key
You can get your SendGrid API key in your SendGrid Dashboard -> Settings -> API keys

##### 2. datasource.json
```json
{
  "sendgrid": {
    "connector": "loopback-sendgrid-connector",
    "api_key": "your_api_key",
    "from": "default_sender_email (not required)"
  }
}
```

##### 3. model-config.json
```json
{
  "Email": {
    "dataSource": "sendgrid",
    "public": false
  }
}
```
