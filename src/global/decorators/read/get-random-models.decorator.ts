import { Model } from "mongoose";

const getRandomModels =
  (Model: Model<any>, getRandomModelsConfig: any) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const { PAGE_SIZE, refs, refFields } = getRandomModelsConfig;
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const totalElements = await Model.countDocuments().exec();
      const content = [];

      for (let i = 0; i < PAGE_SIZE; i++) {
        const randomOffset = Math.floor(Math.random() * PAGE_SIZE);
        let query = Model.findOne().skip(randomOffset).lean();

        if (refs && refFields) {
          for (let i = 0; i < refs.length; i++) {
            query = query.populate(refs[i], refFields[i]);
          }
        }

        const document = await query.exec();
        if (document) content.push(document);
      }

      const totalPages = Math.ceil(totalElements / PAGE_SIZE);

      const document = {
        content,
        totalElements,
        totalPages,
        pageSize: PAGE_SIZE,
        page: 0,
        sort: null,
        firstPage: true,
        lastPage: true,
        emptyPage: content.length === 0,
      };

      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default getRandomModels;
