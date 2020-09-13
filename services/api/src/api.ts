import 'reflect-metadata'; // We need this in order to use @Decorators
import application from './application/loader';
import Log from './application/loader/logger';
import express from "express";

application().then((app: express.Application) => {
    Log.info('Application started.');
})