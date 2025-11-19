import supabase from "../../../common/db"
import argon2 from "argon2"
import crypto from "crypto"

export class Verify{
	env_path: string = `${__dirname}/.env` // assuming run at root?
	constructor(){}

	private async fetch_password_hash(email: string): Promise<string>{
		const { data, error } = await supabase.from('users').select('password_hash').eq('email', email)
		if(error) throw new Error(error.message)
		if(!data) throw new Error("User not found")
		return data[0].password_hash
	}	

	public async verify_password(email: string, password: string): Promise<boolean>{
		const hash = await this.fetch_password_hash(email);
		return await argon2.verify(hash, password); // if returns true should generate a token and return it -> jwt controller?
	}
}