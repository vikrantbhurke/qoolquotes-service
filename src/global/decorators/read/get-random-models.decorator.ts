import { Model } from "mongoose";

const getRandomModels =
  (Model: Model<any>, getRandomModelsConfig: any) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const { refs, refFields } = getRandomModelsConfig;
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const pageSize = args[0];
      const totalElements = await Model.countDocuments().exec();

      let randomDocuments = await Model.aggregate([
        { $sample: { size: parseInt(pageSize, 10) } },
      ]);

      for (let i = 0; i < refs.length; i++) {
        randomDocuments = await Model.populate(randomDocuments, {
          path: refs[i],
          select: refFields[i],
        });
      }

      // randomDocuments = await Model.populate(randomDocuments, { path: 'relatedField' });

      // const content = [];

      // for (let i = 0; i < pageSize; i++) {
      //   const randomOffset = Math.floor(Math.random() * pageSize);
      //   let query = Model.findOne().skip(randomOffset).lean();

      //   if (refs && refFields) {
      //     for (let i = 0; i < refs.length; i++) {
      //       query = query.populate(refs[i], refFields[i]);
      //     }
      //   }

      //   const document = await query.exec();
      //   if (document) content.push(document);
      // }

      const totalPages = Math.ceil(totalElements / pageSize);

      const document = {
        content: randomDocuments,
        totalElements,
        totalPages,
        pageSize,
        page: 0,
        sort: null,
        firstPage: true,
        lastPage: true,
        emptyPage: randomDocuments.length === 0,
      };

      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default getRandomModels;
