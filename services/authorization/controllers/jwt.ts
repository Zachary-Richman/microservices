import crypto from "crypto"
import supabase from "../../../common/db"
import jwt from "jsonwebtoken"
import { refresh_tokens } from "../models/tokens";
import { JWTRequiredUserInformation, JWTPayload } from "../models/user";


export class JWTController{
	constructor(){}

	private async generate_plan_refresh_token(): Promise<string>{
		return crypto.randomBytes(64).toString("hex"); // 128 chars hex
	}
	
	public async generate_refresh_token(uuid: string): Promise<string>{
		let token: refresh_tokens = {
			user_id: uuid,
			token_hash: await this.generate_plan_refresh_token(),
			created_at: new Date(),
			expires_at: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
		};

		const { error } = await supabase.from('refresh_tokens').insert(token)
		if (error) throw new Error(error.message)
		return token.token_hash;
	}

	public async revoke_refresh_token(token?: string, uuid?: string): Promise<void>{
		if(!token && !uuid) throw new Error("No token or uuid provided for revoking refresh token");

		if(token){
			const { error } = await supabase
				.from('refresh_tokens').update({revoked: true}).eq('token_hash', token);
			if (error) throw new Error(error.message);
		} else if (uuid){
			const { error } = await supabase
				.from('refresh_tokens').update({revoked: true}).eq('user_id', uuid);
			if (error) throw new Error(error.message);
		}
	}

	public async check_refresh_token(uuid: string, token: string): Promise<boolean>{
		const { data, error } = await supabase.from('refresh_tokens').select('*').eq('token_hash', token).eq("user_id", uuid).eq('revoked', false)
		if(error) throw new Error(error.message)

		if(!data || data.length == 0) return false; // row not found or empty
		if(data[0].expires_at < new Date()) return false; // token expired
		return true;
	}

	public async generate_jwt_token(payload: JWTRequiredUserInformation): Promise<string>{
		const secret = process.env.JWT_SECRET;
		if(!secret) throw new Error("JWT_SECRET is not set");

		const options: jwt.SignOptions = { algorithm: "HS256", expiresIn: "10m" }

		return jwt.sign(payload, secret, options);
	}
	
	public async check_jwt_token(token: string): Promise<boolean>{
		const secret = process.env.JWT_SECRET;
		if (!secret) throw new Error("JWT_SECRET is not set");

		try{
			jwt.verify(token, secret);
			return true;
		} catch (err){
			console.log("Most likely invalid JWT: " + err);
			return false;
		}
	}

	public async decode_jwt_token(token: string): Promise<JWTPayload | boolean>{
		const secret = process.env.JWT_SECRET;
		if (!secret) throw new Error("JWT_SECRET is not set");
		
		try{
			const decode: string | jwt.JwtPayload = String(jwt.verify(token, secret));
			return JSON.parse(decode);
		} catch (err){
			console.log("Most likely invalid JWT: " + err);
			return false;
		}
	}

	public async check_expiration(jwt: JWTPayload): Promise<boolean>{
		if(jwt.exp < Date.now()) return false;
		return true;
	}
}