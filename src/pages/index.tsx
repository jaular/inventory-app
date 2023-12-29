import { useSession } from "next-auth/react";
import { Loader } from "@mantine/core";
import Container from "~/components/Container";
import Message from "~/components/Message";
import Main from "~/components/equip/Main";

export default function Home() {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return (
      <Container title="Inventario de equipos">
        <div className="flex min-h-[65vh] items-center justify-center">
          <Loader color="blue" size="lg" />
        </div>
      </Container>
    );
  }

  if (status === "authenticated" && sessionData?.user.role !== "none") {
    return (
      <Container title="Inventario de equipos">
        <Main />
      </Container>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Container title="Inventario de equipos">
        <Message title="Inicia sesión" />
      </Container>
    );
  }

  return (
    <Container title="Inventario de equipos">
      <Message title="¡No estás autorizado a ver esta página!" />
    </Container>
  );
}
