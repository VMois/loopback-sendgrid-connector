"use strict";

const assert = require('assert');
const sendGridMail = require('@sendgrid/mail');

var SendgridConnector = function SendgridConnector(settings) {
  assert(typeof settings === 'object', 'Cannot create connector without settings object');
  assert(typeof settings.api_key === 'string', 'Cannot create connector without API key');
  console.log('Create SendGrid connector');
  if (settings.api_key) {
    this.sendgridMail = sendGridMail;
    this.sendgridMail.setApiKey(settings.api_key);
    // set globally substitution wrappers (according to sendgrid docs)
    this.sendGridMail.setSubstitutionWrappers('{{', '}}');
  }
}

SendgridConnector.initialize = function (dataSource, callback) {
  console.log('Initialize SendgridConnector');
  dataSource.connector = new SendgridConnector(dataSource.settings);
  callback();
};

SendgridConnector.prototype.DataAccessObject = Mailer;

function Mailer() {}

Mailer.send = function(options, cb) {
  const dataSource = this.dataSource;
  const connector = dataSource.connector;
  const sgMail = connector.sendgridMail;

  assert(connector, 'Cannot send mail without a connector!');
  assert(sgMail, 'Cannot send mail without a sendgrid object!');

  const fn = function (err, result) {
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(result);
  };
}
