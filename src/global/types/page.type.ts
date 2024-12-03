export class Page {
  content: any[];
  totalElements: number;
  totalPages: number;
  pageSize: number | null;
  page: number | null;
  sort: string | null;
  firstPage: boolean;
  lastPage: boolean;
  emptyPage: boolean;
}
