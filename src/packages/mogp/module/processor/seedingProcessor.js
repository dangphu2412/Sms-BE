/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { MogpConfig } from '../../core/config';
import { BaseProcessor } from '../base/baseProcessor';
import { SeedingCollector } from '../collector/seedingCollector';

export class SeedingProcessor extends BaseProcessor {
    constructor() {
        super(SeedingCollector.builder());
    }

    preProcess(tasks) {}

    afterProcess() { }

    afterRun(task) { }
}
