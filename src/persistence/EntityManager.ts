import { MongoClient, Db, ObjectID } from 'mongodb';

import { omit, pick } from 'lodash';

import { ModelMeta } from '../model/ModelMeta'
import { ModelType } from '../model/modelDecorator';
import { validateModel } from '../validation/validateModel';
import ValidationError from '../errors/ValidationError';

import createLogger from '../logging/createLogger';

const logger = createLogger('Entity Manager');

export class EntityManager {
    private db: Db

    async connect(mongoConnectionString: string): Promise<boolean> {
        try {
            logger.info('Connecting to mongodb');
            this.db = await MongoClient.connect(mongoConnectionString);
            logger.info('Successfully connected to mongodb');

            return true;
        }
        catch (err) {
            logger.error('Error while connecting to mongodb', err.stack);
            return false;
        }
    }

    async find(model: ModelType<any>, query: any) {
        const modelMeta: ModelMeta = model.modelMeta;
        const col = this.db.collection(modelMeta.namePlural);

        const rawResult = await col.find(query).toArray();

        const result = rawResult.map((v) => {
            const { _id, ...rest } = v;

            const retVal = new model();
            Object.assign(retVal, {
                [modelMeta.idKey]: _id.toString(),
                ...rest,
            });

            return retVal;
        })

        return result;
    }

    async findOne(model: any, query: any = {}) {
        const modelMeta: ModelMeta = model.modelMeta;
        const col = this.db.collection(modelMeta.namePlural);

        const rawResult = await col.findOne(query);

        if (!rawResult) {
            return null;
        }

        const { _id, ...rest } = rawResult;

        const retVal = new model();
        Object.assign(retVal, {
            [modelMeta.idKey]: _id.toString(),
            ...rest,
        });

        return retVal;
    }

    async findByID(model: any, id: string) {
        const modelMeta: ModelMeta = model.modelMeta;
        const col = this.db.collection(modelMeta.namePlural);

        try {
            const rawResult = await col.findOne({ _id: new ObjectID(id) });
            const { _id, ...rest } = rawResult;
            const retVal = new model();
            Object.assign(retVal, {
                [modelMeta.idKey]: _id.toString(),
                ...rest,
            });

            return retVal;
        }
        catch (err) {
            logger.error(err.stack);
            return null;
        }
    }

    async save(model: any, instance: any) {
        const modelMeta: ModelMeta = model.modelMeta;

        const validationResult = validateModel(modelMeta, instance);
        if(!validationResult.isValid) {
            throw new ValidationError("Validation failure while saving entity", validationResult)
        }

        const toSave = pick(instance, Object.keys(modelMeta.fields));

        const col = this.db.collection(modelMeta.namePlural);
        const result = await col.insertOne(toSave);

        if (result.insertedCount === 0) {
            return null;
        }

        const savedInstance = await this.findByID(model, result.insertedId.toString());
        return savedInstance;
    }

    async deleteByID(model: any, id: string) {
        const modelMeta: ModelMeta = model.modelMeta;
        const col = this.db.collection(modelMeta.namePlural);

        try {
            const result = await col.findOneAndDelete({ _id: new ObjectID(id) });
            return true;
        }
        catch (err) {
            logger.error(err.stack);
            return false;
        }
    }

    async updateByID(model: any, id: string, newValue: any) {
        const modelMeta: ModelMeta = model.modelMeta;

        const validationResult = validateModel(modelMeta, newValue);
        if(!validationResult.isValid) {
            throw new ValidationError("Validation failure while updating entity", validationResult)
        }

        const col = this.db.collection(modelMeta.namePlural);

        const fields = Object.keys(modelMeta.fields).filter(f => !modelMeta.fields[f].isID);

        const toSave = pick(newValue, fields);

        const result = await col.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: toSave });

        if (!result.ok) {
            return null;
        }

        return newValue;
    }

}

export default new EntityManager();
