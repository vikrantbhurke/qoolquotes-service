import { Model } from "mongoose";

const getModelById =
  (Model: Model<any>, getModelByIdConfig: any) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const { refs, refFields } = getModelByIdConfig;

    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const id = args[0];
      let query = Model.findById(id).lean();

      if (refs && refFields) {
        for (let i = 0; i < refs.length; i++) {
          query = query.populate(refs[i], refFields[i]);
        }
      }

      const document = await query.exec();
      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default getModelById;
