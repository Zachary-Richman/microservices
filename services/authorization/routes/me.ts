import { Verify } from "../controllers/verify";

const verify = new Verify();

const email = "test@test.com";
const password = "test";
const is_valid = async () => await verify.verify_password(email, password);
is_valid().then(r => console.log(r));

