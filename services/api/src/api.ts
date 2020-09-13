import 'reflect-metadata'; // We need this in order to use @Decorators
import application from './loader';
import Log from './loader/logger';
import express from "express";

application().then((app: express.Application) => {
    Log.info('Application started.');
})