import { Model } from "mongoose";

const getOneModelByIndex =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const index = args[0];
      let query = Model.findOne().skip(index).lean();
      const document = await query.exec();
      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default getOneModelByIndex;
