

import Form from "@/components/Form";
import Header from "@/components/Header";
import PostFeed from "@/components/PostFeed";
import { getUser } from "@/hooks/useUsers";
import getSession from "@/libs/getSession";
import { User } from "@prisma/client";


export default async function Home() {
  const session = await getSession();
  const user = await getUser(session?.user.id as string) as Omit<User, 'followersCount'>;


  return (
    <>
      <Header label="For you" />

      <Form placeholder="What's on your mind?" user={user}/>

      <PostFeed />
    </>
  );
}
