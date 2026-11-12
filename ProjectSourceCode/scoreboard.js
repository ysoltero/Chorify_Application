const app = require('../app')
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./ProjectSourceCode/src/db');

const residents_points = [];

import { names } from '../test/names-test';