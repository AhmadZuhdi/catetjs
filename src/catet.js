/*
* @Author: ahmadzuhdi
* @Date:   2015-10-12 17:05:59
* @Last Modified by:   ahmadzuhdi
* @Last Modified time: 2015-10-12 18:13:07
*/

'use strict';

import Firebase from 'firebase';
import moment from 'moment';
import fs from 'fs-extra';
import bluebird from 'bluebird';
import uuid from 'node-uuid'

export default class Catet {

  constructor({level = 0, appKey = uuid.v4(), logPath = `${__dirname}/logs/${appKey}.log`, useCloud = false} = {}){

    /**
     * log level
     * @type {Number}
     * @example
     * 0 = debug
     * 1 = info
     * 2 = warn
     * 3 = error
     * 4 = fatal
     */
    this.level = level

    /**
     * mapping for level
     * @type {Array}
     */
    this.levelMap = [
      'debug',
      'info',
      'warn',
      'error',
      'fatal'
    ]

    /**
     * app key
     * @type {String}
     */
    this.appKey = appKey

    /**
     * path of log if cloud is not actived
     * @type {String}
     */
    this.logPath = logPath

    /**
     * status of using cloud
     * @type {Boolean}
     */
    this.useCloud = useCloud

    /**
     * firebase object
     * @type {Object}
     */
    this.fb = new Firebase(`https://catetin.firebaseio.com/${appKey}`)

    /**
     * make sure file is exsist
     */
    fs.ensureFileSync(logPath)
  }

  /**
   * get log level
   * @return {Number}
   */
  getLevel(){
    return this.level;
  }

  /**
   * set level of log
   * @param {Number} level
   */
  setLevel(level = 0){
    this.level = level;
    return this
  }

  log(...logMessages){

    logMessages.map(message => {
      this.writeLog(this.level, message)
    })

    return this;
  }

  debug(...logMessages){
    logMessages.map(message => {
      this.writeLog(0, message)
    })

    return this;
  }

  info(...logMessages){
    logMessages.map(message => {
      this.writeLog(1, message)
    })

    return this;
  }

  warn(...logMessages){
    logMessages.map(message => {
      this.writeLog(2, message)
    })

    return this;
  }

  error(...logMessages){
    logMessages.map(message => {
      this.writeLog(3, message)
    })

    return this;
  }

  fatal(...logMessages){
    logMessages.map(message => {
      this.writeLog(4, message)
    })

    return this;
  }

  writeLog(level, message){
    var timestamp = moment().format()
    var type = this.levelMap[level]

    if(this.useCloud){
      this.writeToClouds({
        timestamp,
        message,
        level,
        type
      })
    }

    fs.appendFile(this.logPath, `[${timestamp} | ${level} | ${type}] :: ${message} \n`)
  }

  writeToClouds(message){
    this.fb.push(message)
    return this
  }
}