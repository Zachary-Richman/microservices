import supabase from "../../common/db"

async function CreateUser(){
  const { error } = await supabase
  .from('Users')
  .insert({ Name: 'Mordor' });

  console.log(error);
}

CreateUser();