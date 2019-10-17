export class Restaurent {
    id: number;
    name: string;
address: RestaurentAddress;
images: [];

}

export interface RestaurentAddress {
address: string;
pincode: number;
state: string;
city: string;
distic: string;
locality: string;
landMark: string;
country: string;
}
