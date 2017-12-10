# loopback-sendgrid-connector
Simple Loopback connector for SendGrid Mail service. Inspired by [loopback-connector-sendgrid](https://github.com/Cellarise/loopback-connector-sendgrid)

## Installation
```
npm install loopback-sendgrid-connector --save
```

## Documentation
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

or you can specify your env key, and connector will use this as api_key for Sendgrid

```json
{
  "sendgrid": {
    "connector": "loopback-sendgrid-connector",
    "api_key_env": "your_env_var",
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

### Usage
You can use callback (promises in future).

#### Simple usage:
```javascript
loopback.Email.send({
  to: "to@test.com",
  from: "from@test.com",
  subject: "Your subject",
  text: "Some text",
  html: "<b>Some message</b>"
},
function (err, result) {
  if(err) {
    console.log('[!] Error', err);
    return;
  }
  console.log(result);
});
```

#### Advanced usage:
```javascript
loopback.Email.send({
  to: "to@test.com",
  from: "from@test.com",
  subject: "Your subject",
  text: "Some text",
  html: "<b>Some message</b>",
  templateId: "your_sendgrid_template_id",
  substitutions: {
    name: 'John',
    city: 'NY'
  }
// and mamy more, according to SendGrid Mail documentation (link below)
},
function (err, result) {
  if(err) {
    console.log('[!] Error', err);
    return;
  }
  console.log(result);
});
```

Also you can specify TO field as an array to send email to multiple recipients:
```javascript
to: ["to1@test.com", "to2@test.com", "to3@test.com"]
```

List of all options for
[SendGrid Mail API](https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html).

[SendGrid send mail examples](https://github.com/sendgrid/sendgrid-nodejs/blob/master/packages/mail/USE_CASES.md) (most of them you can use in this connector)

### In future
1. Add promises support
2. Write tests :)
