"use strict";

const assert = require('assert');
const sendGridMail = require('@sendgrid/mail');

var SendgridConnector = function SendgridConnector(settings) {
  assert(typeof settings === 'object', 'Cannot create connector without settings object');
  assert(typeof settings.api_key === 'string', 'Cannot create connector without API key');

  if (settings.api_key) {
    this.sendgridMail = sendGridMail;
    this.sendgridMail.setApiKey(settings.api_key);
    // set globally substitution wrappers (according to sendgrid docs)
    this.sendgridMail.setSubstitutionWrappers('{{', '}}');
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

  // check TO field
  const to = options.to;
  assert(to, 'Cannot send mail without TO field');
  assert(typeof to === 'array', 'TO field must be an array');

  // check FROM field
  // if not specified in options, get from datasource settings
  const from = options.from || settings.from;
  assert(from, 'Cannot send email without FROM field, please add in options or in datasource settings');
  assert(typeof from === 'string', 'FROM field must be a string');


  // check if callback is function
  if (cb) {
    assert(typeof cb === 'function', 'Callback must be a function');
  }

  // create return function
  const fn = function (err, result) {
    if (cb) {
      return cb(err, result);
    }
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(result);
  };

  fn(null, {});
};

Mailer.prototype.send = function protoSend(fn) {
  return this.constructor.send(this, fn);
};

module.exports = SendgridConnector;
