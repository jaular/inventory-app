import type { AccProps } from "~/lib/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Loader } from "@mantine/core";
import Container from "~/components/Container";
import AccTrackingTableList from "~/components/acc/AccTrackingTableList";
import Message from "~/components/Message";
import { RouterOutputs, api } from "~/utils/api";

// type AccByIdOutput = RouterOutputs["acc"]["getById"];

type DataProps = AccProps & {
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
  // acc: AccByIdOutput;
};

export default function AccHistoryPage() {
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

function AccItem({ id, data, isSuccess, isLoading }: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <Link className="mb-4 text-blue-500 underline" href="/accs">
        Regresar
      </Link>
      <div className="my-4">
        <h1 className="text-base md:text-lg">
          Historial de cambios del elemento con ID:{" "}
          <span className="font-bold">{id}</span>
        </h1>
      </div>
      <AccTrackingTableList
        data={isSuccess ? data : []}
        isDataLoading={isLoading}
      />
    </div>
  );
}

const Main = () => {
  const n = useRouter().query.id as string;
  // const accQuery = api.acc.getById.useQuery({ n });
  const { data, isSuccess, isLoading } = api.acc.getTrackingAllById.useQuery({
    n,
  });

  return (
    <AccItem
      id={n}
      data={isSuccess ? data : []}
      isSuccess={isSuccess}
      isLoading={isLoading}
    />
  );
};
