import type { AccProps } from "~/lib/types";
import Link from "next/link";
import NextError from "next/error";
import { useRouter } from "next/router";
import Container from "~/components/Container";
import AccTrackingTableList from "~/components/AccTrackingTableList";
import { RouterOutputs, api } from "~/utils/api";

type AccByIdOutput = RouterOutputs["acc"]["getById"];

type DataProps = AccProps & {
  n: string;
  createdAt: Date;
  createdBy?: {
    name: string | null;
  };
};

type Props = {
  data: DataProps[];
  isSuccess: boolean;
  acc: AccByIdOutput;
};

function AccItem({ acc, data, isSuccess }: Props) {
  return (
    <Container>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link className="mb-4 text-blue-500 underline" href="/accs">
          Regresar
        </Link>
        <h1 className="my-4 text-lg">
          Historial de cambios del elemento con ID:{" "}
          <span className="font-bold">{acc?.n}</span>
        </h1>
        <AccTrackingTableList data={isSuccess ? data : []} />
      </div>
    </Container>
  );
}

const AccViewPage = () => {
  const n = useRouter().query.id as string;
  const accQuery = api.acc.getById.useQuery({ n });
  const { data, isSuccess } = api.acc.getTrackingAllById.useQuery({ n });

  if (accQuery.error) {
    return (
      <NextError
        title={accQuery.error.message}
        statusCode={accQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (accQuery.status !== "success") {
    return <div className="flex h-full flex-col justify-center px-8 "></div>;
  }
  const { data: acc } = accQuery;
  return (
    <AccItem acc={acc} data={isSuccess ? data : []} isSuccess={isSuccess} />
  );
};

export default AccViewPage;
