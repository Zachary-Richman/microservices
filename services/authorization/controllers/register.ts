import { UserRegisterPayload } from "../models/user"
import supabase from "../../../common/db"
import argon2 from "argon2"
import crypto from "crypto"

export class Register{
	env_path: string = `${__dirname}/.env` // assuming run at root?
	constructor(){}

	private async hash_password(password: string): Promise<{hash: string}>{
		// 16 bytes = 128 bits
		const salt = crypto.randomBytes(16);
		const hashed_password = await argon2.hash(password, {
			salt: salt, 
			hashLength: 32,
			type: argon2.argon2id,
			memoryCost: 2 ** 16,   // 64 MB
			timeCost: 3,           // number of iterations
			parallelism: 1,        // threads
		  }); 

		return {hash: hashed_password}
	}

	private verify_role(role: string): boolean{ // TODO: move this function elsewhere, it doesn't belong here -> should move to administration microservice
		const valid_roles = ["student", "teacher", "administrator"];

		if(!valid_roles.includes(role)) return false;
		return true;
	}
	
	public async register_user(user: UserRegisterPayload): Promise<UserRegisterPayload>{
		if(!user.password) return user;
		const { hash } = await this.hash_password(user.password) 
		user.password_hash = hash;
		delete user.password;
		
		user.role = "student";
		
		const { error } = await supabase.from('users').insert(user)
		if(error) throw new Error(error.message)
		
		// remove hash and salt from user object before returning, for easier transfer to other services
		delete user.password_hash;
		
		return user;
	}
}