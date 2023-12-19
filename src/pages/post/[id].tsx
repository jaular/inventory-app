import NextError from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import Container from "~/components/Container";
import { RouterOutputs, api } from "~/utils/api";

type PostByIdOutput = RouterOutputs["post"]["getById"];

function PostItem(props: { post: PostByIdOutput }) {
  const { post } = props;
  return (
    <Container>
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link className="mb-4 text-blue-500 underline" href="/">
          Regresar
        </Link>
        <h1 className="mt-4 text-4xl font-bold">{post?.n}</h1>
        <pre className="mt-8 overflow-x-scroll rounded-xl bg-gray-800 p-4">
          {JSON.stringify(post, null, 4)}
        </pre>
      </div>
    </Container>
  );
}

const PostViewPage = () => {
  const n = useRouter().query.id as string;
  const postQuery = api.post.getById.useQuery({ n });

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== "success") {
    return (
      <div className="flex h-full flex-col justify-center px-8 ">
        <div className="mb-2 h-10 w-full animate-pulse rounded-md bg-zinc-900/70"></div>
        <div className="mb-8 h-5 w-2/6 animate-pulse rounded-md bg-zinc-900/70"></div>

        <div className="h-40 w-full animate-pulse rounded-md bg-zinc-900/70"></div>
      </div>
    );
  }
  const { data } = postQuery;
  return <PostItem post={data} />;
};

export default PostViewPage;
