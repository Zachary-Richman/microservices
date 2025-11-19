import { Register } from "../controllers/register";
import { UserRegisterPayload } from "../models/user";

const register = new Register();

const user: UserRegisterPayload = {
	name: "test",
	email: "test@test.com",
	password: "test",
}

register.register_user(user);