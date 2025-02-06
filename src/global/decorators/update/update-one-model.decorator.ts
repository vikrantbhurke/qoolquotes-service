import { Model } from "mongoose";

const updateOneModel =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const updateQuoteIndexDTO = args[0];
      let query = Model.findOneAndUpdate(updateQuoteIndexDTO).lean();
      const document = await query.exec();
      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default updateOneModel;
