export interface UpdateCreateProductFormProps {
  title: string;
  buttonText: string;
  toastSuccess: string;
  toastError: string;
}

export interface CreateProductForm {
  name: string;
  typeId: number;
  materialId: number;
  minPrice: number;
}
