export interface User{
    name: string;
    email: string;
	role: string;
	created_at: Date;
	updated_at: Date
}

export interface UserRegisterPayload{
	name: string;
	email: string;
	password?: string;
	password_hash?: string; // will initially be empty, then filled in by the controller
	role?: string; // will initially be empty, then filled in by the controller
}

export interface JWTRequiredUserInformation{
	name: string;
	uuid: string;
	role: string;
}

export interface JWTPayload extends JWTRequiredUserInformation{
	iat: number;
	exp: number
}