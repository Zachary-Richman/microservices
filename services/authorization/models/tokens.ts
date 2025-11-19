export interface refresh_tokens{
	user_id: string;
	token_hash: string;
	expires_at: Date;
	created_at: Date;
	revoked?: boolean;
}