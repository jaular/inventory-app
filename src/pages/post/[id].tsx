import type { PostProps } from "~/lib/types";
import Link from "next/link";
import NextError from "next/error";
import { useRouter } from "next/router";
import Container from "~/components/Container";
import TrackingTableList from "~/components/TrackingTableList";
import { RouterOutputs, api } from "~/utils/api";

type PostByIdOutput = RouterOutputs["post"]["getById"];

type DataProps = PostProps & {
  n: string;
  createdAt: Date;
  createdBy?: {
    name: string | null;
  };
};

type Props = {
  id: string;
  data: DataProps[];
  isSuccess: boolean;
  post: PostByIdOutput;
};

function PostItem({ id, post, data, isSuccess }: Props) {
  return (
    <Container>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link className="mb-4 text-blue-500 underline" href="/">
          Regresar
        </Link>
        <div className="my-4">
          <h1>
            Historial de cambios del elemento con ID:{" "}
            <span className="font-bold">{id}</span>
          </h1>
          {!post?.n && <p>Elemento ya fue eliminado!</p>}
        </div>

        <TrackingTableList data={isSuccess ? data : []} />
      </div>
    </Container>
  );
}

const PostViewPage = () => {
  const n = useRouter().query.id as string;
  const postQuery = api.post.getById.useQuery({ n });
  const { data, isSuccess } = api.post.getTrackingAllById.useQuery({ n });

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== "success") {
    return <div className="flex h-full flex-col justify-center px-8 "></div>;
  }
  const { data: post } = postQuery;
  return (
    <PostItem
      id={n}
      post={post}
      data={isSuccess ? data : []}
      isSuccess={isSuccess}
    />
  );
};

export default PostViewPage;
