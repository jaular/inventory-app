import type { PostProps } from "~/lib/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Loader } from "@mantine/core";
import Container from "~/components/Container";
import TrackingTableList from "~/components/equip/TrackingTableList";
import Message from "~/components/Message";
import { RouterOutputs, api } from "~/utils/api";

// type PostByIdOutput = RouterOutputs["post"]["getById"];

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
  isLoading: boolean;
  // post: PostByIdOutput;
};

export default function EquipHistoryPage() {
  const router = useRouter();

  const { data: sessionData, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  if (status === "loading") {
    return (
      <Container>
        <div className="flex min-h-[65vh] items-center justify-center">
          <Loader color="gray" size="xl" type="dots" />
        </div>
      </Container>
    );
  }

  if (status === "authenticated" && sessionData?.user.role !== "none") {
    return (
      <Container>
        <Main />
      </Container>
    );
  }

  return (
    <Container>
      <Message title="¡No estás autorizado a ver esta página!" />
    </Container>
  );
}

function PostItem({ id, data, isSuccess, isLoading }: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <Link className="mb-4 text-blue-500 underline" href="/">
        Regresar
      </Link>
      <div className="my-4">
        <h1 className="text-base md:text-lg">
          Historial de cambios del elemento con ID:{" "}
          <span className="font-bold">{id}</span>
        </h1>
      </div>
      <TrackingTableList
        data={isSuccess ? data : []}
        isDataLoading={isLoading}
      />
    </div>
  );
}

const Main = () => {
  const n = useRouter().query.id as string;
  // const { data: post, status } = api.post.getById.useQuery({ n });
  const { data, isSuccess, isLoading } = api.post.getTrackingAllById.useQuery({
    n,
  });

  return (
    <PostItem
      id={n}
      data={isSuccess ? data : []}
      isSuccess={isSuccess}
      isLoading={isLoading}
    />
  );
};
