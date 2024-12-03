import { Model } from "mongoose";

const createModel =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const createModelDTO = args[0];
      const document = new Model(createModelDTO);
      await document.save();
      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default createModel;
