export type PetWithShelter = {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  ageMonths: number;
  size: string;
  gender: string;
  description: string;
  photos: string[];
  city: string;
  shelter: {
    name: string;
    phone: string;
    email: string;
  };
};

export type SwipeFilters = {
  type?: string;
  size?: string;
  gender?: string;
  city?: string;
};
