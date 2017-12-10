"use strict";

const assert = require('assert');
const sendGridMail = require('@sendgrid/mail');

var SendgridConnector = function SendgridConnector(settings) {
  assert(typeof settings === 'object', 'Cannot create connector without settings object');
  assert(typeof settings.api_key === 'string' || typeof settings.api_key_env === 'string', 
    'Cannot create connector without API key. Please specify api_key or api_key_env');
  
  this.sendgridMail = sendGridMail;
  // set globally substitution wrappers (according to sendgrid docs)
  this.sendgridMail.setSubstitutionWrappers('{{', '}}');

  if (settings.api_key_env) {
    const envApiKey = process.env[settings.api_key_env];
    this.sendgridMail.setApiKey(envApiKey);
    delete settings.api_key_env;
  }

  if (settings.api_key) {
    this.sendgridMail.setApiKey(settings.api_key);
    delete settings.api_key;
  }

  this.settings = settings;
}

SendgridConnector.initialize = function (dataSource, callback) {
  dataSource.connector = new SendgridConnector(dataSource.settings);
  callback();
};

SendgridConnector.prototype.DataAccessObject = Mailer;

function Mailer() {}

Mailer.send = function(options, cb) {
  const dataSource = this.dataSource;
  const connector = dataSource.connector;
  const settings = dataSource.settings;
  const sgMail = connector.sendgridMail;

  // check connectors
  assert(connector, 'Cannot send mail without a connector!');
  assert(sgMail, 'Cannot send mail without a sendgrid object!');
  assert(options, 'Cannot send email without OPTIONS argument, please add OPTIONS object');
  assert(typeof options === 'object', 'OPTIONS argument must be an object');

  // check FROM field
  // if not specified in options, get from datasource settings
  const from = options.from || settings.from;
  assert(from, 'Cannot send email without FROM field, please add in options or in datasource settings');
  assert(typeof from === 'string', 'FROM field must be a string');
  options.from = from;

  // check callback
  assert(cb, 'Cannot send email without Callback function, please add callback function in options');
  assert(typeof cb === 'function', 'Callback must be a function');

  // create return function
  const fn = function (err, result) {
    return cb(err, result);
  };

  sgMail.send(options)
  .then(() => {
    fn(null);
  })
  .catch((err) => {
    fn(err);
  });
};

Mailer.prototype.send = function protoSend(fn) {
  return this.constructor.send(this, fn);
};

module.exports = SendgridConnector;
